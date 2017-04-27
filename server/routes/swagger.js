import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'E-Docman',
    version: '1.0.0',
    description: 'E-Docman RESTful API with Swagger'
  }
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./server/routes/documentRoutes.js', './server/routes/userRoutes.js',
    './server/routes/roleRoutes.js', './server/routes/searchRoutes.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

const swaggerRoute = (router) => {
  router.route('/swagger.json')
    .get((req, res) => {
      res.send(swaggerSpec);
    });
  // router.route('/documentation')
  //   .get((req, res) => {
  //     res.status(200)
  //       .sendFile(path.join(__dirname, '../docs/index.html'));
  //   });
};

export default swaggerRoute;
