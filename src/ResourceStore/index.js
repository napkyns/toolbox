import normalize from 'json-api-normalizer';

import Paginator from '../Paginator';

export default class ResourceStore {

  constructor(config = {}) {

    this.key = config.key || config.model.vuexModuleKey || null;

    this.model = config.model || {};

    this.service = this.model.service ? new this.model.service() : (config.service ? new config.service() : null);

    this.namespaced = true;

    this.state = {
      items: {},
      ...config.state,
    };

    this.actions = {
      index: ({commit}, payload) => {
        return this.service.index(payload).then((response) => {

          const ids = ResourceStore.processData(this.key, commit, response.data, payload && payload.replaceStore === true);

          let paginator = null;

          if (response.data.meta && response.data.meta.pagination) {
            paginator = new Paginator(response.data.meta.pagination);
          }

          return {
            ids,
            paginator,
          };
        });
      },
      show: ({commit}, payload) => {
        return this.service.show(payload.id, payload).then((response) => {
          return ResourceStore.processData(this.key, commit, response.data);
        });
      },
      store: ({commit}, payload) => {
        return this.service.store(payload).then((response) => {
          if (response) {
            const idInArray = ResourceStore.processData(this.key, commit, response.data);
            return idInArray[0];
          }
        });
      },
      update: ({commit}, payload) => {
        return this.service.update(payload.id, payload).then((response) => {
          if (response) {
            return ResourceStore.processData(this.key, commit, response.data);
          }
        });
      },
      archive: ({commit}, payload) => {
        return this.service.archive(payload.id, payload).then((response) => {
          return ResourceStore.processData(this.key, commit, response.data);
        });
      },
      restore: ({commit}, payload) => {
        return this.service.restore(payload.id, payload).then((response) => {
          return ResourceStore.processData(this.key, commit, response.data);
        });
      },
      destroy: ({commit}, payload) => {
        return this.service.destroy(payload.id, payload).then(() => {
          const model = {
            id: payload.id,
          };
          commit('remove', model);
        });
      },
      destroyAll: ({commit}, payload) => {
        return this.service.destroyAll(payload).then(() => {
          commit('index', {});
        });
      },
      destroyByIds: ({commit}, payload) => {
        return this.service.destroyByIds(payload).then(() => {
          commit('removeByIds', payload.ids || []);
        });
      },
      ...config.actions,
    };

    this.mutations = {
      index(state, items) {
        state.items = items;
      },
      merge(state, collection = {}) {
        state.items = {
          ...state.items,
          ...collection,
        };
      },
      remove(state, model) {
        const items = state.items;
        delete items[model.id];
        state.items = {
          ...items,
        };
      },
      removeByIds(state, ids = []) {

        const items = state.items;

        ids.forEach((id) => {
          delete items[id];
        });

        state.items = {
          ...items,
        };
      },
      ...config.mutations,
    };

    this.getters = {
      all: (state) => {
        return Object.values(state.items).map(data => new this.model(data));
      },
      collection: (state) => (ids) => {
        if (ids && Array.isArray(ids)) {
          return ids.map(id => new this.model(state.items[id])).filter(item => item.id && item !== null);
        }
        return [];
      },
      show: (state) => (id) => {

        let data = state.items[id];

        if (data) {
          return new this.model(data);
        } else {
          return window.app.vue.$store.dispatch(`${this.key}/show`, {
            id,
          }).then(() => {
            return new this.model(state.items[id]);
          });
        }

      },
      findBy: (state) => (value, key = 'id') => {
        const data = Object.values(state.items).find(item => item[key] === value);

        if (data) {
          return new this.model(data);
        }

        return null;
      },
      ...config.getters,
    };
  }

  static processData(primaryKey, commit, data, replace = false) {

    const normalized = normalize(data);

    commit('auth/authenticated', !!window.app.auth.getToken(), {root: true})

    for (let [key, models] of Object.entries(normalized)) {

      for (let [id, model] of Object.entries(models)) {

        if (model.attributes) {
          for (const [key, value] of Object.entries(model.attributes)) {
            model[key] = value;
          }
          delete model.attributes;
        }

        if (model.relationships) {
          for (const [_key, value] of Object.entries(model.relationships)) {
            if (Array.isArray(value.data)) {
              model.relationships[_key] = value.data.map(payload => payload.id);
            } else {
              model.relationships[_key] = value.data.id;
            }
          }
        }

        models[id] = model;
      }

      if (replace) {
        commit(`${key}/index`, models, { root: true });
      } else {
        commit(`${key}/merge`, models, { root: true });
      }
    }

    if (data.data) {
      if (Array.isArray(data.data)) {
        return data.data.map(item => item.id);
      } else {
        return [data.data.id];
      }
    }

    return [];
  }

  toObject() {
    return {
      key: this.key,
      namespaced: this.namespaced,
      state: this.state,
      actions: this.actions,
      mutations: this.mutations,
      getters: this.getters,
    };
  }
}
