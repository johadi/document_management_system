import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import routes from './server/routes';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.set('port', port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

app.listen(port, () => {
  /* eslint-disable */
  console.log(`its running on port ${port}`);
  /* eslint-enable */
});

export default app;
