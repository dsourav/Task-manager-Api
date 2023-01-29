const request = require('supertest')

const User = require('../src/models/user')
const server = require('../src/server')
const {userId, newUser, setupDB} =  require('./fixtures/db')


beforeEach(async()=>{
   await setupDB()
})

test('Should sign up a new user',async()=>{
    await request(server).post('/users').send({
        name: "Dev Srv",
        email: "dev@gmail.com",
        password: "12345678"
    }).expect(201)
})

test('Should login a user',async()=>{
   const dbUser= await request(server).post('/users/login').send({
      email:  newUser.email,
      password: newUser.password

    }).expect(200)
})

test('Should not login non existence user', async()=>{
    await request(server).post('/users/login').send({
        email: newUser.email,
        password: '12730678'
    }).expect(400|500)
})

test('should get own profile while authticated',async()=>{
    const token = newUser.tokens[0].token.toString()
    await request(server).get('/users/profile').
    set('Authorization', `Bearer ${token}`).
    send().expect(200)
})

test('should deleted authenticated user',async()=>{
    const token = newUser.tokens[0].token
    await request(server).delete('/users/me').set('Authorization', `Bearer ${token}`).send().expect(200)
})

test('should not delet unauthenticated user',async()=>{
    await request(server).delete('/users/me').send().expect(401)
})

test('Authenticated user should upload profile image',async()=>{
    await  request(server).post('/users/me/avatar').set('Authorization',`Bearer ${newUser.tokens[0].token}`).attach('avatar','tests/fixtures/profile-pic.jpg').expect(200)

    const user = await User.findById({_id: userId});
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user field', async()=>{
    await request(server).patch('/users/me') .set('Authorization', `Bearer ${newUser.tokens[0].token}`).send({
        name: 'Updated dev srv'
    }).expect(201)

    const user = await User.findById({_id: newUser._id})

    expect(user.name).toEqual('Updated dev srv')
})