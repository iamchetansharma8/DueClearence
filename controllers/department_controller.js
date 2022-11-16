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

// get department list for god level admin
module.exports.listGod= async function(req,res){
    try{
        if(!req.user.isGodLevelAdmin){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let list=await Department.find().select({ name: 1, _id: 0 });
        return res.status(200).json({
            message : 'Success',
            list : list
        });
    }catch(error){
        console.log('Error in listing departments',error);
        return res.send('Error in listing departments');
    }
}

// get department list for super admin
module.exports.listSuper= async function(req,res){
    try{
        let list=await User.findById(req.user._id).populate('superAdminRightsOf','name-_id').select({ name: 1, _id: 0 });
        return res.status(200).json({
            message : 'Success',
            list : list
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