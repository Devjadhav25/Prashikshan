"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useJobsContext } from "@/context/jobContext";
import { useGlobalContext } from "@/context/globalContext";
import { formatDates } from "@/utils/formatDate";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import JobCard from "@/component/jobItem/jobCard";
import { Job } from "@/types/custom";
import formatMoney from "@/utils/formatMoney";
import { Bookmark, ExternalLink, MapPin, Briefcase, Clock, Users, Building2 } from "lucide-react";

function Page() {
  const { jobs, likeJob, applyToJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const job = jobs.find((job: Job) => job._id === id);
  const otherJobs = jobs.filter((job: Job) => job._id !== id);

  if (!job) return null;

  const likes = Array.isArray(job.likes) ? job.likes : [];
  const applicants = Array.isArray(job.applicants) ? job.applicants : [];
  const isLiked = !!userProfile?._id && likes.includes(userProfile._id);
  const isApplied = !!userProfile?._id && applicants.includes(userProfile._id);

  const {
    title,
    location,
    description,
    salary,
    createdBy,
    jobType,
    createdAt,
    salaryType,
    negotiable,
    employer_logo,
    externalLink,
    source,
    job_apply_link,
    job_google_link
  } = job;

  // ✅ FIX: Prioritize JSearch logo, then recruiter pic, then fallback icon
  const recruiterName = createdBy?.name || "Prashikshan Recruiter";
  const recruiterAvatar = employer_logo || createdBy?.profilePicture || "/user.png";

  const handleLike = (jobId: string) => {
    likeJob(jobId);
  };

  const handleShare = () => {
    const shareUrl = externalLink || job_apply_link || window.location.href;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Job link copied to clipboard!");
  };

  // ✅ IMPROVED PARSER: Fixes sentence gaps and bullet alignment
  const formatDescription = (text: string) => {
    if (!text) return "No description provided.";
    if (text.includes("<") && text.includes(">")) return text;

    return text
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return ""; 

        // Detect Headers
        const isHeader = /^(requirements|responsibilities|what you|about the|qualifications|benefits|skills|summary|who we)/i.test(trimmed) || trimmed.endsWith(':');
        
        if (isHeader) {
          return `<h3 class="text-lg font-extrabold text-gray-900 mt-8 mb-4 uppercase tracking-tight">${trimmed.replace(':', '')}</h3>`;
        }

        // Detect and Fix Bullet Points (Ensures text doesn't wrap under the bullet)
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          const content = trimmed.replace(/^[-•*\d.]+\s*/, "");
          return `<div class="flex items-start gap-3 mb-2 ml-1">
                    <span class="text-[#7263f3] mt-1.5 flex-shrink-0 text-xs">●</span>
                    <span class="text-gray-600 leading-relaxed text-sm md:text-base">${content}</span>
                  </div>`;
        }

        // Regular sentences
        return `<p class="text-gray-600 leading-relaxed mb-4 text-sm md:text-base">${trimmed}</p>`;
      })
      .filter(line => line !== "")
      .join("");
  };

  const handleApply = () => {
    const applyDestination = externalLink || job_apply_link || job_google_link;
    if (source !== "Manual" && applyDestination) {
      window.open(applyDestination, "_blank", "noopener,noreferrer");
      return;
    }
    if (isAuthenticated) {
      if (!isApplied) {
        applyToJob(job._id);
      } else {
        toast.error("You have already applied to this job");
      }
    } else {
      router.push("https://prashikshan.onrender.com/login");
    }
  };

  return (
    <main className="bg-[#F4F7FE] min-h-screen">
      <Header />

      {/* ✅ FIX: Added larger gap and overflow-hidden to prevent sidebar overlap */}
      <div className="pt-8 pb-20 px-4 md:px-8 mx-auto w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 lg:gap-12 overflow-hidden">
        
        {/* LEFT SIDEBAR - Suggestions (Set width to prevent overlap) */}
        <div className="hidden lg:flex lg:w-[360px] flex-shrink-0 flex-col gap-8">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-4">Active Position</h3>
              <JobCard activeJob job={job} />
            </div>

            <div>
              <h3 className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mb-4">Similar Opportunities</h3>
              <div className="space-y-4">
                {otherJobs.slice(0, 2).map((otherJob: Job) => (
                  <JobCard job={otherJob} key={otherJob._id} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 min-w-0">
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 relative overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-3 border border-gray-100">
                  <Image
                    src={recruiterAvatar}
                    alt={recruiterName}
                    width={80}
                    height={80}
                    className="object-contain"
                    unoptimized // Prevents potential issues with external API logos
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-2">{title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-400 font-bold text-xs uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#7263f3]"/> {location}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5"><Building2 size={14}/> {source}</span>
                  </div>
                </div>
              </div>
              <button
                className={`p-3 rounded-2xl transition-all shadow-sm ${
                  isLiked ? "bg-[#7263f3] text-white" : "bg-white text-gray-300 border border-gray-100"
                }`}
                onClick={() => isAuthenticated ? handleLike(job._id) : router.push("https://prashikshan.onrender.com/login")}
              >
                <Bookmark size={22} fill={isLiked ? "white" : "none"} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: <Briefcase size={18}/>, label: "Salary", value: formatMoney(salary, "INR"), sub: `/${salaryType}`, color: "green" },
                { icon: <Clock size={18}/>, label: "Posted", value: formatDates(createdAt), sub: "Ago", color: "blue" },
                { icon: <Users size={18}/>, label: "Applicants", value: applicants.length, sub: "Applied", color: "purple" },
                { icon: <Clock size={18}/>, label: "Type", value: jobType[0] || "Full Time", sub: "Contract", color: "yellow" }
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-50 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className={`p-2 bg-${stat.color}-50 text-${stat.color}-600 rounded-xl mb-1`}>{stat.icon}</div>
                  <span className="text-[10px] text-gray-400 font-black uppercase mb-1">{stat.label}</span>
                  <span className="font-bold text-gray-900 text-sm">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Structured Description */}
            <div className="max-w-none">
              <h2 className="text-xl font-black text-gray-900 mb-6 border-b pb-4">Job Description</h2>
              <div
                className="description-container"
                dangerouslySetInnerHTML={{ __html: formatDescription(description) }}
              ></div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Actions */}
        <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col gap-8">
          <div className="space-y-4">
            <button
              className={`w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase shadow-lg shadow-indigo-100 transition-all ${
                isApplied ? "bg-emerald-500 text-white cursor-default" : "bg-[#7263f3] text-white"
              }`}
              onClick={handleApply}
            >
              {source !== "Manual" ? (
                <span className="flex items-center justify-center gap-2">Apply on Site <ExternalLink size={16} /></span>
              ) : isApplied ? "Applied" : "Apply Now"}
            </button>

            <button 
              onClick={handleShare}
              className="w-full py-3 rounded-2xl border border-gray-100 bg-white text-gray-600 font-black text-xs uppercase tracking-widest shadow-sm"
            >
              Share Job Opportunity
            </button>
          </div>

          {/* Re-labeled to Skills */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8">
            <div>
              <h3 className="font-black text-gray-900 mb-5 text-sm uppercase tracking-widest">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-4 py-2 rounded-xl text-[11px] font-bold bg-indigo-50 text-[#7263f3]">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">Mentioned in description.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-black text-gray-900 mb-5 text-sm uppercase tracking-widest">Category Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags && job.tags.length > 0 ? (
                  job.tags.map((tag: string, index: number) => (
                    <span key={index} className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No tags listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Page;