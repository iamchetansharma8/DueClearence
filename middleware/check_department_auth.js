const fs = require('fs');
const User=require('../models/users')
const Department=require('../models/department')

const checkDepartmentAndAuth = async function (req , res , next){
    try{
        let dept=req.body.department
        let department=await Department.findOne({name:dept});
        if(!department){
            return res.status(400).json({
                message : 'Department name not found'
            })
        }
        let unauth=true
        if(JSON.stringify(department.superAdmin)==JSON.stringify(req.user.id)){
            unauth=false
        }
        for(i of department.subAdmins){
            if(!unauth)break
            if(JSON.stringify(req.user.id)==JSON.stringify(i)){
                unauth=false
            }
        }
        if(unauth){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        await fs.rename('./store/reserved_name.xlsx' , `./store/${dept}.xlsx` , function(err){
            if(err){
                throw err;
            }
            console.log("file renamed");
            next();
        });
    }catch(error){
        console.log('Error in checking department',error);
        return res.send('Error in checking department');
    }
}

module.exports = checkDepartmentAndAuth;