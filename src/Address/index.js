export default class Address {
  constructor (config = {}) {
    this.street = config.street || '';
    this.street2 = config.street2 || '';
    this.city = config.city || '';
    this.state = config.state || '';
    this.country = config.country || '';
    this.postCode = config.postCode || '';
    this.lat = config.lat || '';
    this.lng = config.lng || '';
  }

  get coordinates() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  toString() {
    return `${this.street.length ? `${this.street}` : ''}${this.street2.length ? ` ${this.street2}` : ''}${this.street.length || this.street2.length ? `,` : ''}
    ${this.city.length ? ` ${this.city},` : ''}
    ${this.state.length ? ` ${this.state},` : ''} 
    ${this.postCode.length ? ` ${this.postCode}` : ''}
    ${this.country}`;
  }
}
