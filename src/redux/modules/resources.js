import createReducer from 'create-reducer-map'
import update from 'react-addons-update'
import * as u from 'utils'
import {API} from 'constants'

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
  GET Resource By ID
----------------------------- */
const createResourcesRequestByIDBasicConstant = (type) => {
  checkResourceType(type)
  return `LOAD_${type.toUpperCase()}_BY_ID`
}
const [
  LOAD_CUSTOMER_BY_ID_CYCLE, 
  LOAD_PRODUCT_BY_ID_CYCLE, 
  LOAD_INVOICE_BY_ID_CYCLE
] = RESOURCE_TYPES.map(u.compose(createResourcesRequestByIDBasicConstant, getProimseCycleActions))


const composeRecourceLoadByIdAC = (type) => (id) => (dispatch) => {
  checkResourceType(type)
  fetch(`${API + type}/${id}`, {mode: 'cors'})
    .then(response => {
      dispatch({
        type: createResourcesRequestByIDBasicConstant(type),
        payload: {
          promise: response.json()
        }  
      })
    })
    .catch(error => {
      throw error
    })
}
export const [getCustomerById, getProductById, getInvoiceById] = RESOURCE_TYPES.map(composeRecourceLoadByIdAC)


/* -----------------------------
  GET ALL resources
----------------------------- */
const createResourcesLoadBasicConstant = (type) => {
  checkResourceType(type)
  return `LOAD_${type.toUpperCase()}`
}
const [
  LOAD_CUSTOMERS_CYCLE, 
  LOAD_PRODUCTS_CYCLE, 
  LOAD_INVOICES_CYCLE
] = RESOURCE_TYPES.map(u.compose(createResourcesLoadBasicConstant, getProimseCycleActions))

// decorator => thunk
const composeLoadResourceAllAC = (type) => () => (dispatch) => {
  checkResourceType(type)
  fetch(API + type, {mode: 'cors'})
    .then(response => {
      dispatch({
        type: createResourcesLoadBasicConstant(type),
        payload: {
          promise: response.json()
        }  
      })
    })
    .catch(error => {
      throw error
    })
}
export const [getCustomers, getProducts, getInvoices] = RESOURCE_TYPES.map(composeLoadResourceAllAC)

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

const createResourceLoadReducersCycle = (resourceType, actionsCycle) => ({
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

const createResourceLoadByIDReducersCycle = (resourceType, actionsCycle) => ({
  // [actionsCycle.pending]: (state) => ({
  //   ...state,
  //   [resourceType]: update(state[resourceType], {$merge: {loading: true, loaded: false}})
  // }),
  [actionsCycle.fulfilled]: (state, action) => {
    console.log(action, 'actionFullfilled---------')
    return update(state, {[resourceType]: {data: {$push: [action]}}})
  }/*,
  [actionsCycle.rejected]: (state, reason) => ({
    TODO: Provide loading/loaded inside each resource item  
  })*/
})

export default createReducer(initialState, {
  ...createResourceLoadReducersCycle('invoices', LOAD_INVOICES_CYCLE),
  ...createResourceLoadReducersCycle('customers', LOAD_CUSTOMERS_CYCLE),
  ...createResourceLoadReducersCycle('products', LOAD_PRODUCTS_CYCLE),
  ...createResourceLoadByIDReducersCycle('invoices', LOAD_INVOICE_BY_ID_CYCLE),
  ...createResourceLoadByIDReducersCycle('customers', LOAD_CUSTOMER_BY_ID_CYCLE),
  ...createResourceLoadByIDReducersCycle('products', LOAD_PRODUCT_BY_ID_CYCLE),
})
