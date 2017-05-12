import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';
import { signUpAction } from '../../src/actions/authActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const userDetails = {
  username: 'temitope12',
  firstname: 'Emmanuel',
  lastname: 'Shaibu',
  email: 'emma@gmail.com',
  password: 'password'
};

describe('Signup actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('creates SIGNUP_SUCCESSFUL action when user has been created',
    (done) => {
      const expectedActions = [
        {
          type: 'SIGNUP_SUCCESSFUL',
          user: { userId: 3, roleId: 2 }
        }
      ];

      const store = mockStore({ signUpReducer: {} });

      store.dispatch(signUpAction(userDetails)).then(() => {
        expect(store.getActions()).to.eql(expectedActions);
        done();
      });

      moxios.wait(() => {
        const request = moxios.requests.mostRecent();
        request.respondWith({
          status: 201,
          response: { user: userDetails, token: 'abcdefgjiop', status: 'success' }
        });
      });
      done();
    });

  it('creates RESPONSE_ERROR action when user details are incorrect',
    (done) => {
      const expectedActions = [
        { type: 'RESPONSE_ERROR', message: 'This username hello12is already in use' }
      ];

      const store = mockStore({ loginReducer: { } });

      store.dispatch(signUpAction(userDetails)).then(() => {
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
