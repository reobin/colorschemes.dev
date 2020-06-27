const { createRemoteFileNode } = require("gatsby-source-filesystem");

// NOTE: Manually processing images won't be necessary after a fix
// is merged into gatsby-source-strapi:
// https://github.com/strapi/gatsby-source-strapi/pull/118

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type StrapiRepository implements Node {
      processed_featured_image: File @link
      processed_images: [File]
    }
  `);
};

exports.onCreateNode = ({
  node,
  actions: { createNode },
  store,
  cache,
  createNodeId,
}) => {
  if (
    node.internal.type === "StrapiRepository" &&
    node.images !== null &&
    node.images.length > 0
  ) {
    try {
      node.images.forEach(async (image, index) => {
        const fileNode = await createRemoteFileNode({
          url: `http://localhost:1337${image.url}`,
          parentNodeId: node.id,
          createNode,
          createNodeId,
          cache,
          store,
        });
        if (fileNode) {
          if (index === 0) node.processed_featured_image = fileNode.id;
          else
            node.processed_images = [
              ...(node.processed_images || []),
              fileNode,
            ];
          index++;
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
};

const path = require("path");

const URLify = value =>
  !!value ? value.trim().toLowerCase().replace(/\s/g, "%20") : "";

const createRepositoryPages = (repositories, createPage) => {
  repositories.forEach(repository =>
    createPage({
      path: `${URLify(repository.owner?.name || "oops")}/${URLify(
        repository.name,
      )}`,
      component: path.resolve(`./src/templates/repository/index.jsx`),
      context: {
        ownerName: repository.owner?.name || "oops",
        name: repository.name,
      },
    }),
  );
};

const pageSize = 20;
const createRepositoryPaginatedPages = (repositories, createPage) => {
  const pageCount = Math.ceil(repositories.length / pageSize);

  const sortOrders = [
    { value: "DESC", path: "desc/", isDefault: true },
    { value: "ASC", path: "asc/" },
  ];
  const sortableFields = [
    { fieldName: "stargazers_count", path: "stars/", isDefault: true },
    { fieldName: "last_commit_at", path: "updated/" },
    { fieldName: "created_at", path: "created/" },
  ];
  return Array.from({ length: pageCount }).map((_, index) => {
    sortableFields.forEach(field => {
      sortOrders.forEach(sortOrder => {
        const sortPath =
          field.isDefault && sortOrder.isDefault
            ? ""
            : `${field.path}${sortOrder.path}`;

        createPage({
          path: index === 0 ? `/${sortPath}` : `/${sortPath}${index + 1}`,
          component: path.resolve(`./src/templates/repositories/index.jsx`),
          context: {
            skip: index * pageSize,
            limit: pageSize,
            sortField: [field.fieldName],
            sortOrder: [sortOrder.value],
            pageCount,
            currentPage: index + 1,
          },
        });
      });
    });
  });
};

const repositoriesQuery = `
  {
    allStrapiRepository {
      nodes {
        name
        owner {
          name
        }
      }
    }
  }
`;

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const {
    data: {
      allStrapiRepository: { nodes: repositories },
    },
  } = await graphql(repositoriesQuery);

  createRepositoryPages(repositories, createPage);
  createRepositoryPaginatedPages(repositories, createPage);
};
