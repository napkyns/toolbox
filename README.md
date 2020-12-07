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

> **:warning: Vuex Store**  
> In order to utilize the ``hasMany`` and ``belongsTo`` relationships on the [Model](./src/Model/README.md), you must set your Vue instance to a ```window``` variable.

```
window.vue = new Vue(vueConfig);
```

## Example Usage

Portfolio.js
```
import { Model } from '@napkyns/toolbox';

import Account from '@/your-project/Account';

export default class Portfolio extends Model {

  static get fields() {
    return {
      name: {
        default: '',
        required: true,
        type: String,
      },
    };
  }

  get accounts() {
    return this.hasMany(Account);
  }
}
```

Account.js
```
import { Model } from '@napkyns/toolbox';

import Portfolio from '@/your-project/Porfolio';

export default class Account extends Model {

  static get dates() {
    return [
      'lastUpdateAt',
    ];
  }

  static get fields() {
    return {
      name: {
        default: '',
        required: true,
        type: String,
      },
      balance: {
        default: 0,
        required: false,
        type: Number,
      },
    };
  }

  get portfolio() {
    return this.belongsTo(Portfolio);
  }
}
```

