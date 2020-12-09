# Model

The model is the base object we use to consume API payloads that represent server-side models. 

## Demo

[Codepen](https://codepen.io/nickhough/pen/abmZwJo)

## Example Usage

Portfolio.js
```javascript
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
```javascript
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

Portfolios.vue
```vue
<template>
    <div id="portfolios">
        <template v-for="portfolio in portfolios">
            <div class="portfolio">
                <template v-for="account in portfolio.accounts">
                    <span class="name">{{ account.name }}</span>
                    <div class="balance">{{ account.balance }}</div>
                </template>
            </div>
        </template>
    </div>
</template>

<script>
export default {
  name: 'Portfolios',
  computed: {
    portfolios() {
      return this.$store.getters['portfolio/all'];
    },
  },
}
</script>
```

Behind the scenes, the Model will reach out to the Vuex Store and pull in the related models. The Model will rely on 
one of two things to determine relationships:

1. The `relationships` property, as defined by `json-api-normalizer` - which is utilized by the [ResourceStore](../ResourceStore).
2. A foreign key on the related object. In the example above, you would ensure the `account` had a `portfolioId` 
property set with the proper id. 