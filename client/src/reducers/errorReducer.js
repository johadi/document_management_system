import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} state of props
 */
export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESPONSE_ERROR:
      return Object.assign({}, state, { error: action.message,
        success: null });
    case actionTypes.CLEAR_ERROR:
      return Object.assign({}, state, { error: null });
    default:
      return state;
  }
};
