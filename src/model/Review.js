// models/Review.js
import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adopter: {
      type: Schema.Types.ObjectId,
      ref: "AdopPets",
    },
   
    requestType: {
      type: String,
      enum: ["adoption", "foster"],
      required: true,
    },
    comment: {
      type: String,
    },
    rating: {
      type: Number, // 1–5 scale
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
