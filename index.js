require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const error = require('./middleware/error');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const tenants = require('./routes/tenants');
const auth = require('./routes/auth');
const employers = require('./routes/employers');
const employerauth = require('./routes/employerauth');
const tenantauth = require('./routes/tenantauth');
const express = require('express');
const app = express();
//  Tackling with UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (ex) => {
  console.log('WE GOT AN UNCAUGHT EXCEPTION');
  winston.error(ex.message, ex);
  process.exit(1);

})

//  Tackling with UNHANDLED PROMISE REJECTIONS
process.on('unhandledRejection', (ex) => {
  console.log('WE GOT AN UNCAUGHT REJECTION');
  winston.error(ex.message, ex);
  process.exit(1);
})



winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.add(new winston.transports.MongoDB({db:'mongodb://localhost/vidly'}));

// throw new Error('Something failed during startup'); 





if (!config.get('jwtPrivateKey')){
  console.log('Fatal Error. JWT private key is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly',{ useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/tenantauth', tenantauth);
app.use('/api/employerauth', employerauth);


app.use('/api/tenants', tenants);
app.use('/api/employers', employers);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));