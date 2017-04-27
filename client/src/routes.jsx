import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SignUpPage from './components/auth/SignUpPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import UserDashBoard from './components/document/DashBoard.jsx';
import CreateDocument from './components/document/CreateDocument.jsx';
import EditDocument from './components/document/EditDocument.jsx';
import MyDocument from './components/document/MyDocuments.jsx';
import ViewDocument from './components/document/ViewOneDocument.jsx';
import ChangePassword from './components/user/ChangePassword.jsx';
import ViewUser from './components/user/ViewUser.jsx';
import EditUser from './components/user/EditUser.jsx';
import ViewAllUsers from './components/user/ViewAllUsers.jsx';
import CreateUser from './components/user/CreateUser.jsx';

export default(
  <Route path="/">
    <IndexRoute component={LoginPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/register" component={SignUpPage} />
    <Route path="/dashboard" component={UserDashBoard} />
    <Route path="/create-document" component={CreateDocument} />
    <Route path="/edit-document/:id" component={EditDocument} />
    <Route path="/view-document/:id" component={ViewDocument} />
    <Route path="/my-documents" component={MyDocument} />
    <Route path="/change-password" component={ChangePassword} />
    <Route path="/profile" component={ViewUser} />
    <Route path="/view-user/:id" component={ViewUser} />
    <Route path="/edit-profile" component={EditUser} />
    <Route path="/edit-user/:id" component={EditUser} />
    <Route path="/users" component={ViewAllUsers} />
    <Route path="/create-user" component={CreateUser} />
  </Route>
);
