const mongoose=require('mongoose')

const DepartmentSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required: true
    },
    superAdmin:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    subAdmins:[{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    }],
    createdAt:{
         type: Date,
         default: Date.now
    }
})

module.exports=mongoose.model('Department', DepartmentSchema);