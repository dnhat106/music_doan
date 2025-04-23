const urls = {
  production: {
    backendUrl: "http://localhost:4000/api"
  },
  development: {
    backendUrl: "http://localhost:4000/api"
  },
};

const { production, development } = urls;
export const appUrls = true ? development : production;
