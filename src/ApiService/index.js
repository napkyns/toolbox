import _ from 'lodash';
import axios from 'axios';

export default class ApiService {

  constructor(config = {}) {

    this.token = config.token;
    this.unauthenticated = config.unauthenticated;
    this.maxDepth = config.maxDepth;

    this.axios = axios.create({
      ...config,
    });

    this.axios.interceptors.response.use(null, async (error) => {

      if (error.response && error.response.status === 401) {

        const unauthenticated = this.unauthenticated || window.app.auth.unauthenticated || null;

        if (unauthenticated) {
          return unauthenticated();
        } else {
          return Promise.reject(error);
        }

      } else {
        return Promise.reject(error);
      }
    });
  }

  async request(config = {}) {

    const {headers, ...rest} = config;
    const baseUrl = config.apiBaseUrl || window.app.env.apiBaseUrl || '';

    let token = null;

    if (this.token) {
      token = this.token();
    } else if (window.app.auth.getToken) {
      token = await window.app.auth.getToken();
    }

    const requestHeaders = {
      Authorization: token ? `Bearer ${token}` : null,
      ...headers,
    };

    return this.axios({
      headers: requestHeaders,
      baseURL: baseUrl || '',
      responseType: 'json',
      ...rest,
    });
  }

  prepareParams(params) {

    if (params && Array.isArray(params.include)) {
      params.include = params.include.join(',');
    }

    if (params && Array.isArray(params.require)) {
      params.require = params.require.join(',');
    }

    return params;
  }

  preparePayload(data, currentDepth = 0) {

    const maxDepth = this.maxDepth || window.app.env.apiMaxDepth || 3;

    if (currentDepth >= maxDepth) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.preparePayload(item, currentDepth + 1));
    } else if (typeof data === 'string' || data === null) {
      return data;
    } else if (typeof data === 'object') {

      let snaked = {};

      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          snaked[_.snakeCase(key)] = this.preparePayload(data[key], currentDepth + 1);
        }
      }

      return snaked;
    }

    return data;
  }
}
