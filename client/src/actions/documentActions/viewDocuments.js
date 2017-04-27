import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export default (token, offset, limit, all = true) => {
  const decodedToken = jwtDecode(token);
  let route = '/api/v1/users/documents';
  if (all === true) {
    route = (decodedToken.RoleId === 1) ? '/api/v1/documents/'
      : '/api/v1/documents/accessible/';
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
        documents: response.data.data.documents,
        pageCount: response.data.data.paginationMeta.pageCount
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: error.message
      });
    });
};
