import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    auth0Id: {
        type: String,
        required: true,
        unique: true,
    },
    appliedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
        },
    ],
    savedJobs: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Job",
        },
    ],
    role: {
        type: String,
        enum: ["jobseeker", "recruiter"],
        default: "jobseeker",
    },
    resume: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        default: "No bio provided.",
    },
    profession : {
        type: String,
        default: "Unemployed",
    },
    skills: [{ name: String, value: Number }],
    location: {
        type: String,
        default: "India",
    },
    socialLinks: {
        github: { type: String, default: "" },
        twitter: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        instagram: { type: String, default: "" },
    },
    interests: { type: [String], default: [] },
    
    // ✅ MOVED THESE INSIDE THE SCHEMA OBJECT
    completedCourses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Resource" 
    }],
    earnedCredits: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;