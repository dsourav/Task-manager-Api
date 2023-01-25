const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next)=>{
 try {
    const token = req.header('Authorization').replace('Bearer ','')
    // if(!token){
    //    return res.status(401).send({error: 'Invalid token provided'})
    // }
//   console.log(token)
  const decoded = jwt.verify(token,'ssshhhhh____')
  console.log(decoded)
  const user = await User.findOne({
    _id: decoded.uid,
    'tokens.token' : token
  })

  if(!user) {
    throw new Error()
  }
  
   req.user = user
   req.token = token

   next()

 } catch (error) {

    res.status(401).send({error: 'Unauthorized User'})
 }
}
module.exports=auth
