import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

/**
 *
 * @export
 * @param {any} initialState
 * @returns {object} store object
 */
export default function configureStore(initialState) {
  return createStore(rootReducer,
    initialState, composeWithDevTools(
      applyMiddleware(thunk, reduxImmutableStateInvariant())
    ));
}
