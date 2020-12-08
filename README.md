![npm](https://img.shields.io/npm/dt/@napkyns/toolbox?style=flat-square)

A collection of helpful JS classes - with some specific benefits with Vue/Vuex.

## Classes

- [ApiService](./src/ApiService/README.md)
- [Field](./src/Field/README.md)
- [Form](./src/Form/README.md)
- [FormErrors](./src/FormErrors/README.md)
- [Model](./src/Model/README.md)
- [Paginator](./src/Paginator/README.md)
- [ResourceService](./src/ResourceService/README.md)
- [ResourceStore](./src/ResourceStore/README.md)

## Installation

**NPM**  
```
npm i @napkyns/toolbox
```

**Yarn**  
```
yarn add @napkyns/toolbox
```

## window.app

Some classes have additional functionality when given access to specific variables.

```javascript
window.app = {};
```

Adding a `loginUrl` to the `window.app` object will cause the [ApiService](./src/ApiService/README.md) to automatically redirect users to the login when a 401 response is received. 

```javascript
window.app.loginUrl = '/auth/login';
```

Adding a `tokeyKey` to the `window.app` object will override the `localStorage` key the [ApiService](./src/ApiService/README.md) uses for `Authorization` headers. 

Adding a Vue instance to the ``window.app`` object will add relationship functionality to the [Model](./src/Model/README.md). 

```javascript
window.app.vue = new Vue(vueConfig);
```