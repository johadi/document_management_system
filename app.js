import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import logger from 'morgan';
import jsLogger from 'js-logger';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import routes from './server/routes';
import db from './server/models/';
import initialData from './server/config/initialData';
import webpackConfig from './webpack.config';

// require('dotenv').config();
dotenv.load();

jsLogger.useDefaults();

const compiler = webpack(webpackConfig);

const app = express();
const router = express.Router();
const port = process.env.PORT || 8000;
const env = process.env.NODE_ENV || 'development';

app.use(express.static(path.join(__dirname, './client/public')));
app.use(express.static(path.join(__dirname, './server/docs')));

if (process.env.NODE_ENV === 'development') {
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    hot: true,
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(webpackHotMiddleware(compiler));
}

routes(router);

app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/documentation', (req, res) => {
  res.status(200)
    .sendFile(path.join(__dirname, './server/docs/index.html'));
});

app.use('/api/v1/', router);

app.use('/api/v1/*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'We don\'t seem to understand your request!'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/public/index.html'));
});

if (process.env.NODE_ENV !== 'test') {
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
} else {
  app.listen(port, () => jsLogger.debug(`App is running on port ${port}`));
}

export default app;
