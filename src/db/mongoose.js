const mongoose = require('mongoose')
const uri = process.env.MONGO_URL
console.log('mongo db url',uri)
mongoose.set("strictQuery", false);
mongoose.connect(uri)
