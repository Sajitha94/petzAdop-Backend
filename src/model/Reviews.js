// models/Review.js
import { model, Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pet: {
      type: Schema.Types.ObjectId,
      ref: "AdopPets",
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);
export default Review;
