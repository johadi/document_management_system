import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './server/routes';

require('dotenv').config();

const app = express();
const router = express.Router();
const port = process.env.PORT || 8000;

routes(router);

app.set('port', port);

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

app.listen(port, () => {
  /* eslint-disable */
  console.log(`its running on port ${port}`);
  /* eslint-enable */
});

export default app;
