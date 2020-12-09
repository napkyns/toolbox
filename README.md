![npm](https://img.shields.io/npm/dt/@napkyns/toolbox?style=flat-square)

A collection of helpful JS classes - with some specific benefits with Vue/Vuex.

## Classes

- [ApiService](./src/ApiService)
- [Column](./src/Column)
- [Field](./src/Field)
- [Form](./src/Form)
- [FormErrors](./src/FormErrors)
- [Menu](./src/Menu)
- [MenuItem](./src/MenuItem)
- [Model](./src/Model)
- [Paginator](./src/Paginator)
- [ResourceService](./src/ResourceService)
- [ResourceStore](./src/ResourceStore)
- [RouterBuilder](./src/RouterBuilder)
- [StoreBuilder](./src/StoreBuilder)

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