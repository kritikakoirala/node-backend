const express = require('express')
const router = express.Router();

const { signUp, login, verify }  = require('./sampleFunction')

// login and signup
router.post('/signup', signUp)
router.post('/login', login)
router.post('/verify', verify)

module.exports = router