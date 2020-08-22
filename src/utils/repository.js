import moment from "moment";

export const getRepositoryInfos = repository => {
  if (!repository) return {};

  return {
    ...repository,
    ownerName: repository.owner?.name,
    createdAt: moment(repository.createdAt).fromNow(),
    lastCommitAt: moment(repository.lastCommitAt).fromNow(),
  };
};

const isValidProcessedFluidImage = imageObject =>
  !!imageObject?.childImageSharp?.fluid;

// Returns the usable first image; that was properly processed at build time
export const getFirstProcessedFluidImage = (featuredImage, images) => {
  if (isValidProcessedFluidImage(featuredImage))
    return featuredImage.childImageSharp.fluid;

  if (!images || images.length < 1 || !Array.isArray(images)) return null;

  const fallbackImage = images.find(isValidProcessedFluidImage);
  return fallbackImage ? fallbackImage.childImageSharp.fluid : null;
};
