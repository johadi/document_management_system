import Validator from 'validatorjs';
import db from '../models/';
import helpers from '../utils/helpers';

const role = db.Role;
const roleRules = {
  title: 'required|between:3,254'
};

export default {

  /**
   * Method to create a new role
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  createRole(req, res) {
    const responseInfo = {};
    const obj = req.body;
    const validator = new Validator(obj, roleRules);
    if (validator.passes()) {
      role.create(req.body)
        .then((newRole) => {
          responseInfo.status = 'success';
          responseInfo.message = 'Role created successfully.';
          return res.status(201)
            .json(helpers.responseFormat(responseInfo, newRole));
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
   * Method to get one role
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  getOneRole(req, res) {
    const responseInfo = {};
    role.findById(req.params.id)
      .then((foundRole) => {
        if (!foundRole) {
          responseInfo.message = 'Role not found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }

        responseInfo.message = 'Role found';
        responseInfo.status = 'success';
        return res.status(200)
          .json(helpers.responseFormat(responseInfo, foundRole));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to get all roles from database
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  getAllRoles: (req, res) => {
    // return res.json({ hello : 'hello' });
    const responseInfo = {};
    role.findAll()
      .then((roles) => {
        if (!roles) {
          responseInfo.message = 'No Role found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        responseInfo.status = 'success';
        res.status(200).json(helpers.responseFormat(responseInfo, roles));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to update a role
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  updateRole(req, res) {
    const responseInfo = {};
    const validator = new Validator(req.body, roleRules);
    if (validator.passes()) {
      role.findById(req.params.id)
        .then((foundRole) => {
          if (!foundRole) {
            responseInfo.message = 'Role not found';
            responseInfo.status = 'fail';
            return res.status(404)
              .json(helpers.responseFormat(responseInfo));
          }
          foundRole.update(req.body)
            .then((updatedRole) => {
              responseInfo.status = 'success';
              responseInfo.message = 'Role title updated successfully';
              return res.status(200)
                .json(helpers.responseFormat(responseInfo, updatedRole));
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
   * Method to delete a role
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  deleteRole(req, res) {
    const responseInfo = {};
    role.findById(req.params.id)
    .then((foundRole) => {
      if (!foundRole) {
        responseInfo.message = 'Role not found';
        responseInfo.status = 'fail';
        return res.status(404)
          .json(helpers.responseFormat(responseInfo));
      }
      foundRole.destroy()
        .then(() => {
          responseInfo.status = 'success';
          responseInfo.message = 'Role deleted successfully';
          return res.status(200)
            .json(helpers.responseFormat(responseInfo));
        });
    })
    .catch((error) => {
      res.status(400)
        .json(helpers.catchErrorsResponse(error));
    });
  }
};
