const express = require('express');
const multer = require('multer');

const router = express.Router();

const Pokemon = require('../models/Pokemon');

// upload image
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// restrict user to unwanted upload
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// @route   GET api/
// @desc    get all pokemon
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pokemon = await Pokemon.find();
    res.json(pokemon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/:id
// @desc    get pokemon by id
// @access  Public
router.get('/:id', (req, res) => {
  Pokemon.findById(req.params.id, (err, data) => {
    res.json(data);
  });
});

// @route   POST api/
// @desc    add and pokemon
// @access  Public
router.post('/', upload.single('image'), async (req, res) => {
  const image = req.file.path;
  const { name, description } = req.body;

  try {
    const pokemon = new Pokemon({
      name,
      image,
      description,
    });

    await pokemon.save();
    res.json(pokemon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/:id
// @desc    update pokemon
// @access  Public
router.put('/:id', upload.single('image'), async (req, res) => {
  let image = '';
  if (req.body.image) {
    image = req.body.image;
  } else {
    image = req.file.path;
  }
  const { name, description } = req.body;

  await Pokemon.findByIdAndUpdate(req.params.id, { name, image, description });
  res.json({ message: 'updated' });
});

// @route   delete api/:id
// @desc    delete pokemon
// @access  Public
router.delete('/:id', async (req, res) => {
  await Pokemon.findByIdAndRemove(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;
