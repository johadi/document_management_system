import expect from 'expect';
import actionTypes from '../../src/actions/actionTypes';
import usersReducer from '../../src/reducers/usersReducer';

describe('usersReducer', () => {
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

  const pageCount = '1';
  describe('PAGINATED_USERS', () => {
    it('should return a list of users and a pageCount detail', () => {
      const initialState = {};
      const paginateUsersDispatch = {
        type: actionTypes.PAGINATED_USERS,
        users,
        pageCount
      };
      const newState = usersReducer(initialState, paginateUsersDispatch);

      expect(newState.users).toEqual(paginateUsersDispatch.users);
      expect(newState.pageCount).toEqual(paginateUsersDispatch.pageCount);
    });
  });

  describe('VIEW_USER', () => {
    it('should return a user\'s detail', () => {
      const initialState = {};
      const viewUserDispatch = {
        type: actionTypes.VIEW_USER,
        user: users[1]
      };
      const newState = usersReducer(initialState, viewUserDispatch);
      expect(newState.user).toEqual(viewUserDispatch.user);
    });
  });

  describe('UPDATE_USER', () => {
    it('should return a user\'s updated detail', () => {
      const initialState = {};
      const updateUserDispatch = {
        type: actionTypes.UPDATE_USER,
        user: { id: '2',
          username: 'okazaki',
          firstname: 'Inamoto',
          lastname: 'Suzuki',
          email: 'b@gmail.com'
        }
      };
      const newState = usersReducer(initialState, updateUserDispatch);
      expect(newState.user).toEqual(updateUserDispatch.user);
      expect(newState.updateStatus).toEqual(true);
    });
  });

  describe('USER_DELETED', () => {
    it('should remove a user from state', () => {
      const initialState = { users };
      const deleteUserDispatch = {
        type: actionTypes.USER_DELETED,
        userId: users[0].id
      };
      const newState = usersReducer(initialState, deleteUserDispatch);
      expect(newState.users).toEqual(users.slice(1));
      expect(newState.deleteStatus).toEqual(true);
    });
  });

  it('should return initial state if no action is passed', () => {
    const initialState = {};
    const action = {};
    const newState = usersReducer(initialState, action);

    expect(newState).toEqual(initialState);
  });
});
