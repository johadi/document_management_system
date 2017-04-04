/**
 * Function to validate request body keys for user insert and update
 * @param {Object} request request body object
 * @param {Boolean} isAdmin switch for when user is admin
 * @returns {Object} array containing validity and invalid keys
 */
const validateUserKeys = (request, isAdmin) => {
  const requestKeys = Object.keys(request);
  const validSchema = [
    'username',
    'firstname',
    'lastname',
    'email',
    'password',
    'password_confirmation'
  ];
  if (isAdmin) {
    validSchema.push('roleId');
  }
  const badRequestBodyKeys = [];
  requestKeys.forEach((key) => {
    if (!validSchema.includes(key)) {
      badRequestBodyKeys.push(key);
    }
  });
  const validity = badRequestBodyKeys.length === 0;
  return [validity, badRequestBodyKeys];
};

/**
 * Function to validate request body keys for document insert and update
 * @param {Object} request request body object
 * @returns {Object} array containing validity and invalid keys
 */
const validateDocumentKeys = (request) => {
  const requestKeys = Object.keys(request);
  const validSchema = [
    'access',
    'content',
    'title'
  ];
  const badRequestBodyKeys = [];
  requestKeys.forEach((key) => {
    if (!validSchema.includes(key)) {
      badRequestBodyKeys.push(key);
    }
  });
  const validity = badRequestBodyKeys.length === 0;
  return [validity, badRequestBodyKeys];
};

/**
 * Function to validate request body keys for role insert and update
 * @param {Object} request request body object
 * @returns {Object} array containing validity and invalid keys
 */
const validateRoleKeys = (request) => {
  const requestKeys = Object.keys(request);
  const validSchema = [
    'title'
  ];
  const badRequestBodyKeys = [];
  requestKeys.forEach((key) => {
    if (!validSchema.includes(key)) {
      badRequestBodyKeys.push(key);
    }
  });
  const validity = badRequestBodyKeys.length === 0;
  return [validity, badRequestBodyKeys];
};

/**
 * Function to filter documents by access
 * @param {String} access the access level
 * @returns {Object} the access level if valid
 * @returns {Object} undefined if an invalid access is supplied
 */
const filterDocumentsByAccess = (access) => {
  const accepted = ['public', 'private', 'role'];
  if (accepted.includes(access)) {
    return access;
  }
  return undefined;
};

const validRequestBodyCheck = (validation, res, next) => {
  if (!validation[0]) {
    return res.status(400).json({
      status: 'fail',
      message:
        `Badly formatted request body including ( ${validation[1]} )`
    });
  }
  next();
};

export default {
  validateUserKeys,
  validateDocumentKeys,
  validateRoleKeys,
  filterDocumentsByAccess,
  validRequestBodyCheck
};
