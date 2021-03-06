import FormErrors from '../FormErrors';

export default class Form {

  constructor(fields = {}) {
    this.originalFields = {...fields};
    this.fields = fields;
    this.errors = new FormErrors();
  }

  reset() {
    this.fields = {...this.originalFields};
    this.errors.clear();
  }

  recordErrors(error) {
    if (error.response && error.response.data) {
      this.errors.record(error.response.data.errors);
    }
  }
}