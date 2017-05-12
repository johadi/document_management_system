import axios from 'axios';
import actionTypes from '../actionTypes';

export default (documentDetails) => {
  const token = localStorage.getItem('token');
  return dispatch =>
    axios.post('/api/v1/documents/', documentDetails, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.DOCUMENT_CREATED,
        document: response.data.document
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
};
