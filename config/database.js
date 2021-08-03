const mongoose = require('mongoose')

exports.connect=()=>{
  mongoose.
  connect(process.env.DB_CONN, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then(()=>{
    console.log('database connected')
  }).catch((err)=>{
    console.log(err)
    console.log("error in connecting database")
  })
}


