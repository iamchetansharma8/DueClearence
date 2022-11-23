const mongoose=require('mongoose')

const DueSchema= new mongoose.Schema({
    rollNumber:{
        type : Number,
        required : true
    },
    department:{
        type : mongoose.Schema.ObjectId,
        ref:'Department',
        required: true
    },
    hasDue:{
        type : Boolean,
        default : true,
    },
    createdAt:{
         type: Date,
         default: Date.now
    }
})

module.exports=mongoose.model('Due', DueSchema);