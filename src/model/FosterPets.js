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

    requests: [
      {
        requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
