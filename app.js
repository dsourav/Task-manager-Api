const server = require('./src/server')

const port = process.env.process

server.listen(port,()=>{
  console.log('Server is running')
})

