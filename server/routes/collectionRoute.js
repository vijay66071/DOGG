const express = require('express');
const Collection = require('../models/Collection'); // Ensure the correct path to your Collection model
const router = express.Router();

// Create a new collection
router.post('/', async (req, res) => {
  const { name, filter, images, userId } = req.body;

  if (!name || !filter || !images || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const collection = new Collection({ name, filter, images, userId });
    await collection.save();
    res.status(201).json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all collections
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find();
    res.status(200).json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a collection
router.put('/:id', async (req, res) => {
  try {
    const { images } = req.body;
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      { images },
      { new: true }
    );
    res.json(updatedCollection);
  } catch (error) {
    console.error('Error removing image', error); // More specific error message
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
