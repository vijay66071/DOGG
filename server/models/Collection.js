const mongoose = require('mongoose');

const CollectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  filter: {
    type: String,
    required: true,
  },
  images: [
    {
      code: String,
      url: String,
    },
  ],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Collection = mongoose.model('Collection', CollectionSchema);
module.exports = Collection;
