import multer from 'multer';
export const fileValidation ={
    image:['image/jpeg','image/png','image/svg+xml'],
    file:['application/pdf'],
    imgAndPdf:['image/jpeg','image/png','image/svg+xml','application/pdf'],
}
function fileUpload(customValidation = []){

    const storage = multer.diskStorage({});

    function fileFilter(req,file,cb){
        console.log(file);
        if(customValidation.includes(file.mimetype)){
            cb(null,true);
        }else{
            cb("invalid format",false);
        }
    }
    const upload = multer({fileFilter,storage});

    return upload;
}

export default fileUpload;
