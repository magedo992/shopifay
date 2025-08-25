const express = require("express");
const router = express.Router();

const {
  signup,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
} = require("../controller/authController");
const {uploadUser}=require('../middelware/uploadImage');


router.post("/signup",uploadUser.single('UserProfile'), signup);

router.post("/activate", activateAccount);

router.post("/login", login);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

module.exports = router;
