import { model, Schema } from "mongoose";

const adopPetsSchema = new Schema(
  {
    post_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: 3,
    },
    age: {
      type: Number,
      required: [true, "Age is required for registration"],
    },
    breed: {
      type: String,
      required: [true, "Breed is required"],
    },
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      required: [true, "Size is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: [true, "Gender is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    medical_history: {
      type: String,
      required: [true, "Medical History is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    photo: { type: [String], required: [true, "Photo is required"] },
    video: { type: String },
    requests: [
      {
        adopter_email: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"], // ✅ approved, not accepted
          default: "pending",
        },

        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const AdopPets = model("AdopPets", adopPetsSchema);
export default AdopPets;
