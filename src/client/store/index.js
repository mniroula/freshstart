import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const devtool = window.__REDUX_DEVTOOLS_EXTENSION__;
const reduxDevTools = (devtool && devtool()) || compose;

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    reduxDevTools,
  ),
);

export default store;
