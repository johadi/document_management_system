import expect from 'expect';
import actionTypes from '../../src/actions/actionTypes';
import documentsReducer from '../../src/reducers/documentsReducer';

describe('documentsReducer', () => {
  const documents = [
    { id: '1', title: 'class room', content: 'Hello children' },
    { id: '2', title: 'andela tower', content: 'EPIC Tower is' },
    { id: '3', title: 'Dutse in Nigeria', content: 'Dutse its a town' }
  ];

  const pageCount = '1';
  describe('PAGINATED_DOCUMENTS', () => {
    const initialState = {};
    it('should return a list of Documents and a pageCount detail', () => {
      const paginateDocumentsDispatch = {
        type: actionTypes.PAGINATED_DOCUMENTS,
        documents,
        pageCount
      };
      const newState = documentsReducer(initialState, paginateDocumentsDispatch);
      expect(newState.documents).toEqual(paginateDocumentsDispatch.documents);
      expect(newState.pageCount).toEqual(paginateDocumentsDispatch.pageCount);
      expect(newState.deleteStatus).toEqual(null);
    });
  });

  describe('DOCUMENT_CREATED', () => {
    const initialState = { documents };
    it('should add created document to state', () => {
      const viewDocumentDispatch = {
        type: actionTypes.DOCUMENT_CREATED,
        document: {
          id: 4,
          title: 'tope',
          content: 'lets create a document' }
      };
      const newState = documentsReducer(initialState, viewDocumentDispatch);
      expect(newState.document).toEqual(viewDocumentDispatch.document);
      expect(newState.success).toEqual(true);
    });
  });

  describe('DOCUMENT_UPDATED', () => {
    const initialState = { documents };
    it('should return a document\'s updated detail', () => {
      const updateDocumentDispatch = {
        type: actionTypes.DOCUMENT_UPDATED,
        document: {
          id: 4,
          title: 'temitope',
          content: 'lets create a document' }
      };
      const newState = documentsReducer(initialState, updateDocumentDispatch);
      expect(newState.document).toEqual(updateDocumentDispatch.document);
      expect(newState.updateStatus).toEqual(true);
    });
  });

  describe('VIEW_DOCUMENT', () => {
    const initialState = { documents };
    it('should return a documents\'s details', () => {
      const viewDocumentDispatch = {
        type: actionTypes.VIEW_DOCUMENT,
        document: documents[1]
      };
      const newState = documentsReducer(initialState, viewDocumentDispatch);
      expect(newState.document).toEqual(viewDocumentDispatch.document);
    });
  });

  describe('DOCUMENT_DELETED', () => {
    // it('should return a user\'s updated detail', () => {
    it('should remove a document from state', () => {
      const initialState = { documents };
      const deleteDocumentDispatch = {
        type: actionTypes.DOCUMENT_DELETED,
        status: 'success',
        documentId: '1'
      };
      const newState = documentsReducer(initialState, deleteDocumentDispatch);
      expect(newState.documents).toEqual(documents.slice(1));
      expect(newState.deleteStatus).toEqual(true);
    });
  });

  it('should return initial state if no action is passed', () => {
    const initialState = {};
    const action = {};
    const newState = documentsReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
