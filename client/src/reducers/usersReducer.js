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
    case actionTypes.PAGINATED_USERS:
      return Object.assign({}, state, {
        users: action.users,
        pageCount: action.pageCount,
        update_status: null,
        delete_status: null
      });
    case actionTypes.SEARCH_USERS:
      return Object.assign({}, state, {
        users: action.users,
        pageCount: action.pageCount,
        update_status: null });
    case actionTypes.USER_CREATED:
      return Object.assign({}, state, {
        success: true,
        error: null,
        message: action.message });
    case actionTypes.PASSWORD_UPDATED:
      return Object.assign({}, state,
        { update_status: true,
          error: null,
          message: action.message });
    case actionTypes.VIEW_USER:
      return Object.assign({}, state, {
        user: action.user,
        update_status: null
      });
    case actionTypes.UPDATE_USER:
      return Object.assign({}, state,
        { update_status: true,
          error: null,
          user: action.user });
    case actionTypes.USER_DELETED:
      return Object.assign({}, state, {
        users: state.users.filter(user =>
          user.id !== action.userId
        ),
        delete_status: true,
        error: null
      });
    default:
      return state;
  }
}
