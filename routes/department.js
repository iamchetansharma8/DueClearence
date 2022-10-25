const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const departmentController=require('../controllers/department_controller')
const passport=require('passport')
const bodyParser = require('body-parser').json();

router.post('/create' ,ensureAuth ,bodyParser, departmentController.create);
router.post('/change_super_admin' ,ensureAuth ,bodyParser, departmentController.changeSuperAdmin);
router.post('/add_sub_admin' ,ensureAuth ,bodyParser, departmentController.addSubAdmin);
router.post('/revoke_sub_admin' ,ensureAuth ,bodyParser, departmentController.revokeSubAdminRights);
module.exports=router;