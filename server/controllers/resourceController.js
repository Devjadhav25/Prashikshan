import asyncHandler from "express-async-handler";
import Resource from "../models/resourceModel.js";
import User from "../models/userModel.js";

// @desc    Get all learning resources
export const getResources = asyncHandler(async (req, res) => {
  // ⚠️ HACKATHON TRICK: This line completely clears the old broken data so the new courses load perfectly. 
  // You can remove this single line after you run it once!
 // await Resource.deleteMany({}); 

  let resources = await Resource.find({}).sort({ createdAt: -1 });

  // Auto-seed high-quality diverse platforms
  if (resources.length === 0) {
    const dummyData = [
      {
        title: "React.js Full Course 2024",
        description: "Build robust, interactive user interfaces. This free crash course covers Hooks, Context API, and state management.",
        url: "https://www.youtube.com/embed/SqcY0GlETPk", // ✅ Correct Youtube Embed link
        type: "video",
        platform: "YouTube",
        tags: ["React", "Frontend"],
        skillsAwarded: ["React", "JavaScript"],
        credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Programming in Java",
        description: "Official Swayam course by IIT Kharagpur covering core Java, OOP concepts, and multithreading.",
        url: "https://onlinecourses.nptel.ac.in/noc21_cs03/preview", 
        type: "course",
        platform: "Swayam",
        tags: ["Java", "Backend"],
        skillsAwarded: ["Java", "OOP"],
        credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "AI for Everyone",
        description: "A non-technical introduction to Machine Learning and Data Science hosted by Andrew Ng.",
        url: "https://www.coursera.org/learn/ai-for-everyone",
        type: "course",
        platform: "Coursera",
        tags: ["AI", "Machine Learning"],
        skillsAwarded: ["Artificial Intelligence", "Data Science"],
        credits: 2,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Front-End Web Development",
        description: "Master HTML, CSS, and JS to build interactive UI components.",
        url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/front-end-web-development",
        type: "course",
        platform: "Great Learning",
        tags: ["HTML/CSS", "Frontend"],
        skillsAwarded: ["HTML", "CSS", "Web Design"],
        credits: 2,
        thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Cyber Security Basics",
        description: "Introduction to network security, malware, and protecting digital assets.",
        url: "https://www.open.edu/openlearn/science-maths-technology/introduction-cyber-security/content-section-overview",
        type: "document",
        platform: "OpenLearn",
        tags: ["Cyber Security", "Networking"],
        skillsAwarded: ["Cyber Security", "Networking"],
        credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Big Data Analytics Tutorials",
        description: "Comprehensive free documentation and tutorials on Big Data, Hadoop, and Spark architectures.",
        url: "https://data-flair.training/blogs/big-data-tutorials/",
        type: "document",
        platform: "DataFlair",
        tags: ["Big Data", "Analytics"],
        skillsAwarded: ["Big Data", "Hadoop"],
        credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop"
      }
    ];
    await Resource.insertMany(dummyData);
    resources = await Resource.find({}).sort({ createdAt: -1 });
  }

  res.status(200).json(resources);
});

// @desc    Mark course as completed & award skills
export const completeCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.oidc.user.sub;

  const user = await User.findOne({ auth0Id: userId });
  const course = await Resource.findById(courseId);

  if (!user || !course) return res.status(404).json({ message: "User or Course not found" });

  if (user.completedCourses.includes(courseId)) {
    return res.status(400).json({ message: "Course already completed" });
  }

  user.completedCourses.push(courseId);
  user.earnedCredits += course.credits;

  course.skillsAwarded.forEach(newSkill => {
    const existingSkill = user.skills.find(s => s.name.toLowerCase() === newSkill.toLowerCase());
    if (existingSkill) {
      existingSkill.value = Math.min(100, existingSkill.value + 20);
    } else {
      user.skills.push({ name: newSkill, value: 50 });
    }
  });

  await user.save();

  res.status(200).json({ 
    message: `Earned ${course.credits} Credits and new skills!`,
    updatedUser: user 
  });
});