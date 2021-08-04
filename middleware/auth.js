const jwt = require('jsonwebtoken')
const {User} = require('../models/user')

const auth = async (req, res, next) => {
  
  // get the token
  const authHeader = req.headers.token
  const token = authHeader.split(" ")[1]
  if(authHeader && authHeader.split(" ")[0]==="Bearer"){
    
    jwt.verify(token, '$$$sample$$$', async (err, decoded)=>{
      if(err){
        res.json({
          status:false,
          message:"Invalid Token"
        })
      }else{
        console.log(decoded)
        const findToken = User.findOne({email:decoded.email})
        if(findToken){
          const checkActive = User.findOne({status:decoded.status})
          if(checkActive){
            next()
          }else{
            res.json({
              message:"User is not active"
            })
          }
         
        }else{
          res.json({
            status:false,
            message:"User not found"
          })
        }
      }
    })
  }
}

module.exports = auth