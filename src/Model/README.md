# Model

## Example

ExampleModel.js
```
import { Model } from '@napkyns/toolbox';

import BelongsToRelatedModel from '@/your-project/BelongsToRelatedModel';
import HasManyRelatedModel from '@/your-project/HasManyRelatedModel';

export default class ExampleModel extends Model {

  static get dates() {
    return [];
  }

  static get fields() {
    return {
      yourField: {
        arrayOf: null,
        default: null,
        formFieldType: 'text',
        handler: null,
        help: '',
        hidden: false,
        key: '',
        label: '',
        max: null,
        min: null,
        multiple: false,
        options: [],
        payloadKey: '',
        placeholder: '',
        render: null,
        required: false,
        rows: null,
        step: null,
        type: String,
      },
    };
  }

  get yourBelongsToRelationship() {
    return this.belongsTo(BelongsToRelatedModel);
  }

  get yourHasManyRelationship() {
    return this.hasMany(HasManyRelatedModel);
  }
}
```
