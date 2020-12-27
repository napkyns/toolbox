export default class ServiceProvider {

  constructor(config = {}) {
    this.framework = config.framework || null;
  }

  boot() {}

  addRoutes(routes) {
    if (this.framework) {
      this.framework.routerBuilder.addRoutes(routes);
      this.framework.resetRouter();
    } else {
      console.error('No framework');
    }
  }

  addStoreModule(storeModule) {
    if (this.framework) {
      this.framework.store.registerModule(storeModule.key, storeModule);
    } else {
      console.error('No framework');
    }
  }

  addHelper(key, helper) {
    if (this.framework) {
      this.framework.addHelper(key, helper);
    } else {
      console.error('No framework');
    }
  }

}