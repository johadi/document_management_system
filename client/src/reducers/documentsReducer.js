import actionTypes from '../actions/actionTypes';
import initialState from '../store/initialState';

/**
 * Reducers for document state
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
        updateStatus: null,
        deleteStatus: null
      });
    case actionTypes.SEARCH_DOCUMENTS:
      return Object.assign({}, state, {
        documents: action.documents,
        pageCount: action.pageCount,
        updateStatus: null,
        deleteStatus: null });
    case actionTypes.DOCUMENT_CREATED:
      return Object.assign({}, state,
        { success: true,
          error: null,
          document: action.document });
    case actionTypes.DOCUMENT_UPDATED:
      return Object.assign({}, state,
        { updateStatus: true,
          error: null,
          document: action.document });
    case actionTypes.DOCUMENT_DELETED:
      return Object.assign({}, state, {
        documents: state.documents.filter(document =>
          document.id !== action.documentId
        ),
        deleteStatus: true,
        error: null
      });
    case actionTypes.VIEW_DOCUMENT:
      return Object.assign({}, state, { document: action.document });
    case actionTypes.NO_DOCUMENT_FOUND:
      return Object.assign({}, state, { documents: [] });
    default:
      return state;
  }
}
