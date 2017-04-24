import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details, token, documentid) => {
  return (dispatch) => {
    return axios.put(`/api/v1/documents/${documentid}`, details, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.DOCUMENT_UPDATED,
        document: response.data.data
      });
    }).catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
  };
};
