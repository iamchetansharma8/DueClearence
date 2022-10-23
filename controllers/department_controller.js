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
        let oldSuperAdmin=await User.findByIdAndUpdate(department.superAdmin,
            {$pull:{superAdminRightsOf:department._id}});
        department.superAdmin=newSuperAdmin._id;
        department.save();
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
        if(department.superAdmin!=req.user._id){
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
        if(department.superAdmin!=req.user._id){
            return res.status(401).json({
                message : 'Unauthorised access'
            })
        }
        let oldSubAdmin=User.findOne({
            email: req.body.oldSubAdminEmail
        })
        if(!oldSubAdmin){
            return res.status(400).json({
                message : 'User whom you want to remove not found'
            })
        }
        let isSubAdmin=false;
        for(subAdmin in department.subAdmins){
            if(subAdmin==oldSubAdmin._id){
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