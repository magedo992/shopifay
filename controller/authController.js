const User = require('../model/USERModel');
const asyncHandler = require('express-async-handler');
const ErrorHandler=require('../utils/ErrorHandel');
const { sendEmail } = require('../utils/EmailSender');
const { generateToken } = require('../utils/token');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();


const signup = asyncHandler(async (req, res, next) => {
  const { email, name, phone, password } = req.body;
console.log('i take the body');

  const existUser = await User.findOne({ email });
  if (existUser) {
    return next(new ErrorHandler("User already exists", 409));
  }

  const activationCode = generateCode();
  const imageURL=req.file.path;
  const imagePublicId=req.file.filename;

  const user = await User.create({
    name,
    phone,
    password,
    email,
    isActive: false,
    activationCode,
    image:imageURL,
    imagePublicId:imagePublicId
  });


  await sendEmail({
    from: process.env.email,
    to: email,
    subject: "Activate your account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; border-radius: 10px; padding: 20px; border: 1px solid #ddd;">
  <h2 style="color: #333; text-align: center; font-size: 24px;">Welcome, ${name} 🎉</h2>
  
  <p style="color: #555; font-size: 16px; text-align: center;">
    Use the following code to activate your account:
  </p>
  
  <div style="background: #4CAF50; color: white; font-size: 22px; font-weight: bold; text-align: center; padding: 15px; border-radius: 8px; letter-spacing: 3px;">
    ${activationCode}
  </div>
  
  <p style="color: #777; font-size: 14px; margin-top: 20px; text-align: center;">
    If you didn’t request this, please ignore this email.
  </p>
</div>
`
  });

  res.status(201).json({ message: "User created. Please check your email to activate account." });
});


const activateAccount = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.isActive) return res.status(400).json({ message: "Account already activated." });

  if (user.activationCode !== code) {
    return next(new ErrorHandler("Invalid activation code", 409));
  }

  user.isActive = true;
  user.activationCode = undefined;
  await user.save();

  res.status(200).json({ message: "Account activated successfully." });
});


const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  

  const user = await User.findOne({ email });
  
  if (!user) return next(new ErrorHandler("user not found", 404));

  if (!user.isActive) {
    return next(new ErrorHandler("Please activate your account first", 403));
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));

  const token = generateToken(user._id);

  res.status(200).json({ message: "Login successful", token, user });
});


const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const resetCode = generateCode();
  user.resetPasswordToken = resetCode;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 
  await user.save();

  await sendEmail({
    from: process.env.email,
    to: email,
    subject: "Password Reset Code",
    html: `
     <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
  <h2 style="color: #333; text-align: center;">Hello ${user.name}</h2>
  <p style="color: #555; font-size: 15px; text-align: center; line-height: 1.5;">
    Use this code to reset your password. <br>
    <strong style="color: #d9534f;">(Valid for 15 minutes)</strong>
  </p>
  <div style="text-align: center; margin: 20px 0;">
    <h3 style="background: #007bff; color: white; display: inline-block; padding: 12px 25px; border-radius: 8px; letter-spacing: 2px; font-size: 20px;">
      ${resetCode}
    </h3>
  </div>
  <p style="color: #777; font-size: 13px; text-align: center; margin-top: 20px;">
    If you did not request a password reset, please ignore this email.
  </p>
</div>
`
  });

  res.status(200).json({ message: "Password reset code sent to email." });
});


const verifyResetCode = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.resetPasswordToken !== code || Date.now() > user.resetPasswordExpires) {
    return next(new ErrorHandler("Invalid or expired reset code", 400));
  }

  res.status(200).json({ message: "Code verified successfully." });
});


const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.resetPasswordToken !== code || Date.now() > user.resetPasswordExpires) {
    return next(new ErrorHandler("Invalid or expired reset code", 400));
  }

  user.password = newPassword; 
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successfully." });
});

module.exports = {
  signup,
  activateAccount,
  login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
