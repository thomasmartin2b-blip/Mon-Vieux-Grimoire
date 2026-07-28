const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single('image');

const optimizeImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const name = req.file.originalname.split(' ').join('_').split('.')[0];
  const filename = `${name}${Date.now()}.webp`;
  const filepath = path.join('images', filename);

  sharp(req.file.buffer)
    .resize(500)
    .webp({ quality: 80 })
    .toFile(filepath)
    .then(() => {
      req.file.filename = filename;
      next();
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

module.exports = { upload, optimizeImage };