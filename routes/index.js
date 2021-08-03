const express = require('express')
const router = express.Router()

const sampleRouter = require('../routes/sampleRoutes/sampleRoute')

router.use('',  sampleRouter)

module.exports = router;