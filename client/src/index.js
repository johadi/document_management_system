import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import jwtDecode from 'jwt-decode';
import configureStore from './store/configureStore';
import routes from './routes';
import '../node_modules/toastr/build/toastr.min.css';
import setAuthorizationToken from './utils/setAuthorizationToken';
import { setCurrentUser } from './actions/userActions';


const store = configureStore();

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}

render(
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
