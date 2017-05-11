import expect from 'expect';
import actionTypes from '../../src/actions/actionTypes';
import errorReducer from '../../src/reducers/errorReducer';

describe('errorReducer', () => {
  const initialState = {};
  it('should set the error message when Type is RESPONSE_ERROR', () => {
    const errorDispatch = {
      type: actionTypes.RESPONSE_ERROR,
      message: 'Invalid token'
    };
    const newState = errorReducer(initialState, errorDispatch);

    expect(newState.success).toEqual(null);
    expect(newState.error).toEqual(errorDispatch.message);
  });

  it('should clear the error message when Type is CLEAR_ERROR', () => {
    const errorDispatch = {
      type: actionTypes.CLEAR_ERROR
    };
    const newState = errorReducer(initialState, errorDispatch);

    expect(newState.error).toEqual(null);
  });

  it('should return initial state if no action is passed', () => {
    const action = {};
    const newState = errorReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});
