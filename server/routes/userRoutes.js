import userCtrl from '../controllers/userController';
import auth from '../middleware/auth';

const userRoute = (router) => {
  router.route('/users')
    .get(auth.verifyToken, auth.verifyAdmin, userCtrl.getAllUsers)
    .post(userCtrl.createUser);

  router.route('/users/login')
    .post(userCtrl.login);

  router.route('/users/logout')
    .get(userCtrl.logout);

  router.route('/users/:id')
    .get(auth.verifyToken, userCtrl.getOneUser)
    .put(auth.verifyToken, userCtrl.updateUser)
    .patch(auth.verifyToken, userCtrl.updateUser)
    .delete(auth.verifyToken, auth.verifyAdmin, userCtrl.deleteUser);
};

export default userRoute;
