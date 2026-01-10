import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  // General Info
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, default: "Remote" },
  
  // Salary Info
  salary: { type: Number, required: true },
  salaryType: { type: String, default: "Yearly" }, // Matches your "Yearly", "Monthly" types
  negotiable: { type: Boolean, default: false },
  
  // Job Details
  jobType: { type: [String], required: true }, // e.g., ["Full Time"]
  tags: [{ type: String }],
  skills: { type: [String], default: [] }, // Changed from Array to [String] for better indexing
  
  // Relations
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  // External API Info (JSearch)
  source: { type: String, default: "Manual" }, // e.g., "JSearch", "LinkedIn"
  externalId: { type: String, unique: true, sparse: true },
  
  // ✅ Correct way to define Link fields
  externalLink: { type: String, default: "" }, 
  applyLink: { type: String, default: "" }, 
  
  // Employer Info for API Jobs
  employer_logo: { type: String, default: "" },
  job_apply_link: { type: String, default: "" },
  job_google_link: { type: String, default: "" },

}, {
  timestamps: true
});

const Job = mongoose.model("Job", JobSchema);

export default Job;