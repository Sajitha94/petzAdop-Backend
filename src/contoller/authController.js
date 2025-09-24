import User from "../model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import sendMailer from "../utils/sendMailer.js";
import generateToken from "../utils/generateToken.js";
export const register = async (req, res) => {
  console.log(req.body);
  const { name, email, password, phonenumber, location, usertype } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({
      status: "error",
      message: "User Already Exists",
    });
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phonenumber,
    location,
    usertype,
  });

  const token = generateToken({ id: newUser._id, role: newUser.usertype });
  res.status(201).json({
    status: "success",
    message: "User Created Successfully",
    token,
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

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

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid password",
        data: { email },
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_AUTH_SECRET_KEY, {
      expiresIn: "2d",
    });

    res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      data: {
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
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
