// Mock Base44 client for static / GitHub Pages builds.
const emptyList = async () => [];
const emptyGet = async () => null;
const emptyCreate = async () => ({});
const emptyUpdate = async () => ({});
const emptyDelete = async () => ({});

const entityProxy = new Proxy(
  {},
  {
    get: () => ({
      filter: emptyList,
      list: emptyList,
      get: emptyGet,
      create: emptyCreate,
      update: emptyUpdate,
      delete: emptyDelete,
    }),
  }
);

export const db = {
  auth: {
    isAuthenticated: async () => false,
    me: async () => null,
    logout: async () => {},
    redirectToLogin: () => {},
  },
  app: {
    getPublicSettings: async () => ({ id: 'static', public_settings: {} }),
  },
  entities: entityProxy,
  integrations: {
    Core: {
      UploadFile: async () => ({ file_url: '' }),
    },
  },
};

export const base44 = db;
export default db;
