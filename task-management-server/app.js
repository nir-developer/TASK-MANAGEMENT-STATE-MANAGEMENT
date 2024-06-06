const userRouter = require('./routes/userRoutes')


// const userRouter = require('./routes/userRoutes')
const express = require('express')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const cors = require('cors')

const app = express()

app.use(morgan('dev'))

//PARSERS
app.use(bodyParser.json())
app.use(cookieParser()); 

//CORS - CONFIGURE WITH CREDENTIALS - TELL THE BROWSER TO SEND ALSO HTTP ONLY COOKIES EVEN IF ON DIFFERENT ORIGIN
app.use(cors({
    origin:'http://localhost:1234',
    credentials:true
}))

app.use(cookieParser())


app.use('/api/v1/users', userRouter)


//M.W TO PARSE JSON BODIES IN REQUESTS

//COOKIE PARSER??? WITHOUT??


//M.W TO SETUP HTTP-ONLY COOKIE


///MOUNTING ROUTES 



module.exports =app;

///////////////////////
////PREVIOSE CODE BEFORE REFACTORING TO MVC! 
// const express = require('express')

// const  mongoose = require('mongoose')

// //BCRYPTJS - JONAS
// const bcrypt = require('bcryptjs')

// //CHATGPT - BCRYPT - DEPRECATED BUT STILL..
// //const bcrypt = require('bcrypt')

// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// const morgan = require('morgan');


// const app = express(); 

// const userSchema = new mongoose.Schema({
//     name:{
//         type:String, 
//         required:[true, 'Name Confirm is required']
//     },
//     email:{
//         type:String,
//         unique:true,
//         required:[true, 'Email Confirm is required']
//     },
//     password:{
//         type:String, 
//         required:[true, 'Password is required'], 
//         minLength:4
//     },
//     passwordConfirm:{
//         type:String, 
//         required:[true, 'Password Confirm is required'], 
//         validator:[]
//     }, 
//     photo:String,
// })

// const User = mongoose.model('User', userSchema)

// //M.W TO PARSE JSON BODIES IN REQUESTS
// app.use(bodyParser.json())

// //COOKIE PARSER??? WITHOUT??

// app.use(morgan('dev'))

// //M.W TO SETUP HTTP-ONLY COOKIE
// app.use((req,res,next) =>{
//     res.set('Access-Control-Allow-Credentials', 'true')
//     res.set('Access-Control-Allow-Origin', 'http://localhost:1234'),
//     res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'),
//      res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')

//     next();
// })


// //SINGUP END POINT
// app.post('/signup', async(req,res)=>{
//     const {name, email, password, passwordConfirm, photo} = req.body; 
   

//     try 
//     {
//         //CHECK IF USER ALREADY EXISTS IN DB
//         const existingUser = await User.findOne({email})

//         if(existingUser) return res.status(400).json({error:'Email already exists'})

        
//         //HASHED PASSWORD
//         const hashedPassword = await bcrypt.hash(password, 10); 


//         //CREATE NEW USER
//         const newUser =  await  User.create({name,email,password:hashedPassword,passwordConfirm, photo})


//         console.log('SUCCESS CREATING USER!')
//         console.log(newUser) 



//         //CREATE THE JWT TOKEN
//         const token = jwt.sign({email}, 'superduper100', {expiresIn:'1h'})
        
//         //SET HTTP-ONLY COOKIE WITH THE JWT TOKEN 
//         res.cookie('token', token, { httpOnly:true})
       
//        // res.status(201).json({message:'User created successfully'})
//        res.status(201).json({
//             token,
//             status:'success', 
//             data:{
//                 user:newUser
//             }
//        })

//     }
//     catch(err)
//     {
//         console.error(err)
//         //res.status(500).json({error:'Internal Server Error'})
//         res.status(500).json({
//             status:'fail', 
//             message:err.message
//         })

//     }

// })



// //LOGIN END POINT  - TEST WITH POSTMAN - OK - THE COOKIE IS SENT BACK!!
// app.post('/login', async (req,res) =>{
//     const {email, password} = req.body ; 

//     console.log(email, password)
//     try 
//     {

//         //FIND USER
//         const user = await User.findOne({email})

//         //CHECK IF USER EXISTS AND PASSWORD IS CORRECT
//         if(!user || !(await bcrypt.compare(password, user.password)))
//         {
//             return res.status(401).json({error:'Invalid username or password'})

//         }

//         //GENERATE JWT TOKEN 
//         const token = jwt.sign({email}, 'superduper100', {expiresIn:'1h'})

//         //SET HTTP-ONLY COOKIE WITH THE JWT TOKEN 
//         res.cookie('token', token, { httpOnly:true})

//        // res.status(200).json({message:'Login Successful'})
//         res.status(201).json({
//             token,
//             status:'success', 
//             data:{
//                 user
//             }
//        })


//     }
//     catch(err)
//     {
//         console.error(err)
//         res.status(500).json({error:'Internal server error'})


//     }

// })

// //LOGOUT END POINT
// app.post("/logout", (req,res) =>{
//     //CLEAR HTTP-ONLY COOKIE
//     try
//     {
//         res.clearCookie('token')
//         res.status(200).json({message:'Logout Successful'})

//     }
//     catch(err)
//     {
//         res.status(500).json({status:'fail', message:'Server:Could not Logout'})
//     }
// })




// module.exports =app;
