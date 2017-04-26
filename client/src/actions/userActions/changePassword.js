import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details) =>
  dispatch =>
    axios.put(`/api/v1/users/${details.userId}/password`, details.user, {
      headers: {
        Authorization: details.token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.PASSWORD_UPDATED,
        message: response.data.message
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
