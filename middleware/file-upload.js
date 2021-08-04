const { Error } = require('mongoose')
const multer = require('multer')

// configure file upload settings

const fileStorage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, './uploads')
  }, 
  filename:(req, file, cb)=>{

    // escape the spaces between the letters of filename and store with the created date + escaped filename
    cb(null, Date.now()+'--'+file.originalname.split(" ").join(""))
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/jpg'){
    cb(null, true)
  }else{
    cb(new Error("Image must be jpeg, png or jpg"), false)
  }
}

const upload = multer({
  storage:fileStorage,
  fileFilter:fileFilter
})

module.exports = upload