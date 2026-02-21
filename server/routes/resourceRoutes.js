import express from "express";
import { getResources, completeCourse } from "../controllers/resourceController.js";

const router = express.Router();

router.get("/resources", getResources);

// ✅ Add the completion route with Auth protection
router.post("/resources/complete", (req, res, next) => {
    if (req.oidc.isAuthenticated()) return next();
    return res.status(401).json({ message: "Not authenticated" });
}, completeCourse);

export default router;