const authController = require('../controllers/authController')
const userController =require('../controllers/userController')
const express = require('express')

const router = express.Router();


//AUTHENTICATION ROUTES
router.post('/signup',authController.signup )
router.post('/login', authController.login)



//ADMIN ROUTES 
router.route('/').get(userController.getAllUsers)

module.exports = router;