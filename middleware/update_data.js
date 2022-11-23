const multer = require('multer');

const reader = require("xlsx");

const User=require('../models/users');
const Department=require('../models/department')
const Due=require('../models/due')
const DIR  = './store';
const storage = multer.diskStorage({
    destination : (req , file , cb)=>{
        cb(null, DIR);
    } , 
    filename : (req , file , cb)=>{
        const filename = 'reserved_name.xlsx';
        cb(null , filename);
    }
})

const upload = multer({
    storage : storage , 
    fileFilter : (req , file , cb)=>{
        // console.log(file.mimetype);
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

const updateData = async function(req , res , next){
    try{
        const file = reader.readFile(`./store/${req.body.department}.xlsx`);
        console.log("moving");
        let data = []
        let sheets = file.SheetNames; 
        for(let i = 0; i<sheets.length ; i++){
            const temp = reader.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]]
            )
            temp.forEach( async (res)=>{
                await data.push(res); 
            })
        }
        let department=await Department.findOne({name:req.body.department});
        console.log(department._id)
        let arr=[]
        for(rollNumber of data){
            let key = Object.keys(rollNumber)[0];
            obj={"rollNumber":rollNumber[key],department:department._id}
            arr.push(obj)
            console.log(rollNumber[key])
        }
        console.log(arr)
        await Due.deleteMany({department:department._id})
        let due=await Due.insertMany(arr);
        return res.status(200).json({
            message : 'file uploaded'
        });
    }catch(error){
        console.log('Error in uploading to db',error);
        return res.send('Error in uploading to db');
    }
}

module.exports = {updateData , upload};