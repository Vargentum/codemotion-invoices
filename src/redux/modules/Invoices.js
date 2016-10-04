import createReducer from 'create-reducer-map'
import update from 'react-addons-update'


export const compose = (...fns) => (initValue) => fns.reduce((p,fn) => fn.call(p, p), initValue)
export const composeRight = (...fns) => (initValue) => fns.reduceRight((p,fn) => fn.call(p, p), initValue)

const API = 'http://localhost:8000/api/'

const getProimseCycleActions = (actionType) => ({
  pending: actionType + '_PENDING',
  fulfilled: actionType + '_FULFILLED',
  rejected: actionType + '_REJECTED',
})

const RESOURCE_TYPES = ['customers', 'products', 'invoices']
const checkResourceType = (type) => {
  if (!RESOURCE_TYPES.includes(type)) throw new Error(`incorrect resource type ${type}`)
}

/* -----------------------------
  Constants
----------------------------- */
const createResourceBasicConstant = (type) => {
  checkResourceType(type)
  return `LOAD_${type.toUpperCase()}`
}
const [
  LOAD_CUSTOMERS_CYCLE, 
  LOAD_PRODUCTS_CYCLE, 
  LOAD_INVOICES_CYCLE
] = RESOURCE_TYPES.map(compose(createResourceBasicConstant, getProimseCycleActions))

/* -----------------------------
  Action creators
----------------------------- */
const composeRecourceLoadAC = (type) => () => (dispatch) => {
  checkResourceType(type)
  fetch(API + type, {mode: 'cors'})
    .then(response => {
      dispatch({
        type: createResourceBasicConstant(type),
        payload: {
          promise: response.json()
        }  
      })
    })
    .catch(error => {
      throw error
    })
}
export const [getCustomers, getProducts, getInvoices] = RESOURCE_TYPES.map(composeRecourceLoadAC)

/* -----------------------------
  Reducers
----------------------------- */
const createResourceState = () => ({
  loading: false,
  loaded: false,
  data: []
}) 

const initialState = {
  'customers': createResourceState(),
  'products': createResourceState(),
  'invoices': createResourceState()
}

export default createReducer(initialState, {
  [LOAD_INVOICES_CYCLE.pending]: (state) => ({
    ...state,
    invoices: update(state.invoices, {$set: {loading: true}})
  }),
  [LOAD_INVOICES_CYCLE.fulfilled]: (state, action) => ({
    ...state,
    invoices: {
      loaded: true,
      loading: false,
      data: action
    }
  }),
  [LOAD_INVOICES_CYCLE.rejected]: (state, reason) => ({
    ...state,
    invoices: update(state.invoices, {$merge: {
                                        loading: false,
                                        error: reason
                                      }})
  })
})
