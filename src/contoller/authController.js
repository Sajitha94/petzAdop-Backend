import User from "../model/User.js";
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

export const login = async (req, res) => {};
