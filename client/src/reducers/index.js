import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signUpReducer from './signUpReducer';
import documentsReducer from './documentsReducer';
import usersReducer from './usersReducer';
import errorReducer from './errorReducer';

const rootReducer = combineReducers({
  loginReducer,
  signUpReducer,
  documentsReducer,
  usersReducer,
  errorReducer
});

export default rootReducer;
