import { docCtrl } from '../controllers';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const documentRoute = (router) => {
  /**
   * @swagger
   * definitions:
   *   NewDocument:
   *     type: object
   *     required:
   *       - title
   *       - content
   *     properties:
   *       title:
   *         type: string
   *       content:
   *         type: string
   *       access:
   *         type: string
   *   Document:
   *     allOf:
   *       - $ref: '#/definitions/NewDocument'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/documents')
    /**
     * @swagger
     * /api/v1/documents:
     *   get:
     *     description: Returns paginated list of all documents
     *     tags:
     *      - Find Documents
     *     produces:
     *      - application/json
     *     parameters:
     *      - name: x-access-token
     *        in: header
     *        description: an authorization header of admin user
     *        required: true
     *        type: string
     *     responses:
     *       200:
     *         description: documents
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Document'
     */
    .get(auth.verifyToken, docCtrl.getAllDocuments)
    /**
     * @swagger
     * /api/v1/documents:
     *   post:
     *     description: Creates new document
     *     tags:
     *      - Create Document
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: x-access-token
     *         in: header
     *         description: an authorization header
     *         required: true
     *         type: string
     *       - name: document
     *         description: Document object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/NewDocument'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           $ref: '#/definitions/Document'
     */
    .post(auth.verifyToken, utils.isValidDocumentBody, docCtrl.createDocument);

  /**
   * @swagger
   * definitions:
   *   NewDocUpdate:
   *     type: object
   *     required:
   *       - title
   *       - content
   *       - access
   *     properties:
   *       title:
   *         type: string
   *       content:
   *         type: string
   *       access:
   *         type: string
   *   DocUpdate:
   *     allOf:
   *       - $ref: '#/definitions/NewDocUpdate'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/documents/:id')
    /**
     * @swagger
     * /api/v1/documents/{id}:
     *   get:
     *     description: Returns a particular document
     *     tags:
     *      - Find Documents
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         description: The document's id
     *         in:  path
     *         required: true
     *         type: string
     *       - name: x-access-token
     *         in: header
     *         description: an authorization header
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/DocUpdate'
     */
    .get(auth.verifyToken, utils.isValidRequestId, docCtrl.getDocument)
    .patch(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrDeleteDocument, utils.isValidDocumentBody, docCtrl.updateDocument)
    /**
     * @swagger
     * /api/v1/documents/{id}:
     *   put:
     *     description: Updates the document of the user signed in
     *     tags:
     *      - Update Document
     *     produces:
     *       - application/json
     *     parameters:
     *        - name: id
     *          description: The document's id
     *          in:  path
     *          required: true
     *          type: string
     *        - name: x-access-token
     *          in: header
     *          description: an authorization header
     *          required: true
     *          type: string
     *        - name: document
     *          description: User object
     *          in:  body
     *          required: true
     *          type: string
     *          schema:
     *            $ref: '#/definitions/NewDocUpdate'
     *     responses:
     *       200:
     *         description: documents
     *         schema:
     *           $ref: '#/definitions/DocUpdate'
     */
    .put(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrDeleteDocument, utils.isValidDocumentBody, docCtrl.updateDocument)
    /**
     * @swagger
     * /api/v1/documents/{id}:
     *    delete:
     *      description: Deletes the document with the id supplied as param
     *      tags:
     *        - Delete Document
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: id
     *          description: The document's id
     *          in:  path
     *          required: true
     *          type: string
     *        - name: x-access-token
     *          in: header
     *          description: an authorization header
     *          required: true
     *          type: string
     *      responses:
     *        200:
     *          description: documents
     *          schema:
     *            type: array
     *            items:
     *              $ref: '#/definitions/DocUpdate'
     */
    .delete(auth.verifyToken, utils.isValidRequestId, utils.canUpdateOrDeleteDocument,
      docCtrl.deleteDocument);
};

export default documentRoute;
