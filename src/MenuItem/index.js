export default class MenuItem {
  constructor(config = {}) {

    const routeMeta = config.route && config.route.meta ? config.route.meta : {};

    this.count = config.count || null;
    this.divider = config.divider || false;
    this.hideTitle = config.hideTitle || false;
    this.icon = config.icon || routeMeta.icon || null; // BIcon icon prop
    this.imageUrl = config.imageUrl || null;
    this.menuItems = config.menuItems ? config.menuItems.map(menuItem => new MenuItem(menuItem)) : [];
    this.onClick = config.onClick || null;
    this.route = config.route || {}; // Vue Router Route
    this.secondaryMenuActive = config.secondaryMenuActive || false;
    this.title = config.title || routeMeta.title || '';
    this.usePsIcon = config.usePsIcon || false;
    this.when = config.when !== undefined ? config.when : null;
  }

  get shouldShowTitle() {
    return this.title && !this.hideTitle;
  }
}