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

    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true }, // user who submitted
    fosterOrgId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // foster organization ID
  },
  { timestamps: true }
);

const FosterPets = model("FosterPets", fosterPetsSchema);
export default FosterPets;
