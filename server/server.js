const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://adam:admin@cluster0.ojjqodb.mongodb.net/test');

const leadSchema = new mongoose.Schema({
  estateType: String,
  fullname: String,
  phone: String,
  email: String,
  region: String,
  district: String,
});

const Lead = mongoose.model('Lead', leadSchema);

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));

app.post(
  '/api/lead',
  [
    body('estateType').notEmpty(),
    body('fullname').notEmpty(),
    body('phone').isMobilePhone('cs-CZ').notEmpty(),
    body('email').isEmail().notEmpty(),
    body('region').notEmpty(),
    body('district').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      estateType,
      fullname,
      phone,
      email,
      region,
      district,
    } = req.body;

    const lead = new Lead({
      estateType,
      fullname,
      phone,
      email,
      region,
      district,
    });

    lead
      .save()
      .then(() => {
        res.status(201).json({ message: 'Data byla uložena.' });
      })
      .catch((error) => {
        res.status(500).json({ error: 'Chyba při ukládání dat.' });
      });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



