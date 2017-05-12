import Validator from 'validatorjs';
import db from '../models/';
import helpers from '../utils/helpers';
import {
  getUserAccessibleDocs,
  countUserAccessibleDocs,
  getDocumentsOfUser,
  countDocumentsOfUser
} from '../utils/query';

const document = db.Document;
const documentRules = {
  title: 'required|between:3,254',
  content: 'required',
  access: 'required|in:private,public,role'
};

const accessCategories = {
  public: 'public',
  private: 'private',
  role: 'role'
};

const docCtrl = {

  /**
   * Method to create a new document
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  createDocument(req, res) {
    const responseInfo = {};
    const obj = req.body;
    const validator = new Validator(obj, documentRules);

    if (validator.passes()) {
      req.body.creatorId = req.decoded.userId;
      document.create(req.body)
        .then((newDocument) => {
          responseInfo.status = 'success';
          responseInfo.message = 'Document created successfully.';
          responseInfo.document = newDocument;
          return res.status(201).json(responseInfo);
        })
        .catch((error) => {
          res.status(400).json(helpers.catchErrorsResponse(error));
        });
    } else {
      return res.status(400)
        .json(helpers.validationResponse(validator.errors.all()));
    }
  },

  /**
   * Method to find one document
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  getDocument(req, res) {
    const responseInfo = {};
    document.findById(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          return res.status(404).json(helpers.noDocumentFound());
        }

        responseInfo.status = 'success';
        responseInfo.message = 'Document found';
        responseInfo.document = foundDocument;
        if (req.decoded.roleId === 1
          || (req.decoded.userId === foundDocument.creatorId)
          || foundDocument.access === 'public') {
          return res.status(200).json(responseInfo);
        }

        if (foundDocument.access === accessCategories.role) {
          return db.User.findById(foundDocument.creatorId)
            .then((documentOwner) => {
              if (documentOwner.roleId === req.decoded.roleId) {
                return res.status(200).json(responseInfo);
              }
              return res.status(401)
                .json(helpers.unauthorizedResponse());
            });
        }

        return res.status(401).json(helpers.unauthorizedResponse());
      })
      .catch((error) => {
        res.status(400).json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to get paginated documents from database
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  getAllDocuments: (req, res) => {
    const responseInfo = {};
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    if (req.decoded.roleId === 1) {
      const queryBuilder = {
        include: [{
          model: db.User,
          attributes: ['firstname', 'lastname']
        }],
        order,
        limit,
        offset
      };
      if (req.query.q) {
        queryBuilder.where = {
          title: {
            $iLike: `%${req.query.q}%`
          }
        };
      }
      document.findAndCountAll(queryBuilder)
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
    } else {
      db.sequelize.query(getUserAccessibleDocs(req, limit, offset, order), {
        type: db.sequelize.QueryTypes.SELECT
      })
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).json(helpers.noDocumentFound());
        }
        db.sequelize.query(countUserAccessibleDocs(req), {
          type: db.sequelize.QueryTypes.SELECT
        })
        .then((count) => {
          responseInfo.status = 'success';
          responseInfo.paginationMeta = helpers
            .generatePaginationMeta(documents, page, count[0].count);
          responseInfo.documents = documents;
          return res.status(200).json(responseInfo);
        });
      })
      .catch((error) => {
        res.status(400).json(helpers.catchErrorsResponse(error));
      });
    }
  },

  /**
   * Method to update a document
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  updateDocument(req, res) {
    const responseInfo = {};
    const validator = new Validator(req.body, documentRules);
    if (validator.passes()) {
      req.foundDocument.update(req.body)
        .then((updatedDocument) => {
          responseInfo.status = 'success';
          responseInfo.message = 'Document updated successfully';
          responseInfo.document = updatedDocument;
          return res.status(200).json(responseInfo);
        })
        .catch((error) => {
          res.status(400).json(helpers.catchErrorsResponse(error));
        });
    } else {
      return res.status(400)
        .json(helpers.validationResponse(validator.errors.all()));
    }
  },

  /**
   * Method to delete a document
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  deleteDocument(req, res) {
    const responseInfo = {};
    req.foundDocument.destroy()
      .then(() => {
        responseInfo.status = 'success';
        responseInfo.message = 'Document deleted successfully';
        return res.status(200).json(responseInfo);
      })
      .catch((error) => {
        res.status(400).json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method getUserDocuments to obtain all documents of a user
   * @param {Object} req - request Object
   * @param {Object} res - request Object
   * @return {Object} response Object
   */
  getUserDocuments(req, res) {
    const responseInfo = {};
    const loggedInUserId = req.decoded.userId;

    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;

    if ((loggedInUserId === parseInt(req.params.id, 10))
      || ((loggedInUserId !== parseInt(req.params.id, 10)) && req.decoded.roleId === 1)) {
      const criteria = {
        creatorId: req.params.id
      };
      if (req.query.q) {
        criteria.title = {
          $iLike: `%${req.query.q}%`
        };
      }
      document.findAndCountAll({
        where: criteria, limit, offset, order
      })
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
    } else {
      db.sequelize.query(getDocumentsOfUser(req, limit, offset, order), {
        type: db.sequelize.QueryTypes.SELECT
      })
      .then((documents) => {
        if (documents.length === 0) {
          return res.status(404).json(helpers.noDocumentFound());
        }
        db.sequelize.query(countDocumentsOfUser(req), {
          type: db.sequelize.QueryTypes.SELECT
        })
        .then((count) => {
          responseInfo.status = 'success';
          responseInfo.paginationMeta = helpers
            .generatePaginationMeta(documents, page, count[0].count);
          responseInfo.documents = documents;
          return res.status(200).json(responseInfo);
        });
      })
      .catch((error) => {
        res.status(400).json(helpers.catchErrorsResponse(error));
      });
    }
  }
};

export default docCtrl;
