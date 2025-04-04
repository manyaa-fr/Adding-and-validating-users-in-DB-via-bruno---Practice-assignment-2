const express = require('express');
const { resolve } = require('path');
const connectToDatabase = require('./db');
const user = require('./schema');
const bcrypt = require ('bcrypt');
require('dotenv').config();

const app = express();
const port = 3010;
const dburi = process.env.DB_URL;

app.use(express.json());
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});


app.post('/login', async (req, res) => {
  const { mail, password } = req.body;

  if (!mail || !password) {
    return res.status(400).json({ message: 'Mail and password are required.' });
  }

  try {
    const existingUser = await user.findOne({ mail });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (isPasswordCorrect) {
      res.status(200).json({ message: 'Login successful!', user: existingUser.username });
    } else {
      res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.listen(port, async() => {
  try {
    await connectToDatabase(dburi);
  console.log(`Example app listening at http://localhost:${port}`);
  } catch (error) {
    console.log("error connecting", error);
  }
});