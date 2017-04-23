import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export default (token, offset, limit) => {
  const decodedToken = jwtDecode(token);
  const route = (decodedToken.RoleId === 1) ? '/api/v1/documents/'
    : '/api/v1/documents/accessible/';
  return (dispatch) => {
    return axios.get(`${route}?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.PAGINATED_DOCUMENTS,
        documents: response.data.data.documents,
        pageCount: response.data.data.paginationMeta.pageCount
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.DOCUMENT_RETRIEVAL_FAILED,
        status: 'failed',
        error: error.message
      });
    });
  };
};
