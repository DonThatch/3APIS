import multer from 'multer';
import * as path from "node:path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../stationImages'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
export const upload = multer({ storage: storage }).single('image');
