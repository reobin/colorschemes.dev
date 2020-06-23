import glob
import json
import os
import time
from datetime import datetime

import s3_helper
from file_helper import find_image_urls
from github_helper import (
    get_latest_commit_at,
    get_rate_limit,
    get_readme_file,
    list_repository_image_urls,
    search_repositories,
)
from print_helper import colors

IS_PRODUCTION = os.getenv("IS_PRODUCTION")
EMPTY_S3_BUCKET = os.getenv("EMPTY_S3_BUCKET")
MAX_IMAGE_COUNT = os.getenv("MAX_IMAGE_COUNT")
MAX_IMAGE_COUNT = int(MAX_IMAGE_COUNT) if MAX_IMAGE_COUNT is not None else 5

S3_REPOSITORIES_DIRECTORY_NAME = os.getenv("S3_REPOSITORIES_DIRECTORY_NAME")
S3_IMPORTS_DIRECTORY_NAME = os.getenv("S3_IMPORTS_DIRECTORY_NAME")

LOCAL_REPOSITORIES_DIRECTORY_NAME = "repositories"
LOCAL_IMPORTS_DIRECTORY_NAME = "imports"


def save_local_file(file_name, data):
    file_path = f"data/{file_name}"
    print(f"{colors.INFO}WRITE{colors.NORMAL} to local file {file_path}\n")
    with open(file_path, "w") as file:
        file.write(data)


def save_file(file_name, data):
    if IS_PRODUCTION:
        s3_helper.upload_file(file_name, data)
    else:
        save_local_file(file_name, data)


def save_repository_file(repository, data):
    separator = "/" if IS_PRODUCTION else "__"
    file_name = f"{repository['owner']['name']}{separator}{repository['name']}.json"

    if IS_PRODUCTION:
        file_name = f"{S3_REPOSITORIES_DIRECTORY_NAME}/{file_name}"
    else:
        file_name = f"{LOCAL_REPOSITORIES_DIRECTORY_NAME}/{file_name}"
    save_file(file_name, data)


def empty_local_data_directory():
    files = glob.glob("data/*.json")
    for data_file in files:
        try:
            os.remove(data_file)
        except OSError as e:
            print(f"{colors.ERROR}Error deleting {data_file}: {e.strerror}")


if __name__ == "__main__":
    start = time.time()

    repositories = search_repositories()

    if EMPTY_S3_BUCKET:
        s3_helper.empty_bucket()

    if not IS_PRODUCTION:
        empty_local_data_directory()

    for index, repository in enumerate(repositories):
        # TODO: Check if last commit is more recent than last import
        #       if it is, continue
        #       if not, skip readme and image urls fetching

        print(
            f"{colors.INFO}# {repository['owner']['name']}/{repository['name']}{colors.NORMAL}"
        )
        repository["readme"] = get_readme_file(repository)
        readme_image_urls = find_image_urls(repository["readme"], MAX_IMAGE_COUNT)
        print(
            f"{colors.INFO}INFO: {colors.NORMAL}Found {len(readme_image_urls)} valid image(s) in the readme file"
        )
        repository_image_urls = list_repository_image_urls(
            repository, len(readme_image_urls), MAX_IMAGE_COUNT
        )
        print(
            f"{colors.INFO}INFO: {colors.NORMAL}Found {len(repository_image_urls)} valid image(s) in the repository files"
        )
        repository["image_urls"] = readme_image_urls + repository_image_urls

        repository["latest_commit_at"] = get_latest_commit_at(repository)

        save_repository_file(repository, json.dumps(repository))

    end = time.time()

    elapsed_time = end - start

    now = datetime.today().strftime("%Y-%m-%d_%H:%M:%S")
    summary = {"elapsed_time": elapsed_time, "imported_at": now}
    summary_file_name = f"{now}.json"
    if IS_PRODUCTION:
        summary_file_name = f"{S3_IMPORTS_DIRECTORY_NAME}/{summary_file_name}"
    else:
        summary_file_name = f"{LOCAL_IMPORTS_DIRECTORY_NAME}/{summary_file_name}"

    save_file(summary_file_name, json.dumps(summary))

    print(f"#########################")
    print(f"#        Summary        #")
    print(f"#########################")
    print("")
    print(f"Elapsed time: {elapsed_time} seconds")
