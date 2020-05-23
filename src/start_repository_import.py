import json
import math
import os
import re
import sys
import time

from file_helper import find_image_urls
from github_helper import (
    ITEMS_PER_PAGE,
    get_latest_commit_at,
    get_rate_limit,
    get_readme_file,
    list_repositories,
    list_repository_image_urls,
    sleep_until_reset,
)
from print_helper import start_sleeping
from request_helper import get
from s3_helper import upload_file, empty_bucket

IS_DEV = os.getenv("IS_DEV")

BASE_URL = "https://api.github.com"


def search_repositories(remaining_calls, reset):
    repositories = []

    first_page_repositories, total_count = list_repositories()
    repositories.extend(first_page_repositories)

    page_count = 1 if IS_DEV == "True" else math.ceil(total_count / ITEMS_PER_PAGE)

    for page in range(2, page_count + 1):
        if remaining_calls <= 1:
            sleep_until_reset(reset)

        current_page_repositories, total_count = list_repositories(page=page)
        repositories.extend(current_page_repositories)

        remaining_calls = remaining_calls - 1

    return repositories, total_count


def upload_repository_file(repository):
    file_name = f"{repository['owner']['name']}__{repository['name']}.json"
    upload_file(file_name, json.dumps(repository))


if __name__ == "__main__":
    remaining_calls, reset = get_rate_limit()

    if remaining_calls <= 1:
        remaining_calls = sleep_until_reset(reset)

    repositories, total_count = search_repositories(remaining_calls, reset)

    remaining_calls = remaining_calls - 1

    print("Total repo count:", total_count)

    if IS_DEV:
        empty_bucket()

    for index, repository in enumerate(repositories):
        if remaining_calls <= 1:
            remaining_calls = sleep_until_reset(reset)

        repository["readme"] = get_readme_file(repository)
        readme_image_urls = find_image_urls(repository["readme"])

        remaining_calls = remaining_calls - 1
        if remaining_calls <= 1:
            remaining_calls = sleep_until_reset(reset)

        repository["latest_commit_at"] = get_latest_commit_at(repository)

        repository_image_urls, remaining_calls = list_repository_image_urls(
            repository, remaining_calls, reset
        )

        repository["image_urls"] = readme_image_urls + repository_image_urls

        upload_repository_file(repository)
