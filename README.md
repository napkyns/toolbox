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

**Vuex Store**

In order to utilize the ``hasMany`` and ``belongsTo`` relationships on the [Model](./src/Model/README.md), you must set your Vue instance to a ```window``` variable.

```javascript
window.vue = new Vue(vueConfig);
```