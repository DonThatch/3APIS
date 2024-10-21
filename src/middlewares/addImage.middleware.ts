import multer from 'multer';
import path from "node:path";

const storage = multer({
    dest: "stationImages/",
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname) {
            cb(null, true);
        }else{
            cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
        }
    }
});

export const addImage = storage.single("image");
