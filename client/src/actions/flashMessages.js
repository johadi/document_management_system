import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from './actionTypes';

/**
 *
 * @export
 * @param {any} message
 * @returns {any} message
 */
export function addFlashMessage(message) {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  };
}

/**
 *
 * @export
 * @param {any} id
 * @returns {any} id
 */
export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  };
}
