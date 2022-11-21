const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber : {type : String , required : true } , 
    due : {type : Boolean} ,
} , 
{
    collection : 'students'
}
);

module.exports = mongoose.model('Student' , studentSchema);


