import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, user) => {
  const route = '/api/v1/search/users';
  return dispatch =>
    axios.get(`${route}?q=${user}`, {
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
      if (error.response.status === 401) {
        return dispatch({
          type: actionTypes.INVALID_TOKEN
        });
      }
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
