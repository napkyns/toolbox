import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

export default class ApiService {

  constructor(config = {}) {

    this.baseUrl = config.apiBaseUrl || process.env.VUE_APP_API_BASE_URL || '';
    this.maxDepth = config.maxDepth || process.env.VUE_APP_API_MAX_DEPTH || 3;
    this.tokenKey = config.tokenKey || process.env.VUE_APP_TOKEN_KEY || 'token';
    this.loginUrl = config.loginUrl || process.env.VUE_APP_LOGIN_URL|| null;

    this.api = axios.create({
      baseURL: this.baseUrl || '',
      headers: {
        Authorization: {
          toString() {
            return  `Bearer ${localStorage.getItem(this.tokenKey)}`;
          },
        },
      },
      responseType: 'json',
    });

    this.api.interceptors.response.use(null, error => {

      if(error.response && error.response.status === 401) {

        localStorage.removeItem(this.tokenKey);

        if (this.loginUrl) {
          window.location.replace(this.loginUrl);
        } else {
          return Promise.reject(error);
        }

      } else {
        return Promise.reject(error);
      }
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
    } else if (moment.isMoment(data)) {
      return data.clone().utc().format('YYYY-MM-DD HH:mm:ss');
    } else if (typeof data === 'string' || data === null) {
      return data;
    } else if (typeof data === 'object') {
      let snaked = {};

      for (let key in data) {
        if (key === 'file') {
          let formData = new FormData();
          formData.append('file', data['file']);
          snaked['file'] = formData;
        } else if (data.hasOwnProperty(key)) {
          snaked[_.snakeCase(key)] = this.preparePayload(data[key], currentDepth + 1);
        }
      }

      return snaked;
    }

    return data;
  }
}
