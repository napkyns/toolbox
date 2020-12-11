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

  static get service() {
    return null;
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

  belongsTo(model, foreignKey = null, ownerKey = null) {

    if (!store) {
      return null;
    }

    const className = _.camelCase(model.name);
    const relationshipsKey = className;

    foreignKey = foreignKey || `${className}Id`;
    ownerKey = ownerKey || 'id';

    let belongsToId = null;
    let relatedData = null;

    // Foreign Key Method

    if (this[foreignKey]) {
      belongsToId = this[foreignKey];
    }

    // Relationships Method

    else if (this.relationships && this.relationships[relationshipsKey]) {
      belongsToId = this.relationships[relationshipsKey];
    }

    if (belongsToId) {
      relatedData = this.getRelatedDataViaIdentifierFromVuex(model, belongsToId, ownerKey);
    }

    return relatedData;
  }

  hasOne(model, foreignKey = null, localKey = null, relationshipsKey = null) {

    if (!store) {
      return null;
    }

    const className = _.camelCase(model.name);
    relationshipsKey = relationshipsKey || className;
    foreignKey = foreignKey || `${_.camelCase(this.constructor.name)}Id`;
    localKey = localKey || 'id';
    let hasOneId = null;
    let relatedData;

    console.log(this.relationships);

    // Relationships Method

    if (this.relationships && this.relationships[relationshipsKey]) {
      hasOneId = this.relationships[relationshipsKey];
    }

    if (hasOneId) {
      relatedData = this.getRelatedDataViaIdentifierFromVuex(model, hasOneId, localKey);
    }

    // Foreign Key Method

    if (!relatedData) {

      relatedData = this.getRelatedDataViaForeignKeyFromVuex(model, foreignKey, localKey);

      if (relatedData.length) {
        relatedData = _.first(relatedData); // Could be a breaking point, if there's more than one result in Vuex?
      }
    }

    return relatedData;
  }

  hasMany(model, foreignKey = null, localKey = null) {

    if (!store) {
      return [];
    }

    const className = _.camelCase(model.name);
    const relationshipsKey = pluralize(className);

    foreignKey = foreignKey || `${_.camelCase(this.constructor.name)}Id`;
    localKey = localKey || 'id';

    let ids = [];
    let relatedData;

    // Relationships Method

    if (this.relationships && this.relationships[relationshipsKey]) {

      ids = this.relationships[relationshipsKey];
      const vuexGetter = `${model.vuexModuleKey}/collection`;
      const getter = store.getters[vuexGetter];

      if (getter && typeof getter === 'function') {
        relatedData = getter(ids);
      }
    }

    // Foreign Key Method

    if (!relatedData) {
      relatedData = this.getRelatedDataViaForeignKeyFromVuex(model, foreignKey, localKey);
    }

    if (relatedData) {
      relatedData = relatedData.map(rawData => new model(rawData));
    }

    return relatedData || [];
  }

  getRelatedDataViaForeignKeyFromVuex(model, foreignKey, localKey) {

    const allItemsForKey = store.getters[`${model.vuexModuleKey}/all`];
    let relatedData = [];

    if (allItemsForKey) {

      relatedData = allItemsForKey.filter((item) => {

        if (!item[foreignKey] || !item[localKey]) {
          return false;
        }

        // Integer ID's
        if (parseInt(item[foreignKey]) === parseInt(this[localKey])) {
          return true;
        }
        // String ID's - less common, but possible
        else if (item[foreignKey] === this[localKey]) {
          return true;
        }

        return false;
      });
    }

    return relatedData;
  }

  getRelatedDataViaIdentifierFromVuex(model, identifier, ownerKey) {

    let relatedData = null;
    const vuexGetter = ownerKey === 'id' ? `${model.vuexModuleKey}/show` : `${model.vuexModuleKey}/findBy`;
    const getter = store.getters[vuexGetter];

    if (getter && typeof getter === 'function') {
      relatedData = getter(identifier, ownerKey);
    }

    return relatedData;
  }
}