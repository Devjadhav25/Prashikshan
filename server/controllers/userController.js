import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { auth } from "express-openid-connect";



export const getUserProfile = asyncHandler( async (req, res) => {
  try{

    const id = req.oidc.user.sub;
    console.log("id:", id);

    //find user by id
    let user = await User.findOne({ auth0Id: id });
    console.log("user found:", user);
    if(!user){
      // Create the user
      user = new User({
        name: req.oidc.user.name,
        email: req.oidc.user.email,
        auth0Id: req.oidc.user.sub,
        role: "jobseeker",
        profilePicture: req.oidc.user.picture,
      });
      await user.save();
      console.log("New user created:", user);
    }
    
    // const { id } = req.params;

    // // find user by auth0 id
    // const user = await User.findOne({ auth0Id: id });

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }


    return res.status(200).json(user);
  }catch(error){
    console.log("Error in getUserProfile:", error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
});