export default () => {

  try {

    if (!window) {
      let window;
    }

    if (!window.app) {
      window.app = {};
    }

    if (!window.app.env) {
      window.app.env = {};
    }

    if (!window.app.auth) {
      window.app.auth = {
        getToken() {
          console.error('window.app.auth.getToken has not been defined for this project.');
        },
        setToken() {
          console.error('window.app.auth.setToken has not been defined for this project.');
        },
        removeToken() {
          console.error('window.app.auth.removeToken has not been defined for this project.');
        },
        unauthenticated() {
          console.error('window.app.auth.unauthenticated has not been defined for this project.');
        },
      };
    }

    if (!window.app.storage) {
      window.app.storage = {
        setItem(key, value) {
          console.error('window.app.storage.setItem has not been defined for this project.');
        },
        getItem(key) {
          console.error('window.app.storage.getItem has not been defined for this project.');
        },
        removeItem(key) {
          console.error('window.app.storage.removeItem has not been defined for this project.');
        },
      };
    }

    if (!window.app.token) {
      window.app.token = {
        get() {
          console.error('window.app.token.get has not been defined for this project.');
        },
        set(token) {
          console.error('window.app.token.set has not been defined for this project.');
        },
      };
    }

    if (!window.app.theme) {
      window.app.theme = {
        get() {
          console.error('window.app.theme.get has not been defined for this project.');
        },
        set(token) {
          console.error('window.app.theme.set has not been defined for this project.');
        },
      };
    }

  } catch (e) {}
};