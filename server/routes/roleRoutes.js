import { roleCtrl } from '../controllers';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const documentRoute = (router) => {
  router.route('/roles')
    .get(auth.verifyToken, auth.verifyAdmin, roleCtrl.getAllRoles)
    .post(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRoleBody, roleCtrl.createRole);

  router.route('/roles/:id')
    .get(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRequestId, roleCtrl.getOneRole)
    .patch(auth.verifyToken, auth.verifyAdmin, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, utils.isValidRoleBody,
      roleCtrl.updateRole)
    .put(auth.verifyToken, auth.verifyAdmin, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, utils.isValidRoleBody,
      roleCtrl.updateRole)
    .delete(auth.verifyToken, utils.isValidRequestId,
      utils.preventDefaultRolesChangeOrDelete, roleCtrl.deleteRole);
};

export default documentRoute;
