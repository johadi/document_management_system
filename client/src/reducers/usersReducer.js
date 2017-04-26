import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} state of props
 */
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PASSWORD_UPDATED:
      return Object.assign({}, state,
        { update_status: true,
          error: null,
          message: action.message });
    case actionTypes.VIEW_USER:
      return Object.assign({}, state, { user: action.user });
    default:
      return state;
  }
}
