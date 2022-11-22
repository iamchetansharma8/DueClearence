const User=require('../models/users');
const Department=require('../models/department')

module.exports.create = async function(req,res){
    try{
        if(!req.user.isGodLevelAdmin){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let department=await Department.findOne({
            name : req.body.name
        })
        if(department){
            return res.status(400).json({
                message : 'Department pre-exists'
            })
        }
        let superAdmin=await User.findOne({
            email: req.body.superAdminEmail
        })
        if(!superAdmin){
            return res.status(400).json({
                message : 'User whom you want to add super-admin not found'
            })
        }
        department=await Department.create({
            name: req.body.name,
            creator: req.user._id,
            superAdmin: superAdmin._id
        });
        await superAdmin.superAdminRightsOf.push(department._id)
        superAdmin.save();
        return res.status(200).json({
            message : 'Department created'
        });
    }catch(error){
        console.log('Error in creating new department (create)',error);
        return res.send('Error in creating new department');
    }
}

module.exports.changeSuperAdmin = async function(req,res){
    try{
        if(!req.user.isGodLevelAdmin){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let department=await Department.findOne({
            name : req.body.name
        })
        if(!department){
            return res.status(400).json({
                message : 'Department not found'
            })
        }
        let newSuperAdmin=await User.findOne({
            email: req.body.newSuperAdminEmail
        })
        if(!newSuperAdmin){
            return res.status(400).json({
                message : 'User whom you want to add as new super-admin not found'
            })
        }
        if(JSON.stringify(department.superAdmin)==JSON.stringify(newSuperAdmin.id)){
            return res.status(400).json({
                message : 'User whom you want to make as new super-admin is already super-admin'
            })
        }
        let oldSuperAdmin=await User.findByIdAndUpdate(department.superAdmin,
            {$pull:{superAdminRightsOf:department._id}});
        oldSuperAdmin.save();
        
        department.superAdmin=newSuperAdmin._id;
        department.save();
        await newSuperAdmin.superAdminRightsOf.push(department._id)
        newSuperAdmin.save();
        return res.status(200).json({
            message : 'Super-admin changed'
        });
    }catch(error){
        console.log('Error in changing super admin',error);
        return res.send('Error in changing super admin');
    }
}


// get department list for god level admin
module.exports.listGod= async function(req,res){
    try{
        if(!req.user.isGodLevelAdmin){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let list=await Department.find().populate('superAdmin','email-_id').select({ name: 1,superAdmin:1, _id: 0 });
        console.log(list)
        let newlist=[];
        for(let i of list){
            let obj={"name":i.name,"superAdmin":i.superAdmin}
            if(obj.superAdmin!=null){
                obj.superAdmin=obj.superAdmin.email
            }
            newlist.push(obj)
        }
        console.log(newlist)
        return res.status(200).json({
            message : 'Success',
            list : newlist
        });
    }catch(error){
        console.log('Error in listing departments',error);
        return res.send('Error in listing departments');
    }
}


// get department list for sub admin
module.exports.listSub= async function(req,res){
    try{
        let list=await User.findById(req.user._id).populate('subAdminRightsOf','name-_id').select({ name: 1, _id: 0 });
        return res.status(200).json({
            message : 'Success',
            list : list
        });
    }catch(error){
        console.log('Error in listing departments',error);
        return res.send('Error in listing departments');
    }
}

// get sub-admin list for department
module.exports.listSubAdmins= async function(req,res){
    try{
        console.log(req.params.name);
        let list=await Department.findOne({name : req.params.name}).populate('subAdmins','displayName').select({ name: 1, _id: 0 });
        if(!list){
            return res.status(400).json({
                message : 'Department does not exist'
            })
        }
        return res.status(200).json({
            message : 'Success',
            list : list
        });
    }catch(error){
        console.log('Error in listing departments',error);
        return res.send('Error in listing departments');
    }
}

// delete department
module.exports.deleteDepartment = async function(req,res){
    try{
        if(!req.user.isGodLevelAdmin){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let department=await Department.findOne({name : req.body.name});
        if(!department){
            return res.status(400).json({
                message : 'Department does not exist'
            })
        }
        let super_admin_id=department.superAdmin;
        let super_admin=await User.findByIdAndUpdate(super_admin_id,{$pull:{superAdminRightsOf:department.id}})
        for(let sub_admin_id of department.subAdmins){
            let sub_admin=await User.findByIdAndUpdate(sub_admin_id,{$pull:{subAdminRightsOf:department.id}})
        }
        department.remove();
        return res.status(200).json({
            message : 'Department deleted',
        });
    }catch(error){
        console.log('Error in deleting department',error);
        return res.send('Error in deleting department');
    }
}