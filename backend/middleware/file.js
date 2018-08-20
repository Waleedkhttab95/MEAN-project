const multer = require('multer');


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'

};
const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime Type");
    if(isValid){
      error=null;
    }
   cd(error, 'backend/images');
  },
  filename: (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
const ext= MIME_TYPE_MAP[file.mimetype];
cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

module.exports = multer({storage: storage}).single("image");

