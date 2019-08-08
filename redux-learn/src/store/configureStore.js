import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk' // async actions

/*
const middleware = applyMiddleware(  promise(),  thunk,  createLogger() );
export default createStore(reducer, middleware);
*/
export default function configureStore(initialState) {
  const logger = createLogger()
  const store = createStore(
    rootReducer, // what to do
    initialState, // with what data
    applyMiddleware(thunk, logger)) // add middleware

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
