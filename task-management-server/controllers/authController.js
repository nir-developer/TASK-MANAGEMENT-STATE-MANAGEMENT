const User = require('../models/User')
const jwt = require('jsonwebtoken')


exports.signup = async (req,res) =>{
    try 
    {

        console.log('INSIDE SIGNUP !')
        console.log(req.body)

        let user = new User({
            name: req.body.name, 
            email:req.body.email,
            password: req.body.password, 
            passwordConfirm: req.body.passwordConfirm ,
            photo:req.body.photo, 

        })

        //NOTE: VALIDATE PASSWORD CONFIRM  IS DONE BY THE CUSTOM VALIDATOR I ADDED IN THE USER SCHEMA


        //NOTE: BEFORE MONGOOSE WILL SAVE THE USER - IT WILL HASH THE PASSWORD -  BY THE PRE-SAVE M.W)

        user = await user.save();


        //LOGIN THE USER - ADD THE HTTP ONLY COOKIE 
        
        //SIGN THE JWT WITH THE ID AS PAYLOAD  
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })


        //CREATE THE HTTP ONLY COOKIE AND ADD IT THE JWT 
        const cookieOptions = {
        expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };
   
    //  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

 

    //ADD COOKIE TO THE RESPONSE
   res.cookie('httpOnlyCookieName','cookieValue', {
    httpOnly:true
  });
 

   //REMOVE PASSWORD FROM THE OUTPUT 

   user.password = undefined;

    res.status(201).json({
     status:'success', 
     token,
      data:{ user}
        })


    }
    catch(err)
    {
        console.log(err.message)
        res.status(500)
        .json({
            status:'fail',
             message:err.message
            })
    }
}

exports.login = async(req,res) =>{

    try 
    {
        //1)CHECK IF PASSWORD AND EMAIL EXISTS IN THE REQUEST
    const {email , password} = req.body; 

    if(!email || !password) 
    {
       
        return res.json(400).json({status:'fail', message:'Email and passwords are required'})
    }


    //2) CHECK IF USER ESITS IN DB AND PASSWORD IS CORRECT
    //EXPLICLTY SELECT THE PASSWORD - SINCE I REMOVED IT FROM THE SCHEMA TO BE DISPLAYED
    const user = await User.findOne({email}).select('+password')

    
   if(!user || !await user.correctPassword(password, user.password)) 
    {
        return res.status(400).json({status:'fail', message:'Incorrect Email or password'})
        // const error = {statusCode: 401, status:'fail', message:'Incorrect Email or password'}
        // throw error; 
    }   

    //SIGN THE TOKEN 
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    
     const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  //TEST IN THE RESPONSE HEADER IF THERE IS A Header: Set-Cookie with the token value
  res.cookie('jwt', token, cookieOptions);



 // Remove password from output
    user.password = undefined;

//    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA1MDNkODg1YmUwMTBjYjA4YmI3YyIsImlhdCI6MTcxNzU5MDk0MywiZXhwIjoxNzI1MzY2OTQzfQ.T1W1fPuJysjEE3YTUz1PGkB76DoYus5rLFWIKB9tZrU",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NjA1MDNkODg1YmUwMTBjYjA4YmI3YyIsImlhdCI6MTcxNzU5MDk2MCwiZXhwIjoxNzI1MzY2OTYwfQ.PF_n02lKkVDe0YycL8d5LB_J1chB8vf9rWPV329pqFY",


        
    //CREATE THE HTTP ONLY COOKIE THAT CONTAINS THE JWT TOKEN 
    

    //SEND BACK THE RESPONSE
    res.status(200).json({
        status:'success', 
        token,
            data:{ user }
            })
        
}

 catch(err)
    {
        res.status(400).json({message:err.message})
        // res.status(err.statusCode).json({
        //     status:err.statusCode, 
        //     message:err.message
        // })

    }

}