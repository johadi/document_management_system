import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} state of props
 */
export default function signUpReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SIGNUP_SUCCESSFUL:
      return [...state, Object.assign({}, action.user)];
    case actionTypes.SIGNUP_FAILED:
      return Object.assign({}, state, { error: action.message, success: null });
    default:
      return state;
  }
}
