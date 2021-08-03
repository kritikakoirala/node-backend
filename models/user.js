const mongoose = require('mongoose')
const Joi = require("joi");
// const JoiObjectId = require("joi-objectid");
// const myJoiObjectId = JoiObjectId(Joi);

const UserSchema = new mongoose.Schema({
  first_name : {
    type:String
  },
  last_name : {
    type:String
  },
  email :{
    type:String,
    unique:true
  },
  password:{
    type:String
  },
  otp:{
    type:String
  },
  status:{
    type:Boolean
  }
})

const User = mongoose.model("user", UserSchema)

// validation for signup using Joi

const createValidator = (payload) =>{
  const schema = Joi.object({
    first_name:Joi.string().required(),
    last_name:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required()
  })

  return schema.validate(payload)
}

module.exports = { User, createValidator}