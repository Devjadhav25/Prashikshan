"use client"
import Header from '@/component/Header'
import { useGlobalContext } from '@/context/globalContext';
import { useJobsContext } from '@/context/jobContext';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Job } from '@/types/custom';
import MyJob from '@/component/jobItem/MyJob';
import Footer from '@/component/Footer';





function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const { userJobs, jobs } = useJobsContext();
  const { isAuthenticated , loading , userProfile} = useGlobalContext();

  const userIds = userProfile?._id;
  const router = useRouter();

  // Inside Page() component in myjobs/page.tsx
const likedJobs = jobs ? jobs.filter((job: Job) => {
  // ✅ Change 'applicants' to 'likes' to correctly show liked jobs
  return job.likes && job.likes.includes(userIds);
}) : [];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("http://localhost:8000/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }
  return (
    <div>
      <Header />

      <div className="mt-8 w-[90%] mx-auto flex flex-col">
        <div className="self-center flex items-center gap-6">
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium
          ${
            activeTab === "posts"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`}
            onClick={() => setActiveTab("posts")}
          >
            My Job Posts
          </button>
          <button
            className={`border border-gray-400 px-8 py-2 rounded-full font-medium
          ${
            activeTab === "likes"
              ? "border-transparent bg-[#7263F3] text-white"
              : "border-gray-400"
          }`}
            onClick={() => setActiveTab("likes")}
          >
            Liked Jobs
          </button>
        </div>

        {activeTab === "posts" && userJobs && userJobs.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No job posts found.</p>
          </div>
        )}

        {activeTab === "likes" && likedJobs.length === 0 && (
          <div className="mt-8 flex items-center">
            <p className="text-2xl font-bold">No liked jobs found.</p>
          </div>
        )}

        <div className="my-8 grid grid-cols-2 gap-6">
          {activeTab === "posts" && userJobs &&
            userJobs.map((job: Job) => <MyJob key={job._id} job={job} />)}

          {activeTab === "likes" && likedJobs &&
            likedJobs.map((job: Job) => <MyJob key={job._id} job={job} />)}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Page
