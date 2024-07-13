const imageUpload = require("../multer.config");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sharp = require("sharp");
const fs = require("fs");


exports.signup = async (req, res) => {
  try {
    let existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    let imagePath;
    if (req.file) {
      const { path: tempPath, filename } = req.file;
      const resizedImagePath = `uploads/resized-${filename}`;
      await sharp(tempPath)
        .resize({ width: 300, height: 300 })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(resizedImagePath);

      fs.unlink(tempPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting temp image:", err);
        }
      });

      imagePath = resizedImagePath;
    }

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: "user",
      image:
        imagePath ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WQTIyI3gDR7pusOaPAIGJKzMZ9aUxcfsJQ&s",
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });

    let isCorrectPassword = false;
    if (user) {
      isCorrectPassword = await bcrypt.compare(password, user.password);
    }
    if (!user || !isCorrectPassword) {
      return res
        .status(404)
        .json({ message: "Email or password incorrect", success: false });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });

    // Remove password from the response
    delete user._doc.password;

    res.status(200).json({ data: user, token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server Error", success: false });
  }
};
exports.checkOn = async (req,res)=>{
    const user = req.user
  res.status(200).json({data:"on"})
}