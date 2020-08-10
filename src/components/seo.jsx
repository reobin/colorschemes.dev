import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

function SEO({ description, lang, meta, title, imageUrl, path }) {
  const { site, logo } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            platform
            siteUrl
            description
            author
            socialImageUrl
          }
        }
        logo: file(relativePath: { eq: "logo_background.png" }) {
          publicURL
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;

  const ogImage = imageUrl
    ? `${site.siteMetadata.siteUrl}${imageUrl}`
    : site.siteMetadata.socialImageUrl ||
      `${site.siteMetadata.siteUrl}${logo.publicURL}`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.platform}${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          property: `og:url`,
          content: `${site.siteMetadata.siteUrl}${path}`,
        },
        {
          property: `og:image`,
          content: ogImage,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          property: `twitter:image`,
          content: ogImage,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: "en",
  meta: [],
  description: "",
  path: "",
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  path: PropTypes.string,
};

export default SEO;
