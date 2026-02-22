"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Pencil, Trash, Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { useJobsContext } from "@/context/jobContext";
import { Job } from "@/types/custom";
import { formatDates } from "@/utils/formatDate";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JobProps {
  job: Job;
}

function MyJob({ job }: JobProps) {
  const { deleteJob, likeJob } = useJobsContext();
  const { userProfile, isAuthenticated, getUserProfile } = useGlobalContext();
  
  const router = useRouter();

  // ✅ FIX: DERIVED STATE
  // Calculate isLiked directly from the job prop and userProfile.
  // This removes the "Cascading Render" error.
  const isLiked = userProfile?._id && Array.isArray(job.likes) 
    ? job.likes.includes(userProfile._id) 
    : false;

  const handleLike = (id: string) => {
    // Note: We don't need setIsLiked here anymore. 
    // The context will update 'job.likes' and React will re-render automatically.
    likeJob(id);
  };

  // ✅ FIX: Add null check for createdBy
  // Keep your existing profile fetch logic
  useEffect(() => {
    if (isAuthenticated && job.createdBy?._id) {
      getUserProfile(job.createdBy._id);
    }
  }, [isAuthenticated, job.createdBy?._id]); // ✅ Use optional chaining

  // ✅ Safe recruiter info (for API jobs where createdBy can be null)
  const recruiterName = job.createdBy?.name || "Prashikshan Recruiter";
  const recruiterAvatar = job.createdBy?.profilePicture || "/user.png";
  const recruiterId = job.createdBy?._id;

  return (
    <div className="p-8 bg-white rounded-xl flex flex-col gap-5">
      <div className="flex justify-between">
        <div
          className="flex items-center space-x-4 mb-2 cursor-pointer"
          onClick={() => router.push(`/job/${job._id}`)}
        >
          <Image
            alt={`logo`}
            src={recruiterAvatar}
            width={48}
            height={48}
            className="rounded-full shadow-sm"
          />

          <div>
            <CardTitle className="text-xl font-bold truncate">
              {job.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {recruiterName}
            </p>
          </div>
        </div>
        <button
          className={`text-2xl ${
            isLiked ? "text-[#7263f3]" : "text-gray-400"
          } `}
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when clicking bookmark
            isAuthenticated
              ? handleLike(job._id)
              : router.push("https://localhost:8000/login");
          }}
        >
          <Bookmark size={24} fill={isLiked ? "currentColor" : "none"} />
        </button>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
        <p className="text-sm text-muted-foreground mb-4">
          Posted {formatDates(job.createdAt)}
        </p>

        <div className="flex justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {(job.skills || []).map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {(job.tags || []).map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* ✅ FIX: Action buttons shown only if current user is the creator AND createdBy exists */}
          {recruiterId && recruiterId === userProfile?._id && (
            <div className="self-end flex items-center">
              <Button variant="ghost" size="icon" className="text-gray-500">
                <Pencil size={14} />
                <span className="sr-only">Edit job</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteJob(job._id);
                }}
              >
                <Trash size={14} />
                <span className="sr-only">Delete job</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyJob;