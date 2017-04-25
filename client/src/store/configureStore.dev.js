import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers';

const middlewares = [thunk, reduxImmutableStateInvariant()];

/**
 * @param {object} initialState
 * @return {void} null
 */
export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middlewares))
  );
}
