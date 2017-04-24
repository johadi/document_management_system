import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 *
 * @param {Object} state
 * @param {Object} action
 * @returns {Object} state of props
 */
export default function documentsReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.PAGINATED_DOCUMENTS:
      return Object.assign({}, state, {
        documents: action.documents,
        pageCount: action.pageCount,
        update_status: null
      });
    case actionTypes.SEARCH_DOCUMENTS:
      return Object.assign({}, state, {
        documents: action.documents,
        pageCount: action.pageCount,
        update_status: null });
    case actionTypes.DOCUMENT_CREATED:
      return Object.assign({}, state,
        { success: true,
          error: null,
          document: action.document });
    case actionTypes.DOCUMENT_UPDATED:
      return Object.assign({}, state,
        { update_status: true,
          error: null,
          document: action.document });
    case actionTypes.VIEW_DOCUMENT:
      return Object.assign({}, state, { document: action.document });
    default:
      return state;
  }
}
