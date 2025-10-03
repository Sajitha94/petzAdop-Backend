import { model, Schema } from "mongoose";

// Sub-schema for requests with timestamps
const requestSchema = new Schema(
  {
    forster_parent_ID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    forster_parent_email: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true } // <-- automatically adds createdAt & updatedAt for each request
);

const fosterPetsSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: String },
    breed: { type: String },
    size: { type: String, default: "Medium" },
    gender: { type: String, default: "Female" },
    color: { type: String },
    location: { type: String },
    medical_history: { type: String },
    description: { type: String },
    photos: { type: [String], default: [] },
    video: { type: String, default: null },
    fosterOrgId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    requests: [requestSchema], // <-- subdocuments with their own timestamps
  },
  { timestamps: true } // <-- parent schema timestamps
);

export default model("FosterPets", fosterPetsSchema);
