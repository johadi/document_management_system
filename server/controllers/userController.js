import Validator from 'validatorjs';
import db from '../models/';
import helpers from '../utils/helpers';

const user = db.User;
const expiresIn = process.env.JWT_EXPIRES_IN || '5h';
const updateUserRules = {
  firstname: 'required|between:2,40',
  lastname: 'required|between:2,40',
  username: 'required|between:6,40'
};
const createUserRules = {
  firstname: 'required|between:2,40',
  lastname: 'required|between:2,40',
  username: 'required|between:6,40',
  password: 'required|min:6|confirmed',
  password_confirmation: 'required',
  email: 'required|email'
};

export default {

  /**
   * Create a new user
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  createUser(req, res) {
    const responseInfo = {};
    const obj = req.body;
    const validator = new Validator(obj, createUserRules);
    if (validator.passes()) {
      const criteria = [
        { email: obj.email.trim().toLowerCase() },
        { username: obj.username.trim() }
      ];
      user.findOne({ where: { $or: criteria } })
        .then((existingUser) => {
          if (existingUser) {
            if (existingUser.email === obj.email.trim().toLowerCase()) {
              responseInfo.message =
                `This email ${obj.email} is already in use`;
            } else {
              responseInfo.message =
                `This username ${obj.username} is already in use`;
            }
            responseInfo.status = 'fail';
            return res.status(409)
              .json(helpers.responseFormat(responseInfo));
          }
          user.create(req.body)
            .then((newUser) => {
              const token = helpers.signToken(newUser);
              responseInfo.status = 'success';
              responseInfo.token = token;
              responseInfo.message =
                `User created successfully. Token will expire in ${expiresIn}`;
              newUser = helpers.userDetailsToShow(newUser);
              return res.status(201)
                .json(helpers.responseFormat(responseInfo, newUser));
            })
            .catch((error) => {
              res.status(400)
                .json(helpers.catchErrorsResponse(error));
            });
        });
    } else {
      return res.status(400)
        .json(helpers.validationResponse(validator.errors.all()));
    }
  },

  /**
   * User Method to find one user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  getOneUser(req, res) {
    const responseInfo = {};
    const attributes = helpers.filterUserDetails();
    user.findById(req.params.id, { attributes })
      .then((foundUser) => {
        if (!foundUser) {
          responseInfo.message = 'User does not exist';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        responseInfo.message = 'User found';
        responseInfo.status = 'success';
        return res.status(200)
          .json(helpers.responseFormat(responseInfo, foundUser));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Get paginated users from database
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  getAllUsers: (req, res) => {
    const responseInfo = {};
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    const attributes = helpers.filterUserDetails();
    user.findAndCountAll({ attributes, limit, offset, order })
      .then((users) => {
        if (users.rows.length === 0) {
          responseInfo.message = 'No user found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        responseInfo.status = 'success';
        const data = {};
        data.paginationMeta = helpers.generatePaginationMeta(users, page);
        data.users = users.rows;
        res.status(200).json(helpers.responseFormat(responseInfo, data));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to update a user
   * @param {Object} req - the request object
   * @param {Object} res - the response object
   * @returns {Object} response body
   */
  updateUser(req, res) {
    const responseInfo = {};
    const validator = new Validator(req.body, updateUserRules);
    if (validator.passes()) {
      user.findById(req.params.id)
        .then((foundUser) => {
          if (!foundUser) {
            responseInfo.message = 'User does not exist';
            responseInfo.status = 'fail';
            return res.status(404)
              .json(helpers.responseFormat(responseInfo));
          }
          foundUser.update(req.body)
            .then((updatedUser) => {
              responseInfo.status = 'success';
              responseInfo.message = 'User updated successfully';
              updatedUser = helpers.userDetailsToShow(updatedUser);
              return res.status(200)
                .json(helpers.responseFormat(responseInfo, updatedUser));
            });
        })
        .catch((error) => {
          res.status(400)
            .json(helpers.catchErrorsResponse(error));
        });
    } else {
      return res.status(400)
        .json(helpers.validationResponse(validator.errors.all()));
    }
  },

  /**
   * Method to update user Password
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  changePassword: (req, res) => {
    const responseInfo = {};
    const passwordChangeRules = {
      old_password: 'required',
      new_password: 'required|min:6|confirmed',
      new_password_confirmation: 'required'
    };
    const validator = new Validator(req.body, passwordChangeRules);
    if (validator.passes()) {
      user.findById(req.params.id)
        .then((foundUser) => {
          if (!foundUser) {
            responseInfo.message = 'User does not exist';
            responseInfo.status = 'fail';
            return res.status(404)
              .json(helpers.responseFormat(responseInfo));
          }
          if (foundUser.passwordMatch(req.body.old_password)) {
            if (req.body.old_password === req.body.new_password) {
              responseInfo.status = 'fail';
              responseInfo.message =
                'Current password can\'t be same with new password';
              return res.status(400)
                .json(helpers.responseFormat(responseInfo));
            }
            foundUser.update({ password: req.body.new_password })
              .then(() => {
                responseInfo.status = 'success';
                responseInfo.message = 'Password changed successfully';
                return res.status(200)
                  .json(helpers.responseFormat(responseInfo));
              });
          } else {
            responseInfo.status = 'fail';
            responseInfo.message = 'Incorrect current password';
            return res.status(400)
              .json(helpers.responseFormat(responseInfo));
          }
        })
        .catch((err) => {
          res.status(400).send(err.errors);
        });
    } else {
      return res.status(400)
        .json(helpers.validationResponse(validator.errors.all()));
    }
  },

  /**
   * Method to delete a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  deleteUser(req, res) {
    const responseInfo = {};
    user.findById(req.params.id)
      .then((foundUser) => {
        if (!foundUser) {
          responseInfo.message = 'User does not exist';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        foundUser.destroy()
          .then(() => {
            responseInfo.status = 'success';
            responseInfo.message = 'User deleted successfully';
            return res.status(200)
              .json(helpers.responseFormat(responseInfo));
          });
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * User Method to authenticate a user
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  login(req, res) {
    const responseInfo = {};
    const criteria = [
      { email: (req.body.email) ? req.body.email.trim().toLocaleLowerCase()
        : req.body.email },
      { username: (req.body.username) ? req.body.username.trim()
        : req.body.username }
    ];
    user.findOne({ where: { $or: criteria } })
      .then((foundUser) => {
        if (foundUser && foundUser.passwordMatch(req.body.password)) {
          const token = helpers.signToken(foundUser);
          responseInfo.status = 'success';
          responseInfo.token = token;
          responseInfo.message =
            `User login successfully.Token will expire in ${expiresIn}`;
          return res.status(200)
            .json(helpers.responseFormat(responseInfo));
        }
        responseInfo.status = 'fail';
        responseInfo.message = 'Authentication failed.';
        return res.status(401)
          .json(helpers.responseFormat(responseInfo));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to logout user
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} - response object
   */
  logout(req, res) {
    const responseInfo = {};
    responseInfo.status = 'success';
    responseInfo.message = 'Successfully logged out.';
    res.status(200)
      .json(helpers.responseFormat(responseInfo));
  }
};
