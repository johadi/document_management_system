import userCtrl from '../controllers/userController';
import auth from '../middlewares/auth';
import utils from '../middlewares/utils';

const userRoute = (router) => {
  router.route('/users')
    .get(auth.verifyToken, auth.verifyAdmin, userCtrl.getAllUsers)
    .post(utils.isValidUserCreateBody, userCtrl.createUser);

  router.route('/users/login')
    .post(userCtrl.login);

  router.route('/users/logout')
    .get(userCtrl.logout);

  router.route('/users/:id')
    .get(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUserOrDocuments, userCtrl.getOneUser)
    .patch(auth.verifyToken, utils.isValidRequestId,
      utils.canUpdateOrFindUserOrDocuments, utils.isValidUserUpdateBody,
      utils.preventDefaultAdminRoleChange, userCtrl.updateUser)
    .delete(auth.verifyToken, auth.verifyAdmin,
      utils.isValidRequestId, utils.preventDefaultAdminDelete,
      userCtrl.deleteUser);
};

export default userRoute;
