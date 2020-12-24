import VueRouter from 'vue-router';

import {DialogProgrammatic as Dialog} from 'buefy';
import {SnackbarProgrammatic as Snackbar} from 'buefy';

export default class Framework {
  
  constructor() {
    this.booted = false;
    this.vueModules = [];
    this.router = null;
    this.routerBuilder = null;
    this.store = null;
    this.vue = null;
    this.vueConfig = {};
    this.vueRootComponent = null;
    this.userVuexAction = 'user/show';

    this.init();
  }

  init() {
    window.framework = this;
    window.app = window.app; // Doesn't work without this... wtf?
    window.app.d = console.log;
    window.app.vue = null;
    window.app.findRouteByName = (name, routesArg = []) => {

      if (!this.router) {
        console.error('router not set');
        return;
      }

      const routes = routesArg.length ? routesArg : this.router.options.routes;

      let route = null;

      routes.forEach(_route => {

        if (_route.name === name) {
          route = _route;
        }

        if (!route && _route.children) {
          route = window.app.findRouteByName(name, _route.children);
        }

        return route;

      });

      if (!route) {
        console.error(`Could not find route with name: ${name}`);
        return '';
      }

      return route;
    };
    window.app.snackbar = (payload) => {

      if (!Snackbar) {
        console.error('Snackbar component unavailable');
        return;
      }

      let config = {};

      if (typeof payload === 'string') {
        config.message = payload;
      } else {
        config = {
          ...payload,
        }
      }

      Snackbar.open({
        position: window.innerWidth > 1088 ? 'is-bottom-right' : 'is-top-right',
        type: 'is-success',
        duration: 3000,
        ...config,
      });
    };
    window.app.snackbarError = (error, config = {}) => {

      let errors = error.response && error.response.data && error.response.data.errors ? error.response.data.errors : null;

      if (errors) {

        if (!Array.isArray(errors)) {
          errors = Object.values(errors);
        }

        config.message = errors.map((error) => {
          return error.detail ? error.detail : error;
        }).join("<br />");

        Snackbar.open({
          position: window.innerWidth > 1088 ? 'is-bottom-right' : 'is-top-right',
          type: 'is-danger',
          ...config,
        });
      } else {
        console.error('Cannot find error message.');
      }

    };
    window.app.config = (config = {}) => {
      Dialog.confirm({
        title: config.title || '',
        message: config.message || '',
        confirmText: config.confirmText || 'Ok',
        type: config.type || 'is-danger',
        onConfirm: config.onConfirm || null,
      });
    };
  }
  
  env(env = {}) {
    if (!window.app.env) {
      window.app.env = {};
    }

    window.app.env = {
      ...env,
    };
  }

  storage(storage = {}) {
    if (!window.app.storage) {
      window.app.storage = {};
    }

    window.app.storage = {
      ...storage,
    };
  }

  auth(auth = {}) {
    if (!window.app.auth) {
      window.app.auth = {};
    }

    window.app.auth = {
      ...auth,
    };
  }

  theme(theme = {}) {
    if (!window.app.theme) {
      window.app.theme = {};
    }

    window.app.theme = {
      ...theme,
    };
  }

  addHelper(key, value) {
    window.app[key] = value;
  }

  addVueModule(module) {
    this.vueModules.push(module);
  }

  loadModules() {

    if (this.vueModules.length) {
      this.vueModules.forEach((ServiceProvider) => {

        const serviceProvider = new ServiceProvider({
          framework: this,
        });

        serviceProvider.boot();
      });
    }

    // React Native Modules?

  }

  addStore(store) {
    this.store = store;
  }

  addRouter(router, builder) {
    this.router = router;
    this.routerBuilder = builder;
  }

  resetRouter() {
    this.router = new VueRouter({
      mode: 'history',
      base: process.env.BASE_URL,
      routes: this.routerBuilder.getRoutes(),
    });
  }

  addVue(Vue, RooComponent, config = {}) {
    this.vue = Vue;
    this.vueRootComponent = RooComponent;
    this.vueConfig = config;
  }

  bootVue() {
    if (!this.vue) {
      console.error('framework.vue not set');
      return;
    }

    window.app.vue = new this.vue({
      router: this.router,
      store: this.store,
      render: h => h(this.vueRootComponent),
      ...this.vueConfig,
    }).$mount('#app');
  }

  /**
   * Attempt to get the User before booting Vue, to enable router redirects, setting the theme, etc.
   */
  boot() {

    this.loadModules();

    const token = window.app.auth.getToken();

    if (token && this.store._actions[this.userVuexAction]) {
      this.store.dispatch(this.userVuexAction).finally(() => {
        this.bootVue();
      });
    } else {
      this.bootVue();
    }

    this.booted = true;
  }
}