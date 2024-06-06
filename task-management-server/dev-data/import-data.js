const dotenv = require('dotenv')
dotenv.config({path:'./config.env'})

console.log(process.env.NODE_ENV)

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Import the User model
const Task = require('../models/Task'); // Import the Task model

let DB;

const NODE_ENV= process.env.NODE_ENV; 
if(NODE_ENV === 'development') 
    DB = process.env.DB_COMPASS
if(NODE_ENV === 'production')
     DB = process.env.DB_ATLAS 


if(!DB) throw new Error('NO VALID ENVIRONMENT WAS DEFINED!')

// Connect to MongoDB
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');

    async function addSampleData() {
        try {
            // Hash the passwords
            const saltRounds = 10;
            const hashedPassword1 = await bcrypt.hash('password123', saltRounds);
            const hashedPassword2 = await bcrypt.hash('password123', saltRounds);

            // Create users
            const user1 = new User({
                name: 'Alice',
                password: hashedPassword1,
                email:'alice@gmail.com',
                passwordConfirm: hashedPassword1,
                role: 'user',
                photo: 'alice.jpg'
            });

            const user2 = new User({
                name: 'Bob',
                email:'bob@gmail.com',
                password: hashedPassword2,
                passwordConfirm: hashedPassword2,
                role: 'admin',
                photo: 'bob.jpg'
            });

            // Save users to the database
            await user1.save();
            await user2.save();

            // Create tasks for user1
            const task1 = new Task({
                title: 'Task 1',
                description: 'Description for Task 1',
                isCompleted: false,
                user: user1._id
            });

            const task2 = new Task({
                title: 'Task 2',
                description: 'Description for Task 2',
                isCompleted: false,
                user: user1._id
            });

            // Create tasks for user2
            const task3 = new Task({
                title: 'Task 3',
                description: 'Description for Task 3',
                isCompleted: false,
                user: user2._id
            });

            const task4 = new Task({
                title: 'Task 4',
                description: 'Description for Task 4',
                isCompleted: true,
                user: user2._id
            });

            // Save tasks to the database
            await task1.save();
            await task2.save();
            await task3.save();
            await task4.save();

            console.log('Sample data added successfully into to db with url:', DB);
            mongoose.connection.close();
        } catch (error) {
            console.error('Error adding sample data to db with URL', error);
            mongoose.connection.close();
        }
    }

    addSampleData();

}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
