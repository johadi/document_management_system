import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import jsLogger from 'js-logger';
import routes from './server/routes';
import db from './server/models/';
import initialData from './server/config/initialData';

require('dotenv').config();

jsLogger.useDefaults();

const app = express();
const router = express.Router();
const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'development';

routes(router);

app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/', router);

app.use('/api/v1/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'We don\'t seem to understand your request!'
  });
});

db.sequelize.sync()
  .then(() => db.Role.findOne({ where: { title: 'Admin' } }))
  .then((roleExists) => {
    if (!roleExists) {
      return db.Role.create(initialData.adminRole);
    }
  })
  .then((adminRole) => {
    if (adminRole) {
      return db.Role.create(initialData.regularRole);
    }
  })
  .then((regularRole) => {
    if (regularRole) {
      return db.User.create(initialData.adminUser);
    }
  })
  .then(() => app.listen(port))
  .then(() => jsLogger.debug(`App is running on port ${port}`))
  .catch((err) => {
    if (env === 'development') {
      jsLogger.error(err);
    }
  });

export default app;
