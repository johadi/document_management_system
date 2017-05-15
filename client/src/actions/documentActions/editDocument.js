import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details, token, documentId) =>
  dispatch =>
    axios.put(`/api/v1/documents/${documentId}`, details, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.DOCUMENT_UPDATED,
        document: response.data.document
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
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });

