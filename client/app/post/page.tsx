"use client";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import JobForm from "@/component/jobPost/JobForm";
import { useGlobalContext } from "@/context/globalContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Megaphone, LayoutList } from "lucide-react";

function Page() {
  const { isAuthenticated, loading } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(process.env.NODE_ENV === "production" ? "https://prashikshan.onrender.com/login" : "http://localhost:8000/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return null;

  return (
    <div className="bg-[#F8F9FB] min-h-screen flex flex-col">
      <Header />

      {/* 🚀 MODERN HEADER BANNER */}
      <div className="bg-[#1e1b4b] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-[1400px] mx-auto w-[95%] relative z-10 flex items-center gap-6">
            <div className="p-5 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20 shadow-2xl">
               <Megaphone size={40} className="text-amber-400" />
            </div>
            <div>
               <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-2">Employer Portal</p>
               <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Create a New Job Post</h1>
               <p className="text-gray-400 font-medium mt-2 max-w-lg">Fill out the details below to publish an opportunity and connect with talented candidates across the platform.</p>
            </div>
        </div>
      </div>

      <div className="flex-1 py-12 px-6">
        <div className="max-w-[1400px] mx-auto w-full lg:w-[95%] flex flex-col xl:flex-row gap-8 items-start">
          
          {/* Informational Sidebar */}
          <div className="w-full xl:w-[320px] bg-white rounded-3xl p-8 border border-gray-100 shadow-sm shrink-0 sticky top-24 animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-2"><LayoutList className="text-[#7263f3]" size={20}/> Best Practices</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#7263f3] font-black text-xs flex items-center justify-center shrink-0">1</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Clear Title</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Use industry-standard titles so candidates can easily find your post.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#7263f3] font-black text-xs flex items-center justify-center shrink-0">2</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Detailed Description</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Outline responsibilities, requirements, and perks clearly.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#7263f3] font-black text-xs flex items-center justify-center shrink-0">3</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Accurate Tags</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Add relevant skills to match with the best algorithms.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* The Form Itself */}
          <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <JobForm />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Page;