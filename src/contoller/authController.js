import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendMailer from "../utils/sendMailer.js";
import generateToken from "../utils/generateToken.js";
export const register = async (req, res) => {
  const { name, email, password, phonenumber, location, usertype } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      status: "error",
      message: "User Already Exists",
    });
  }
  const profilePics =
    req.files && req.files.profilePictures
      ? req.files.profilePictures.map((file) => `/uploads/${file.filename}`)
      : [];

  const newUser = await User.create({
    name,
    email,
    password,
    phonenumber,
    location,
    usertype,
    profilePictures: profilePics,
  });

  const token = generateToken({
    id: newUser._id,
    role: newUser.usertype,
    name: newUser.name,
  });
  newUser.currentToken = token;
  await newUser.save();
  res.status(201).json({
    status: "success",
    message: "User Created Successfully",
    token,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user and include password field
    const user = await User.findOne({ email }).select("+password");
    console.log(user, "user1");

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User does not exist with this email",
        data: { email },
      });
    }

    if (!user.password) {
      return res.status(400).json({
        status: "error",
        message: "User has not set a password yet. Please reset your password.",
        data: { email },
      });
    }

    // check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
        data: { email },
      });
    }

    // ✅ generate token with id + usertype
    const token = generateToken({
      id: user._id,
      role: user.usertype,
      name: user.name,
    });

    // ✅ save token in DB (invalidate old one)
    user.currentToken = token;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        name: user.name,
        email: user.email,
        role: user.usertype,
        token,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      console.log(user);
      return res.status(400).json({
        status: "error",
        message: "User does not exist with this email.Please Register!",
        data: {
          email: email,
        },
      });
    }

    // token generate
    const token = crypto.randomBytes(6).toString("hex");
    user.verifyToken = token;
    user.verifyTokenExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // send email
    await sendMailer(
      email,
      "Your Verification Code",
      `<p>Your code is: <b>${token}</b></p>`
    );
    res.json({ message: "Verification code sent to email" });
  } catch (err) {
    console.log(err);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, token } = req.body;
    console.log(req.body, "n");

    const user = await User.findOne({
      email,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });
    console.log(user, "us");

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    res.json({ message: "Token verified. You can now set your password." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const setPassword = async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const user = await User.findOne({
      email,
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = password;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password set successfully. You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/authController.js
export const getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -verifyToken -verifyTokenExpiry -currentToken"
    );

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.json({ status: "success", data: user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phonenumber, location, usertype } = req.body;

    const user = await User.findById(id).select("+password");
    if (!user)
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.phonenumber = phonenumber || user.phonenumber;
    user.location = location || user.location;
    user.usertype = usertype || user.usertype;

    if (password) user.password = password; // hashed via pre-save middleware

    await user.save();
    res.json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
