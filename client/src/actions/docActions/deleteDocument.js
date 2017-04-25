import axios from 'axios';
import actionTypes from '../actionTypes';

export default (documentid) => {
  const token = window.localStorage.getItem('token');
  return dispatch =>
    axios.delete(`/api/v1/documents/${documentid}`, {
      headers: {
        Authorization: token
      }
    })
    .then(() => {
      dispatch({
        type: actionTypes.DOCUMENT_DELETED,
        documentId: documentid
      });
    }).catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};

