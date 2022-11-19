const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const superadminController=require('../controllers/superadmin_controller')
const passport=require('passport')


router.get('/page_add_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/superadmin/add_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='newAdminEmail'>newAdminEmail:</label><br><input type='email' id='newAdminEmail' name='newAdminEmail'><button type='submit'>Add</button></form>")
})

router.get('/page_revoke_sub_admin',ensureAuth,(req,res)=>{
    res.send("<form action='/superadmin/revoke_sub_admin' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><label for='oldSubAdminEmail'>oldSubAdminEmail:</label><br><input type='email' id='oldSubAdminEmail' name='oldSubAdminEmail'><button type='submit'>Revoke</button></form>")
})
router.post('/add_sub_admin' ,ensureAuth , superadminController.addSubAdmin);
router.post('/revoke_sub_admin' ,ensureAuth , superadminController.revokeSubAdminRights);

// department list of which user has super-admin access
router.get('/list_super' ,ensureAuth , superadminController.listSuper);

module.exports=router;