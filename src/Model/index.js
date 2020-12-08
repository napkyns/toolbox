import _ from 'lodash';
import pluralize from 'pluralize';
import moment from 'moment';

import Field from '../Field';

let store;

export default class Model {

  constructor(config = {}) {

    if (!config) return;

    this._config = {
      dates: [
        'createdAt',
        'updatedAt',
        'deletedAt',
        ...(config.dates || []),
        ...(this.constructor.dates || []),
      ],
      excluded: [
        '_attributes',
        '_relationships',
        '_type',
        ...(config.excluded || []),
        ...(this.constructor.excluded || []),
      ],
      fields: {
        ...(this.constructor.fields || {}),
      },
    };

    if (window.app && window.app.vue) {
      store = window.app.vue.$store;
    }

    for (const [key, value] of Object.entries(this._config.fields)) {
      this._config.fields[key] = new Field(value);
    }

    // Parse Values

    for (const [key, value] of Object.entries(config)) {
      this[_.camelCase(key)] = this.parseValueRecursive(key, value);
    }

    // Set Default Values

    for (const [key, value] of Object.entries(this._config.fields)) {
      if (this[key] === undefined && value.default !== undefined) {
        this[key] = typeof value.default === 'function' ? value.default() : value.default;
      }
    }

    delete this._config;
  }

  static get vuexModuleKey() {
    return _.camelCase(this.name);
  }

  static get defaultFieldValues() {

    const defaults = {};

    for (const [key, value] of Object.entries(this.fields)) {

      let defaultValue = undefined;

      if (value.default !== undefined) {
        defaultValue = typeof value.default === 'function' ? value.default() : value.default;
      }

      defaults[key] = defaultValue;
    }

    return defaults;
  }

  static get fields() {
    return {};
  }

  static get labels() {
    const singular = _.startCase(this.name);
    return {
      singular,
      plural: pluralize(singular),
    }
  }

  parseValueRecursive(key, value) {

    const camelCaseKey = _.camelCase(key);
    const field = this._config.fields[camelCaseKey];

    if (!this._config.excluded.includes(camelCaseKey)) {

      // ID
      if (camelCaseKey === 'id' && parseInt(value)) {
        return parseInt(value);
      }

      // Null
      else if (value === null) {
        return null;
      }

      // Date
      else if ((field && field.type === Date) || (this._config.dates.includes(camelCaseKey) && moment(value).isValid())) {
        return moment(value);
      }

      // Bool
      else if (field && field.type === Boolean) {
        return value === 1 || value === 'true' || value === true;
      }

      // Number
      else if (field && field.type === Number) {
        return Number(value);
      }

      // String
      else if (field && field.type === String) {
        return String(value).trim();
      }

      // Array
      else if (Array.isArray(value)) {

        // Move to hasMany??

        if (field && field.arrayOf) {
          return value.map(item => new field.arrayOf(item));
        }

        return value;
      }

      // Object
      else if (((field && field.type === Object) || value === Object(value))) {

        const object = {};

        for (const [objectKey, objectValue] of Object.entries(value)) {
          object[_.camelCase(objectKey)] = this.parseValueRecursive(objectKey, objectValue);
        }

        return object;
      }

      // Catch all

      else {
        return value;
      }
    }
  }

  belongsTo(model) {

    if (!store) {
      return null;
    }

    const className = _.camelCase(model.name);
    const relationshipsKey = className;
    const foreignKey = `${className}Id`;
    let belongsToId = null;
    let relatedData;

    // Foreign Key Method

    if (this[foreignKey]) {
      belongsToId = this[foreignKey];
    }

    // Relationships Method

    else if (this.relationships && this.relationships[relationshipsKey]) {
      belongsToId = this.relationships[relationshipsKey];
    }

    const vuexGetter = `${model.vuexModuleKey}/show`;
    const getter = store.getters[vuexGetter];

    if (getter) {
      relatedData = getter(belongsToId);
    }

    if (relatedData) {
      return new model(relatedData);
    }

    return null;
  }

  hasMany(model) {

    if (!store) {
      return [];
    }

    const className = _.camelCase(model.name);
    const relationshipsKey = pluralize(className);
    const foreignKey = `${_.camelCase(this.constructor.name)}Id`;

    let ids = [];
    let relatedData;

    // Relationships Method

    if (this.relationships && this.relationships[relationshipsKey]) {

      ids = this.relationships[relationshipsKey];
      const vuexGetter = `${model.vuexModuleKey}/collection`;
      const getter = store.getters[vuexGetter];

      if (getter) {
        relatedData = getter(ids);
      }
    }

    // Foreign Key Method

    if (!relatedData) {

      const allForKey = store.getters[`${model.vuexModuleKey}/all`];

      if (allForKey) {
        relatedData = allForKey.filter((item) => {

          if (!item[foreignKey]) {
            return false;
          }

          // Integer ID's
          if (parseInt(item[foreignKey]) === parseInt(this.id)) {
            return true;
          }
          // String ID's - less common, but possible
          else if (item[foreignKey] === this.id) {
            return true;
          }

          return false;
        });
      }
    }

    if (relatedData) {
      relatedData = relatedData.map(rawData => new model(rawData));
    }

    return relatedData || [];
  }
}