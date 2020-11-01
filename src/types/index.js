import PropTypes from "prop-types";

export const GatsbyImageType = PropTypes.shape({
  childImageSharp: PropTypes.shape({
    fluid: PropTypes.object,
    src: PropTypes.object,
  }),
});

export const RepositoryOwnerType = PropTypes.shape({
  name: PropTypes.string.isRequired,
});

export const VimPreviewColorType = PropTypes.shape({
  group: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
});

export const RepositoryType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  githubUrl: PropTypes.string,
  owner: RepositoryOwnerType.isRequired,
  featuredImage: GatsbyImageType,
  stargazersCount: PropTypes.number.isRequired,
  weekStargazersCount: PropTypes.number,
  images: PropTypes.arrayOf(GatsbyImageType.isRequired),
  lastCommitAt: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  vimColors: PropTypes.shape({
    light: PropTypes.arrayOf(VimPreviewColorType),
    dark: PropTypes.arrayOf(VimPreviewColorType),
  }),
});
