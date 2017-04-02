import userCtrl from '../controllers/userController';

const userRoute = (router) => {
  router.route('/users')
    .get(userCtrl.getAllUsers)
    .post(userCtrl.createUser);

  router.route('/users/login')
    .post(userCtrl.login);

  router.route('/users/logout')
    .get(userCtrl.logout);

  router.route('/users/:id')
    .get(userCtrl.getOneUser)
    .put(userCtrl.updateUser)
    .patch(userCtrl.updateUser)
    .delete(userCtrl.deleteUser);
};

export default userRoute;
