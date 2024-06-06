const User = require('../models/User')

exports.getAllUsers =async (req,res)=> {
    try 
    {
        const users = await User.find(); 

        console.log('FOUND ALL USERS!')
        console.log(users)

        res.status(200).json({
            status:'success', 
            results: users.length, 
            data:{
                users
            }
        })

    }
    catch(err)
    {

        res.status(500).json({status:'fail', message: err.message})
    }
}