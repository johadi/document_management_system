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
      return Object.assign({}, state, { user: action.user,
        success: true,
        error: null
      });
    case actionTypes.CLEAR_REGISTER_ERROR:
      return Object.assign({}, state, { error: action.error });
    default:
      return state;
  }
}
