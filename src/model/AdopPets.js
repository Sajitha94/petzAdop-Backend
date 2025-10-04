import { model, Schema } from "mongoose";

// Subdocument schema for requests
const requestSchema = new Schema(
  {
    adopter_email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    review: {
      comment: { type: String },
      rating: { type: Number, min: 0, max: 5 },
      createdAt: { type: Date },
    },
  },
  { timestamps: true } // ✅ will auto-add createdAt + updatedAt
);

const adopPetsSchema = new Schema(
  {
    post_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
    petsStatus: { type: Number, enum: [1, -1], default: 1 },
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
      minlength: 3,
    },
    age: { type: Number, required: [true, "Age is required for registration"] },
    breed: { type: String, required: [true, "Breed is required"] },
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
    color: { type: String, required: [true, "Color is required"] },
    location: { type: String, required: [true, "Location is required"] },
    medical_history: {
      type: String,
      required: [true, "Medical History is required"],
    },
    description: { type: String, required: [true, "Description is required"] },
    photo: { type: [String], required: [true, "Photo is required"] },
    video: { type: String },
    requests: [requestSchema], // ✅ using sub-schema
  },
  { timestamps: true } // ✅ for main document
);

const AdopPets = model("AdopPets", adopPetsSchema);
export default AdopPets;
