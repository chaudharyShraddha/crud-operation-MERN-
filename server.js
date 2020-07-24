const express = require('express');
const mongoDB = require('./config/database');
const app = express();

// Init Middleware
app.use(
  express.json({
    extended: false,
  })
);
app.use('/uploads', express.static('uploads'));

// connect to database
mongoDB();

// define route
app.use('/api', require('./routes/routes'));

app.listen(5000, () => console.log('Server is running'));
