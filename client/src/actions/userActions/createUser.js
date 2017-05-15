import axios from 'axios';
import actionTypes from '../actionTypes';

export default (userData, token) =>
  dispatch =>
    axios.post('/api/v1/users', userData, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.USER_CREATED,
        message: response.data.message
      });
    })
    .catch((error) => {
      if (error.response.status === 401) {
        return dispatch({
          type: actionTypes.INVALID_TOKEN
        });
      }
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });

