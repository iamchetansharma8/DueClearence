const express= require('express')
const router=express.Router()
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const departmentController=require('../controllers/department_controller')

router.get('/create', ensureAuth , departmentController.create);

module.exports=router;