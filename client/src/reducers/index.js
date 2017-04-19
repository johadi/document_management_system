import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signUpReducer from './signUpReducer';
// import allDocumentsReducer from './allDocumentsReducer';
// import allUsersReducer from './allUsersReducer';
// import allRolesReducer from './allRolesReducer';
// import viewUserReducer from './viewUserReducer';

const rootReducer = combineReducers({
  loginReducer,
  signUpReducer
});

export default rootReducer;
