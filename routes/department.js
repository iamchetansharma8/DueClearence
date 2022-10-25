const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const departmentController=require('../controllers/department_controller')
const passport=require('passport')


router.get('/create_page',ensureAuth,(req,res)=>{
    res.send("<form action='/department/create' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='superAdminEmail'>superAdminEmail:</label><br><input type='email' id='superAdminEmail' name='superAdminEmail'><button type='submit'>Create</button></form>")
})
router.get('/page_add_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/department/add_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='newAdminEmail'>newAdminEmail:</label><br><input type='email' id='newAdminEmail' name='newAdminEmail'><button type='submit'>Add</button></form>")
})

router.get('/page_revoke_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/department/revoke_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='oldSubAdminEmail'>oldSubAdminEmail:</label><br><input type='email' id='oldSubAdminEmail' name='oldSubAdminEmail'><button type='submit'>Revoke</button></form>")
})

router.post('/create' ,ensureAuth , departmentController.create);
router.post('/change_super_admin' ,ensureAuth , departmentController.changeSuperAdmin);
router.post('/add_sub_admin' ,ensureAuth , departmentController.addSubAdmin);
router.post('/revoke_sub_admin' ,ensureAuth , departmentController.revokeSubAdminRights);
module.exports=router;