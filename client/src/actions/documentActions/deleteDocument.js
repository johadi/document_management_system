import axios from 'axios';
import actionTypes from '../actionTypes';

export default (documentId) => {
  const token = window.localStorage.getItem('token');
  return dispatch =>
    axios.delete(`/api/v1/documents/${documentId}`, {
      headers: {
        Authorization: token
      }
    })
    .then(() => {
      dispatch({
        type: actionTypes.DOCUMENT_DELETED,
        documentId
      });
    }).catch((error) => {
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

