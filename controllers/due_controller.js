const User=require('../models/users');
const Department=require('../models/department')
const Due=require('../models/due');


module.exports.listStudents=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.params.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
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
        let due=await Due.find({department:department._id})
        let list=[]
        for(i of due){
            let obj={"Roll Number":i['rollNumber'],"hasDue":i['hasDue'],"Amount":i["amount"]}
            list.push(obj)
        }
        return res.status(200).json({
            message : 'Success',
            list : list,
            department:department.name
        });
    }catch(error){
        console.log('Error in listing students',error);
        return res.send('Error in listing students');
    }
}

module.exports.setDueFalse=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
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
        let due=await Due.findOne({"department":department._id,"rollNumber":req.body.rollNumber});
        if(!due){
            return res.status(400).json({
                message : 'Record not found'
            })
        }
        if(due.hasDue==false){
            return res.status(400).json({
                message : 'Due was already set to false'
            })
        }
        due.hasDue=false;
        due.amount=0;
        await due.save();
        console.log(due)
        return res.status(200).json({
            message : 'Success'
            
        });
    }catch(error){
        console.log('Error in setting due to false',error);
        return res.send('Error in setting due to false');
    }
}


module.exports.setDueAmount=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
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
        let due=await Due.findOne({"department":department._id,"rollNumber":req.body.rollNumber});
        if(!due){
            return res.status(400).json({
                message : 'Record not found'
            })
        }
        if(!req.body.amount){
            return res.status(400).json({
                message : 'Due amount must be supplied'
            })
        }
        due.amount= req.body.amount
        due.hasDue=true;
        await due.save();
        return res.status(200).json({
            message : 'Success'
        });
    }catch(error){
        console.log('Error in setting due to true',error);
        return res.send('Error in setting due to true');
    }
}

module.exports.addStudent=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.department
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
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
        let checkDue=await Due.findOne({rollNumber:req.body.rollNumber, 
            department:department._id});

        if(checkDue){
            return res.status(401).json({
                message : 'Record pre-exists'
            })
        }
        let has_due=req.body.hasDue;
        if(has_due==""){
            has_due=true
        }
        let amount;
        if(has_due==="true"){
            if(req.body.amount<=0){
                return res.status(401).json({
                    message : 'Due amount must be entered and should be greater than 0'
                })
            }
            amount=req.body.amount
        }else{
            amount=0;
        }
        let due=await Due.create({rollNumber:req.body.rollNumber, 
            department:department._id, hasDue:has_due, amount:amount});
        return res.status(200).json({
            message : 'Success'
        });
    }catch(error){
        console.log('Error in listing students',error);
        return res.send('Error in listing students');
    }
}

module.exports.removeSingleStudent=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.department
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
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
        let checkDue=await Due.findOne({rollNumber:req.body.rollNumber, 
            department:department._id});

        if(!checkDue){
            return res.status(401).json({
                message : 'Record does not exist'
            })
        }
        await Due.deleteOne({rollNumber:req.body.rollNumber, 
            department:department._id});
        return res.status(200).json({
            message : 'Success'
        });
    }catch(error){
        console.log('Error in listing students',error);
        return res.send('Error in listing students');
    }
}