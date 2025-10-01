import { model, Schema } from "mongoose";

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
start_date: { type: Date }, // <--- new
    end_date: { type: Date },   // <--- new
    requests: [
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
        requestedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default model("FosterPets", fosterPetsSchema);
