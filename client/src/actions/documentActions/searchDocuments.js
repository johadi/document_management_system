import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, searchTerm, userId = false) => {
  let route = '/api/v1/search/documents';
  if (userId) {
    route = `/api/v1/users/${userId}/documents`;
  }
  return dispatch =>
    axios.get(`${route}?q=${searchTerm}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.SEARCH_DOCUMENTS,
        documents: response.data.documents,
        pageCount: response.data.paginationMeta.pageCount
      });
    }).catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
