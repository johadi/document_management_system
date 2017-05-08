import { userCtrl, docCtrl } from '../controllers';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const userRoute = (router) => {
  /**
   * @swagger
   * definitions:
   *   NewUser:
   *     type: object
   *     required:
   *       - username
   *       - email
   *       - firstName
   *       - lastName
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       firstName:
   *         type: string
   *       lastName:
   *         type: string
   *       password:
   *         type: string
   *         format: password
   *       email:
   *         type: string
   *         format: email
   *   User:
   *     allOf:
   *       - $ref: '#/definitions/NewUser'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/users')
    /**
     * @swagger
     * /api/v1/users:
     *   get:
     *     description: Returns users
     *     tags:
     *      - Find Users
     *     produces:
     *      - application/json
     *     parameters:
     *      - name: x-access-token
     *        in: header
     *        description: an authorization header
     *        required: true
     *        type: string
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/User'
     */
    .get(auth.verifyToken, auth.verifyAdmin, userCtrl.getAllUsers)
    /**
     * @swagger
     * /api/v1/users:
     *   post:
     *     description: Creates new user
     *     tags:
     *      - Create Users
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: User object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/NewUser'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           $ref: '#/definitions/User'
     */
    .post(utils.isValidUserCreateBody, userCtrl.createUser);

  /**
   * @swagger
   * definitions:
   *   NewLogin:
   *     type: object
   *     required:
   *       - email
   *       - password
   *     properties:
   *       email:
   *         type: string
   *         format: email
   *       password:
   *         type: string
   *         format: password
   *   Login:
   *     allOf:
   *       - $ref: '#/definitions/NewLogin'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/users/login')
    /**
     * @swagger
     * /api/v1/users/login:
     *   post:
     *     description: Logs in a user
     *     tags:
     *      - Authentication
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: user
     *         description: User object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/NewLogin'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           $ref: '#/definitions/Login'
     */
    .post(utils.isValidLoginBody, userCtrl.login);

  router.route('/users/logout')
    .post(auth.verifyToken, userCtrl.logout);

  /**
   * @swagger
   * definitions:
   *   NewUpdate:
   *     type: object
   *     required:
   *       - username
   *       - email
   *       - firstName
   *       - lastName
   *       - password
   *     properties:
   *       username:
   *         type: string
   *       firstName:
   *         type: string
   *       lastName:
   *         type: string
   *   UpdateUserPassword:
   *     type: object
   *     required:
   *       - old_password
   *       - new_password
   *       - new_password_confirmation
   *     properties:
   *       old_password:
   *         type: string
   *         example: password
   *       new_password:
   *         type: string
   *         example: password
   *       new_password_confirmation:
   *         type: string
   *         example: password
   *   Update:
   *     allOf:
   *       - $ref: '#/definitions/NewUpdate'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/users/:id')
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   get:
     *     description: Returns a particular user
     *     tags:
     *      - Find Users
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         description: The user's id
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
     *             $ref: '#/definitions/Update'
     */
    .get(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUser, userCtrl.getOneUser)
    .patch(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUser, utils.isValidUserUpdateBody,
      utils.preventDefaultAdminRoleChange, userCtrl.updateUser)
    /**
     * @swagger
     * /api/v1/users/{id}:
     *   put:
     *     description: Updates the user signed in
     *     tags:
     *      - Update Users
     *     produces:
     *       - application/json
     *     parameters:
     *        - name: id
     *          description: The user's id
     *          in:  path
     *          required: true
     *          type: string
     *        - name: x-access-token
     *          in: header
     *          description: an authorization header
     *          required: true
     *          type: string
     *        - name: user
     *          description: User object
     *          in:  body
     *          required: true
     *          type: string
     *          schema:
     *            $ref: '#/definitions/NewUpdate'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           $ref: '#/definitions/Update'
     */
    .put(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUser, utils.isValidUserUpdateBody,
      utils.preventDefaultAdminRoleChange, userCtrl.updateUser)
    /**
     * @swagger
     * /api/v1/users/{id}:
     *    delete:
     *      description: Deletes the user with the id supplied as param
     *      tags:
     *        - Delete User
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: id
     *          description: The user's id
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
     *          description: users
     *          schema:
     *            type: string
     *            items:
     *              message: ''
     */
    .delete(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRequestId, utils.preventDefaultAdminDelete,
      userCtrl.deleteUser);

  router.route('/users/:id/password')
    .put(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUser, utils.isValidUpdatePasswordBody,
      userCtrl.changePassword)
    /**
     * @swagger
     * /api/v1/users/{id}/password:
     *   put:
     *     description: Updates the user password
     *     tags:
     *      - Update User
     *     produces:
     *       - application/json
     *     parameters:
     *        - name: id
     *          description: The user's id
     *          in:  path
     *          required: true
     *          type: string
     *        - name: x-access-token
     *          in: header
     *          description: an authorization header
     *          required: true
     *          type: string
     *        - name: user
     *          description: User object
     *          in:  body
     *          required: true
     *          type: string
     *          schema:
     *            $ref: '#/definitions/UpdateUserPassword'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           message: ''
     */
    .patch(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUser, utils.isValidUpdatePasswordBody,
      userCtrl.changePassword);

  /**
   * @swagger
   * definitions:
   *   NewFetchDoc:
   *     type: object
   *   FetchDoc:
   *     allOf:
   *       - $ref: '#/definitions/NewFetchDoc'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/users/:id/documents')
    /**
     * @swagger
     * /users/{id}/documents:
     *   get:
     *     description: Returns the documents of a particular user
     *     tags:
     *      - Find Documents
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         description: The user's id
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
     *             $ref: '#/definitions/FetchDoc'
     */
    .get(auth.verifyToken, utils.isValidRequestId, docCtrl.getUserDocuments);
};

export default userRoute;
