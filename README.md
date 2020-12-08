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

## Window Variable

Adding your Vue instance to the `window.app` object will add `hasMany` and `belongsTo` relationship functionality to the [Model](./src/Model/README.md). 

```javascript
window.app.vue = new Vue(vueConfig);
```