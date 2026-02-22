import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import job from "../models/jobModel.js";

// ✅ Unified createJob with Socket.io Broadcasting (Restored to normal)
export const createJob = asyncHandler(async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    const isAuth = req.oidc.isAuthenticated() || (user && user.email);

    if (!isAuth || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { title, description, location, salary, jobType, tags, skills, salaryType, negotiable } = req.body;

    if (!title || !description || !location || !salary) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    
    if (!Array.isArray(jobType) || jobType.length === 0) {
      return res.status(400).json({ message: "At least one job type is required" });
    }

      const Newjob = new job({
        title,
        description,
        location,
        salary,
        jobType,
        tags,
        skills,
        salaryType,
        negotiable,
        createdBy: user._id,
        status: "Approved", // Ensure new jobs are visible in Find Work
        employer_logo: req.body.employer_logo || "/user.png", // Default logo if not provided
      });

    await Newjob.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("newJobAvailable", Newjob);
    }

    // Explicitly return success for frontend redirection
    return res.status(201).json({ success: true, message: "Job created successfully", Newjob });
  } catch (error) {
    console.log("Error in createJob:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// ✅ REVERTED: Now fetches ALL jobs immediately
export const getJobs = asyncHandler(async (req, res) => {
  try {
    const jobs = await job
      .find({}) // Removed the status filter so all jobs show up!
      .populate("createdBy", "name profilePicture")
      .sort({ createdAt: -1 }); 
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get jobs by user
export const getJobsByUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const jobs = await job
      .find({ createdBy: user._id })
      .populate("createdBy", "name profilePicture");
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in getJobsByUser:", error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// ✅ REVERTED: Search now looks at ALL jobs
export const searchJobs = asyncHandler(async (req, res) => {
  try {
    const { tags, location, title } = req.query;
    let query = {}; // Removed the status filter here
    
    if (tags) query.tags = { $in: tags.split(",") };
    if (location) query.location = { $regex: location, $options: "i" };
    if (title) query.title = { $regex: title, $options: "i" };
    
    const jobs = await job.find(query).populate("createdBy", "name profilePicture");
    return res.status(200).json(jobs);
  } catch (error) {
    console.log("Error in searchJobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// apply for job
export const applyJob = asyncHandler(async (req, res) => {
  try {
    const jobDoc = await job.findById(req.params.id);
    if (!jobDoc) return res.status(404).json({ message: "Job not found" });

    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) return res.status(404).json({ message: "User not synced to DB" });

    if (jobDoc.applicants.includes(user._id)) return res.status(400).json({ message: "Already applied" });
    
    jobDoc.applicants.push(user._id);
    await jobDoc.save();
    return res.status(200).json(jobDoc);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// like unlike job
export const likeJob = asyncHandler(async (req, res) => {
  try {
    const jobDoc = await job.findById(req.params.id);
    if (!jobDoc) return res.status(404).json({ message: "Job not found" });
    
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isLiked = jobDoc.likes.includes(user._id);
    let message = "";
    if (isLiked) {
      jobDoc.likes = jobDoc.likes.filter((like) => !like.equals(user._id));
      message = "Job removed from likes";
    } else {
      jobDoc.likes.push(user._id);
      message = "Job added to likes";
    }
    await jobDoc.save();
    return res.status(200).json({message , job : jobDoc});
  } catch (error) {
    console.log("Error in likeJob:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get job by id
export const jobById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const jobDoc = await job.findById(id).populate("createdBy", "name profilePicture");
    if (!jobDoc) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json(jobDoc);
  } catch (error) {
    console.log("Error in jobById:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findOne({ auth0Id: id });

    if (!user && id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(id);
    }

    if (!user && req.oidc.isAuthenticated() && req.oidc.user.sub === id) {
      user = new User({
        auth0Id: req.oidc.user.sub,
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        profilePicture: req.oidc.user.picture,
      });
      await user.save();
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete job
export const deleteJob = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const jobDoc = await job.findById(id);
    const user = await User.findOne({ auth0Id: req.oidc.user.sub });
    if (!jobDoc || !user) return res.status(404).json({ message: "Not found" });

    await jobDoc.deleteOne({ _id: id });
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.log("Error in deleteJob:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    if (!req.oidc || !req.oidc.user) return res.status(401).json({ message: "Not Authenticated" });

    const userId = req.oidc.user.sub;
    const { name, profession, location, bio, skills, socialLinks, interests } = req.body;

    if (!name || name.trim() === "") return res.status(400).json({ message: "Name is required." });

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: userId },
      { $set: { name: name.trim(), profession: profession || "", location: location || "", bio: bio || "", skills: Array.isArray(skills) ? skills : [], socialLinks: socialLinks || {}, interests: Array.isArray(interests) ? interests : [] } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Detailed Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export const uploadProfilePicture = asyncHandler(async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.oidc.user.sub;
    const imageUrl = req.file.path;

    const updatedUser = await User.findOneAndUpdate(
      { auth0Id: userId },
      { $set: { profilePicture: imageUrl } },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, profilePicture: updatedUser.profilePicture });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});