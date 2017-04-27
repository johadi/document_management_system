import axios from 'axios';
import actionTypes from '../actionTypes';

export default (details) => {
  const token = localStorage.getItem('token');
  return dispatch =>
    axios.post('/api/v1/documents/', details, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.DOCUMENT_CREATED,
        document: response.data.data
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
