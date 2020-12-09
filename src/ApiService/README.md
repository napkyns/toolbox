# ApiService

The ApiService has the following features:

1. Adds the `Authorization` headers to outbound requests.
2. Catches 401 responses and optionally redirects to a provided `loginUrl`.
3. Accepts an array of `include` or `require` parameters and joins the array before the request.
4. Accepts a payload with camelCased keys and converts the keys to snake_case before the request.
5. Parses certain payload values, such as `moment` objects and `files`.

## Config

You may set config variables by passing them into the constructor of the ApiService or by setting them in your 
Vue .env file(s). The constructor config object will take precedent. 

| Config Key | Env Key | Required | Description | Default |
| --- | --- | :---: | --- | --- |
| apiBaseUrl | VUE_APP_API_BASE_URL | Yes | Passed to Axios for the `BaseURL` param. | - |
| tokenKey | VUE_APP_TOKEN_KEY | No | Optionally, override where `localStorage` key. | `token` |
| loginUrl | VUE_APP_LOGIN_URL | No | Will redirect to this url when a 401 response is received. | `/auth/login` |
| maxDepth | VUE_APP_API_MAX_DEPTH | No | Configure how deep with the `preparePayload` go. | `3` |

## Methods

### prepareParams

The `prepareParams` method will accept a payload of type array for the `include` or `require` keys and transform it to a comma delimited string.

```javascript
import ApiService from '../ApiService';

export default class PostService extends ApiService {
  
  constructor() {
    super();
    this.url = 'post';
  }

  index(payload = {}) {

    const { params } = payload;

    // params == {
    //   include: ['account', 'user'],
    //   require: ['balanceByDay', 'balanceByMonth'],
    // }

    const requestConfig = {
      method: 'get',
      url: this.url,
      params: this.prepareParams(params),
    }; 

    // params == {
    //   include: 'account,user',
    //   require: 'balanceByDay,balanceByMonth',
    // }

    return this.request(requestConfig);
  }
}
```

### preparePayload

The `preparePayload` method will accept a camelCase keyed payload and transform the keys to snake_case.

```javascript
import ApiService from '../ApiService';

export default class PostService extends ApiService {
  
  constructor() {
    super();
    this.url = 'post';
  }

  store(payload = {}) {
  
      const { params, ...rest } = payload;
    
      // rest == {
      //   postBody: 'Foo bar',
      //   postDate: '2020-12-08 09:00:00',
      // }

      const requestConfig = {
        method: 'post',
        url: this.url,
        params: this.prepareParams(params),
        data: this.preparePayload(rest),
      };  

      // apiConfig == {
      //   ...
      //   data: {
      //     post_body: 'Foo bar',
      //     post_date: '2020-12-08 09:00:00',
      //   },
      // }

      return this.request(requestConfig);
    }
}
```