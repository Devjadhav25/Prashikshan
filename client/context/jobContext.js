"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useGlobalContext } from "./globalContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";

const isProduction = process.env.NODE_ENV === "production";
const baseURL = isProduction 
    ? "https://prashikshan.onrender.com" 
    : "http://localhost:8000";

// Update Axios
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;
const socket = io(baseURL);
const JobsContext = createContext();

export const JobsContextProvider = ({ children }) => { 
    const router = useRouter();
    const { userProfile, auth0User } = useGlobalContext();  

    // ✨ ARCHITECTURE FIX: 'allJobs' holds the raw database data. 'jobs' holds the filtered data for the UI.
    const [allJobs, setAllJobs] = useState([]); 
    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(false);
    const [userJobs, setUserJobs] = useState([]);

    const [searchQuery, setSearchQuery] = useState({
        tags: "",
        location: "",
        title: "",
    });

    // Filters
    const [filters, setFilters] = useState({
        fullTime: false,
        partTime: false,
        internship: false,
        contract: false,
        fullStack: false,
        backend: false,
        devOps: false,
        uiUx: false, // Updated to match the camelCase in your Filters.tsx
    });

    const [minSalary, setMinSalary] = useState(0);
    const [maxSalary, setMaxSalary] = useState(3000000);
    
    // ✨ FIX: This tracks if the user has actually touched the salary slider
    const [isSalaryFiltered, setIsSalaryFiltered] = useState(false);

    const getJobs = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/v1/jobs");
            console.log("Current User:", JSON.stringify(auth0User, null, 2));
            setAllJobs(res.data); // Save raw data to allJobs
        } catch (error) {
            console.error("Error fetching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (jobData) => {
        try {
            const res = await axios.post("/api/v1/jobs", jobData);
            toast.success("Job created successfully");
            const newJob = res.data.Newjob;

            setAllJobs((prevJobs) => [newJob, ...prevJobs]);
            
            // update userjobs
            if (userProfile?._id) {
                setUserJobs((prevUserJobs) => [newJob, ...prevUserJobs]);
                await getUserJobs(userProfile._id);
            }
            await getJobs();
            
            router.push(`/job/${newJob._id}`);
        } catch (error) {
            console.error("Error creating job", error);
        }   
    };
    
    const getUserJobs = async (userId) => {
        setLoading(true);  
        try {
            const res = await axios.get("/api/v1/jobs/user/" + userId);
            setUserJobs(res.data);
        } catch (error) {
            console.error("Error fetching user jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const searchJobs = async (tags, location, title) => {
        setLoading(true);
        try {
            // build query string
            const querry = new URLSearchParams(); 
            if(tags) querry.append("tags", tags);
            if(location) querry.append("location", location);
            if(title) querry.append("title", title);

            // send request
            const res = await axios.get(`/api/v1/jobs/search?${querry.toString()}`);
            setAllJobs(res.data); // Save search results to raw data
        } catch (error) {
            console.error("Error searching jobs", error);
        } finally {
            setLoading(false);
        }
    };

    // get job by id
    const getJobById = async (jobId) => {
        setLoading(true);  
        try {
            const res = await axios.get(`/api/v1/jobs/${jobId}`);
            return res.data;
        } catch (error) {
            console.error("Error fetching job by id", error);
        } finally {
            setLoading(false);
        }  
    };

    // like a job
    const likeJob = async (jobId) => {
        console.log("Job liked", jobId);
        try {
            const res = await axios.put(`/api/v1/jobs/like/${jobId}`); 
            toast.success(res.data.message || "Updated likes");
            getJobs();
        } catch (error) {
            console.error("Error liking job", error);
        }   
    };

    // apply to a job
    const applyToJob = async (jobId) => {
        // Find job from the raw list
        const job = allJobs.find((j) => j._id === jobId);
        if (!job) return toast.error("Job not found");

        // Handle JSearch/External links
        if (job.source && job.source !== 'Manual') {
            const link = job.externalLink || job.job_apply_link || job.job_google_link;
            return window.open(link, "_blank");
        }

        // Handle Manual links
        try {
            await axios.put(`/api/v1/jobs/apply/${jobId}`); 
            toast.success("Applied to job successfully");
            getJobs();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying to job");
        }
    };

    // delete a job
    const deleteJob = async (jobId) => {
        try {
            await axios.delete(`/api/v1/jobs/${jobId}`);
            setAllJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
            setUserJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
            toast.success("Job deleted successfully");
        } catch (error) {
            console.error("Error deleting job", error);
            toast.error(error.response?.data?.message || "Error deleting job");
        }   
    };
    
    const handleSearchChange = useCallback((searchName, value) => {
        setSearchQuery((prev) => ({ ...prev, [searchName]: value }));
    }, []);

    const handleFilterChange = useCallback((filterName) => {
        setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
    }, []);


    // -------------------------------------------------------------
    // ✨ THE MASTER FILTER EFFECT ✨
    // This runs locally instantly every time you touch a checkbox or slider
    // -------------------------------------------------------------
    useEffect(() => {
        const locallyFiltered = allJobs.filter((job) => {
            
            // 1. Job Type Logic
            const typeActive = filters.fullTime || filters.partTime || filters.contract || filters.internship;
            if (typeActive) {
                const jType = String(job.jobType || "").toUpperCase();
                const matchesType = 
                    (filters.fullTime && jType.includes("FULLTIME")) ||
                    (filters.partTime && jType.includes("PARTTIME")) ||
                    (filters.contract && (jType.includes("CONTRACT") || jType.includes("CONTRACTOR"))) ||
                    (filters.internship && jType.includes("INTERN"));
                if (!matchesType) return false; // Hide job if it doesn't match checked boxes
            }

            // 2. Tags Logic
            const tagsActive = filters.fullStack || filters.backend || filters.devOps || filters.uiUx;
            if (tagsActive) {
                // Handle both array-style and string-style tags
                const jTags = Array.isArray(job.tags) ? job.tags.map(t => t.toLowerCase()) : String(job.tags || "").toLowerCase();
                const matchesTag = 
                    (filters.fullStack && (jTags.includes("full stack") || jTags.includes("fullstack"))) ||
                    (filters.backend && jTags.includes("backend")) ||
                    (filters.devOps && jTags.includes("devops")) ||
                    (filters.uiUx && (jTags.includes("ui/ux") || jTags.includes("uiux") || jTags.includes("ui ux")));
                if (!matchesTag) return false;
            }

            // 3. Salary Logic (ONLY APPLIES IF SLIDER WAS TOUCHED)
            if (isSalaryFiltered) {
                const jSalary = Number(job.salary || job.job_min_salary || 0);
                if (jSalary < minSalary || jSalary > maxSalary) {
                    return false; // Hide job if it's outside the slider range
                }
            }

            // If it passed all tests, show it!
            return true; 
        });

        // Set the exported variable to the filtered array
        setJobs(locallyFiltered);

    }, [allJobs, filters, minSalary, maxSalary, isSalaryFiltered]);
    // -------------------------------------------------------------


    useEffect(() => {
        getJobs();
    },[]);

    useEffect(() => {
        // 👂 Listen for the "newJobAvailable" event
        socket.on("newJobAvailable", (newJob) => {
            setAllJobs((prevJobs) => [newJob, ...prevJobs]);
            toast.success("New job posted just now!");
        });

        // Clean up when the user leaves the page
        return () => socket.off("newJobAvailable");
    }, []);

    useEffect(() => {   
        if(userProfile?._id){
            getUserJobs(userProfile._id);
        }   
    }, [userProfile?._id]);
    
    return (
        <JobsContext.Provider value={{
            jobs, // Now ALWAYS passes the cleanly filtered list to your Find Work page
            loading,  
            userJobs, 
            createJob,  
            searchJobs, 
            getJobById, 
            likeJob, 
            applyToJob, 
            deleteJob, 
            handleFilterChange, 
            filters, 
            minSalary, 
            setMinSalary, 
            maxSalary, 
            setMaxSalary, 
            searchQuery, 
            handleSearchChange, 
            setFilters,
            setSearchQuery,
            isSalaryFiltered,
            setIsSalaryFiltered
        }}>
            {children}
        </JobsContext.Provider>
    );      
}

export const useJobsContext = () => {
    return useContext(JobsContext);
}