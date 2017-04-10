import Validator from 'validatorjs';
import db from '../models/';
import helpers from '../utils/helpers';

const document = db.Document;
const documentRules = {
  title: 'required|between:6,254',
  content: 'required',
  access: 'required|in:private,public,role'
};

const accessCategories = {
  public: 'public',
  private: 'private',
  role: 'role'
};

export default {

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
      req.body.creatorId = req.decoded.UserId;
      document.create(req.body)
        .then((newDocument) => {
          responseInfo.status = 'success';
          responseInfo.message = 'Document created successfully.';
          return res.status(201)
            .json(helpers.responseFormat(responseInfo, newDocument));
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
   * Method to find one document
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  getOneDocument(req, res) {
    const responseInfo = {};
    document.findById(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          responseInfo.message = 'Document not found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }

        responseInfo.message = 'Document found';
        responseInfo.status = 'success';
        if (req.decoded.RoleId === 1
          || (req.decoded.UserId === foundDocument.creatorId)
          || foundDocument.access !== 'public') {
          return res.status(200)
            .json(helpers.responseFormat(responseInfo, foundDocument));
        }

        if (foundDocument.access === accessCategories.role) {
          return db.User.findById(foundDocument.creatorId)
            .then((documentOwner) => {
              if (documentOwner.roleId === req.decoded.RoleId) {
                return res.status(200)
                  .json(helpers.responseFormat(responseInfo, foundDocument));
              }
              return res.status(401)
                .json(helpers.unauthorizedResponse());
            });
        }

        return res.status(401)
          .json(helpers.unauthorizedResponse());
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method to get paginated documents from database
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Object} Response object
   */
  getAllDocuments: (req, res) => {
    // return res.json({ hello : 'hello' });
    const responseInfo = {};
    const page = helpers.pagination(req);
    document.findAndCountAll(page)
      .then((documents) => {
        if (!documents) {
          responseInfo.message = 'No Document found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        responseInfo.status = 'success';
        const data = {};
        data.paginationMeta = helpers.generatePaginationMeta(documents, page);
        data.documents = documents.rows;
        res.status(200).json(helpers.responseFormat(responseInfo, data));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
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
      document.findById(req.params.id)
        .then((foundDocument) => {
          if (!foundDocument) {
            responseInfo.message = 'Document not found';
            responseInfo.status = 'fail';
            return res.status(404)
              .json(helpers.responseFormat(responseInfo));
          }
          if (req.decoded.RoleId === 1
            || (req.decoded.UserId === foundDocument.creatorId)) {
            foundDocument.update(req.body)
              .then((updatedDocument) => {
                responseInfo.status = 'success';
                responseInfo.message = 'Document updated successfully';
                return res.status(200)
                  .json(helpers.responseFormat(responseInfo, updatedDocument));
              });
          } else {
            return res.status(401)
              .json(helpers.unauthorizedResponse());
          }
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
   * Method to delete a document
   * @param {Object} req the request object
   * @param {Object} res the response object
   * @returns {Object} response body
   */
  deleteDocument(req, res) {
    const responseInfo = {};
    document.findById(req.params.id)
      .then((foundDocument) => {
        if (!foundDocument) {
          responseInfo.message = 'Document not found';
          responseInfo.status = 'fail';
          return res.status(404)
            .json(helpers.responseFormat(responseInfo));
        }
        if (req.decoded.RoleId === 1
          || (req.decoded.UserId === foundDocument.creatorId)) {
          foundDocument.destroy()
            .then(() => {
              responseInfo.status = 'success';
              responseInfo.message = 'Document deleted successfully';
              return res.status(200)
                .json(helpers.responseFormat(responseInfo));
            });
        } else {
          return res.status(401)
            .json(helpers.unauthorizedResponse());
        }
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  },

  /**
   * Method getUserDocuments to obtain all documents for a specific user
   * @param {Object} req - request Object
   * @param {Object} res - request Object
   * @return {Object} response Object
   */
  getUserDocuments(req, res) {
    const responseInfo = {};
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    document.findAndCountAll({
      where: { creatorId: req.params.id }, limit, offset, order
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
      data.paginationMeta = helpers.generatePaginationMeta(documents, page);
      data.documents = documents.rows;
      res.status(200).json(helpers.responseFormat(responseInfo, data));
    })
    .catch((error) => {
      res.status(400)
        .json(helpers.catchErrorsResponse(error));
    });
  },

  /**
   * Method getMyDocuments to obtain all documents of a logged in user
   * @param {Object} req - request Object
   * @param {Object} res - request Object
   * @return {Object} response Object
   */
  getMyDocuments(req, res) {
    const responseInfo = {};
    const page = helpers.pagination(req);
    const limit = page.limit;
    const offset = page.offset;
    const order = page.order;
    document.findAndCountAll({
      where: { creatorId: req.decoded.UserId }, limit, offset, order
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
        data.paginationMeta = helpers.generatePaginationMeta(documents, page);
        data.documents = documents.rows;
        res.status(200).json(helpers.responseFormat(responseInfo, data));
      })
      .catch((error) => {
        res.status(400)
          .json(helpers.catchErrorsResponse(error));
      });
  }
};
