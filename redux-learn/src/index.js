import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
// Redux
//import { createStore } from 'redux'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

//const store = createStore( () => {}, {}) // anon reducer function(what to do), initState(with what)
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById('root'));
registerServiceWorker();
