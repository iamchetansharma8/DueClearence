const User=require('../models/users');
const Department=require('../models/department')

module.exports.addSubAdmin = async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
            })
        }
        if(JSON.stringify(department.superAdmin)!=JSON.stringify(req.user.id)){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let newAdmin=await User.findOne({
            email: req.body.newAdminEmail
        })
        if(!newAdmin){
            return res.status(400).json({
                message : 'User whom you want to add admin not found'
            })
        }
        let isSubAdmin=false;
        for(subAdmin of department.subAdmins){
            if(JSON.stringify(subAdmin)==JSON.stringify(newAdmin.id)){
                isSubAdmin=true;
            }
        }
        if(isSubAdmin){
            return res.status(400).json({
                message : 'User whom you want to add is already a sub-admin'
            })
        }
        await department.subAdmins.push(newAdmin._id);
        department.save();
        await newAdmin.subAdminRightsOf.push(department._id)
        newAdmin.save();
        return res.status(200).json({
            message : 'Sub-admin added'
        });
    }catch(error){
        console.log('Error in adding sub admin',error);
        return res.send('Error in adding sub admin');
    }
}

module.exports.revokeSubAdminRights = async function(req,res){
    try{
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
            })
        }
        if(JSON.stringify(department.superAdmin)!=JSON.stringify(req.user.id)){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let oldSubAdmin=await User.findOne({
            email: req.body.oldSubAdminEmail
        })
        if(!oldSubAdmin){
            return res.status(400).json({
                message : 'User whom you want to remove not found'
            })
        }
        let isSubAdmin=false;
        for(subAdmin of department.subAdmins){
            if(JSON.stringify(subAdmin)==JSON.stringify(oldSubAdmin.id)){
                isSubAdmin=true;
            }
        }
        if(!isSubAdmin){
            return res.status(400).json({
                message : 'User whom you want to remove is not sub-admin'
            })
        }
        oldSubAdmin=await User.findByIdAndUpdate(oldSubAdmin,
            {$pull:{subAdminRightsOf:department._id}});

        department=await Department.findByIdAndUpdate(department._id,
                {$pull:{subAdmins:oldSubAdmin._id}});
    
        return res.status(200).json({
            message : 'Sub-admin access revoked'
        });
    }catch(error){
        console.log('Error in removing sub-admin',error);
        return res.send('Error in removing sub-admin');
    }
}

// get department list for super admin
module.exports.listSuper= async function(req,res){
    try{
        let list=await User.findById(req.user._id).populate('superAdminRightsOf','name-_id').select({ name: 1, _id: 0 })
        let newList=[];
        for(let i of list['superAdminRightsOf']){
            let tempList=await Department.findOne({name:i.name}).populate('subAdmins','email-_id').select({ name: 1,subAdmins:1, _id: 0 });
            console.log(tempList)
            newList.push(tempList)
        }
        return res.status(200).json({
            message : 'Success',
            list : newList
        });
    }catch(error){
        console.log('Error in listing departments',error);
        return res.send('Error in listing departments');
    }
}