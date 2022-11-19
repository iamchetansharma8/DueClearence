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

// department list for god
router.get('/list_god' ,ensureAuth , departmentController.listGod);


// department list of which user has sub-admin access
router.get('/list_sub' ,ensureAuth , departmentController.listSub);

// sub-admin list for a given department
router.get('/list_sub_admins/:name' ,ensureAuth , departmentController.listSubAdmins);


router.post('/create' ,ensureAuth , departmentController.create);
router.post('/change_super_admin' ,ensureAuth , departmentController.changeSuperAdmin);
module.exports=router;