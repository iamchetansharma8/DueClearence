const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const departmentController=require('../controllers/department_controller')
const passport=require('passport')


router.get('/create_page',ensureAuth,(req,res)=>{
    res.send("<form action='/department/create' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='superAdminEmail'>superAdminEmail:</label><br><input type='email' id='superAdminEmail' name='superAdminEmail'><button type='submit'>Create</button></form>")
})

router.get('/page_change_super_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/department/change_super_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='newSuperAdminEmail'>newSuperAdminEmail:</label><br><input type='email' id='newSuperAdminEmail' name='newSuperAdminEmail'><button type='submit'>Change Super Admin</button></form>")
})

router.get('/page_add_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/department/add_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='newAdminEmail'>newAdminEmail:</label><br><input type='email' id='newAdminEmail' name='newAdminEmail'><button type='submit'>Add</button></form>")
})

router.get('/page_revoke_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/department/revoke_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='oldSubAdminEmail'>oldSubAdminEmail:</label><br><input type='email' id='oldSubAdminEmail' name='oldSubAdminEmail'><button type='submit'>Revoke</button></form>")
})

// department list for god
router.get('/list_god' ,ensureAuth , departmentController.listGod);

// department list of which user has super-admin access
router.get('/list_super' ,ensureAuth , departmentController.listSuper);

// department list of which user has sub-admin access
router.get('/list_sub' ,ensureAuth , departmentController.listSub);

// sub-admin list for a given department
router.get('/list_sub_admins/:name' ,ensureAuth , departmentController.listSubAdmins);


router.post('/create' ,ensureAuth , departmentController.create);
router.post('/change_super_admin' ,ensureAuth , departmentController.changeSuperAdmin);
router.post('/add_sub_admin' ,ensureAuth , departmentController.addSubAdmin);
router.post('/revoke_sub_admin' ,ensureAuth , departmentController.revokeSubAdminRights);
module.exports=router;