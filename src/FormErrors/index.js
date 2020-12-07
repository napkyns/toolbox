import _ from 'lodash';

export default class FormErrors {

  constructor() {
    this.bag = {};
  }

  record(errors) {
    this.bag = {};

    errors.forEach(error => {
      if (error.key) {
        this.bag[_.camelCase(error.key)] = error.detail;
      }
    })
  }

  get(field) {
    if (this.bag[field]) {
      return this.bag[field];
    }

    return null;
  }

  has(field) {
    return this.bag.hasOwnProperty(_.camelCase(field));
  }

  clear(field) {

    if (field) {
      delete this.bag[field];
      return;
    }

    this.bag = {};
  }

  any() {
    return Object.keys(this.bag).length > 0;
  }
}