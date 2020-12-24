export default class Module {
  constructor(config = {}) {
    this.routes = config.routes || [];
    this.storeModules = config.storeModules || [];
  }
}