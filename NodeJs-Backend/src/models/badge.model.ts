import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    criteria: { type: Number, required: true },
  },
  { timestamps: true }
);