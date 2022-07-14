require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User')

const app = express();

const port = process.env.PORT || 9000
app.use(cors())

app.get('/', async(req, res) => {
     res.send('Patrick Anjos da Rocha');
})

app.listen(port)