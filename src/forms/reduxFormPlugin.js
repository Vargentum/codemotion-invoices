import {FORM_ID} from 'forms/NewInvoiceForm'
import update from 'react-addons-update'

export default {
  [FORM_ID]: function (state, {type, payload, meta}) {
    if (type === 'redux-form/CHANGE' && meta.field === 'products') {
      const synchedQuantities = payload.map((product, idx) => state.values.quantities[idx] || 1)
      return update(state, {values: {quantities: {$set: synchedQuantities}}})
    } 
    else return state
  }
}
