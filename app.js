import express from 'express';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.get('/server', (request, response) => {
  response.status(200).send('our server is up');
});

app.set('port', port);

app.listen(port, () => {
  /* eslint-disable */
  console.log(`its running on port ${port}`);
  /* eslint-enable */
});
