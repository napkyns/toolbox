import MenuItem from '../MenuItem';

export default class Menu {
  constructor(config = {}) {
    this.title = config.title || '';
    this.allMenuItems = config.menuItems ? config.menuItems.map(menuItem => new MenuItem(menuItem)) : [];
    this.menuItems = this.allMenuItems.filter(menuItem => menuItem.when === true || menuItem.when === null)
  }
}