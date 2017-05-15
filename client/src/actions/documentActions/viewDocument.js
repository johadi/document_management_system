import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, documentId) =>
  dispatch =>
    axios.get(`/api/v1/documents/${documentId}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.VIEW_DOCUMENT,
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

