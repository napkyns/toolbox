import _ from 'lodash';
import axios from 'axios';
import moment from 'moment';

const maxDepth = 3;

export default class ApiService {

  constructor() {

    this.api = axios.create({
      baseURL: process.env.VUE_APP_API_URL,
      headers: {
        Authorization: {
          toString() {
            return  `Bearer ${localStorage.getItem('token')}`;
          },
        },
      },
      responseType: 'json',
    });

    this.api.interceptors.response.use(null, error => {
      if(error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        if (window.loginPath) {
          window.location.replace(window.loginPath);
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

    if (currentDepth >= maxDepth) {
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
