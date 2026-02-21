import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/jobController.js";
import { upload } from "../utils/cloudinary.js";
import { uploadProfilePicture } from "../controllers/jobController.js";

const router = express.Router();

router.get("/check-auth", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    // return auth status
    return res.status(200).json({
      isAuthenticated: true,
      user: req.oidc.user,
    });
  } else {
    return res.status(200).json(false);
  }
});
 ;
router.get("/user/:id", getUserProfile);

router.put("/user/update", (req, res, next) => {
  if (req.oidc.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
}, updateUserProfile);

router.post("/user/upload-avatar", 
  // 1. Auth Check
  (req, res, next) => {
    if (req.oidc.isAuthenticated()) return next();
    return res.status(401).json({ message: "Not authenticated" });
  },
  // 2. Safe Multer Execution
  (req, res, next) => {
    const uploadMiddleware = upload.single("avatar");
    
    uploadMiddleware(req, res, function (err) {
      if (err) {
        // If Cloudinary fails (e.g., bad API key), it prints HERE in your backend terminal
        console.error("🚨 CLOUDINARY/MULTER ERROR:", err);
        return res.status(500).json({ 
            message: "Upload to Cloudinary failed", 
            error: err.message 
        });
      }
      next();
    });
  },
  // 3. Final Controller
  uploadProfilePicture
);

export default router;