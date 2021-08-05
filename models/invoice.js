const mongoose = require('mongoose')
const Joi = require('joi')
const JoiObjectId = require("joi-objectid");


const InvoiceSchema = new mongoose.Schema({
  createdAt:{
    type:Date,
    default:Date.now()
  },

  product_detail:{
    type: mongoose.Schema.ObjectId,
    ref: "products", 
  },

})

const Invoice = mongoose.model('invoice', InvoiceSchema)


module.exports = { Invoice}