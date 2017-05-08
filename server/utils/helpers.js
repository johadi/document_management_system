import jwt from 'jsonwebtoken';
import _ from 'underscore';

const secret = process.env.JWT_SECRET_TOKEN || 'docman';
const expiresIn = process.env.JWT_EXPIRES_IN || '5h';

const Helpers = {
  signToken(user) {
    return jwt.sign({
      UserId: user.id,
      RoleId: user.roleId,
      Email: user.email,
      Username: user.username
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
    const responseInfo = {};
    responseInfo.status = 'error';
    responseInfo.errors = error.errors;
    return responseInfo;
  },
  validationResponse(validationErrors) {
    const responseInfo = {};
    responseInfo.status = 'error';
    responseInfo.errors = this.validationErrorsToArray(validationErrors);
    return responseInfo;
  },
  unauthorizedResponse() {
    const responseInfo = {};
    responseInfo.status = 'fail';
    responseInfo.message =
      'User is unauthorized for this request';
    return responseInfo;
  },
  noDocumentFound() {
    const responseInfo = {};
    responseInfo.status = 'fail';
    responseInfo.message = 'No document found';
    return responseInfo;
  },
  userDoesNotExist() {
    const responseInfo = {};
    responseInfo.status = 'fail';
    responseInfo.message = 'User does not exist';
    return responseInfo;
  },
  generatePaginationMeta(dbResult, page, count = undefined) {
    const paginationMeta = {};
    if (count === undefined) {
      paginationMeta.pageCount = Math.floor(dbResult.count / page.limit) + 1;
      paginationMeta.totalCount = dbResult.count;
      paginationMeta.outputCount = dbResult.rows.length;
    } else {
      paginationMeta.pageCount = Math.floor(count / page.limit) + 1;
      paginationMeta.totalCount = count;
      paginationMeta.outputCount = dbResult.length;
    }
    paginationMeta.pageSize = page.limit;
    paginationMeta.currentPage = Math.floor(page.offset / page.limit) + 1;
    return paginationMeta;
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
      order = '"createdAt" ASC';
    } else {
      order = '"createdAt" DESC';
    }
    return { limit, offset, order };
  }
};

export default Helpers;
