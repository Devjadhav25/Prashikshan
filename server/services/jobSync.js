import axios from 'axios';
import Job from '../models/jobModel.js';

/**
 * Fetches jobs from JSearch API and saves them to MongoDB
 */



// this is for automatically refresh the job list on client side
// Inside the loop in jobSync.js
// const savedJob = await Job.findOneAndUpdate(...);
// const io = req.app.get("io");
// io.emit("newJobAvailable", savedJob);
const syncExternalJobs = async (searchQuery = "Software Engineer") => {
    console.log(`📡 Starting API Sync for: ${searchQuery}...`);

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: searchQuery,
            page: '1',
            num_pages: '1'
        },
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY, // Found in RapidAPI Endpoints
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const apiJobs = response.data.data;

        if (!apiJobs || apiJobs.length === 0) {
            console.log("⚠️ No jobs found from API.");
            return;
        }

        for (const job of apiJobs) {
            // Mapping JSearch data to YOUR Mongoose Schema
            const jobData = {
                title: job.job_title,
                location: job.job_city && job.job_country 
                    ? `${job.job_city}, ${job.job_country}` 
                    : job.job_location || "Remote",
                salary: job.job_min_salary || 45000, 
                salaryType: "Year",
                negotiable: false,
                jobType: [job.job_employment_type || "Full Time"],
                description: job.job_description || "No description provided.",
                skills: ["Contact Recruiter"], 
                tags: [job.job_title, "API"],
                externalId: job.job_id, 
                
                // ✅ UPDATED: Captures the original source (e.g., LinkedIn, Indeed)
                source: job.job_publisher || "JSearch", 
                
                // REQUIRED: Replace this string with your real Admin User ID from MongoDB
                createdBy: "6983d3e65amsh446c01914719602p11c88bjsn97b67cdd8104" 
            };

            // Prevents duplicates by searching for the externalId
            await Job.findOneAndUpdate(
                { externalId: job.job_id },
                jobData,
                { upsert: true, new: true, runValidators: true }
            );
        }

        console.log(`✅ Successfully synced ${apiJobs.length} jobs.`);
    } catch (error) {
        console.error("❌ Sync Logic Error:", error.message);
    }
};

export default syncExternalJobs;