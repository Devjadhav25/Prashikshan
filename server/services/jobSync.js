// server/services/jobSync.js
import axios from 'axios';
import Job from '../models/jobModel.js';

const syncExternalJobs = async (searchQuery = "Software Engineer", io) => {
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
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const apiJobs = response.data.data;
        console.log("RAW API DATA SAMPLE:", JSON.stringify(apiJobs[0], null, 2));

        if (!apiJobs || apiJobs.length === 0) {
            console.log("⚠️ No jobs found from API.");
            return;
        }

        for (const job of apiJobs) {
            // Extract and format salary
            const minSalary = job.job_min_salary || 0;
            const maxSalary = job.job_max_salary || 0;
            const avgSalary = minSalary && maxSalary 
                ? Math.round((minSalary + maxSalary) / 2) 
                : minSalary || maxSalary || 45000;

            // Map JSearch salary period to your format
            const salaryPeriodMap = {
                'YEARLY': 'Yearly',
                'MONTHLY': 'Monthly',
                'WEEKLY': 'Weekly',
                'HOURLY': 'Hourly',
                'YEAR': 'Yearly',
                'MONTH': 'Monthly',
                'WEEK': 'Weekly',
                'HOUR': 'Hourly'
            };
            const apiSalaryPeriod = job.job_salary_period?.toUpperCase() || 'YEARLY';
            const salaryType = salaryPeriodMap[apiSalaryPeriod] || 'Yearly';

            // Format employment type
            const employmentType = job.job_employment_type || 'FULLTIME';
            const jobTypeMap = {
                'FULLTIME': 'Full Time',
                'PARTTIME': 'Part Time',
                'CONTRACTOR': 'Contract',
                'INTERN': 'Internship',
                'TEMPORARY': 'Contract'
            };
            const formattedJobType = jobTypeMap[employmentType.toUpperCase()] || 'Full Time';

            // Extract skills from description or use job title
            const extractSkills = (desc, title) => {
                const commonSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'CSS', 'HTML', 'SQL', 'MongoDB', 'AWS', 'Git'];
                const foundSkills = commonSkills.filter(skill => 
                    desc?.toLowerCase().includes(skill.toLowerCase()) || 
                    title?.toLowerCase().includes(skill.toLowerCase())
                );
                return foundSkills.length > 0 ? foundSkills.slice(0, 5) : [title || 'Contact Recruiter'];
            };

            // Clean HTML from description
            const cleanDescription = (html) => {
                if (!html) return "No description provided.";
                // Remove HTML tags but preserve line breaks
                return html
                    .replace(/<[^>]*>/g, '')
                    .replace(/&nbsp;/g, ' ')
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .trim();
            };

            const jobData = {
                title: job.job_title || "Untitled Position",
                employer_logo: job.employer_logo|| "",
                externalLink: job.job_apply_link || job.job_google_link || "",
    
                // ✅ FIX 2: Add applyLink to match your required Model field
                applyLink: job.job_apply_link || job.job_google_link || "",
                job_apply_link: job.job_apply_link || "",
                job_google_link: job.job_google_link || "",
                location: job.job_city && job.job_country 
                    ? `${job.job_city}, ${job.job_country}` 
                    : job.job_location || "Remote",
                salary: avgSalary,
                salaryType: salaryType, // Now matches frontend: "Yearly", "Monthly", etc.
                negotiable: job.job_is_remote || false,
                jobType: [formattedJobType], // Properly formatted: "Full Time", "Part Time", etc.
                description: cleanDescription(job.job_description),
                skills: extractSkills(job.job_description, job.job_title),
                tags: [
                    job.job_title,
                    formattedJobType,
                    job.job_city || 'Remote',
                    ...extractSkills(job.job_description, job.job_title).slice(0, 2)
                ].filter(Boolean),
                externalId: job.job_id,
                source: job.job_publisher || "JSearch",
                createdBy: "67307854d3a71f000523fd75" // Your admin user ID
            };

            // Check if it's a new job or existing one
            const existingJob = await Job.findOne({ externalId: job.job_id });

            // Update or Create (Upsert)
            const savedJob = await Job.findOneAndUpdate(
                { externalId: job.job_id },
                { $set: jobData },
                { upsert: true, new: true, runValidators: true }
            ).populate("createdBy", "name profilePicture");

            // Emit to frontend ONLY if it's a brand new job and socket is available
            if (io && !existingJob && savedJob) {
                console.log(`🚀 Broadcasting new job: ${savedJob.title}`);
                io.emit("newJobAvailable", savedJob);
            }
        }

        console.log(`✅ Successfully synced ${apiJobs.length} jobs.`);
    } catch (error) {
        console.error("❌ Sync Logic Error:", error.message);
    }
};

export default syncExternalJobs;