"use client";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobContext";
import { Job } from "@/types/custom";
import { Calendar, ExternalLink, MapPin } from "lucide-react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react"; 
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
  const recruiterName = createdBy?.name || "JobHelper Recruiter";
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
      case "full time": return "bg-green-500/10 text-green-600 border-green-200";
      case "part time": return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "contract": return "bg-red-500/10 text-red-600 border-red-200";
      case "internship": return "bg-indigo-500/10 text-indigo-600 border-indigo-200";
      default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getSourceStyle = (src: string | undefined) => {
    switch (src?.toLowerCase()) {
      case 'linkedin': return "bg-blue-100 text-blue-700 border-blue-200";
      case 'jsearch': return "bg-purple-100 text-purple-700 border-purple-200";
      case 'indeed': return "bg-blue-600 text-white border-blue-700";
      case 'ziprecruiter': return "bg-gray-800 text-white border-gray-900";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div
      onClick={() => router.push(`/job/${_id}`)}
      className={`p-6 rounded-[32px] flex flex-col gap-5 transition-all relative group cursor-pointer
    ${
      activeJob
        ? "bg-white shadow-xl border-2 border-[#7263f3]"
        : "bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-1"
    }`}
    >
      {/* --- TOP SECTION: LOGO & BADGE AREA --- */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center flex-1 min-w-0">
          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
            <Image
              src={recruiterAvatar}
              alt={recruiterName}
              width={56}
              height={56}
              className="object-contain p-1"
              unoptimized
            />
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            {/* Title with clamping and padding to prevent hitting the badge column */}
            <h4 className="group-hover:text-[#7263f3] text-lg font-black transition-colors line-clamp-1 pr-2">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-tight">
              <span className="truncate max-w-[100px]">{recruiterName}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-[#7263f3]">
                <MapPin size={12} /> {location}
              </span>
            </div>
          </div>
        </div>

        {/* --- ACTION COLUMN (Badge + Bookmark) --- */}
        <div className="flex flex-col items-end gap-3 shrink-0 ml-2">
          {source && (
            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black border uppercase tracking-widest shadow-sm ${getSourceStyle(source)}`}>
              {source === 'Manual' ? 'Direct' : `via ${source}`}
            </div>
          )}
          
          <button
            className={`p-2 rounded-full transition-all active:scale-90 hover:bg-gray-50 ${
              isLiked ? "text-[#7263f3] bg-purple-50" : "text-gray-300"
            } `}
            onClick={(e) => {
              e.stopPropagation(); 
              isAuthenticated ? likeJob(_id) : router.push("/login");
            }}
          >
            {isLiked ? bookmark : bookmarkEmpty}
          </button>
        </div>
      </div>

      {/* --- TAGS & APPLICANTS --- */}
      <div className="flex items-center gap-2 flex-wrap">
        {jobType.map((type, index) => (
          <span
            key={index}
            className={`py-1 px-3 text-[10px] font-black uppercase rounded-full border tracking-tighter ${jobTypeBg(type)}`}
          >
            {type}
          </span>
        ))}
        <span className="text-[10px] font-black text-gray-400 ml-auto uppercase tracking-widest">
          {applicants.length} {applicants.length === 1 ? "Applicant" : "Applicants"}
        </span>
      </div>

      <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 font-medium">
        {cleanDescription}
      </p>

      <Separator className="opacity-50" />

      {/* --- BOTTOM SECTION --- */}
      <div className="flex justify-between items-center mt-auto">
        <div>
          <p className="flex items-baseline gap-1">
            <span className="font-black text-2xl text-gray-900">{formatMoney(salary, "INR")}</span>
            <span className="font-bold text-gray-400 text-[10px] uppercase">
              /{salaryType === "Yearly" ? "yr" : salaryType === "Monthly" ? "mo" : "wk"}
            </span>
          </p>
          <p className="flex items-center gap-1.5 text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
            <Calendar size={12} className="text-[#7263f3]" />
            Posted {formatDates(createdAt)}
          </p>
        </div>

        <Button 
          onClick={handleApply}
          className="bg-[#7263f3] hover:bg-[#5e4ee0] text-white rounded-2xl px-6 py-6 font-black uppercase tracking-widest text-xs shadow-xl shadow-[#7263f3]/20 transition-all hover:scale-105 active:scale-95"
        >
          Apply <ExternalLink size={14} className="ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default JobCard;