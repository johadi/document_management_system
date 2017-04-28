import 'babel-polyfill';
import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import configureStore from './store/configureStore.dev';
import initialState from './store/initialState';
import routes from './routes.jsx';
import '../../node_modules/toastr/build/toastr.min.css';
import './font-awesome/scss/font-awesome.scss';
import './stylesheet/styles.scss';


const store = configureStore(initialState);

render(
  <Provider store={store}>
    <Router history={browserHistory}>{routes}</Router>
  </Provider>
  , document.getElementById('root'));

