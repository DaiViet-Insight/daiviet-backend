const fs = require('fs');
const { uploadToBlobStorage } = require('../config/blob');
const containerName = process.env.IMAGE_CONTAINER;

async function iuploadFile(req, res) {
    try {
        const file = req.file;
        const filename = "image-" + Date.now() + ".jpg";
        stream = fs.createReadStream(file.path);
        const result = await uploadToBlobStorage(stream, containerName, filename);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}
module.exports = { iuploadFile };