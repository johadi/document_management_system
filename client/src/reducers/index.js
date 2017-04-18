import { combineReducers } from 'redux';
import users from './userReducer';
import flashMessages from './flashReducer';
import auth from './auth';

const rootReducer = combineReducers({
  users,
  flashMessages,
  auth
});

export default rootReducer;
