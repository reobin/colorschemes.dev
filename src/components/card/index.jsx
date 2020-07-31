import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import PropTypes from "prop-types";
import classnames from "classnames";

import { LAYOUTS, SECTIONS } from "../../constants";

import { URLify } from "../../utils/string";
import { getRepositoryInfos } from "../../utils/repository";

import RepositoryTitle from "../repositoryTitle";
import { Star } from "../icons";

import "./index.scss";

const Card = ({ repository, linkId, linkTabIndex, linkState, className }) => {
  const {
    ownerName,
    name,
    description,
    featuredImage,
    stargazersCount,
    lastCommitAt,
    createdAt,
  } = getRepositoryInfos(repository);

  return (
    <li className={classnames("card", className)}>
      <div className="card__image">
        {!!featuredImage && (
          <Img
            fluid={featuredImage.childImageSharp.fluid}
            alt={`${ownerName} ${name}`}
            imgStyle={{ objectFit: "contain" }}
          />
        )}
      </div>
      <div className="card__header">
        <h2 className="card__title">
          <Link
            to={`/${URLify(`${ownerName}/${name}`)}`}
            state={linkState}
            id={linkId}
            tabIndex={linkTabIndex}
            data-section={SECTIONS.REPOSITORIES}
            data-layout={LAYOUTS.GRID}
          >
            <RepositoryTitle ownerName={ownerName} name={name} tag="div" />
          </Link>
        </h2>
        <div className="card__stargazers">
          <Star className="card__stargazers-icon" />
          <span className="card__stargazers-count">{stargazersCount}</span>
        </div>
      </div>
      <p className="card__infos">{description}</p>
      <p className="card__infos">
        Created <strong>{createdAt}</strong>
      </p>
      <p className="card__infos">
        Last commit <strong>{lastCommitAt}</strong>
      </p>
    </li>
  );
};

Card.propTypes = {
  repository: PropTypes.shape({
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    featuredImage: PropTypes.shape({
      childImageSharp: PropTypes.shape({
        fluid: PropTypes.shape({}).isRequired,
      }).isRequired,
    }),
    stargazersCount: PropTypes.number.isRequired,
    lastCommitAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  linkState: PropTypes.object,
  className: PropTypes.string,
};

export default Card;
