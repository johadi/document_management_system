import axios from 'axios';
import actionTypes from '../actionTypes';

export default (userId) => {
  const token = window.localStorage.getItem('token');
  return dispatch =>
    axios.delete(`/api/v1/users/${userId}`, {
      headers: {
        Authorization: token
      }
    })
    .then(() => {
      dispatch({
        type: actionTypes.USER_DELETED,
        userId
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
