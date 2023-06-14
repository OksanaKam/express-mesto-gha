const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
.then(() => {
  console.log('Connected');
})
.catch((err) => {
  console.log(`Connected error: ${err}`);
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '648881c428ae397ab376e594'
  };
  next();
});

app.use(routerUsers);
app.use(routerCards);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});