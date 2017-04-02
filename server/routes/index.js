import homeRoute from './homeRoutes';
import userRoute from './userRoutes';
// import roleRoute from './roleRoutes';
// import documentRoute from './documentRoutes';
// import searchRoute from './searchRoutes';

const routes = (router) => {
  homeRoute(router);
  userRoute(router);
  // roleRoute(router);
  // documentRoute(router);
  // searchRoute(router);
};

export default routes;

