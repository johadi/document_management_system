import db from '../models';
import helpers from '../utils/helpers';

const responseInfo = {};

export default {
  searchUser(req, res) {
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    const attributes = helpers.filterUserDetails();
    const criteria = [
      {
        username: {
          $iLike: `%${req.query.q}%`
        }
      },
      {
        firstname: {
          $iLike: `%${req.query.q}%`
        }
      },
      {
        lastname: {
          $iLike: `%${req.query.q}%`
        }
      }
    ];
    db.User.findAndCountAll({ where: { $or: criteria },
      attributes,
      limit,
      offset,
      order
    })
    .then((users) => {
      if (!users) {
        responseInfo.message = 'No User found';
        responseInfo.status = 'fail';
        return res.status(404)
          .json(helpers.responseFormat(responseInfo));
      }
      responseInfo.status = 'success';
      const data = {};
      const paginationMeta = helpers.generatePaginationMeta(users, page);
      data.paginationMeta = paginationMeta;
      data.users = users.rows;
      return res.status(200)
        .json(helpers.responseFormat(responseInfo, data));
    })
    .catch((error) => {
      res.status(400)
        .json(helpers.catchErrorsResponse(error));
    });
  },
  searchDocument(req, res) {
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    const criteria = {
      title: {
        $iLike: `%${req.query.q}%`
      }
    };
    db.Document.findAndCountAll({ where: criteria,
      limit,
      offset,
      order
    })
    .then((documents) => {
      if (!documents) {
        responseInfo.message = 'No document found';
        responseInfo.status = 'fail';
        return res.status(404)
          .json(helpers.responseFormat(responseInfo));
      }
      responseInfo.status = 'success';
      const data = {};
      const paginationMeta = helpers.generatePaginationMeta(documents, page);
      data.paginationMeta = paginationMeta;
      data.users = documents.rows;
      return res.status(200)
        .json(helpers.responseFormat(responseInfo, data));
    })
    .catch((error) => {
      res.status(400)
        .json(helpers.catchErrorsResponse(error));
    });
  }
};

