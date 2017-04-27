import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signUpReducer from './signUpReducer';
import documentsReducer from './documentsReducer';
import errorReducer from './errorReducer';

const rootReducer = combineReducers({
  loginReducer,
  signUpReducer,
  documentsReducer,
  errorReducer
});

export default rootReducer;
