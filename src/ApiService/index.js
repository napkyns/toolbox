import _ from 'lodash';
import axios from 'axios';

export default class ApiService {

  constructor(config = {}) {

    this.tokenKey = config.tokenKey;
    this.loginUrl = config.loginUrl;

    this.axios = axios.create({
      ...config,
    });

    this.axios.interceptors.response.use(null, error => {

      if (error.response && error.response.status === 401) {

        const tokenKey = this.tokenKey || window.app.env.tokenKey || 'token';
        const loginUrl = this.loginUrl || window.app.env.loginUrl || null;

        console.log(tokenKey);
        console.log(loginUrl);

        if (window.app.storage.getItem(this.tokenKey)) {
          window.app.storage.removeItem(this.tokenKey);
        }

        if (loginUrl && window && window.location) {
          window.location.replace(this.loginUrl);
        } else {
          return Promise.reject(error);
        }

      } else {
        return Promise.reject(error);
      }
    });
  }

  request(config = {}) {

    const {headers, ...rest} = config;
    const baseUrl = config.apiBaseUrl || window.app.env.apiBaseUrl || '';
    const token = window.app.storage.getItem(this.tokenKey);

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

    const maxDepth = config.maxDepth || process.env.VUE_APP_API_MAX_DEPTH || 3;

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
