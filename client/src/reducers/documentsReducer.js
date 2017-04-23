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
        documents: action.documents, pageCount: action.pageCount });
    case actionTypes.DOCUMENT_RETRIEVAL_FAILED:
      return [...state, Object.assign({}, action.status)];
    case actionTypes.DOCUMENT_CREATED:
      return Object.assign({}, state,
        { success: true,
          error: null,
          document: action.document });
    default:
      return state;
  }
}
