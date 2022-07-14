require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User')

const app = express();

const port = process.env.PORT || 9000
app.use(express.json())
app.use(cors())

app.get('/', async(req, res) => {
     res.send('Patrick Anjos da Rocha');
})

// CREATE USER
app.post('/auth/register', async (req, res) => {
    const { name, login, email, password, confirmPassword } = req.body

    // Validations
    if (!name) {
        return res.status(422).json({ msg: 'O Nome é obrigatório!' })
    }
    if (!login) {
        return res.status(422).json({ msg: 'O Login é obrigatório!' })
    }
    if (!email) {
        return res.status(422).json({ msg: 'O E-mail é obrigatório!' })
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória!' })
    }
    if (!confirmPassword) {
        return res.status(422).json({ msg: 'Insira novamente a senha!' })
    }
    if (password !== confirmPassword) {
        return res.status(422).json({ msg: 'As senhas não são iguais!' })
    }

    // Check if user exists
    const userEmailExists = await User.findOne({email: email})
    if (userEmailExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro email!' })
    }
    const userLoginExists = await User.findOne({login: login})
    if (userLoginExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro Login!' })
    }

    // Create Password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create User
    const user = new User({
        name,
        login,
        email,
        password: passwordHash
    })

    try {
        await user.save();
        res.status(200).json({msg: 'Usuário criado com Sucesso!'})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: 'Erro com o servidor, tente novamente mais tarde!'})
    }
})

// Connection with database
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.foastos.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log('Connected with database!')
}).catch(err => console.error(err))

app.listen(port)