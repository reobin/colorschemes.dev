import { Link } from "gatsby";
import PropTypes from "prop-types";
import React from "react";

import "./index.scss";

const Header = () => (
  <header className="header">
    <div className="header__content">
      {/* eslint-disable-next-line */}
      <Link to="/" className="header__title" tabIndex={1}>
        <span>Vim</span>
        <span>C</span>
        <span>S</span>
      </Link>
      <nav className="header__nav">
        <ul>
          {/* eslint-disable-next-line */}
          <Link to="/about/" className="header__link" tabIndex={1}>
            About VimCS
          </Link>
        </ul>
      </nav>
    </div>
  </header>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
