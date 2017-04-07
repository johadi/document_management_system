import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import jsLogger from 'js-logger';
import routes from './server/routes';

require('dotenv').config();

jsLogger.useDefaults();

const app = express();
const router = express.Router();
const port = process.env.PORT || 8000;

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

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use((err, req, res) => {
//     const meta = {};
//     const statusCode = err.code || err.status || 500;
//     meta.message = err.message || 'Error in server interaction';
//     if (err.errors) {
//       meta.errors = err.errors;
//     }
//     return res.status(statusCode).send(meta);
//   });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use((err, req, res) => {
//   const meta = {};
//   const statusCode = err.code || err.status || 500;
//   meta.message = err.message || 'Error in server interaction';
//   if (err.errors) {
//     meta.errors = err.errors;
//   }
//   return res.status(statusCode).send(meta);
// });

app.listen(port, () => {
  jsLogger.debug(`App is running on port ${port}`);
});

export default app;
