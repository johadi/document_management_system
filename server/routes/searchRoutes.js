import { searchCtrl } from '../controllers';
import auth from '../middlewares/auth';

const searchRoute = (router) => {
  /**
   * @swagger
   * definitions:
   *   NewSearchUser:
   *     type: object
   *   SearchUser:
   *     allOf:
   *       - $ref: '#/definitions/NewSearchUser'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/search/users/')
    /**
     * @swagger
     * /api/v1/search/users/?q={username}:
     *   get:
     *     description: Returns the documents of a particular user
     *     tags:
     *      - Find Users
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: username
     *         description: The user's username
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
     *             $ref: '#/definitions/SearchUser'
     */
    .get(auth.verifyToken, auth.verifyAdmin, searchCtrl.searchUser);

  /**
   * @swagger
   * definitions:
   *   NewSearchDocument:
   *     type: object
   *   SearchDocument:
   *     allOf:
   *       - $ref: '#/definitions/NewSearchDocument'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/search/documents/')
    /**
     * @swagger
     * /api/v1/search/documents/?q={document_title}:
     *   get:
     *     description: Returns the documents that matches the title
     *     tags:
     *      - Find Documents
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: document_title
     *         description: The document's title
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
     *         description: documents
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/SearchDocument'
     */
    .get(auth.verifyToken, searchCtrl.searchDocument);
};
export default searchRoute;
