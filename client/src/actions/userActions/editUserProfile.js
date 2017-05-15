import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details, id = false) => {
  const route = (id === false) ? `/api/v1/users/${details.userId}`
    : `/api/v1/users/${id}`;
  return dispatch =>
    axios.put(`${route}`, details.user, {
      headers: {
        Authorization: details.token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.UPDATE_USER,
        user: response.data.user
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
};
