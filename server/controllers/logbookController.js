import asyncHandler from "express-async-handler";
import Logbook from "../models/logbookmodel.js";
import User from "../models/userModel.js";

// @desc    Submit a new daily log
// @route   POST /api/v1/logbook
export const submitLog = asyncHandler(async (req, res) => {
  const userId = req.oidc.user.sub;
  const user = await User.findOne({ auth0Id: userId });

  if (!user) return res.status(404).json({ message: "User not found" });

  const { internshipTitle, companyName, date, hoursWorked, taskDescription } = req.body;

  if (!internshipTitle || !hoursWorked || !taskDescription) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const newLog = new Logbook({
    student: user._id,
    internshipTitle,
    companyName: companyName || "Industry Partner",
    date,
    hoursWorked,
    taskDescription,
    status: "Pending" // Default to "Pending" for new submissions
  });

  await newLog.save();
  res.status(201).json({ message: "Logbook entry submitted successfully", log: newLog });
});

// @desc    Get logs and calculate NEP Credits
// @route   GET /api/v1/logbook/student
export const getStudentLogs = asyncHandler(async (req, res) => {
  const userId = req.oidc.user.sub;
  const user = await User.findOne({ auth0Id: userId });

  if (!user) return res.status(404).json({ message: "User not found" });

  const logs = await Logbook.find({ student: user._id }).sort({ date: -1 });

  // --- NEP 2020 CREDIT ENGINE MATH ---
  // Rule: 30 approved internship hours = 1 Academic Credit
  let totalApprovedHours = 0;
  logs.forEach(log => {
    if (log.status === "Approved") {
      totalApprovedHours += log.hoursWorked;
    }
  });

  const earnedCredits = Math.floor(totalApprovedHours / 30);
  const hoursToNextCredit = 30 - (totalApprovedHours % 30);

  res.status(200).json({
    logs,
    analytics: {
      totalApprovedHours,
      earnedCredits,
      hoursToNextCredit
    }
  });
});
// @desc    [ADMIN/FACULTY] Get ALL logs from all students
// @route   GET /api/v1/admin/logbooks
// @desc    [ADMIN/FACULTY] Get ALL logs from all students
// @route   GET /api/v1/admin/logbooks
export const getAllLogsForAdmin = asyncHandler(async (req, res) => {
  const userId = req.oidc.user.sub;
  const user = await User.findOne({ auth0Id: userId });

  // ✅ STRICT ADMIN CHECK: Only this email can see all logs
  if (user.email !== "sanketjadhav2504@gmail.com") {
      return res.status(403).json({ message: "Access Denied: Faculty Only." });
  }

  const logs = await Logbook.find({})
    .populate("student", "name email profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json(logs);
});

// @desc    [ADMIN/FACULTY] Approve or Reject a log
// @route   PATCH /api/v1/admin/logbook/:id
export const updateLogStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const log = await Logbook.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
  );
  
  
  if (!log) {
    return res.status(404).json({ message: "Logbook entry not found" });
  }

  log.status = status; // "Approved" or "Rejected"
  await log.save();

  res.status(200).json({ message: `Logbook successfully marked as ${status}` });
});