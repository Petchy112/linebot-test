const multer = require('multer');
const mkdirp = require('mkdirp');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req,file);

        const dest = './uploads/'
        mkdirp.sync(dest)
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        console.log(req,file);
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    },
})

const upload = multer({ storage: storage })

module.exports = upload