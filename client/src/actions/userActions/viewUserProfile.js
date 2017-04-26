import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details, id = false) => {
  const route = (id === false) ? `/api/v1/users/${details.userId}`
    : `/api/v1/users/${id}`;
  return dispatch =>
    axios.get(`${route}`, {
      headers: {
        Authorization: details.token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.VIEW_USER,
        user: response.data.data
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
