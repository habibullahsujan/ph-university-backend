/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import fs from 'fs';

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(path, {
      public_id: imageName,
    })
    .catch((error) => {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to upload image.',
      );
    });
    
  fs.unlink(path, (err) => {
    if (err) {
      console.error('Error deleting the file:', err);
      return;
    }
    console.log('File deleted successfully');
  });

  return uploadResult.secure_url;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
