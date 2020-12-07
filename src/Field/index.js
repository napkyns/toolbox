export default class Field {
  constructor(config = {}) {
    this.key = config.key || '';
    this.arrayOf = config.arrayOf || null;
    this.default = config.default !== undefined ? config.default : null;
    this.formFieldType = config.formFieldType || 'text';
    this.handler = config.handler || null;
    this.help = config.help || '';
    this.hidden = config.hidden || false;
    this.label = config.label || '';
    this.max = config.max || null;
    this.min = config.min || null;
    this.multiple = config.multiple || false;
    this.options = config.options ||  [];
    this.payloadKey = config.payloadKey || this.key;
    this.placeholder = config.placeholder || '';
    this.render = config.render || null;
    this.required = config.required || false;
    this.rows = config.rows || 2;
    this.step = config.step || null;
    this.type =  config.type || String;
  }
}