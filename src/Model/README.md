# Model

The model is the base object we use to consume API payloads that represent server-side models. 

## Demo

<a href="https://codepen.io/nickhough/pen/abmZwJo" target="_blank">Codepen</a>

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

PortfolioStore.js
```javascript

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