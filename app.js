import express from 'express';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.get('/server', function(request, response) {
    response.status(200).send("our server is up");
});

app.set('port', port);

app.listen(port, () => {
    console.log('its running on port 8000');
});
