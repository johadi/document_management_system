import db from '../models';
import helpers from '../utils/helpers';

const searchCtrl = {
  searchUser(req, res) {
    const responseInfo = {};
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
      if (users.rows.length === 0) {
        responseInfo.message = 'No User found';
        responseInfo.status = 'fail';
        return res.status(404).json(responseInfo);
      }
      responseInfo.status = 'success';
      responseInfo.paginationMeta = helpers.generatePaginationMeta(users, page);
      responseInfo.users = users.rows;
      return res.status(200).json(responseInfo);
    })
    .catch((error) => {
      res.status(400).json(helpers.catchErrorsResponse(error));
    });
  },
  searchDocument(req, res) {
    const responseInfo = {};
    const page = helpers.pagination(req);
    const queryBuilder = {
      include: [{
        model: db.User,
        attributes: ['firstname', 'lastname']
      }],
      order: page.order,
      limit: page.limit,
      offset: page.offset
    };
    queryBuilder.where = {
      title: {
        $iLike: `%${req.query.q}%`
      }
    };

    db.Document.findAndCountAll(queryBuilder)
    .then((documents) => {
      if (documents.rows.length === 0) {
        return res.status(404).json(helpers.noDocumentFound());
      }
      responseInfo.status = 'success';
      responseInfo.paginationMeta = helpers.generatePaginationMeta(documents, page);
      responseInfo.documents = documents.rows;
      return res.status(200).json(responseInfo);
    })
    .catch((error) => {
      res.status(400).json(helpers.catchErrorsResponse(error));
    });
  }
};

export default searchCtrl;
