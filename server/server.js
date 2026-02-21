import express from 'express';
import { auth } from 'express-openid-connect';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connect from './db/connect.js';
import fs from 'fs';
import User from "./models/userModel.js";
import asyncHandler from 'express-async-handler';
import cron from 'node-cron';
import syncExternalJobs from './services/jobSync.js';
import jobRoutes from './routes/jobRoutes.js';

// ✅ Fixed: Use ESM imports for HTTP and Socket.io
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

app.set('trust proxy', 1);
// ✅ Create the HTTP server using the Express app
const httpServer = createServer(app);

// ✅ Initialize Socket.io with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL,
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  },
  logoutParams: {
    returnTo: process.env.CLIENT_URL
  },
  idpLogout: true,
  auth0Logout: true,
  
  session: {
    absoluteDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
    cookie: {
      // ✅ Dynamic domain: use the live domain in production, undefined for localhost
      
      
      // ✅ Must be true in production for HTTPS
      secure: process.env.NODE_ENV === 'production', 
      
      // ✅ 'None' is required for cross-site cookies between Vercel and Render
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax', 
    },
  },
};

const PORT = process.env.PORT || 8000;
// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auth(config));

// Socket.io Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Make 'io' accessible to your routes and services
app.set("io", io);

// Function to ensure User exists in DB
const ensureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ 
      $or: [{ auth0Id: user.sub }, { email: user.email }] 
    });
    if (!existingUser) {
      const newUser = new User({
        name: user.name,
        email: user.email,
        auth0Id: user.sub,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      await newUser.save();
    }
  } catch (error) {
    console.log("Error ensuring user in DB:", error.message);
  }
});

// --- AUTOMATION: CRON JOB ---
// --- AUTOMATION: CRON JOB ---
// Runs every 12 hours to stay well within JSearch 50/month free limit
cron.schedule('0 */12 * * *', async () => {
  console.log('--- Running Automatic Job/Internship Sync ---');
  try {
    const ioInstance = app.get("io");
    
    // 1. Pick a random tech role
    const roles = ["Web Developer", "Software Engineer", "Data Analyst", "UI UX Designer", "Backend Developer"];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    // 2. Flip a coin: 50% chance for Internship, 50% chance for Full Time Job
    const types = ["INTERN", "FULLTIME"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    await syncExternalJobs(randomRole, randomType, ioInstance); 
  } catch (err) {
    console.error("Cron Job Error:", err.message);
  }
});
// --- MANUAL TEST ROUTE ---
// app.get("/api/v1/sync-now", asyncHandler(async (req, res) => {
//   console.log("Manual Sync Requested...");
//   const io = req.app.get("io");
//   await syncExternalJobs("React Developer");
//   res.send("Sync process started. Check console for details.");
// }));

app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    await ensureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL);
  } else {
    return res.send("Logged out");
  }
});


// Dynamic Route Loading
const routeFiles = fs.readdirSync("./routes");
routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
    app.use("/api/v1", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

// ✅ Corrected Start Function
const startServer = async () => {
  try {
    await connect();
    // ✅ Listen on httpServer, not app
    // ✅ Fix: Bind to 0.0.0.0 so Render can detect the port
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

startServer();