
 require('../src/db/mongoose')
 const Task = require('../src/models/task')


 const findCount= async()=>{
  const deletedDoc= await Task.findByIdAndDelete('63c7f86e4b132dc15681fcf6')
   const taskCount= await Task.count()
   console.log(deletedDoc)
   console.log(taskCount)
}

findCount().catch(error=>{
    console.log('error',error.message)
})
//    Task.findByIdAndDelete('63c7f86e4b132dc15681fcf6').then((data)=>{
//     console.log(data)
//     return Task.count()
//  }).then(console.dir).catch(console.dir)

