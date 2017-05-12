import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';
import { loginAction } from '../../src/actions/authActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Login actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('creates LOGIN_SUCCESSFUL action when user has been authenticated',
    (done) => {
      const expectedActions = [
        { type: 'LOGIN_SUCCESSFUL',
          user: { userId: 2, roleId: 2 },
          token: 'abcdefgjiop'
        }
      ];

      const store = mockStore({ loginReducer: { } });

      store.dispatch(loginAction({
        email: 'ema@gmail.com',
        password: 'password'
      })).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
        done();
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 200,
          response: { token: 'abcdefgjiop' }
        });
      });
      done();
    });

  it('creates RESPONSE_ERROR action when user details are incorrect',
    (done) => {
      const expectedActions = [
        { type: 'RESPONSE_ERROR', message: 'Authentication failed.' }
      ];

      const store = mockStore({ loginReducer: { } });

      store.dispatch(loginAction({
        email: 'wromgemail@gmail.com',
        password: 'password'
      })).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
        done();
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 401,
          response: { message: 'Authentication failed.' }
        });
      });
      done();
    });
});
