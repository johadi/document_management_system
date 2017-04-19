import actionTypes from '../actionTypes';

export default () => (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_ALL,
    documents: []
  });
};
