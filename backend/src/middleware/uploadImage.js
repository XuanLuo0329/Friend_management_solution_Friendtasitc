import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Ensure the directory is created if it does not exist
        }
        cb(null, uploadPath); // Store the image in the uploads folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname.match(/\..*$/)[0];
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Create a multer instance and specify we are only handling a single file.
const upload = multer({ storage: storage });

export { upload };
