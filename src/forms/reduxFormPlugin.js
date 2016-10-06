import {FORM_ID} from 'forms/NewInvoiceForm'
import update from 'react-addons-update'
import _ from 'lodash'
import {API} from 'constants'


const calcInvoiceTotal = ({products, quantities}) => () =>
  products.reduce((p,n,i) => p + n.price * quantities[i], 0)

export default {
  [FORM_ID]: function (state, {type, payload, meta}) {
    if (type === 'redux-form/CHANGE') {
      if (meta.field === 'products') {
        const synchedQuantities = payload.map((product, idx) => state.values.quantities[idx] || 1)
        return update(state, {values: {quantities: {$set: synchedQuantities}}})
      }
      if (meta.field === 'products' || meta.field === 'quantities') {
        return update(state, {values: {total: {$apply: calcInvoiceTotal(state.values)}}})
      }
    }
    return state
  }
}
