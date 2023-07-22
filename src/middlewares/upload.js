const multer = require("multer");
const fs = require("fs");

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var path = __basedir + "/uploads/";
    var stat = null;
        try {
            stat = fs.statSync(path);
        } catch (err) {
            fs.mkdirSync(path);
        }
        if (stat && !stat.isDirectory()) {
            throw new Error('Directory cannot be created because an inode of a different type exists at "' + dest + '"');
        }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
var uploadFile = multer({ storage: storage, fileFilter: imageFilter });
module.exports = uploadFile;