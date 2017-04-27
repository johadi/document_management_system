import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export default userData =>
  dispatch =>
    axios.post('/api/v1/users', userData.user)
      .then((response) => {
        window.localStorage.setItem('token', response.data.token);
        const user = jwtDecode(response.data.token);
        dispatch({
          type: actionTypes.SIGNUP_SUCCESSFUL,
          user
        });
      })
      .catch((error) => {
        dispatch({
          type: actionTypes.RESPONSE_ERROR,
          message: (error.response.data.message) ?
            error.response.data.message : error.response.data.errors
        });
      });
