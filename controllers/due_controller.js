const User=require('../models/users');
const Department=require('../models/department')
const Due=require('../models/due')

module.exports.listStudents=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(200).json({
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
            return res.status(200).json({
                message : 'Unauthorised access'
            })
        }
        let due=await Due.find({department:department._id})
        let list=[]
        for(i of due){
            let obj={"Roll Number":i['rollNumber'],"hasDue":i['hasDue']}
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
            return res.status(200).json({
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
            return res.status(200).json({
                message : 'Unauthorised access'
            })
        }
        let due=await Due.findOne({"department":department._id,"rollNumber":req.body.rollNumber});
        if(!due){
            return res.status(200).json({
                message : 'Record not found'
            })
        }
        if(due.hasDue==false){
            return res.status(200).json({
                message : 'Due was already set to false'
            })
        }
        due.hasDue=false;
        due.save();
        console.log(due)
        return res.status(200).json({
            message : 'Success'
            
        });
    }catch(error){
        console.log('Error in setting due to false',error);
        return res.send('Error in setting due to false');
    }
}


module.exports.setDueTrue=async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(200).json({
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
            return res.status(200).json({
                message : 'Unauthorised access'
            })
        }
        let due=await Due.findOne({"department":department._id,"rollNumber":req.body.rollNumber});
        if(!due){
            return res.status(200).json({
                message : 'Record not found'
            })
        }
        if(due.hasDue==true){
            return res.status(200).json({
                message : 'Due was already set to true'
            })
        }
        due.hasDue=true;
        due.save();
        console.log(due)
        return res.status(200).json({
            message : 'Success'
            
        });
    }catch(error){
        console.log('Error in setting due to true',error);
        return res.send('Error in setting due to true');
    }
}