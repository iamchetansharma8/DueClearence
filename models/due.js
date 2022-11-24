const mongoose=require('mongoose')

const DueSchema= new mongoose.Schema({
    rollNumber:{
        type : String,
        maxLength : 15,
        required : true,
        index : true
    },
    department:{
        type : mongoose.Schema.ObjectId,
        ref:'Department',
        required: true,
        index : true
    },
    hasDue:{
        type : Boolean,
        min : 0,
        default : true,
    },
    amount:{
        type : Number,
        required : true
    },
    createdAt:{
         type: Date,
         default: Date.now
    }
})

DueSchema.index({rollNumber: 1, department: 1}, {unique: true});

module.exports=mongoose.model('Due', DueSchema);