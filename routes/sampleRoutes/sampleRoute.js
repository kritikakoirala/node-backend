const express = require('express')
const router = express.Router();

const { signUp, login, verify, fileUpload }  = require('./sampleFunction')
const upload = require('../../middleware/file-upload')

// login and signup
router.post('/signup', signUp)
router.post('/login', login)
router.post('/verify', verify)
router.post('/uploadFile', upload.any(), fileUpload)

module.exports = router