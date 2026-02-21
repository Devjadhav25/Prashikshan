// server/services/jobSync.js
import axios from 'axios';
import Job from '../models/jobModel.js';

const syncExternalJobs = async (searchQuery = "Software Engineer", employmentType = "", io) => {
    // If it's an intern, append "Internship" to the search for better results
    const queryText = employmentType === 'INTERN' ? `${searchQuery} Internship` : searchQuery;
    console.log(`📡 Starting API Sync for: ${queryText} (${employmentType || 'MIXED'})...`);

    // Build the dynamic parameters
    const params = {
        query: queryText,
        page: '1',
        num_pages: '1'
    };

    // Only force an employment type if one is specifically requested
    if (employmentType) {
        params.employment_types = employmentType;
    }

    const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: params,
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        const apiJobs = response.data.data;

        if (!apiJobs || apiJobs.length === 0) {
            console.log("⚠️ No jobs found from API for this query.");
            return;
        }

        for (const job of apiJobs) {
            const minSalary = job.job_min_salary || 0;
            const maxSalary = job.job_max_salary || 0;
            // Internships generally pay less, so we adjust the fallback dynamically
            const defaultFallback = employmentType === 'INTERN' ? 15000 : 45000;
            const avgSalary = minSalary && maxSalary 
                ? Math.round((minSalary + maxSalary) / 2) 
                : minSalary || maxSalary || defaultFallback;

            const salaryPeriodMap = {
                'YEARLY': 'Yearly', 'MONTHLY': 'Monthly', 'WEEKLY': 'Weekly', 'HOURLY': 'Hourly',
                'YEAR': 'Yearly', 'MONTH': 'Monthly', 'WEEK': 'Weekly', 'HOUR': 'Hourly'
            };
            const apiSalaryPeriod = job.job_salary_period?.toUpperCase() || (employmentType === 'INTERN' ? 'MONTHLY' : 'YEARLY');
            const salaryType = salaryPeriodMap[apiSalaryPeriod] || 'Monthly';

            // Get Job Type from API, fallback to what we requested
            const rawApiType = job.job_employment_type || employmentType || 'FULLTIME';
            const jobTypeMap = {
                'FULLTIME': 'Full Time',
                'PARTTIME': 'Part Time',
                'CONTRACTOR': 'Contract',
                'INTERN': 'Internship',
                'TEMPORARY': 'Contract'
            };
            const formattedJobType = jobTypeMap[rawApiType.toUpperCase()] || 'Full Time';

            const extractSkills = (desc, title) => {
                const commonSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Java', 'CSS', 'HTML', 'SQL', 'MongoDB', 'AWS', 'Git', 'Figma', 'UI/UX'];
                const foundSkills = commonSkills.filter(skill => 
                    desc?.toLowerCase().includes(skill.toLowerCase()) || 
                    title?.toLowerCase().includes(skill.toLowerCase())
                );
                return foundSkills.length > 0 ? foundSkills.slice(0, 5) : [title || 'Contact Recruiter'];
            };

            const cleanDescription = (html) => {
                if (!html) return "No description provided.";
                return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
            };

            const jobData = {
                title: job.job_title || "Untitled Position",
                employer_logo: job.employer_logo || "",
                externalLink: job.job_apply_link || job.job_google_link || "",
                applyLink: job.job_apply_link || job.job_google_link || "",
                job_apply_link: job.job_apply_link || "",
                job_google_link: job.job_google_link || "",
                location: job.job_city && job.job_country 
                    ? `${job.job_city}, ${job.job_country}` 
                    : job.job_location || "Remote",
                salary: avgSalary,
                salaryType: salaryType, 
                negotiable: job.job_is_remote || false,
                jobType: [formattedJobType], 
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
                createdBy: "67307854d3a71f000523fd75" 
            };

            const existingJob = await Job.findOne({ externalId: job.job_id });

            const savedJob = await Job.findOneAndUpdate(
                { externalId: job.job_id },
                { $set: jobData },
                { upsert: true, new: true, runValidators: true }
            ).populate("createdBy", "name profilePicture");

            if (io && !existingJob && savedJob) {
                console.log(`🚀 Broadcasting new Post: ${savedJob.title}`);
                io.emit("newJobAvailable", savedJob);
            }
        }

        console.log(`✅ Successfully synced ${apiJobs.length} positions.`);
    } catch (error) {
        console.error("❌ Sync Logic Error:", error.message);
    }
};

export default syncExternalJobs;