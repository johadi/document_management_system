import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} state of props
 */
export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESSFUL:
      return Object.assign({}, state, {
        user: action.user,
        token: action.token,
        error: null,
        success: action.message }
      );
    case actionTypes.LOGIN_ERROR:
      return Object.assign({}, state, { error: action.message, success: null });
    case actionTypes.CLEAR_ERROR:
      return Object.assign({}, state, { error: action.error });
    case actionTypes.CLEAR_ALL:
      return Object.assign({}, state, { documents: action.documents,
        users: action.users });
    default:
      return state;
  }
}
