import React from "react";
import classnames from "classnames";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

import { RepositoryType } from "src/types";

import { LAYOUTS, SECTIONS } from "src/constants";

import { useNavigation } from "src/hooks/useNavigation";

import { Star, Arrow, GitHub, TrendingUp } from "src/components/icons";

import { format } from "src/utils/date";

import ExternalLink from "src/components/externalLink";
import Layout from "src/components/layout";
import Mosaic from "src/components/mosaic";
import RepositoryTitle from "src/components/repositoryTitle";
import SEO from "src/components/seo";
import ZoomableImage from "src/components/zoomableImage";

import "./index.scss";

const RepositoryPage = ({ data, location }) => {
  const fromPath = location?.state?.fromPath;

  const {
    owner: { name: ownerName },
    name,
    githubUrl,
    featuredImage,
    description,
    images,
    stargazersCount,
    weekStargazersCount,
    lastCommitAt,
    createdAt,
  } = data.repository;

  const {
    siteMetadata: { platform },
  } = data.site;

  useNavigation(SECTIONS.REPOSITORY_MAIN_IMAGE);

  const Nav = ({ bottom }) => (
    <nav
      className={classnames("repository__nav", {
        "repository__nav--bottom": bottom,
      })}
    >
      <Link
        to={fromPath || "/"}
        data-section={
          bottom ? SECTIONS.REPOSITORY_BOTTOM_NAV : SECTIONS.REPOSITORY_NAV
        }
        data-layout={LAYOUTS.LIST}
        className="repository__nav-link"
      >
        <Arrow left className="repository__nav-link-icon" />
        back
      </Link>
      <ExternalLink
        to={githubUrl}
        data-section={
          bottom ? SECTIONS.REPOSITORY_BOTTOM_NAV : SECTIONS.REPOSITORY_NAV
        }
        data-layout={LAYOUTS.LIST}
        className="repository__nav-link"
        icon={GitHub}
      >
        <span>
          View <strong>{name}</strong> on{" "}
        </span>
        <span>GitHub</span>
      </ExternalLink>
    </nav>
  );

  return (
    <Layout>
      <SEO
        title={`${name} ${platform} color scheme, by ${ownerName}`}
        description={description}
        imageUrl={featuredImage?.publicURL}
        path={`/${ownerName}/${name}`}
      />
      <article className="repository">
        <header className="repository__hero">
          <Nav />

          <div className="repository__header">
            <RepositoryTitle ownerName={ownerName} name={name} tag="h1" />
            <div className="repository__meta">
              <div className="repository__stargazers">
                <Star className="repository__icon" />
                <span className="repository__stargazers-count">
                  <strong>{stargazersCount}</strong>
                </span>
              </div>
              {!!weekStargazersCount && (
                <div className="repository__trending-stargazers-count">
                  <TrendingUp className="repository__icon" />
                  <span>
                    <strong>{weekStargazersCount}</strong>/week
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="repository__infos">{description}</p>
          <p className="repository__infos">
            Created{" "}
            <time className="repository__date" dateTime={createdAt}>
              {format(createdAt)}
            </time>
          </p>
          <p className="repository__infos">
            Last commit{" "}
            <time className="repository__date" dateTime={lastCommitAt}>
              {format(lastCommitAt)}
            </time>
          </p>
        </header>
        <section>
          {!!featuredImage && (
            <ZoomableImage
              image={featuredImage}
              alt="featured"
              className="repository__image"
              data-section={SECTIONS.REPOSITORY_MAIN_IMAGE}
              data-layout={LAYOUTS.BLOCK}
            />
          )}
          {!!images && images.length > 0 && <Mosaic images={images} />}
        </section>
      </article>
      <Nav bottom />
    </Layout>
  );
};

RepositoryPage.propTypes = {
  data: PropTypes.shape({
    repository: RepositoryType,
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        platform: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }),
  location: PropTypes.shape({
    fromPath: PropTypes.string,
  }),
};

export const query = graphql`
  query($ownerName: String!, $name: String!) {
    site {
      siteMetadata {
        platform
      }
    }
    repository: mongodbColorschemesRepositories(
      owner: { name: { eq: $ownerName } }
      name: { eq: $name }
    ) {
      name
      description
      githubUrl: github_url
      stargazersCount: stargazers_count
      weekStargazersCount: week_stargazers_count
      lastCommitAt: last_commit_at
      createdAt: github_created_at
      owner {
        name
      }
      featuredImage: processed_featured_image {
        publicURL
        childImageSharp {
          fluid(maxWidth: 1280, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      images: processed_images {
        childImageSharp {
          fluid(maxWidth: 1280, quality: 80) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  }
`;

export default RepositoryPage;
