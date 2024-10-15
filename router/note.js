const express = require('express');
const router = express.Router();
const { validationResult } = require('express-validator')

const Note = require('../Model/Note');

const get = async (req, res) => {
    try {


        const notes = await Note.find();
        res.json(notes);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};


const add = async (req, res) => {
  try {
    const {

      title,
      content,

    } = req.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const img = `https://robohash.org/${req.body.title}.png`;

    const note = new Note({

      title,
      content,
      img,
    });
    const savedNote = await note.save();

    // res.json(savedNote);
    var json = JSON.stringify(savedNote);

    res.send(json);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
}


router.get('/', get);
router.post('/add', add);


module.exports = router;