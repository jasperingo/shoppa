
const path = require('path');
const multer = require('multer');

module.exports = (photoPath)=> {

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, `./public/photos/${photoPath}`);
    },

    filename(req, file, cb) {
      cb(null, `${photoPath}-${req.params.id}${path.extname(file.originalname)}`);
    }
  });

  return multer({ storage });
}

