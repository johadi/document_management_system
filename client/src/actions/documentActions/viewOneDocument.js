import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, documentid) =>
  dispatch =>
    axios.get(`/api/v1/documents/${documentid}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.VIEW_DOCUMENT,
        document: response.data.data
      });
    })
    .catch((error) => {
      dispatch({
        type: actionTypes.RESPONSE_ERROR,
        message: (error.response && error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });

