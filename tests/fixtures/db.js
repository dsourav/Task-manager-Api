const request = require('supertest')
const mongoose =  require('mongoose')
const jwt =  require('jsonwebtoken')

const User = require('../../src/models/user')

const userId = new mongoose.Types.ObjectId()
const newUser = {
    _id: userId,
    name: "das",
    email: "das7@gmail.com",
    password: "12345678",
    tokens: [
     {   
        token: jwt.sign({uid: userId},process.env.JWT_SECRET),
     }
    ]
}


async function setupDB(){
   await User.deleteMany()
   await new User(newUser).save()
}

module.exports = {
    userId,
    newUser,
    setupDB
}