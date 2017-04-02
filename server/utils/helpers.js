import jwt from 'jsonwebtoken';
import _ from 'underscore';

const secret = process.env.JWT_SECRET_TOKEN || 'docman';
const expiresIn = process.env.JWT_EXPIRES_IN || '5h';
const responseInfo = {};

const Helpers = {

  responseFormat(info, data = undefined) {
    const response = {};

    if (info.status) {
      response.status = info.status;
    }
    if (info.message) {
      response.message = info.message;
    }
    if (data) {
      response.data = data;
    }
    if (info.token) {
      response.token = info.token;
    }
    if (info.errors) {
      response.errors = info.errors;
    }
    return response;
  },
  signToken(user) {
    return jwt.sign({
      UserId: user.id,
      RoleId: user.roleId,
      Email: user.email
    }, secret, { expiresIn });
  },
  validationErrorsToArray(error) {
    const errorsArray = [];
    if (!_.isEmpty(error)) {
      Object.keys(error).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(error, key)) {
          _.forEach(error[key], (errorMessage) => {
            errorsArray.push(errorMessage);
          });
        }
      });
    }

    return errorsArray;
  },
  userDetailsToShow(user) {
    return {
      id: user.id,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      roleId: user.roleId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  },
  filterUserDetails() {
    return [
      'id',
      'username',
      'firstname',
      'lastname',
      'email',
      'roleId',
      'createdAt',
      'updatedAt'
    ];
  },
  catchErrorsResponse(error) {
    responseInfo.status = 'error';
    responseInfo.errors = error.errors;
    return responseInfo;
  },
  validationResponse(validationErrors) {
    responseInfo.status = 'error123';
    responseInfo.errors = this.validationErrorsToArray(validationErrors);
    return responseInfo;
  },
  pagination(req) {
    let limit;
    let offset;
    let order;
    if (req.query.limit) {
      if (isNaN(Number(req.query.limit)) || req.query.limit < 0) {
        limit = 10;
      } else {
        limit = req.query.limit;
      }
    } else {
      limit = 10;
    }
    if (req.query.offset) {
      if (isNaN(Number(req.query.offset)) || req.query.limit < 0) {
        offset = 0;
      } else {
        offset = req.query.offset;
      }
    } else {
      offset = 0;
    }
    if (req.query.order && req.query.order.toLowerCase() === 'desc') {
      order = '"createdAt" DESC';
    } else {
      order = '"createdAt" ASC';
    }
    return { limit, offset, order };
  }
};

export default Helpers;
