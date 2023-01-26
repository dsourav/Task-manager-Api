const mongoose = require('mongoose')
const uri = process.env.MONGO_URL

mongoose.set("strictQuery", false);
mongoose.connect(uri)
