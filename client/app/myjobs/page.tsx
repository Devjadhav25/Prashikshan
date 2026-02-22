"use client"
import Header from '@/component/Header'
import { useGlobalContext } from '@/context/globalContext';
import { useJobsContext } from '@/context/jobContext';
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Job } from '@/types/custom';
import MyJob from '@/component/jobItem/MyJob';
import Footer from '@/component/Footer';
import { Heart, Briefcase, PlusCircle, Bookmark } from 'lucide-react';

function Page() {
  const [activeTab, setActiveTab] = useState("posts");
  const { userJobs, jobs } = useJobsContext();
  const { isAuthenticated, loading, userProfile } = useGlobalContext();

  const userIds = userProfile?._id;
  const router = useRouter();

  const likedJobs = jobs ? jobs.filter((job: Job) => {
    return job.likes && job.likes.includes(userIds);
  }) : [];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(process.env.NODE_ENV === "production" ? "https://prashikshan.onrender.com/login" : "http://localhost:8000/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#7263F3]"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#F8F9FB] min-h-screen flex flex-col">
      <Header />

      {/* 🚀 MODERN HEADER BANNER */}
      <div className="bg-[#1e1b4b] text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7263f3]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto w-[95%] relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                 <Briefcase size={36} className="text-emerald-400" />
              </div>
              <div>
                 <h1 className="text-3xl md:text-5xl font-black tracking-tighter">My Activity</h1>
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">Manage your job posts and saved opportunities</p>
              </div>
            </div>

            {/* SEGMENTED TOGGLE CONTROL */}
            <div className="flex items-center bg-white/10 p-1.5 rounded-2xl shadow-inner border border-white/20 backdrop-blur-md">
                <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                    ${activeTab === "posts" ? "bg-white text-indigo-900 shadow-lg" : "text-white/80 hover:bg-white/10"}`}
                    onClick={() => setActiveTab("posts")}
                >
                    <Briefcase size={16}/> My Posts ({userJobs?.length || 0})
                </button>
                <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all
                    ${activeTab === "likes" ? "bg-white text-indigo-900 shadow-lg" : "text-white/80 hover:bg-white/10"}`}
                    onClick={() => setActiveTab("likes")}
                >
                    <Bookmark size={16}/> Saved Jobs ({likedJobs?.length || 0})
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 w-[95%] max-w-[1400px] mx-auto py-12">
        {/* EMPTY STATES */}
        {activeTab === "posts" && (!userJobs || userJobs.length === 0) && (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto mt-10 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlusCircle size={32} className="text-[#7263f3]" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">No job posts yet</h2>
            <p className="text-gray-500 font-medium mb-8">Looking to hire? Create your first job post to find top talent from our platform.</p>
            <button onClick={() => router.push('/post')} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#7263f3] hover:-translate-y-1 transition-all">Create New Job Post</button>
          </div>
        )}

        {activeTab === "likes" && likedJobs.length === 0 && (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 shadow-sm max-w-2xl mx-auto mt-10 animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Your saved list is empty</h2>
            <p className="text-gray-500 font-medium mb-8">Browse the Find Work section and bookmark jobs that catch your eye to apply later.</p>
            <button onClick={() => router.push('/findwork')} className="bg-[#7263f3] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#7263f3]/20 hover:bg-[#5e4ee0] hover:-translate-y-1 transition-all">Explore Jobs</button>
          </div>
        )}

        {/* JOB GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "posts" && userJobs && userJobs.map((job: Job) => (
            <MyJob key={job._id} job={job} />
          ))}

          {activeTab === "likes" && likedJobs.map((job: Job) => (
            <MyJob key={job._id} job={job} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Page;