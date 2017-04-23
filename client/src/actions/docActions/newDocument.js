import axios from 'axios';
import { browserHistory } from 'react-router';
import actionTypes from '../actionTypes';

export default (details) => {
  const token = window.localStorage.getItem('token');
  return (dispatch) => {
    return axios.post('/api/v1/documents/', details, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      console.log(response);
      dispatch({
        type: actionTypes.DOCUMENT_CREATED,
        document: response.data.data
      });
    }).catch((error) => {
      dispatch({
        type: actionTypes.VALIDATION_ERROR,
        message: (error.response.data.message) ?
          error.response.data.message : error.response.data.errors
      });
    });
  };
};
