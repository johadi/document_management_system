import axios from 'axios';
import actionTypes from '../actionTypes';

export default (token, documentid) =>  {
  return (dispatch) => {
    return axios.get(`/api/v1/documents/${documentid}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
      dispatch({
        type: actionTypes.VIEW_DOCUMENT,
        document: response.data.data
      });
    }).catch((error) => {
      dispatch({
        type: actionTypes.VALIDATION_ERROR,
        error: error.message
      });
    });
  };
};
