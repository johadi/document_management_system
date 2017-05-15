import axios from 'axios';
import actionTypes from '../actionTypes';

export default (userDetails, id = false) => {
  const route = (id === false) ? `/api/v1/users/${userDetails.userId}`
    : `/api/v1/users/${id}`;
  return dispatch =>
    axios.get(`${route}`, {
      headers: {
        Authorization: userDetails.token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.VIEW_USER,
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
