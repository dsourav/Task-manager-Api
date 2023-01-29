const request = require('supertest')

const User = require('../src/models/user')
const server = require('../src/server')
const Task =  require('../src/models/task')
const {userId, newUser, setupDB} =  require('./fixtures/db')

beforeEach(async()=>{
    await setupDB()
 })

 const dummyTask = {
    description : "This is a dummy task description", 
 }

 test('Should create new task by user',async()=>{
   await  request(server).post('/task') .
    set('Authorization', `Bearer ${newUser.tokens[0].token}`).
    send(dummyTask).expect(201)

 })