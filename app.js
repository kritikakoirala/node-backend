//require the needed config and setup
require('dotenv/config')
require('./config/database').connect()

//express config
const indexRoute = require('./routes/index')
const auth = require('./middleware/auth')
const express = require('express')
const app = express()

//body parser config
app.use(express.urlencoded({extended:false}))
app.use(express.json())

// port number
const port = 3001

//index route
app.use('/api', indexRoute)

app.get('/', auth, (req, res)=>{res.send('running')})

// make uploads folder static
app.use('/', express.static("uploads"))

// connect server
app.listen(port, ()=>{console.log("server is running")})
