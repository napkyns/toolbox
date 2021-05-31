export default class Address {
  constructor (config = {}) {
    this.name = config.name || null;
    this.street = config.street || null;
    this.street2 = config.street2 || null;
    this.city = config.city || null;
    this.state = config.state || null;
    this.country = config.country || null;
    this.postCode = config.postCode || null;
    this.lat = config.lat || null;
    this.lng = config.lng || null;
  }

  get coordinates() {
    return {
      lat: this.lat,
      lng: this.lng,
    };
  }

  get exists() {
    return this.street || this.street2 || this.city || this.state || this.country || this.postCode || this.lat || this.lng;
  }

  toString() {
    return `${this.street ? `${this.street}` : ''}${this.street2 ? ` ${this.street2}` : ''}${this.street || this.street2 ? `,` : ''}
    ${this.city ? ` ${this.city},` : ''}
    ${this.state ? ` ${this.state},` : ''} 
    ${this.postCode ? ` ${this.postCode}` : ''}
    ${this.country ? this.country : ''}`;
  }
}
