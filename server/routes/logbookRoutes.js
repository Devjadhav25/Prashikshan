import express from "express";
import { 
    submitLog, 
    getStudentLogs, 
    getAllLogsForAdmin, 
    updateLogStatus 
} from "../controllers/logbookController.js";

const router = express.Router();

// Middleware to ensure authentication
const protectLogbook = (req, res, next) => {
  if (req.oidc.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
};

// Student Routes
router.post("/logbook", protectLogbook, submitLog);
router.get("/logbook/student", protectLogbook, getStudentLogs);

// Faculty/Admin Routes (For Hackathon Demo, bypassing strict role checks)
router.get("/admin/logbooks", protectLogbook, getAllLogsForAdmin);
router.put("/admin/logbook/:id", protectLogbook, updateLogStatus);

export default router;