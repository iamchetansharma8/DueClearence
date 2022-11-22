const express = require('express');

const router  = express.Router();
const {updateData , upload} = require('../middleware/updateData');
const check_department = require('../middleware/check_department');
// Route to upload file on the cloud 
router.post('/student-upload',upload.single('studentRecord'),
check_department , 
updateData 
,async (req , res , next)=>{
    const url = req.protocol  + '://' + req.get('host');
    console.log(url);
    // return ;
    // const student = new Student({
    //     rollNumber : '195111' , 
    //     due : false 
    // })

    // try{
    //      await student.save();
    // }
    // catch(err){
    //     console.log(err);
    //     res.status(500).json({
    //         err
    //     })
    // }

})


// Route to fetch file2.xls and updateData on cloud
router.get('/update-data' , updateData , (req , res , next)=>{
     console.log('job done');
     res.send('done');
});


// route to retrieve student data
router.get("/" , (req , res , next)=>{
    Student.find().then(data =>{
        res.status(200).json({
            message: "user list recieved successfully" , 
            students :  data
        })
    })
});

module.exports = router;
