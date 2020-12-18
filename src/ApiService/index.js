import _ from 'lodash';
import axios from 'axios';

export default class ApiService {

  constructor(config = {}) {

    this.baseUrl = config.apiBaseUrl || window.app.env.apiBaseUrl || process.env.VUE_APP_API_BASE_URL || '';
    this.maxDepth = config.maxDepth || process.env.VUE_APP_API_MAX_DEPTH || 3;
    this.tokenKey = config.tokenKey || process.env.VUE_APP_TOKEN_KEY || 'token';
    this.loginUrl = config.loginUrl || process.env.VUE_APP_LOGIN_URL || '/auth/login';

    this.axios = axios.create({
      baseURL: this.baseUrl || '',
      responseType: 'json',
    });

    this.axios.interceptors.response.use(null, error => {

      if (error.response && error.response.status === 401) {

        if (window.app.storage.getItem(this.tokenKey)) {
          window.app.storage.removeItem(this.tokenKey);
        }

        if (this.loginUrl && window && window.location) {
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
    const token = window.app.storage.getItem(this.tokenKey);
    const requestHeaders = {
      Authorization: token ? `Bearer ${token}` : null,
      ...headers,
    };

    return this.axios({
      headers: requestHeaders,
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

    if (currentDepth >= this.maxDepth) {
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
