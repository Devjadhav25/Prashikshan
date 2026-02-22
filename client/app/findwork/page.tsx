"use client";
import React, { useEffect, useState, Suspense, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Filters from "@/component/Filters";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import JobCard from "@/component/jobItem/jobCard";
import SearchForm from "@/component/SearchForm";
import { useJobsContext } from "@/context/jobContext";
import { Job } from "@/types/custom";
import { Briefcase, Sparkles, LayoutGrid, List } from "lucide-react";

function FindWorkContent() {
  const { 
    jobs, filters, searchQuery, handleSearchChange, loading, 
    minSalary, maxSalary, isSalaryFiltered 
  } = useJobsContext();
  
  const [columns, setColumns] = useState(3);
  const searchParams = useSearchParams();
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  const queryTitle = searchParams.get("title");
  
  useEffect(() => {
    if (queryTitle && queryTitle !== searchQuery.title) {
      handleSearchChange("title", queryTitle);
    }
  }, [queryTitle, handleSearchChange, searchQuery.title]);

  useEffect(() => {
    if ((queryTitle || searchQuery.title) && jobs.length > 0) {
       const timer = setTimeout(() => {
         resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [queryTitle, searchQuery.title, jobs.length]);

  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.title.toLowerCase()) &&
      job.location.toLowerCase().includes(searchQuery.location.toLowerCase());

    const noTypeFilters = !filters.fullTime && !filters.partTime && !filters.contract && !filters.internship;
    const matchesType = noTypeFilters || 
      (filters.fullTime && job.jobType.some(t => t.toLowerCase().includes("full"))) ||
      (filters.partTime && job.jobType.some(t => t.toLowerCase().includes("part"))) ||
      (filters.contract && job.jobType.some(t => t.toLowerCase().includes("contract"))) ||
      (filters.internship && job.jobType.some(t => t.toLowerCase().includes("intern")));

    const noCategoryFilters = !filters.fullStack && !filters.backend && !filters.devOps && !filters.uiux;
    const matchesCategory = noCategoryFilters ||
      (filters.fullStack && job.tags.some(tag => tag.toLowerCase().includes("stack"))) ||
      (filters.backend && job.tags.some(tag => tag.toLowerCase().includes("backend"))) ||
      (filters.devOps && job.tags.some(tag => tag.toLowerCase().includes("devops"))) ||
      (filters.uiux && job.tags.some(tag => tag.toLowerCase().includes("ui")));

    const matchesSalary = isSalaryFiltered ? (job.salary >= minSalary && job.salary <= maxSalary) : true; 

    return matchesSearch && matchesType && matchesCategory && matchesSalary;
  });

  return (
    <main className="bg-[#F8F9FB] min-h-screen">
      <Header />

      {/* 🚀 MODERN HERO BANNER */}
      <div className="bg-[#1e1b4b] text-white py-16 px-6 relative overflow-hidden">
        {/* Glowing Background Effects */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#7263f3]/20 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 text-sm font-bold text-amber-300 uppercase tracking-widest">
              <Sparkles size={16} /> Over {jobs.length}+ Opportunities
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">
              Discover your next <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7263f3] to-[#4facfe]">career move.</span>
            </h1>
            <div className="bg-white/10 p-2 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl">
                <SearchForm />
            </div>
          </div>

          <div className="hidden lg:block w-1/3 relative animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1e1b4b] via-transparent to-transparent z-10"></div>
            <Image
              src="/woman-on-phone.jpg"
              alt="Professional working"
              width={400}
              height={400}
              className="rounded-3xl shadow-2xl object-cover h-[350px] border border-white/10"
            />
          </div>
        </div>
      </div>

      {/* 🚀 MAIN CONTENT */}
      <div className="w-[95%] max-w-[1400px] mx-auto py-12">
        <div className="flex justify-between items-end mb-8">
          <div ref={resultsRef} className="scroll-mt-24">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
               <Briefcase className="text-[#7263f3]" size={28}/> Available Positions
            </h2>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-2">Showing {filteredJobs.length} results based on your criteria</p>
          </div>
          
          <button 
            onClick={toggleGridColumns} 
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white shadow-sm border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#7263f3] transition-colors font-bold text-sm"
          >
            {columns === 3 ? <><List size={18}/> List View</> : <><LayoutGrid size={18}/> Grid View</>}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* SIDEBAR FILTERS */}
          <div className="w-full lg:w-[300px] shrink-0 sticky top-24 z-10">
            <Filters />
          </div>

          {/* JOB GRID */}
          <div className="flex-1 w-full">
            {loading ? (
                 <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                     <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#7263F3]"></div>
                     <p className="mt-6 font-bold text-gray-500 tracking-widest uppercase text-sm">Fetching Top Roles...</p>
                 </div>
            ) : filteredJobs.length > 0 ? (
              <div className={`grid gap-6 animate-in fade-in duration-500 ${
                columns === 3 ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : 
                columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}>
                {filteredJobs.map((job: Job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                    <Briefcase size={32}/>
                </div>
                <p className="text-gray-900 font-black text-2xl mb-2">No roles match your criteria</p>
                <p className="text-gray-500 font-medium mb-6 text-center max-w-md">Try expanding your search radius, adjusting the salary slider, or removing some tags.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-8 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#7263f3] transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default function FindWorkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#7263F3]"></div>
      </div>
    }>
      <FindWorkContent />
    </Suspense>
  );
}