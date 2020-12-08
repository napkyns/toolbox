# ApiService

The ApiService has a few main features.

1. Adds the `Authorization` headers to outbound requests.
2. Catches 401 responses and optionally redirects to a provided `loginUrl`.
3. Accepts an array of `include` or `require` parameters and joins the array before the request.
4. Accepts a payload with camelCased keys and converts the keys to snake_case before the request.

## Config

| Key | Required | Description | Default |
| --- | :---: | --- | --- |
| window.app.apiBaseUrl | Yes | Passed to Axios for the `BaseURL` param. | - |
| window.app.tokenKey | No | Optionally, override where `localStorage` key. | `token` |
| window.app.loginPath | No | Will redirect to this url when a 401 response is received. | - |
| window.app.apiServiceMaxDepth | No | Configure how deep with the `preparePayload` go. | `3` |