import jwt from 'jsonwebtoken';
import validate from './validate';

const secret = process.env.JWT_SECRET_TOKEN || 'docman';

export default {

  /**
   * preventDefaultRolesChangeOrUpdate disallows changing or deleting
   * the default roles (admin and regular)
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  preventDefaultRolesChangeOrDelete(req, res, next) {
    if (parseInt(req.params.id, 10) === 1
      || parseInt(req.params.id, 10) === 2) {
      return res.status(403).send({
        status: 'fail',
        message: 'You cannot change or delete this role'
      });
    }
    next();
  },

  /**
   * preventDefaultAdminDelete disallows deleting the default admin account
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  preventDefaultAdminDelete(req, res, next) {
    if (parseInt(req.params.id, 10) === 1) {
      return res.status(403).send({
        status: 'fail',
        message: 'You cannot delete the default admin account' });
    }
    next();
  },

  /**
   * preventDefaultAdminRoleChange disallows changing the default admin role
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  preventDefaultAdminRoleChange(req, res, next) {
    if (+req.body.roleId && +req.params.id === 1) {
      return res.status(403).send({
        status: 'fail',
        message: 'You cannot change the default admin\'s role id'
      });
    }
    next();
  },

  /**
   * isValidRequestId checks if request id parameter is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidRequestId(req, res, next) {
    if (req.params.id && isNaN(parseInt(req.params.id, 10))) {
      return res.status(406).json({
        status: 'fail',
        message: 'Parameter supplied should be a number'
      });
    }
    next();
  },

  /**
   * canUpdateOrFindUserOrDocuments checks if user authorized to
   * find or update user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  canUpdateOrFindUser(req, res, next) {
    if (req.decoded.RoleId !== 1 && (+req.params.id !== req.decoded.UserId)) {
      return res.status(401).send({
        status: 'fail',
        message: 'You don\'t have authorization for this action'
      });
    }
    next();
  },

  /**
   * isValidUserCreateBody checks if user create request body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidUserCreateBody(req, res, next) {
    let isValidRequestBody;
    const token = req.headers.authorization || req.headers['x-access-token']
      || req.body.token || req.query.token;
    if (!token) {
      isValidRequestBody = validate.validateUserKeys(req.body);
    } else {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: 'fail',
            message: 'Invalid token'
          });
        }
        req.decoded = decoded;
        if (req.decoded.RoleId === 1) {
          isValidRequestBody = validate.validateUserKeys(req.body, true);
        } else {
          isValidRequestBody = validate.validateUserKeys(req.body);
        }
      });
    }

    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidRoleBody checks if role update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidRoleBody(req, res, next) {
    const isValidRequestBody = validate.validateRoleKeys(req.body);
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidDocumentBody checks if document update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidDocumentBody(req, res, next) {
    const isValidRequestBody = validate.validateDocumentKeys(req.body);
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidUserUpdateBody checks if update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidUserUpdateBody(req, res, next) {
    let isValidRequestBody;
    if (req.decoded.RoleId === 1) {
      isValidRequestBody = validate.validateUserUpdateKeys(req.body, true);
    } else {
      isValidRequestBody = validate.validateUserUpdateKeys(req.body);
    }
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidUpdatePasswordBody checks if password update body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidUpdatePasswordBody(req, res, next) {
    const isValidRequestBody = validate.validatePasswordChangeKeys(req.body);
    return validate.validRequestBodyCheck(isValidRequestBody, res, next);
  },

  /**
   * isValidLoginBody checks if login request body is valid
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @param {Function} next the callback function
   * @returns {Object} validity response
   */
  isValidLoginBody(req, res, next) {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const bodyArray = Object.keys(req.body);
    let valid = true;
    for (let i = 0; i < bodyArray.length; i += 1) {
      if (!['username', 'email', 'password'].includes(bodyArray[i])) {
        valid = false;
        break;
      }
    }
    if (!password || !(username || email) || !valid || (username && email)) {
      return res.status(401).json({
        status: 'fail',
        message: 'Supply either username or email, with your password'
      });
    }
    next();
  }
};
