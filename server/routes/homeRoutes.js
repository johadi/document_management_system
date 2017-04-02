const homeRoute = (router) => {
  router.route('/')
    .get((req, res) => {
      res.status(200).json({
        message: 'Welcome to the document management api.'
      });
    });
};

export default homeRoute;
