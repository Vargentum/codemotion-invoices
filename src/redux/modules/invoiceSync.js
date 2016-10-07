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

const composeInvoiceApiUrl = ({method, id}) => {
  switch (method) {
    case "POST": return `${API}invoices`
    case "PUT": return `${API}invoices/${id}`
    case "DELETE": return `${API}invoices/${id}`
  }
}

export const createInvoiceAPISyncActionCreator = ({method, isCreating}) => 
  ({id}) => (dispatch, getState) => {
    const URL = composeInvoiceApiUrl({method, id})
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
    fetch(URL, options).then(
      (success) => { console.log(success, 'success---------') /*TODO: Dispatch*/},
      (error) => { console.log(error, 'error---------') }
    )
  }


