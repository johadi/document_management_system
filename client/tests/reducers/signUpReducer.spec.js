import expect from 'expect';
import actionTypes from '../../src/actions/actionTypes';
import signUpReducer from '../../src/reducers/signUpReducer';

describe('signUpReducer', () => {
  const initialState = {};
  it('should set user details when Type is SIGN_UP_SUCCESSFUL', () => {
    const signUpDispatch = {
      type: actionTypes.SIGNUP_SUCCESSFUL,
      user: {
        id: 4,
        username: 'emmytope',
        email: 'emma@gmail.com',
        firstname: 'Rose',
        lastname: 'Shaibu',
        roleId: 2
      }
    };
    const newState = signUpReducer(initialState, signUpDispatch);

    expect(newState.error).toEqual(null);
    expect(newState.success).toEqual(true);
    expect(newState.user).toEqual(signUpDispatch.user);
  });

  it('should return initial state if no action is passed', () => {
    const action = {};
    const newState = signUpReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
