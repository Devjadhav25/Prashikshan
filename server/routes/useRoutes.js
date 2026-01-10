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


router.post("/user/upload-avatar", upload.single("avatar"), uploadProfilePicture);

export default router;