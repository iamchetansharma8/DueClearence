const fs = require('fs');
const check_department = (req , res , next)=>{

    // fetched array from database
    const departments = ['kbh' , 'library' , 'registration'];
    // 
    const dept = req.body.department;
    console.log("check departments" , req.body.department);

    // next();
    console.log(dept);
    
    if(departments.includes(dept)){
        // const new_dept_name = dept + '.xlsx';
         fs.rename('./store/reserved_name.xlsx' , `./store/${dept}.xlsx` , function(err){
            if(err){
                throw err;
            }
            console.log("file renamed");
            next();
        });
        
    }
    else{
       throw new Error("No department with the name registered")
    }
}

module.exports = check_department;