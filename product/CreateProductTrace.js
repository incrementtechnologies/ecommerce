import CONFIG from 'src/config.js'
import AUTH from 'src/services/auth'
export default {
  id: 'createProductTraceModal',
  size: 'modal-md',
  title: 'Add Item',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Batch Number',
    variable: 'batch_number',
    placeholder: 'Enter batch number',
    disabled: false,
    value: null,
    required: true,
    id: 'batch_number',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 5,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Manufactu',
    variable: 'manufacturing_date',
    placeholder: 'Enter manufacture date',
    disabled: false,
    value: null,
    required: true,
    id: 'manufacturing_date',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 5,
      type: 'text'
    }
  }],
  route: 'product_traces/create',
  button: {
    left: 'Cancel',
    right: 'Create'
  },
  sort: {
    column: 'created_at',
    value: 'desc'
  },
  params: []
}
