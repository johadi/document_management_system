import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from '../components/App';
import HomePage from '../components/home/HomePage';
import SignupPage from '../components/authentication/SignupPage';
import DashboardPage from '../components/dashboard/Dashboard';
import requireAuth from '../utils/requireAuth';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="signup" component={SignupPage} />
    <Route path="dashboard" component={requireAuth(DashboardPage)} />
  </Route>
);
