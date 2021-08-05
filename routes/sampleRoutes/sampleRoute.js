const express = require('express')
const router = express.Router();

const { signUp, login, verify, fileUpload, add, getAll, getOne, update, deleteById, postInvoice , getInvoice}  = require('./sampleFunction')
const upload = require('../../middleware/file-upload')

// login and signup
router.post('/signup', signUp)
router.post('/login', login)
router.post('/verify', verify)
router.post('/uploadFile', upload.any(), fileUpload)

// sample CRUD routes  eg. products in ecommerce is used in this sample

router.post('/add-products', upload.any(),  add)
router.get('/products', getAll)
router.get('/product/:id', getOne)
router.put('/product/:id', upload.any(), update)
router.delete('/product/:id', deleteById)


router.post('/invoice', postInvoice)
router.get('/invoice', getInvoice)

module.exports = router