import asyncHandler from "express-async-handler";
import Resource from "../models/resourceModel.js";
import User from "../models/userModel.js";

// @desc    Get all learning resources
export const getResources = asyncHandler(async (req, res) => {
  // ⚠️ HACKATHON TRICK: Clears old data to load the new MEGA list. Remove before production!
  await Resource.deleteMany({}); 

  let resources = await Resource.find({}).sort({ createdAt: -1 });

  if (resources.length === 0) {
    const dummyData = [
      // ==========================================
      // ⚛️ REACT & FRONTEND COURSES
      // ==========================================
      {
        title: "React.js Full Course 2024",
        description: "Build robust, interactive UIs. Free crash course covering Hooks and Context API.",
        url: "https://www.youtube.com/embed/SqcY0GlETPk", type: "video", platform: "YouTube",
        tags: ["React", "Frontend", "Web Dev"], skillsAwarded: ["React", "JavaScript"], credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Meta Front-End Developer Professional Certificate",
        description: "Launch your career as a front-end developer. Build React applications guided by Meta engineers.",
        url: "https://www.coursera.org/professional-certificates/meta-front-end-developer", type: "course", platform: "Coursera",
        tags: ["React", "Frontend", "UI"], skillsAwarded: ["React", "UI/UX", "API"], credits: 6,
        thumbnail: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "React Tutorial for Beginners",
        description: "GeeksforGeeks comprehensive documentation and coding environment for React.js.",
        url: "https://www.geeksforgeeks.org/reactjs-tutorial/", type: "document", platform: "GeeksforGeeks",
        tags: ["React", "Frontend", "Documentation"], skillsAwarded: ["React", "JSX"], credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "React Native - Mobile App Development",
        description: "Learn how to use React to build native iOS and Android applications.",
        url: "https://www.youtube.com/embed/0-S5a0eXPoc", type: "video", platform: "YouTube",
        tags: ["React", "React Native", "Mobile"], skillsAwarded: ["React Native", "Mobile Dev"], credits: 5,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Advanced JavaScript & DOM Manipulation",
        description: "Deep dive into JS closures, async/await, and modern ES6 features.",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript", type: "document", platform: "MDN Web Docs",
        tags: ["JavaScript", "React", "Frontend"], skillsAwarded: ["JavaScript", "ES6"], credits: 2,
        thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=600&auto=format&fit=crop"
      },

      // ==========================================
      // 🤖 AI & MACHINE LEARNING COURSES
      // ==========================================
      {
        title: "Machine Learning Specialization by Stanford",
        description: "Created by Andrew Ng. Master fundamental AI concepts and machine learning algorithms.",
        url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "course", platform: "Coursera",
        tags: ["AI", "Machine Learning", "Python"], skillsAwarded: ["AI", "Machine Learning"], credits: 8,
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "CS50's Introduction to AI with Python",
        description: "Harvard University's official course on using Python for Artificial Intelligence.",
        url: "https://www.youtube.com/embed/5NgNicANyqM", type: "video", platform: "YouTube",
        tags: ["AI", "Python", "Algorithms"], skillsAwarded: ["Python", "AI"], credits: 6,
        thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Artificial Intelligence Foundation",
        description: "Infosys official certification module for understanding AI business implementation.",
        url: "https://springboard.infosys.com/board", type: "course", platform: "Infosys Springboard",
        tags: ["AI", "Business", "Management"], skillsAwarded: ["AI Literacy", "Management"], credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Deep Learning with PyTorch",
        description: "GeeksforGeeks guide to building neural networks using Python and PyTorch.",
        url: "https://www.geeksforgeeks.org/getting-started-with-pytorch/", type: "document", platform: "GeeksforGeeks",
        tags: ["AI", "Deep Learning", "Python"], skillsAwarded: ["PyTorch", "Deep Learning"], credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Natural Language Processing (NLP)",
        description: "Learn text normalization, NER, TF-IDF, and N-gram models for AI applications.",
        url: "https://www.coursera.org/learn/natural-language-processing", type: "course", platform: "Coursera",
        tags: ["AI", "NLP", "Machine Learning"], skillsAwarded: ["NLP", "Python"], credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600&auto=format&fit=crop"
      },

      // ==========================================
      // ☕ JAVA & BACKEND COURSES
      // ==========================================
      {
        title: "Java Programming Masterclass",
        description: "Learn core Java, OOP concepts, Collections framework, and Multithreading.",
        url: "https://www.youtube.com/embed/eIrMbAQSU34", type: "video", platform: "YouTube",
        tags: ["Java", "Backend", "OOP"], skillsAwarded: ["Java", "OOP"], credits: 5,
        thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Java Full Stack Development",
        description: "Official Swayam course covering Spring Boot and full stack integrations.",
        url: "https://onlinecourses.nptel.ac.in/noc21_cs03/preview", type: "course", platform: "Swayam",
        tags: ["Java", "Spring Boot", "Full Stack"], skillsAwarded: ["Spring Boot", "Java"], credits: 6,
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Node.js & Express API Development",
        description: "Build robust REST APIs from scratch using Node.js and Express.",
        url: "https://www.youtube.com/embed/Oe421EPjeBE", type: "video", platform: "YouTube",
        tags: ["Node.js", "Backend", "API"], skillsAwarded: ["Node.js", "Express"], credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1526040652367-6000728c6ce5?q=80&w=600&auto=format&fit=crop"
      },

      // ==========================================
      // 🧠 DATA STRUCTURES & ALGORITHMS (DSA)
      // ==========================================
      {
        title: "Data Structures & Algorithms in C++",
        description: "Master Arrays, Linked Lists, Trees, and Graphs for coding interviews.",
        url: "https://www.youtube.com/embed/8hly31xKli0", type: "video", platform: "YouTube",
        tags: ["DSA", "C++", "Interviews"], skillsAwarded: ["C++", "Algorithms"], credits: 5,
        thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Top 50 Interview DSA Questions",
        description: "GeeksforGeeks curated list of the most frequently asked coding interview questions.",
        url: "https://www.geeksforgeeks.org/top-50-data-structure-and-algorithms-interview-questions-for-sdes/", type: "document", platform: "GeeksforGeeks",
        tags: ["DSA", "Interview Prep", "Problem Solving"], skillsAwarded: ["Problem Solving"], credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Dynamic Programming Masterclass",
        description: "Learn memoization and tabulation techniques to optimize complex algorithms.",
        url: "https://www.coursera.org/learn/algorithms-divide-conquer", type: "course", platform: "Coursera",
        tags: ["DSA", "Algorithms", "Optimization"], skillsAwarded: ["Dynamic Programming"], credits: 4,
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop"
      },

      // ==========================================
      // ☁️ CLOUD, DEVOPS & OTHER
      // ==========================================
      {
        title: "AWS Certified Cloud Practitioner",
        description: "Full preparation course for passing the AWS Cloud Practitioner certification.",
        url: "https://www.youtube.com/embed/SOTamWNgDKc", type: "video", platform: "YouTube",
        tags: ["AWS", "Cloud", "DevOps"], skillsAwarded: ["AWS", "Cloud Computing"], credits: 5,
        thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Git & GitHub Crash Course",
        description: "Essential version control skills. Learn how to commit, push, and resolve merge conflicts.",
        url: "https://www.youtube.com/embed/RGOj5yH7evk", type: "video", platform: "YouTube",
        tags: ["Git", "DevOps", "Version Control"], skillsAwarded: ["Git", "GitHub"], credits: 2,
        thumbnail: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Android App Development Lifecycle",
        description: "Understand Android Activities, Intents, and AVD to build responsive mobile apps.",
        url: "https://www.mygreatlearning.com/academy/learn-for-free/courses/android-app-development", type: "course", platform: "Great Learning",
        tags: ["Android", "Mobile", "Java"], skillsAwarded: ["Android Studio", "Mobile Dev"], credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1607252656733-fd7458052280?q=80&w=600&auto=format&fit=crop"
      },
      {
        title: "Cyber Security Fundamentals",
        description: "Introduction to network security, malware, and protecting digital assets.",
        url: "https://www.open.edu/openlearn/science-maths-technology/introduction-cyber-security", type: "document", platform: "OpenLearn",
        tags: ["Cyber Security", "Networking"], skillsAwarded: ["Security", "Networking"], credits: 3,
        thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
      }
    ];
    await Resource.insertMany(dummyData);
    resources = await Resource.find({}).sort({ createdAt: -1 });
  }

  res.status(200).json(resources);
});

export const completeCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.oidc.user.sub;

  const user = await User.findOne({ auth0Id: userId });
  const course = await Resource.findById(courseId);

  if (!user || !course) return res.status(404).json({ message: "User or Course not found" });

  const isAlreadyCompleted = user.completedCourses.some(id => id.toString() === courseId.toString());

  if (isAlreadyCompleted) {
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