import createReducer from 'create-reducer-map'
import update from 'react-addons-update'
import * as u from 'utils'
import {API} from 'constants'
import {FORM_ID} from 'forms/NewInvoiceForm'


/* -----------------------------
  Invoice controllers
----------------------------- */
// const createInvoiceRequest = ({method, id, isCreating}) => ({values: {discount, total, customer}}) => {

// decorator => thunk

export const createInvoiceAPISyncActionCreator = ({method, id, isCreating}) => 
  () => (dispatch, getState) => {
    const {form: {[FORM_ID]: {values: {discount, total, customer}}}} = getState()
    const headers = new Headers()
    headers.append('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
    headers.append('Access-Control-Allow-Origin', '*')
    headers.append('Content-Type', 'application/json')
    const options = {
      method,
      mode: "cors",
      headers
    }
    if (method === "POST" || method === "PUT") {
      options.body = JSON.stringify({
        customer_id: customer && customer.id,
        discount,
        total,
        isCreating
      })
    }
    fetch(`${API}invoices${id ? '/'+id : ''}`, options).then(
      (success) => { console.log(success, 'success---------') /*TODO: Dispatch*/},
      (error) => { console.log(error, 'error---------') }
    )
  }


