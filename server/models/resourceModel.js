import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["video", "document", "course"], default: "course" },
  platform: { type: String, default: "YouTube" }, // e.g., Swayam, Coursera
  thumbnail: { type: String },
  tags: [{ type: String }],
  
  // ✅ The Auto-Skill Engine Rewards
  skillsAwarded: [{ type: String }], 
  credits: { type: Number, default: 0 } 
}, { timestamps: true });

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;