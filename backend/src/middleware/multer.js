import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb)=> {
        cb(null,"./public");
    },
    filename: function (req, file, cb) {
        cb(null,Date.now() + "-" + file.originalname);
    }
})

const upload = multer({ storage })


export default upload;

