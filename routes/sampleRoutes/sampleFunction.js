const {User, createValidator} = require('../../models/user')
const bc = require('bcryptjs')
const jwt = require('jsonwebtoken')
const transporter = require('../../middleware/nodemailer')
const { Error } = require('mongoose')

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

const verify = async(req, res)=>{
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

module.exports = {signUp, login, verify}