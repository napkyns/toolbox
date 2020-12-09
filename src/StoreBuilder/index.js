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
}