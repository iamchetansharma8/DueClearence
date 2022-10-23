const mongoose=require('mongoose')

const DueSchema= new mongoose.Schema({
    department:{
        type:mongoose.Schema.ObjectId,
        ref:'Department',
        required: true
    },
    userConcerned:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    hasDue:{
        type:Boolean,
        required: true
    },
    createdAt:{
         type: Date,
         default: Date.now
    }
})

module.exports=mongoose.model('Due', DueSchema);