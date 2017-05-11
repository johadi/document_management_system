import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { SignUpComponent, LoginComponent } from './components/auth';
import {
  UserDashBoard,
  CreateDocument,
  EditDocument,
  MyDocuments,
  ViewOneDocument
} from './components/document';
import {
  ChangePassword,
  ViewUser,
  EditUser,
  ViewAllUsers,
  CreateUser
} from './components/user';

export default(
  <Route path="/">
    <IndexRoute component={LoginComponent} />
    <Route path="/login" component={LoginComponent} />
    <Route path="/register" component={SignUpComponent} />
    <Route path="/dashboard" component={UserDashBoard} />
    <Route path="/document" component={CreateDocument} />
    <Route path="/document/:id/edit" component={EditDocument} />
    <Route path="/document/:id" component={ViewOneDocument} />
    <Route path="/documents" component={MyDocuments} />
    <Route path="/password" component={ChangePassword} />
    <Route path="/profile" component={ViewUser} />
    <Route path="/user/:id" component={ViewUser} />
    <Route path="/profile/edit" component={EditUser} />
    <Route path="/user/:id/edit" component={EditUser} />
    <Route path="/users" component={ViewAllUsers} />
    <Route path="/user" component={CreateUser} />
  </Route>
);
