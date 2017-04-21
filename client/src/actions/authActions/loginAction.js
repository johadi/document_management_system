import axios from 'axios';
import jwtDecode from 'jwt-decode';
import actionTypes from '../actionTypes';

export default (credentials) => {
  return (dispatch) => {
    return axios.post('/api/v1/users/login', credentials.user)
      .then((response) => {
        console.log(response, "res");
        const token = response.data.token;
        const user = jwtDecode(token);
        // try
        // {
        //   user = jwtDecode(token);
        // }catch(e){
        //   console.log('token error');
        // }
        window.localStorage.setItem('token', token);
        console.log(user);
        dispatch({
          type: actionTypes.LOGIN_SUCCESSFUL,
          user,
          token,
          message: 'Login Successful'
        });
      })
      .catch((error) => {
        debugger;
        console.log(error);
        dispatch({
          type: actionTypes.LOGIN_ERROR,
          message: (error.response.data.message) ?
            error.response.data.message : null
        });
      });
  };
};
