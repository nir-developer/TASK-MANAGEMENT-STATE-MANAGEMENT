const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

const mongoose = require('mongoose');
const User = require('../models/User'); // Import your models
const Task = require('../models/Task'); // Import your models

let DB;

const NODE_ENV= process.env.NODE_ENV; 
if(NODE_ENV === 'development') 

    DB = process.env.DB_COMPASS
if(NODE_ENV === 'production')
     DB = process.env.DB_ATLAS 


if(!DB) throw new Error('NO VALID ENVIRONMENT WAS DEFINED!')

// Connect to MongoDB
//'mongodb://localhost:27017/task-management'
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    try {
        // Delete all documents from the users collection
        await User.deleteMany({});
        console.log('All documents from the users collection have been deleted');

        // Delete all documents from the tasks collection
        await Task.deleteMany({});
        console.log('All documents from the tasks collection have been deleted from db with url: ', DB);

        // Close the MongoDB connection
        mongoose.connection.close();
        console.log('Connection to MongoDB closed');
    } catch (error) {
        console.error('Error deleting documents:', error);
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
