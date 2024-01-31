const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

router.post('/image',upload.single('stream'),fileController.iuploadFile);

module.exports = router;