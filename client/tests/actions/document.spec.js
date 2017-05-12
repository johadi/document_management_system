import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';
import * as docAction from '../../src/actions/documentActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const token = '';
const offset = 0;
const limit = 10;

describe('Documents actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  describe('create document action', () => {
    it('creates DOCUMENT_CREATED when a document has been created',
      (done) => {
        const document = { title: 'cool title', content: 'cool title content', creatorId: 2 };
        const expectedActions = [
          {
            type: 'DOCUMENT_CREATED',
            document
          }
        ];

        const store = mockStore({ documentsReducer: {} });

        store.dispatch(docAction.createDocumentAction(document))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 201,
            response: { user: document, status: 'success' }
          });
        });
        done();
      });
  });

  describe('get documents action', () => {
    it('creates PAGINATED_DOCUMENTS when documents have been retrieved',
      (done) => {
        const expectedActions = [
          {
            type: 'PAGINATED_DOCUMENTS',
            documents: [{ title: '', content: '', access: '', owner: 1 }],
            pageCount: 1
          }
        ];

        const store = mockStore({ documentsReducer: {} });

        store.dispatch(docAction.viewDocumentsAction(token, offset, limit)).then(() => {
          expect(store.getActions()).to.eql(expectedActions);
          done();
        });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              documents: [{ title: '', content: '', access: '', owner: 1 }],
              paginationMeta: { pageCount: 1 }
            }
          });
        });
        done();
      });
  });

  describe('view a document action', () => {
    it('creates VIEW_DOCUMENT when a document has been retrieved',
      (done) => {
        const expectedActions = [
          {
            type: 'VIEW_DOCUMENT',
            document: { title: 'cool title view', content: 'cool title content', creatorId: 2 }
          }
        ];

        const store = mockStore({ documentsReducer: {} });

        store.dispatch(docAction.viewDocumentAction(token, 2))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: { title: 'cool title view', content: 'cool title content', creatorId: 2 }
          });
        });
        done();
      });
  });

  describe('update a document action', () => {
    it('creates DOCUMENT_UPDATED when a document has been updated',
      (done) => {
        const updateDocument = { title: 'edit title', content: 'cool title content', creatorId: 2 };
        const expectedActions = [
          {
            type: 'DOCUMENT_UPDATED',
            document: updateDocument
          }
        ];

        const store = mockStore({ documentsReducer: {} });

        store.dispatch(docAction.editDocumentAction(updateDocument, token, 2))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: updateDocument
          });
        });
        done();
      });
  });

  describe('delete a document action', () => {
    it('creates DOCUMENT_DELETED when a document has been deleted',
      (done) => {
        const expectedActions = [
          {
            type: 'DOCUMENT_DELETED',
            documentId: 2
          }
        ];

        const store = mockStore({ documentsReducer: {} });

        store.dispatch(docAction.deleteDocumentAction(2))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200
          });
        });
        done();
      });
  });
});
