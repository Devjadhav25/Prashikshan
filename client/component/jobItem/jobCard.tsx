"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobContext";
import { Job } from "@/types/custom";
import { Calendar, ExternalLink, MapPin, Building2, Briefcase } from "lucide-react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react"; 
import { Separator } from "@/components/ui/separator";
import formatMoney from "@/utils/formatMoney";
import { formatDates } from "@/utils/formatDate";
import { bookmark, bookmarkEmpty } from "@/utils/icons";
import { Button } from "@/components/ui/button";

interface JobProps {
  job: Job;
  activeJob?: boolean;
}

function JobCard({ job, activeJob }: JobProps) {
  const { likeJob } = useJobsContext();
  const { userProfile, isAuthenticated } = useGlobalContext();
  const router = useRouter();
  
  const [imgError, setImgError] = useState(false);

  const isLiked = userProfile?._id && Array.isArray(job.likes) 
    ? job.likes.includes(userProfile._id) 
    : false;

  const {
    _id,
    title,
    location,
    salaryType,
    salary,
    createdBy,
    applicants,
    jobType,
    createdAt,
    employer_logo,
    source,
  } = job;
  
  const applyDestination = job.externalLink || job.job_apply_link || job.job_google_link;
  const recruiterName = createdBy?.name || "Prashikshan Recruiter";
  const recruiterAvatar = employer_logo || createdBy?.profilePicture || "/user.png";

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (applyDestination) {
      window.open(applyDestination, "_blank", "noopener,noreferrer");
    } else {
      router.push(`/job/${_id}`);
    }
  };

  const cleanDescription = job.description 
    ? job.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
    : "No description provided.";

  const jobTypeBg = (type: string) => {
    const t = type.toLowerCase().replace("-", " ");
    switch (t) {
      case "full time": return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "part time": return "bg-purple-50 text-purple-600 border-purple-200";
      case "contract": return "bg-amber-50 text-amber-600 border-amber-200";
      case "internship": return "bg-indigo-50 text-indigo-600 border-indigo-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getSourceStyle = (src: string | undefined) => {
    switch (src?.toLowerCase()) {
      case 'linkedin': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'jsearch': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'indeed': return "bg-blue-600 text-white border-blue-700";
      case 'ziprecruiter': return "bg-gray-800 text-white border-gray-900";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div
      onClick={() => router.push(`/job/${_id}`)}
      className={`p-6 rounded-3xl flex flex-col gap-5 transition-all duration-300 relative group cursor-pointer
    ${
      activeJob
        ? "bg-white shadow-xl ring-2 ring-[#7263f3]"
        : "bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1 hover:border-indigo-100"
    }`}
    >
      {/* --- TOP SECTION: LOGO, TITLE, LOCATION --- */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Left: Logo & Info */}
        <div className="flex gap-4 items-center overflow-hidden">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden shadow-sm relative p-2">
            {/* ✅ FIXED: Standard HTML img tag forces the logo to load, bypassing Next.js blockers */}
            {!imgError && recruiterAvatar ? (
              <img
                src={recruiterAvatar}
                alt={recruiterName}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)} // If image is broken, flip to Briefcase icon!
              />
            ) : (
              <Briefcase className="w-6 h-6 text-gray-400" /> 
            )}
          </div>

          <div className="flex flex-col overflow-hidden">
            <h4 className="text-lg font-black text-gray-900 group-hover:text-[#7263f3] transition-colors truncate">
              {title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs font-bold text-gray-500 uppercase tracking-tight">
              <span className="flex items-center gap-1 truncate max-w-[120px]">
                <Building2 size={12} className="shrink-0" /> {recruiterName}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0"></span>
              <span className="flex items-center gap-1 text-[#7263f3] truncate">
                <MapPin size={12} className="shrink-0" /> {location}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Bookmark */}
        <button
          className={`p-2 rounded-full transition-all active:scale-90 shrink-0 ${
            isLiked ? "text-[#7263f3] bg-indigo-50" : "text-gray-300 hover:bg-gray-50"
          } `}
          onClick={(e) => {
            e.stopPropagation(); 
            isAuthenticated ? likeJob(_id) : router.push("/login");
          }}
        >
          {isLiked ? bookmark : bookmarkEmpty}
        </button>
      </div>

      {/* --- MIDDLE SECTION: BADGES & DESC --- */}
      <div className="flex items-center gap-2 flex-wrap">
        {jobType.map((type, index) => (
          <span
            key={index}
            className={`py-1 px-3 text-[10px] font-black uppercase rounded-full border tracking-wider ${jobTypeBg(type)}`}
          >
            {type}
          </span>
        ))}
        {source && (
            <span className={`py-1 px-3 rounded-full text-[10px] font-black border uppercase tracking-wider ${getSourceStyle(source)}`}>
              {source === 'Manual' ? 'Direct' : `via ${source}`}
            </span>
        )}
        <span className="text-[10px] font-black text-gray-400 ml-auto uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
          {applicants?.length || 0} Applicants
        </span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-medium">
        {cleanDescription}
      </p>

      <Separator className="opacity-50" />

      {/* --- BOTTOM SECTION: SALARY & APPLY --- */}
      <div className="flex justify-between items-center mt-auto">
        <div>
          <p className="flex items-baseline gap-1">
            <span className="font-black text-2xl text-gray-900">{formatMoney(salary, "INR")}</span>
            <span className="font-bold text-gray-400 text-[10px] uppercase tracking-widest">
              /{salaryType === "Yearly" ? "yr" : salaryType === "Monthly" ? "mo" : "wk"}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
            <Calendar size={12} className="text-[#7263f3]" />
            {formatDates(createdAt)}
          </p>
        </div>

        <Button 
          onClick={handleApply}
          className="bg-[#7263f3] hover:bg-[#5e4ee0] text-white rounded-2xl px-6 py-5 font-black uppercase tracking-widest text-xs shadow-xl shadow-[#7263f3]/20 transition-all hover:scale-105 active:scale-95"
        >
          Apply <ExternalLink size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default JobCard;