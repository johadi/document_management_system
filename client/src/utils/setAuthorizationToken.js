import axios from 'axios';

/**
 * Set token to headers
 * @param {String} token
 * @returns {void} void
 */
export default function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}
