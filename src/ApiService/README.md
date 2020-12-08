# ApiService

The ApiService has the following features:

1. Adds the `Authorization` headers to outbound requests.
2. Catches 401 responses and optionally redirects to a provided `loginUrl`.
3. Accepts an array of `include` or `require` parameters and joins the array before the request.
4. Accepts a payload with camelCased keys and converts the keys to snake_case before the request.

## Config

You may set config variables by passing them into the constructor of the ApiService or by setting them in your 
Vue .env file(s). The constructor config object will take precedent. 

| Config Key | Env Key | Required | Description | Default |
| --- | --- | :---: | --- | --- |
| apiBaseUrl | VUE_APP_API_BASE_URL | Yes | Passed to Axios for the `BaseURL` param. | - |
| tokenKey | VUE_APP_TOKEN_KEY | No | Optionally, override where `localStorage` key. | `token` |
| loginUrl | VUE_APP_LOGIN_URL | No | Will redirect to this url when a 401 response is received. | - |
| maxDepth | VUE_APP_API_MAX_DEPTH | No | Configure how deep with the `preparePayload` go. | `3` |

## Methods

### prepareParams

The `prepareParams` method will accept a payload of type array for the `include` key and transform it to a comma delimited string.

```javascript
const params = {
  include: [
    'account',
    'user',
  ],
};

return this.api({
  method: 'get',
  url: `${this.baseUrl}/${id}`,
  params: this.prepareParams(params),
});
```

### preparePayload

The `preparePayload` method will accept a camelCase keyed payload and transform the keys to snake_case.