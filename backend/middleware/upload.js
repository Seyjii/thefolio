const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Log into Cloudinary using your .env keys
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Tell Multer to send files to Cloudinary instead of a local folder
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'thefolio_uploads', // This creates a folder in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({ storage: storage });

module.exports = upload;