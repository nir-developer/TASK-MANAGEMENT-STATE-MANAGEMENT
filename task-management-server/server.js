const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')



const express = require('express')
const mongoose = require('mongoose');

const app = express(); 

app.use(morgan('dev'))

const PORT = process.env.PORT || 3000

let DB;
const NODE_ENV= process.env.NODE_ENV; 
if(NODE_ENV === 'development') DB = process.env.DB_COMPASS
if(NODE_ENV === 'production') DB = process.env.DB_ATLAS 


if(!DB) throw new Error('NO VALID ENVIRONMENT WAS DEFINED!')


mongoose.connect(DB, {
   
}).then(() => {
    console.log('Connected to MongoDB on URL: ', DB);
    app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
})
.catch(err => {
    console.error('Connection error', err);
});


//USER SCHEMA
const userSchema = mongoose.Schema({
    name:String, 
    email:{type:String, unique: true},
    password:{
        type:String, 
        select:false
    }, 
    photo: String, 
    tasks:[{type: mongoose.Types.ObjectId, ref: 'Task'}]

})
//TASK SCHEMA
const taskSchema = mongoose.Schema({
    title:{type:String, require:[true, 'Title is required']} ,
    isCompleted:{type:Boolean,default:false },
    date:{type:Date, default:Date.now},
    description:String, 
    user:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
})


const User = new mongoose.model('User', userSchema)
const Task = new mongoose.model('Task', taskSchema)


//M.W TO UPDATE JSON BODIES 
app.use(bodyParser.json())
app.use(cookieParser())




////////////////////////////////////////////////////////
//SINGUP END POINT 
app.post('/api/v1/auth/signup', async(req,res) =>{
    try 
    {
        const {name, email , password, photo } = req.body; 


        //CHECK THE REQ BODY - LATER!
       
        //HASH THE PASSWORD 
        const hashedPassword= await bcrypt.hash(password, 10); 


        //CREATE USER 
        //IMPORTANT !!! INITIALLY - PLACE HOLDER FOR PHOTO , AND EMPTY ARRAY FOR TASKS)
        const user = await User.create({name, email, password:hashedPassword, photo, tasks:[]})

        res.status(201).json({status:'success', data:{user}})


    }
    catch(err)
    {
        console.error('Error signing up: ', err)
        res.status(500).json({message:err.message, status:'fail'})
    }
})



//LOGIN END POINT 
app.post('/api/v1/auth/login', async(req,res) =>{
    try 
    {
        const {email, password} = req.body; 
        console.log(email, password)


        //FIND USER BY EMAIL - AND EXPLICLTY ADD THE PASSWORD(SINCE SELECT:FALSE IN THE SCHEMA!)
        const user = await User.findOne({email}).select('+password')

        //WHY 404? AND NOT 401?
        if(!user) return res.status(404).json({status:'fail', message:'User not found'})

         console.log('USER FOUND BY EMAIL!')
         console.log(user)

        //COMPARE PASSWORD 
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid)
            return res.status(401).json({status:'fail', message:'Invalid password'})

        //GENERATE JWT TOKEN 
        const token = jwt.sign(
            {
             userId:user._id},
             process.env.JWT_SECRET, 
            {expiresIn: process.env.JWT_EXPIRES_IN}
          )

          //STORE THE JWT IN A HTTP ONLY COOKIE (ADD EXPIRATION ALSO)
          res.cookie('jwt', token, {httpOnly:true,})

          //REMOVE THE TOKEN LATER!
          res.status(200).json({status:'success', token})



    }
    catch(err)
    {
        console.error('Error login: ', err.message)
        res.status(500).json({status:'fail', message:`Internal Server Error: ${err.message}`})
    }
})


//LOGOUT END POINT 
app.get('/api/v1/auth/logout', (req,res) =>{
   
    res.clearCookie('jwt')
    res.status(200).json({message:'Logout Success'})

})

//GET USER DATA ENDPOINT (PROTECTED ROUTE!)
app.get('/api/v1/auth/user', async(req,res)=>{
    try 
    {
        //EXTRACT user ID from the JWT token inside the http only cookie in the request rom the browser
        const token = req.cookies.jwt
        
        if(!token)  return res.status(401).json({status:'fail', message:'Unauthorized'})

        const decodedToken = jwt.decode(token, process.env.JWT_SECRET)

        console.log(decodedToken)

        const userId = decodedToken.userId; 
        console.log(userId)

        //FIND USER BY ID  - AND POPULATE IT WITH HIS TASKS!!!!
        const user = await User.findById(userId).populate('tasks'); 

        if(!user) return res.status(404).json({status:"fail", message:"User not found"})

        res.status(200).json({status:'success', data:{user}})


    }
    catch(err)
    {
        console.error('Error fetching user data: ', err)
        res.status(500).json({status:'fail', message:err.message})
    }
})