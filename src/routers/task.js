const express = require('express')
const auth = require('../middlewares/auth')
const router = express.Router()
const Task = require('../models/task')


router.post('/task',auth, async(req,res)=>{
    const passedData = req.body;
    passedData.uid = req.user._id;
    const task = new Task(passedData)

    try {
            await task.save()
            res.status(201).send(task)
    } catch (error) {
      
            res.status(400).send(error)
    }    
})

router.get('/tasks',auth, async(req,res)=>{
      try {
        const match = {}
        const sort = {}
        if(req.query.completed){
         match.completed= req.query.completed === "true"
        }

        if(req.query.sortBy){
          const part = req.query.sortBy.split(':')
          sort[part[0]] = part[1] === 'desc'? -1: 1
        }
   
      await req.user.populate({
        path:'tasks',
        match,
        options: {
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    })
      res.send(req.user.tasks)
 } catch (error) {
      res.status(500).send({message:error.message})
 }
})

router.get('/tasks/:id',auth,async(req,res)=>{
      const _id= req.params.id

      try {
          const task=   await Task.findOne({
            _id,
            uid: req.user._id
          })
          if(!task){
              return res.status(404).send()
          }
     res.send(task)
      } catch (error) {
              res.status(500).send(error)     
      }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    
    try {

        const _id= req.params.id
        const reqUpdatesKeys =Object.keys(req.body)
        const requiredKeys = ['description', 'completed']
        const isValidRequest = reqUpdatesKeys.every((updateKey)=>requiredKeys.includes(updateKey))
        if(!isValidRequest){
            return res.status(400).send({error: 'Please provide valid data'})
        }

        const task= await Task.findOne({_id,uid:req.user._id})
      
        if(!task){
            return res.status(404).send()
        }

        reqUpdatesKeys.forEach((key)=> task[key]= req.body[key])
        const updatedTask= await task.save() 
        if(!updatedTask)
        {
            return res.status(500).send()
        }
        res.send(updatedTask)
    } catch (error) {
            res.status(500).send(error)     
    }

})

router.delete('/tasks/:id',auth,async(req,res)=>{
      const _id= req.params.id

      try {
          const task=   await Task.findOneAndDelete({_id, uid:req.user._id})
          if(!task){
              return res.status(404).send()
          }
     res.send(task)
      } catch (error) {
              res.status(500).send(error)     
      }
})

module.exports = router