import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import {reducer as formReducer} from 'redux-form'
import reduxFormPlugin from 'forms/reduxFormPlugin'
import resources from './modules/resources'

export default combineReducers({
  form: formReducer.plugin(reduxFormPlugin),
  resources,
  router
})
