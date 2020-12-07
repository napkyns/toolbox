import ApiService from './ApiService';

export default class ResourceService extends ApiService{
  
  index(payload = {}) {

    const { params } = payload;

    return this.api({
      method: 'get',
      url: this.baseUrl,
      params: this.prepareParams(params),
    });
  }

  show(id, payload = {}) {

    const { params } = payload;

    return this.api({
      method: 'get',
      url: `${this.baseUrl}/${id}`,
      params: this.prepareParams(params),
    });
  }

  store(payload = {}) {

    const { params, ...rest } = payload;

    return this.api({
      method: 'post',
      url: this.baseUrl,
      params: this.prepareParams(params),
      data: this.preparePayload(rest),
    });
  }

  update(id, payload = {}) {

    const { params, ...rest } = payload;

    return this.api({
      method: 'put',
      url: `${this.baseUrl}/${id}`,
      params: this.prepareParams(params),
      data: this.preparePayload(rest),
    });
  }

  archive(id, payload = {}) {

    const { params, ...rest } = payload;

    return this.api({
      method: 'patch',
      url: `${this.baseUrl}/${id}/archive`,
      params: this.prepareParams(params),
      data: this.preparePayload(rest),
    });
  }

  destroy(id, payload = {}) {
    const { params, ...rest } = payload;

    return this.api({
      method: 'delete',
      url: `${this.baseUrl}/${id}`,
      params: this.prepareParams(params),
      data: this.preparePayload(rest),
    });
  }

  restore(id, payload = {}) {

    const { params, ...rest } = payload;

    return this.api({
      method: 'patch',
      url: `${this.baseUrl}/${id}/restore`,
      params: this.prepareParams(params),
      data: this.preparePayload(rest),
    });
  }
}
