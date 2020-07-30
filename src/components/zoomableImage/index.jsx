import React, { useRef } from "react";
import classnames from "classnames";
import Img from "gatsby-image";
import PropTypes from "prop-types";

import { KEYS } from "../../constants";

import "./index.scss";

const ZoomableImage = ({ image, className, ...inputArgs }) => {
  const input = useRef(null);

  if (!image.childImageSharp?.fluid) return null;

  const renderedImage = (
    <Img
      fluid={image.childImageSharp.fluid}
      alt="zoomable"
      className="zoomable__image"
      imgStyle={{ objectFit: "contain", cursor: "pointer" }}
    />
  );

  return (
    <label className="zoomable">
      <input
        ref={input}
        type="checkbox"
        className="zoomable__toggle"
        name="image-toggle"
        onKeyDown={event => {
          const { key, target } = event;
          const keyIsHandled = Object.values(KEYS).includes(key);

          if (!keyIsHandled) return;
          event.preventDefault();

          if ([KEYS.SPACE, KEYS.ENTER].includes(event.key)) {
            target.checked = !target.checked;
            return;
          }

          target.checked = false;
        }}
        {...inputArgs}
      />
      <div className={classnames("zoomable__container", className)}>
        {renderedImage}
      </div>
      <div className="zoomable__modal">{renderedImage}</div>
    </label>
  );
};

ZoomableImage.propTypes = {
  image: PropTypes.shape({
    childImageSharp: PropTypes.shape({
      fluid: PropTypes.shape({}),
    }),
  }).isRequired,
  className: PropTypes.string,
};

export default ZoomableImage;
