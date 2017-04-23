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
        success: true }
      );
    case actionTypes.CLEAR_ALL:
      return Object.assign({}, state, { documents: action.documents,
        users: action.users,
        token: null });
    default:
      return state;
  }
}
