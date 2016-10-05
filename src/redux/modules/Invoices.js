import createReducer from 'create-reducer-map'
import update from 'react-addons-update'
import * as u from 'utils'

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
] = RESOURCE_TYPES.map(u.compose(createResourceBasicConstant, getProimseCycleActions))

/* -----------------------------
  Action creators
----------------------------- */

// Decorator that returns thunk

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

const createResourceReducersCycle = (resourceType, actionsCycle) => ({
  [actionsCycle.pending]: (state) => ({
    ...state,
    [resourceType]: update(state[resourceType], {$merge: {loading: true, loaded: false}})
  }),
  [actionsCycle.fulfilled]: (state, action) => ({
    ...state,
    [resourceType]: {
      loaded: true,
      loading: false,
      data: action
    }
  }),
  [actionsCycle.rejected]: (state, reason) => ({
    ...state,
    [resourceType]: update(state[resourceType], {$merge: {
                                                  loading: false,
                                                  loaded: false,
                                                  error: reason
                                                }})
  })
})

export default createReducer(initialState, {
  ...createResourceReducersCycle('invoices', LOAD_INVOICES_CYCLE),
  ...createResourceReducersCycle('customers', LOAD_CUSTOMERS_CYCLE),
  ...createResourceReducersCycle('products', LOAD_PRODUCTS_CYCLE)
})
