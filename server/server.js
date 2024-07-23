const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoute = require('./routes/userRoute');
const collectionRoute = require('./routes/collectionRoute');
const app = express();

// Load environment variables from .env file
dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use('/api/user', userRoute);
app.use('/api/collection', collectionRoute);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error: ', err));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
