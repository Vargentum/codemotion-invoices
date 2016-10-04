import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import counter from './modules/counter'
import invoices from './modules/Invoices'

export default combineReducers({
  counter,
  resources: invoices,
  router
})
