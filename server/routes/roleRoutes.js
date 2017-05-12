import { roleCtrl } from '../controllers';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const documentRoute = (router) => {
  /**
   * @swagger
   * definitions:
   *   NewRole:
   *     type: object
   *     required:
   *       - title
   *     properties:
   *       title:
   *         type: string
   *   Role:
   *     allOf:
   *       - $ref: '#/definitions/NewRole'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/roles')
    /**
     * @swagger
     * /api/v1/roles:
     *   get:
     *     description: Returns roles
     *     tags:
     *      - Find Roles
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
     *         description: documents
     *         schema:
     *           type: array
     *           items:
     *             $ref: '#/definitions/Role'
     */
    .get(auth.verifyToken, auth.verifyAdmin, roleCtrl.getAllRoles)
    /**
     * @swagger
     * /api/v1/roles:
     *   post:
     *     description: Creates new role
     *     tags:
     *      - Create
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: x-access-token
     *         in: header
     *         description: an authorization header
     *         required: true
     *         type: string
     *       - name: role
     *         description: role object
     *         in:  body
     *         required: true
     *         type: string
     *         schema:
     *           $ref: '#/definitions/NewRole'
     *     responses:
     *       200:
     *         description: users
     *         schema:
     *           $ref: '#/definitions/Role'
     */
    .post(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRoleBody, roleCtrl.createRole);

  /**
   * @swagger
   * definitions:
   *   NewRoleUpdate:
   *     type: object
   *     required:
   *       - title
   *     properties:
   *       title:
   *         type: string
   *   RoleUpdate:
   *     allOf:
   *       - $ref: '#/definitions/NewRoleUpdate'
   *       - required:
   *         - id
   *       - properties:
   *         id:
   *           type: integer
   *           format: int64
   */
  router.route('/roles/:id')
    /**
     * @swagger
     * /api/v1/roles/{id}:
     *   get:
     *     description: Returns a particular role
     *     tags:
     *      - Find Roles
     *     produces:
     *      - application/json
     *     parameters:
     *       - name: id
     *         description: The role's id
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
     *             $ref: '#/definitions/RoleUpdate'
     */
    .get(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRequestId, roleCtrl.getRole)
    .patch(auth.verifyToken, auth.verifyAdmin, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, utils.isValidRoleBody,
      roleCtrl.updateRole)
    /**
     * @swagger
     * /api/v1/roles/{id}:
     *   put:
     *     description: Updates a role by id
     *     tags:
     *      - Update
     *     produces:
     *       - application/json
     *     parameters:
     *        - name: id
     *          description: The role's id
     *          in:  path
     *          required: true
     *          type: string
     *        - name: x-access-token
     *          in: header
     *          description: an authorization header
     *          required: true
     *          type: string
     *        - name: role
     *          description: User object
     *          in:  body
     *          required: true
     *          type: string
     *          schema:
     *            $ref: '#/definitions/NewRoleUpdate'
     *     responses:
     *       200:
     *         description: roles
     *         schema:
     *           $ref: '#/definitions/RoleUpdate'
     */
    .put(auth.verifyToken, auth.verifyAdmin, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, utils.isValidRoleBody,
      roleCtrl.updateRole)
    /**
     * @swagger
     * /api/v1/roles/{id}:
     *    delete:
     *      description: Deletes the role with the id supplied as param
     *      tags:
     *        - Delete
     *      produces:
     *        - application/json
     *      parameters:
     *        - name: id
     *          description: The role's id
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
     *          description: roles
     *          schema:
     *            type: array
     *            items:
     *              $ref: '#/definitions/RoleUpdate'
     */
    .delete(auth.verifyToken, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, roleCtrl.deleteRole);
};

export default documentRoute;
