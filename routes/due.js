const express= require('express')
const router=express.Router()
const {updateData , upload} = require('../middleware/update_data');
const checkDepartmentAndAuth=require('../middleware/check_department_auth')
const {ensureAuth,ensureGuest}=require('../middleware/auth')
const dueController=require('../controllers/due_controller')
// const dueController=require('../controllers/due_controller')
const passport=require('passport')


router.get('/page_upload_data',ensureAuth,(req,res)=>{
    res.send("<form action='/due/uploadfile' method='POST' enctype='multipart/form-data' method='post'><input type='file' name='studentRecord' accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' ><input type='text' id='department' name='department' placeholder='department'><input type='submit' value='Upload Excel'></form>  ")
})

// Upload excel file and import to mongodb
router.post('/uploadfile',ensureAuth,upload.single('studentRecord'), checkDepartmentAndAuth,updateData);


router.get('/page_show_students',ensureAuth,(req,res)=>{
    res.send("<form action='/due/show_students' method='POST'><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><button type='submit'>Show Students</button></form>")
})

router.post('/show_students',ensureAuth,dueController.listStudents)

router.get('/page_set_due_false',ensureAuth,(req,res)=>{
    res.send("<form action='/due/set_due_false' method='POST'><label for='rollNumber'>rollNumber:</label><br><input type='text' id='rollNumber' name='rollNumber'><br><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><button type='submit'>Set False</button></form>")
})

router.post('/set_due_false',ensureAuth,dueController.setDueFalse)


router.get('/page_set_due_true',ensureAuth,(req,res)=>{
    res.send("<form action='/due/set_due_true' method='POST'><label for='rollNumber'>rollNumber:</label><br><input type='text' id='rollNumber' name='rollNumber'><br><label for='name'>name:</label><br><input type='text' id='name' name='name'><br><button type='submit'>Set True</button></form>")
})

router.get('/page_add_single_student',ensureAuth,(req,res)=>{
    res.send("<form action='/due/add_single_student' method='POST'><label for='rollNumber'>rollNumber:</label><br><input type='text' id='rollNumber' name='rollNumber'><br><label for='department'>department:</label><br><input type='text' id='department' name='department'><br><label for='hasDue'>hasDue:</label><br><input type='text' id='hasDue' name='hasDue'><br><button type='submit'>Add Student</button></form>")
})
router.post('/add_single_student',ensureAuth,dueController.addStudent);

router.post('/set_due_true',ensureAuth,dueController.setDueTrue)


module.exports=router;