import jwtDecode from 'jwt-decode';
import axios from 'axios';
import * as types from './actionTypes';
import setAuthorizationToken from '../utils/setAuthorizationToken';

/**
 *
 *
 * @export
 * @param {any} user
 * @returns {any} data
 */
export function setCurrentUser(user) {
  return {
    type: types.SET_CURRENT_USER,
    user
  };
}

/**
 * createUserSuccess
 *
 * @export
 * @param {any} user
 * @returns {Object} json object
 */
export function createUserSuccess(user) {
  return { type: types.CREATE_USER_SUCCESS, user };
}

/**
 *  create user failure
 *
 * @export
 * @param {any} user
 * @returns {Object} json object
 */
export function createUserFailure(user) {
  return { type: types.CREATE_USER_FAILURE, user };
}


/**
 *  login users
 *
 * @export
 * @param {any} token
 * @returns {Object} json object
 */
export function loginUserSuccess(token) {
  localStorage.setItem('token', token);
  return {
    type: types.LOGIN_USER_SUCCESS,
    payload: {
      token
    }
  };
}

/**
 *
 * @export saveUser
 * @param {any} user
 * @returns {Object} json object
 */
export function saveUser(user) {
  return (dispatch) => {
    return axios.post('/users', user)
      .then(res => {
        const token = res.data.token;
        dispatch(createUserSuccess(res.data.newUser));
        localStorage.setItem('jwtToken', token);
        setAuthorizationToken(token);
        dispatch(setCurrentUser(jwtDecode(token)));
      });
  };
}

/**
 * Checks if user exist
 * @export
 * @param {any} user
 * @returns {Object} json object
 */
export function isUserExists(identifier) {
  return dispatch => {
    return axios.get(`/users/${identifier}`);
  };
}

/**
 *
 * @export
 * @param {any} user
 * @returns {any} data
 */
export function login(user) {
  return dispatch => {
    return axios.post('/users/login', user.user).then(res => {
      const token = res.data.token;
      localStorage.setItem('jwtToken', token);
      setAuthorizationToken(token);
      dispatch(setCurrentUser(jwtDecode(token)));
    });
  };
}

/**
 *
 *
 * @export
 * @returns {any} data
 */
export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthorizationToken(false);
    dispatch(setCurrentUser({}));
  };
}
