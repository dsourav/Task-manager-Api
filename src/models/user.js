const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Task = require('../models/task')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required : true

  },
  age:{
    type: Number,
    validate(value){
        if(value<0){
            throw new Error('value can not be a negative')
        }
        
    },
    default:0

  },
  email:{
    type: String,
    required: true,
    lowercase: true,
    unique:true,
    trim:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is invalid')
        }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 7,
    validate(value){
         if(value.toLowerCase().includes('password')){
            throw new Error('password can not be password')
        }
    }
  },
  avatar: {
    type: Buffer
  },
  tokens:[
    {
      token: {
        type: String ,
        required: true   
      }
    }
  ]
},{
  timestamps: true
})

userSchema.pre('save', async function(next){
  const user = this
  
  if(user.isModified('password')){
    const hashedPassword=await bcrypt.hash(user.password,8)
    user.password = hashedPassword
    
  }
  next()
})

userSchema.pre('remove', async function(next){
  const user = this
  await Task.deleteMany({uid: user._id})
  next()
})

userSchema.methods.toJSON = function(){
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}

userSchema.methods.generateAuthToken = async function(){
  const user = this
  const token= jwt.sign({
   'uid': user._id.toString()
  },
  process.env.JWT_SECRET,
  {
    expiresIn: 1000*60*60 // 1000*60 = 1 minute
  }
  )
  user.tokens= user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials=async (email,password)=>{
  const user= await User.findOne({
    email: email
  })

  if(!user){
    throw new Error('Unable to login')
  }

 const hasMatch= await bcrypt.compare(password,user.password)

 if(!hasMatch){
  throw new Error('Unable to login')
 }
 return user
}

userSchema.virtual('tasks',{
  ref : 'Task',
  localField : '_id',
  foreignField : 'uid'
})

const User=mongoose.model('User', userSchema)

module.exports=User