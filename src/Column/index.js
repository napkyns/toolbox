export default class Column {
  constructor(config = {}) {
    this.component = config.component || null;
    this.editable = config.editable || false;
    this.field = config.field;
    this.formatter = config.formatter || null;
    this.label = config.label;
    this.maxWidth = config.maxWidth || null;
    this.numeric = config.numeric || false;
    this.rank = config.rank || 0;
    this.sortable = config.sortable || false;
    this.truncate = config.truncate || false;
    this.type = config.type || null;
    this.visible = config.visible || this.field !== 'id';
    this.width = config.width || null;
  }
}