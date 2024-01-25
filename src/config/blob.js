const { BlobServiceClient } = require('@azure/storage-blob');

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);


async function uploadToBlobStorage(stream,containerName, fileName) {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.uploadStream(stream);
    const url = blockBlobClient.url;
    return {imageUrl:url};
}
module.exports = { uploadToBlobStorage };