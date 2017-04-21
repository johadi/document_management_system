import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export const loginSuccessful = user => ({ type: 'LOGIN_SUCCESSFUL', user });

export default (userData) => {
  return (dispatch) => {
    return axios.post('/api/v1/users', userData.user)
      .then((response) => {
        window.localStorage.setItem('token', response.data.token);
        const user = jwtDecode(response.data.token);
        dispatch({
          type: actionTypes.SIGNUP_SUCCESSFUL,
          user
        });
      }).catch((error) => {
        dispatch({
          type: actionTypes.SIGNUP_FAILED,
          message: (error.response.data.message) ?
            error.response.data.message : error.response.data.errors
        });
      });
  };
};
