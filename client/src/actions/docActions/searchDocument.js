import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export default (token, documentName) => {
  const decodedToken = jwtDecode(token);
  const route = (decodedToken.RoleId === 1) ? '/api/v1/search/documents'
    : '/api/v1/documents/accessible';
  return dispatch =>
    axios.get(`${route}?q=${documentName}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.SEARCH_DOCUMENTS,
        documents: response.data.data.documents,
        pageCount: response.data.data.paginationMeta.pageCount
      });
    }).catch((error) => {
      console.log(error);
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
