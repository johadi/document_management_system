import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, offset, limit, userId = false) => {
  let route = '/api/v1/documents';
  if (userId) {
    route = `/api/v1/users/${userId}/documents`;
  }
  return dispatch =>
    axios.get(`${route}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.PAGINATED_DOCUMENTS,
        documents: response.data.documents,
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
