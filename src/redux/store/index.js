import { createStore, applyMiddleware, compose } from 'redux'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import rootReducer from '../reducers'

import { fetchAnimeIfNeeded } from '../actions'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
)));

store.dispatch(fetchAnimeIfNeeded())

export default store