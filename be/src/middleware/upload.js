const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images')) // Using public/images directory
    },
    filename: function (req, file, cb) {
        // Get recipe name from request body and remove spaces
        const recipeName = req.body.name ? req.body.name.replace(/\s+/g, '') : '';
        // Create unique filename using recipe name and timestamp
        const uniqueSuffix = recipeName ? `${recipeName}-${Date.now()}` : Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload; 