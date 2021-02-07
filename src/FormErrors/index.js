import _ from 'lodash';

export default class FormErrors {

  constructor() {
    this.bag = {};
  }

  record(errors) {
    this.bag = {};

    if (Array.isArray(errors)) {
      errors.forEach(error => {
        if (error.key) {
          this.bag[_.camelCase(error.key)] = error.detail;
        }
      });
    } else {
      for (const [key, value] of Object.entries(errors)) {

        let message = '';

        if (Array.isArray(value)) {
          message = value.join(' ');
        } else {
          message = value;
        }

        this.bag[_.camelCase(key)] = message;
      }
    }
  }

  get(field) {
    if (this.bag[_.camelCase(field)]) {
      return this.bag[_.camelCase(field)];
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