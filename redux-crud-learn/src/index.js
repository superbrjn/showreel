import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
// redux:
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import { Provider } from 'react-redux';
// router
import { BrowserRouter } from 'react-router-dom';

/*
DO THIS WAY:
1. Component view
2. Component func handlers
3. Actions (API CRUD func), ActionCreators
4. Reducers
5. Server API Routes endpoints
*/

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'));
registerServiceWorker();
