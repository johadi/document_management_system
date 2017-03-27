import express from 'express';

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

app.post('/server', function(request, response) {
    response.status(200).json("our server is up");
});

app.set('port', port);

app.listen(port, () => {
    console.log('its running on port 8000');
});
