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
      if (error.response.status === 401) {
        dispatch({
          type: actionTypes.INVALID_TOKEN
        });
      } else if (error.response.status === 404) {
        dispatch({
          type: actionTypes.NO_DOCUMENT_FOUND,
          message: error.response.data.message
        });
      } else {
        dispatch({
          type: actionTypes.RESPONSE_ERROR,
          message: (error.response.data.message) ?
            error.response.data.message : error.response.data.errors
        });
      }
    });
};
