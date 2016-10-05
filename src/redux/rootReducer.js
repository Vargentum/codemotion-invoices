import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import invoices from './modules/Invoices'

export default combineReducers({
  form: formReducer,
  resources: invoices,
  router
})
