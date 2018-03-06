const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;

app.use(express.static('../public'));

app.use('/r/:id', express.static('../public'));

app.listen(port, () => {
  console.log('listening on port ' + port);
});