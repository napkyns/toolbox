import ResourceStore from '../ResourceStore';

export default class StoreBuilder {

  constructor() {
    this.modules = {};
  }

  addModule(module) {
    if (!module.key) {
      console.error(`[${this.constructor.name}] No key on module`);
    } else {
      this.modules[module.key] = module;
    }
  }

  addResourceStore(model) {
    if (!model.vuexModuleKey) {
      console.error(`[${this.constructor.name}] No vuexModuleKey on model`);
    } else {
      this.modules[model.vuexModuleKey] = new ResourceStore({
        model,
      });
    }
  }

  getVuexModules() {
    return this.modules;
  }

  getReduxModules() {
    const modules = {};

    for (const [key, value] of Object.entries(this.modules)) {
      modules[key] = this.vuexModuleToReduxModule(value);
    }

    return modules;
  }

  getReduxReducers() {
    const reducers = {};

    for (const [key, value] of Object.entries(this.getReduxModules())) {
      reducers[key] = value.reducer;
    }

    return reducers;
  }

  vuexModuleToReduxModule(vuexModule) {

    const defaultState = {
      ...vuexModule.state,
    };

    if (!vuexModule.mutations) {
      vuexModule.mutations = {};
    }

    if (!vuexModule.actions) {
      vuexModule.actions = {};
    }

    const actions = {};

    for (let [actionKey, action] of Object.entries(vuexModule.actions)) {

      actions[actionKey] = (payload) => {

        return (dispatch, getState) => {

          const commit = (key, payload) => {
            return dispatch({
              type: key,
              payload,
            });
          };

          const context = {
            commit,
            state: getState()[vuexModule.key],
          };

          return action(context, payload);
        };
      };
    }

    if (!vuexModule.key) {
      console.error('Missing Vuex Module Key');
    }

    return {

      key: vuexModule.key,

      actions,

      defaultState,

      reducer: (state = defaultState, action) => {

        if (action.type && vuexModule.mutations.hasOwnProperty(action.type)) {

          const mutation = vuexModule.mutations[action.type];
          mutation(state, action.payload);

          return {
            ...state,
          };
        }

        return state;
      },
    };
  }
}