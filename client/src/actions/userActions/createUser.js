import axios from 'axios';
import actionTypes from '../actionTypes';

export default userData =>
  dispatch =>
    axios.post('/api/v1/users', userData)
      .then((response) => {
        dispatch({
          type: actionTypes.USER_CREATED,
          message: response.data.message
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.RESPONSE_ERROR,
          message: (error.response.data.message) ?
            error.response.data.message : error.response.data.errors
        });
      });

