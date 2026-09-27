const isNode = typeof window === 'undefined';

const isClearAccessTokenRequested = () =>
  !isNode && new URLSearchParams(window.location.search).get('clear_access_token') === 'true';

const clearStoredAccessToken = () => {
  if (isNode) return;
  window.localStorage.removeItem('base44_access_token');
  window.localStorage.removeItem('token');
};

const getAccessToken = () => {
  if (isNode) return null;
  try {
    return (
      window.localStorage.getItem('base44_access_token') ||
      window.localStorage.getItem('token') ||
      null
    );
  } catch {
    return null;
  }
};

const getAppParams = () => {
  if (isClearAccessTokenRequested()) {
    clearStoredAccessToken();
  }
  return {
    appId: import.meta.env.VITE_BASE44_APP_ID || 'static',
    token: getAccessToken(),
    functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || '',
    appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || '',
  };
};

export const appParams = {
  ...getAppParams(),
};
