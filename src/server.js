import express from 'express';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

import routers from './routers';

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');

// enable json message body for posting data to API
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

// additional init stuff should go before hitting the routing

// database setup
const mongoose = require('mongoose');

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to LearnVerse');
});

// prefix api endpoints
Object.keys(routers).forEach((prefix) => {
  app.use(`/${prefix}`, routers[prefix]);
});

// START THE SERVER
// =============================================================================
async function startServer() {
  try {
    // connect DB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:9090';
    await mongoose.connect(mongoURI);

    const port = process.env.PORT || 9090;
    app.listen(port);

    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.error(error);
  }
}

startServer();
