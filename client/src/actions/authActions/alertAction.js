import actionTypes from '../actionTypes';

const loginAlert = () => (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_LOGIN_ERROR,
    error: null
  });
};

const registerAlert = () => (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_REGISTER_ERROR,
    error: null
  });
};


export {
  loginAlert,
  registerAlert
};

