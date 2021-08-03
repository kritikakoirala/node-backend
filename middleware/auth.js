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
  // console.log(token)


  // eyJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI2MTA4ZTNiMGUxNGM1Yzc4ZjgwYjliNTIiLCJmaXJzdF9uYW1lIjoiS3JpdGlrYSIsImxhc3RfbmFtZSI6ImtvaXJhbGEiLCJlbWFpbCI6IktyaXRpa2FAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmEkMTAkYTZMR0N4UkhzM1lmY3dXY1JIQnoxdTlZdXpDWGhMYnZ6WkxYem45UzVNZzYyT3A0WmYxeGUiLCJfX3YiOjB9.GcBTpNfWQxRsErXoqzFu73SbRCLmMYiw7CiltoVD82c
}

module.exports = auth