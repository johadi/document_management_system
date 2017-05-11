import expect from 'expect';
import actionTypes from '../../src/actions/actionTypes';
import loginReducer from '../../src/reducers/loginReducer';

describe('loginReducer', () => {
  const initialState = {};
  it('should set user details when passed LOGIN_SUCCESSFUL', () => {
    const loginDispatch = {
      type: actionTypes.LOGIN_SUCCESSFUL,
      user: {
        userId: '3',
        roleId: '2'
      },
      token: 'logintoken'
    };
    const newState = loginReducer(initialState, loginDispatch);

    expect(newState.user).toEqual(loginDispatch.user);
    expect(newState.token).toEqual(loginDispatch.token);
    expect(newState.error).toEqual(null);
    expect(newState.success).toEqual(true);
  });

  it('should set all details to empty state on logout', () => {
    const loginDispatch = {
      type: actionTypes.CLEAR_ALL,
      documents: [],
      users: []
    };
    const newState = loginReducer(initialState, loginDispatch);

    expect(newState.documents).toEqual(loginDispatch.documents);
    expect(newState.users).toEqual(loginDispatch.users);
    expect(newState.token).toEqual(null);
  });

  it('should return initial state if no action is passed', () => {
    const action = {};
    const newState = loginReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
