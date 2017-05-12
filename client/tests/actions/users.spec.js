import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';
import * as userAction from '../../src/actions/userActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const token = 'ahhsbbnns';
const offset = 0;
const limit = 10;

describe('Users actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const users = [
    { id: '1',
      username: 'chelsea',
      firstname: 'Park',
      lastname: 'Hello',
      email: 'a@gmail.com'
    },
    { id: '2',
      username: 'kagawa',
      firstname: 'Inamoto',
      lastname: 'Suzuki',
      email: 'b@gmail.com'
    }
  ];

  describe('create user action', () => {
    it('creates USER_CREATED when a user has been created',
      (done) => {
        const expectedActions = [
          {
            type: 'USER_CREATED',
            message: 'Success'
          }
        ];

        const store = mockStore({ usersReducer: {} });

        store.dispatch(userAction.createUserAction(users[0]))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 201,
            response: { status: 'success' }
          });
        });
        done();
      });
  });

  describe('get users action', () => {
    it('creates PAGINATED_USERS when users have been retrieved',
      (done) => {
        const expectedActions = [
          {
            type: 'PAGINATED_USERS',
            users,
            pageCount: 1
          }
        ];

        const store = mockStore({ usersReducer: {} });

        store.dispatch(userAction.viewUsersAction(token, offset, limit)).then(() => {
          expect(store.getActions()).to.eql(expectedActions);
          done();
        });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              users,
              paginationMeta: { pageCount: 1 }
            }
          });
        });
        done();
      });
  });

  describe('view a user action', () => {
    it('creates VIEW_USER when a user has been retrieved',
      (done) => {
        const expectedActions = [
          {
            type: 'VIEW_USER',
            user: users[0]
          }
        ];

        const store = mockStore({ usersReducer: {} });

        store.dispatch(userAction.viewUserAction({ token }, 1))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: {
              status: 'success',
              user: users[0]
            }
          });
        });
        done();
      });
  });

  describe('update a user action', () => {
    it('creates USER_UPDATED when a user has been updated',
      (done) => {
        const updateUser = users[2];
        const expectedActions = [
          {
            type: 'USER_UPDATED',
            user: updateUser
          }
        ];

        const store = mockStore({ usersReducer: {} });

        store.dispatch(userAction.editUserAction({ user: updateUser, token }, 2))
          .then(() => {
            expect(store.getActions()).to.eql(expectedActions);
            done();
          });

        moxios.wait(() => {
          const request = moxios.requests.mostRecent();
          request.respondWith({
            status: 200,
            response: { status: 'success', user: updateUser }
          });
        });
        done();
      });
  });

  describe('delete a user action', () => {
    it('creates USER_DELETED when a user has been deleted',
      (done) => {
        const expectedActions = [
          {
            type: 'USER_DELETED',
            userId: 2
          }
        ];

        const store = mockStore({ usersReducer: {} });

        store.dispatch(userAction.deleteUserAction(2))
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
