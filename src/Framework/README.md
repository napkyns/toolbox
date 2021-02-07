# Framework

## Configuration

The `userVuexAction` option defines which Vuex Action will be called to fetch the user object.

```javascript
import {
  Framework,
} from '@napkyns/toolbox';

const framework = new Framework({
  userVuexAction: 'user/show',
});
```

## Environment Variables

Environment variables can be set like this:

```javascript
framework.env({
  appName: 'xBand',
  apiBaseUrl: process.env.VUE_APP_API_BASE_URL,
  environment: process.env.VUE_APP_ENV,
  vueAppUrl: process.env.VUE_APP_URL,
});
```

Environment variables can be accessed like this:

```javascript
const apiBaseUrl = window.app.env.apiBaseUrl;
```

## AuthDriver

You can define how the framework should get/set/remove your auth token, as well as 

```javascript
framework.auth({
  getToken() {
    return window.app.storage.getItem('token') ? window.app.storage.getItem('token') : null;
  },
  setToken(token) {
    return window.app.storage.setItem('token', token);
  },
  removeToken() {
    return window.app.storage.removeItem('token');
  },
  redirectRouteAfterLogin() {
    return window.app.findRouteByName('dashboard');
  },
  unauthenticated() {
    window.app.auth.removeToken();
    window.location.replace('/auth/login');
  },
});
```

## StorageDriver

```javascript
framework.storage({
  setItem(key, value) {
    return typeof value === 'string' ? window.localStorage.setItem(key, value) : window.localStorage.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    const value = window.localStorage.getItem(key);

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  },
  removeItem(key) {
    return window.localStorage.removeItem(key);
  },
});
```

## ThemeDriver

```javascript
framework.theme({
  get() {
    return window.app.storage.getItem('theme') || 'dark';
  },
  set(theme) {
    return window.app.storage.setItem('theme', theme);
  }
});
```

## Vue ServiceProviders

You can add packaged functionality via a [ServiceProvider](../ServiceProvider).

```javascript
framework.addVueServiceProvider(AuthServiceProvider);
```
## Helpers

Define helpers like this:

```javascript
framework.addHelper('d', (payload) => {
  if (window.app.env.environment) {
    console.log(payload);
  }
});
```

Access helpers like this:
```javascript
window.app.d('Hello world');
```

## Boot

After you've configured the framework, you'll finally call the boot method.

```javascript
framework.boot();
```