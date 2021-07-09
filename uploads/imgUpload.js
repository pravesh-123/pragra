
/**
 * CreatedBy: Mohini solace
 * Createdat:07-07-2021
 * Purpose :to upload single /multiple files 
 */
const path = require('path');
 const multer = require('multer');
 
 const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
         cb(null, 'images');
     },
    
     filename: function (req, file, cb) {
         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
     }
 });
//for multiple upload
let multipleFileUpload = (img1,img2)=>{
   return multer({ storage: storage }).fields([{name: img1}, {name: img2}]);
}
//for single upload
let singleFileUpload = (img) => {
    return multer({ storage : storage}).single(img);
}

//mixed file upload
let mixFileUpload = (img1,vid,img2)=>{
    return multer({storage:storage}).fields([{name: img1}, {name: vid},{name:img2}]);
}


module.exports={multipleFileUpload,singleFileUpload,mixFileUpload};