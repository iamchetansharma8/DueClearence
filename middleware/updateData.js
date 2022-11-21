const multer = require('multer');

const reader = require("xlsx");
const Student = require('../models/student.model');
const User=require('../models/users');
const Department=require('../models/department')

const path_to_store = './store/file2.xls'; // CHECK
const DIR  = './store';
const storage = multer.diskStorage({
    destination : (req , file , cb)=>{
        cb(null, DIR);
    } , 
    filename : (req , file , cb)=>{
        const filename = 'file2.xls';
        cb(null , filename);
    }
})

const upload = multer({
    storage : storage , 
    fileFilter : (req , file , cb)=>{
        // console.log(file.mimetype);
        // cb(null , true);
        if(file.mimetype == "application/vnd.ms-excel" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            cb(null , true);
        }
        else{
            cb(null , false);
            return cb(new Error("Only specific type of files are required here ."));
        }
    }
});

// const check = (req , res , next)=>{
//     // console.log(req);
//     next();
// }

const updateData = async (req , res , next)=>{
    const file = reader.readFile(path_to_store);
    console.log(file);

    const data = []

    const sheets = file.SheetNames; 


    for(let i = 0; i<sheets.length ; i++){
        const temp = reader.utils.sheet_to_json(
            file.Sheets[file.SheetNames[i]]
        )
        temp.forEach( async (res)=>{
             await data.push(res); 
        })
    }
    console.log(data);
    
    for(let i = 0; i<data.length ; i++){
       try{
        const doc =await Student.findOneAndUpdate({rollNumber : data[i].rollNumber} , {rollNumber: data[i].rollNumber , due : data[i].due});
        console.log(doc);
        if(doc === null){
           await Student.create(data[i]);
        }
       }
       catch(err){
        console.log(err);
       }
    }
    next();
}

module.exports = {updateData , upload};