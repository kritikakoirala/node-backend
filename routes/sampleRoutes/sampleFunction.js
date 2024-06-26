
// import models
const {User, createValidator} = require('../../models/user')
const {Invoice} = require('../../models/invoice')
const {Product, productValidator, updateValidator} = require('../../models/products')


const bc = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../../middleware/nodemailer')
const { Error, Mongoose } = require('mongoose')

// function to signup
const signUp = async(req, res) => {
    const existingEmail = await User.findOne({email:req.body.email})
    if(existingEmail){
      res.json({status:false, message:'Email alredy exists'});
    }else{
      const {error} = createValidator(req.body)
      console.log(error)

      // error thrown by JOI
      if(error){
        return res.status(401).send(error.details[0].message);
      }

      // hash the password before saving to db
      const hashedPassword = bc.hashSync(req.body.password, 10)
      const otp = Math.floor(1000000+Math.random()*9000000);

      const user = new User({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        password:hashedPassword,
        otp:otp,
        status:false
      })

      sendOtp(otp, req.body.email)

      // save the result and send the message
      const result = await user.save()
      res.json({
        status:true,
        message:"OTP is sent to the user's email"
      })
    }
}

// functiong for sending otp after signup
const sendOtp = (otp, email) =>{
  var mailOptions={
    to: email,
    subject: "Otp for registration is: ",
    html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(Error)
    }
    console.log('Message sent: %s', info.messageId);   
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('otp');
});
}

// verify the otp entered by the user

const verify = async(req, res)=> {
  // find the email
  const user = await User.findOne({otp:req.body.otp});
  if(user){
    res.json({
      message:"User registered successfully"
    })

    await User.findOneAndUpdate({email:req.body.email, otp:req.body.otp},{status:true})
  }else{
    res.json({
      message:"OTP does not match"
    })
  }
}

// payload to createSampleValidator
const login = async (req, res) => {

  // find the email in the user table
  const user = await User.findOne({email:req.body.email});
  console.log(user)

  // compare the password
  const passCheck = await bc.compare(req.body.password, user.password)
  console.log(passCheck)

  // send token if the passwords match
  if(passCheck){
    const token = jwt.sign(JSON.stringify(user), "$$$sample$$$")
    res.json({
      status:true,
      message:"User successfully logged in",
      token:token
    })
  }else{
    res.json({
      message:"Username or password does not match"
    })
  }

}

// file upload function
const fileUpload = async (req, res) => {

  // multiple file send url
  if(req.files.length>1){
    const filesArr = []
    req.files.map(file=>{
      return(
        filesArr.push('http://localhost:3001/'+file.filename)
      )
    })
    res.json({

      url:filesArr,
      message:"Multiple files uploaded successfully"
    })
  }else{
    // single file send url
    console.log(req)
    res.json({
      url:'http://localhost:3001/'+req.files[0].filename,
      message:"Single file uploaded successfully"
    })
  }
}

//delete existing file from folder
// const deleteexfile = () => {
//   fs.unlink("upload/" + "\sd - Copy (2).png", (err => {
//     if (err) console.log(err);
//     else {
//       console.log("http://:4000/1626777694436_big_buck_bunny_720p_20mb.mp4null10000");
//     }
//   }));
//   console.log('running delet file');
// }
// deleteexfile()


// CRUD functionality functions

const add = async (req, res) => {
  // console.log(req)

  // const file = new File({
  //   name:'http://localhost:3001'+req.files[0].filename
  // })
  const products = new Product({
    product_name: req.body.product_name, 
    product_description: req.body.product_description,
    product_price : req.body.product_price,
    thumbnail:'http://localhost:3001/'+req.files[0].filename
  })

  const {error} = productValidator(req.body)

  if(error){
    res.json({
      status:false,
      message: error.details[0].message
    })
  }

  await products.save();

  res.json({
    status:true, 
    message:"Product has been successfully added"
  })

}

const getAll = async (req, res) =>{
  try{
    const products = await Product.find()
    res.json(products)
  }catch(err){
    res.json({
      status:false,
      message:err
    })
  }
}

const update = async(req, res) =>{
  
    const {error} = updateValidator(req.body)
    if(error){
      res.json({
        status:false,
        message:error.details[0].message
      })
    }else{
      const productUpdate = await Product.findOneAndUpdate({_id:req.params.id}, {
        product_name:req.body.product_name,
        product_description:req.body.product_description,
        product_price:req.body.product_price,
        thumbnail:req.files[0].filename
  
      })
  
      res.json({
        status:true,
        message:"Product updated successfully",
        data:productUpdate
      })
    }
}

const getOne = async(req, res)=>{
  const oneProduct = await Product.findById({_id:req.params.id})

  res.json({
    data:oneProduct
  })
}

const deleteById = async (req, res) => {
  const deleteProduct = await Product.findByIdAndDelete({_id:req.params.id})

  res.json({
    message:"Product Successfully deleted"
  })
}

const postInvoice = async (req, res) =>{
  console.log(req.body)
  const invoice = new Invoice({
    product_detail: req.body.product_detail
  })

  await invoice.save()

  res.json({
    message:invoice
  })
}

const getInvoice = async (req,res)=>{
  const invoiceId  = await Invoice.find().populate("product_detail")
  res.json({
    mesage:invoiceId
  })
}

module.exports = {signUp, login, verify, fileUpload, add, getAll, getOne, update, deleteById, postInvoice, getInvoice}