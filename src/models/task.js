const mongoose = require('mongoose')

const task = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true,

    },
    completed: {
       type : Boolean,
       default: false
    },
    uid:{
        type: mongoose.Schema.Types.ObjectId,
        required :true,
        ref : 'User'
    }
},
{
    timestamps: true
}
)

const Task = mongoose.model('Task',task)

module.exports =Task