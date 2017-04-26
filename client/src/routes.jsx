import React from 'react';
import { Route, IndexRoute } from 'react-router';
import SignUpPage from './components/auth/SignUpPage.jsx';
import LoginPage from './components/auth/LoginPage.jsx';
import UserDashBoard from './components/user/UserDashBoard.jsx';
import CreateDocument from './components/document/CreateDocument.jsx';
import EditDocument from './components/document/EditDocument.jsx';
import MyDocument from './components/document/MyDocuments.jsx';
import ViewDocument from './components/document/ViewOneDocument.jsx';
import ChangePassword from './components/user/ChangePassword.jsx';
// import ViewAllRoles from './components/ViewAllRoles.jsx';
// import ViewAllUsers from './components/ViewAllUsers.jsx';
// import CreateRole from './components/CreateRole.jsx';
// import EditRole from './components/EditRole.jsx';
// import Profile from './components/ViewUser.jsx';
// import EditProfile from './components/EditUser.jsx';

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
  </Route>
);
