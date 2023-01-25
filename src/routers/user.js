const express = require('express')
const multer  = require('multer')
const sharp = require('sharp')

const auth = require('../middlewares/auth')
const User = require('../models/user')
const {sendWelcomEmail,sendCancelationWEmail} = require('../emails/account')
const router = express.Router()
const upload = multer({ 
limits: {
        fileSize: 1000000
},
 fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
                cb(new Error('Failed to upload file'))
                return
        }
        cb(null,true)
 }
})

router.post('/users',async(req,res)=>{
    const user = new User(req.body)
    try {
       await user.save() 
      const token=await user.generateAuthToken()
      sendWelcomEmail(user.email,user.name);
       res.status(201).send({token,user})
    } catch (error) {
            res.status(400).send(error)     
    }
})

router.get('/users/profile',auth,async(req,res)=>{
    res.send(req.user)
})

router.post('/users/logout',auth,async(req,res)=>{
        try {
          req.user.tokens = req.user.tokens.filter((t)=> t.token!==req.token )
          await req.user.save()  
          res.send()  
        } catch (error) {
          res.status(500).send()
        }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
        try {

                req.user.tokens = []
                await req.user.save()
                res.send()
                
        } catch (error) {
                res.status(500).send()    
        }

})

router.patch('/users/me',auth,async(req,res)=>{
    
    const reqUpdateFields = Object.keys(req.body)
    const updateFields = ['name','email','age','password']

   const isUpdateValid=  reqUpdateFields.every((update)=>{
            return updateFields.includes(update)
    })

    if(!isUpdateValid){
            return res.status(400).send({error: 'Invalid data provided for updates'})
    }
    
    try {
       const user=  req.user
       
       if(!user){
           return res.status(400).send()
        }
        
        reqUpdateFields.forEach((update)=> user[update]= req.body[update])
        const updatedUser= await user.save()
         res.status(201).send(updatedUser)
            
    } catch (error) {
            res.status(400).send(error.message)
            
    }
})

router.delete('/users/me',auth,async(req,res)=>{
  try {
    await req.user.remove()
    sendCancelationWEmail(req.user.email,req.user.name),
    res.send({
            status: 'Sucess',
            deleted: true,
            user: req.user
    })
  } catch (error) {
    res.status(500).send({message:error.message})
  } 
})

router.post('/users/login',async(req,res)=>{
        if(!req.body.email|| !req.body.password){
         return res.status(400).send({error:"Please provide email & password to login"})
        }
       const {email,password} =req.body
     try {
        const user= await User.findByCredentials(email,password)
        const token=await user.generateAuthToken()
        res.send({token,user})
} 
catch (error) {
        res.status(500).send({error:'Unable to login',message: error.message})
       } 
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
      if(!req.file){
      return res.status(400).send({error: 'file not provided'})
      }
      const image= await sharp(req.file.buffer).resize(200,200).png().toBuffer()
       req.user.avatar= image
       console.log(req.user.avatar)
       await req.user.save()
       res.send()

}, (err,req,res,next)=>{
        res.status(400).send({message: err.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
 try {
        const _id =  req.params.id
        const user= await User.findById({_id})

        if(!user || !user.avatar){
                throw new Error('No avatar found')
        }

        res.set('Content-Type','image/png')
        res.send(req.user.avatar)
        
 } catch (error) {

        res.status(400).send({error:error.message})
        
 }
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
     const user =   req.user
     user.avatar = undefined
     await user.save()
     res.send()
})

module.exports = router