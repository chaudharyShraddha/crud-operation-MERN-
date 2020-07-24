const mongoose = require('mongoose');
const config = require('config');

const db = config.get('mongoURI');

const mongoDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('MongoDB is connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = mongoDB;
