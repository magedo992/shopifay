const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


cloudinary.config({
  cloud_name: "duscvark1",
  api_key: process.env.api_key,
  api_secret: process.env.API_secret,
});


const createUploader = (folderName) => {

  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: folderName,        
        format: "png",             
        transformation: [
          { background_removal: "cloudinary_ai" }, 
        ],
      };
    },
  });

  return multer({ storage });
};

const uploadUser = createUploader("user");
const uploadProduct = createUploader("product");

module.exports = { cloudinary, uploadUser, uploadProduct };
