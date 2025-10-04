import { model, Schema } from "mongoose";
import bcrypt, { genSalt } from "bcryptjs";
import crypto from "crypto";
const userSchema = Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: 3,
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Email ID is required for registration"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    phonenumber: {
      type: String,
      required: [true, "Phone Number required for registration"],
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    usertype: {
      type: String,
      enum: ["adopter", "shelter", "foster organization"],
      default: "adopter",
    },
    currentToken: {
      type: String,
      default: null,
    },
    profilePictures: {
      type: [String], // store multiple image URLs
      default: [],
    },
    favorites: [{ type: Schema.Types.ObjectId, ref: "AdopPets" }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verifyToken: { type: String },
    verifyTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // ✅ add await
  }
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export default User;
