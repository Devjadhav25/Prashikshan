import express from 'express';
import { 
    createJob, getJobs, getJobsByUser, searchJobs, 
    applyJob, likeJob, jobById, deleteJob 
} from '../controllers/jobController.js';
import protect from '../middleware/protect.js';
import syncExternalJobs from '../services/jobSync.js'; // ✅ Only one import needed

const router = express.Router();

// Standard Routes
router.post("/jobs", protect, createJob);
router.get("/jobs", getJobs);
router.get("/jobs/user/:id", protect, getJobsByUser);
router.get("/jobs/search", searchJobs);

// Job Action Routes
router.put("/jobs/apply/:id", protect, applyJob);
router.put("/jobs/like/:id", protect, likeJob);
router.get("/jobs/:id", protect, jobById);
router.delete("/jobs/:id", protect, deleteJob);

// ✅ Fixed Sync Route
// ✅ Flexible Sync Route (Test in Browser)
router.get("/sync-api", async (req, res) => {
    try {
        // You can pass specific queries in the URL, e.g.:
        // http://localhost:8000/api/v1/sync-api?role=React&type=INTERN
        const roleToSearch = req.query.role || "Frontend Developer";
        const typeToSearch = req.query.type || "INTERN"; // "INTERN" or "FULLTIME"
        
        await syncExternalJobs(roleToSearch, typeToSearch, req.app.get("io"));
        res.status(200).json({ message: `Successfully fetched ${typeToSearch} positions for: ${roleToSearch}` });
    } catch (error) {
        res.status(500).json({ message: "Sync failed", error: error.message });
    }
});

export default router;