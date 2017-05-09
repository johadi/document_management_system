import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, offset, limit) => {
  const route = '/api/v1/users';
  return dispatch =>
    axios.get(`${route}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.PAGINATED_USERS,
        users: response.data.users,
        pageCount: response.data.paginationMeta.pageCount
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: error.message
      });
    });
};
