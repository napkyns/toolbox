# Model

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

> Assuming you have a Vuex Store wired up for your portfolios...

Portfolios.vue
```
<template>
    <div id="portfolios">
        <template v-for="portfolio in portfolios">
            <div class="portfolio">
                <template v-for="account in portfolio">
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