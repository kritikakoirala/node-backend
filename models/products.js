const mongoose = require('mongoose')
const Joi = require('joi')

const ProductSchema = new mongoose.Schema({
  product_name:{
    type:String
  },

  product_description:{
    type:String, 
  },

  product_price:{
    type:Number,
  },

  thumbnail:{
    type: String, 
  }

})

const Product = mongoose.model('products', ProductSchema)

const productValidator = (payload) =>{

  
  const schema = Joi.object({
    product_name:Joi.string().required(),
    product_description:Joi.string().required(),
    product_price:Joi.string().required(),
    thumbnail:Joi.string()
  })

  return schema.validate(payload)
}

const updateValidator = (payload) => {
  const schema = Joi.object({
    product_name:Joi.string().required(),
    product_description:Joi.string().required(),
    product_price:Joi.number().required(),
    thumbnail:Joi.string()
  })

  return schema.validate(payload)
}

module.exports = { Product, productValidator, updateValidator}