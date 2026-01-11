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

// ✅ SUB-COMPONENT: This contains the main logic that uses searchParams
function FindWorkContent() {
  const { jobs, filters, searchQuery, handleSearchChange, loading } = useJobsContext();
  const [columns, setColumns] = useState(3);
  const searchParams = useSearchParams();
  
  // Ref for auto-scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  // ✅ AUTO-SYNC: Syncs search from Home Page Query Param
  const queryTitle = searchParams.get("title");
  
  useEffect(() => {
    // ✅ CRITICAL FIX: Only update if the value is DIFFERENT to prevent infinite loops
    if (queryTitle && queryTitle !== searchQuery.title) {
      handleSearchChange("title", queryTitle);
    }
  }, [queryTitle, handleSearchChange, searchQuery.title]);

  // ✅ AUTO-SCROLL: Scroll to results when a search is active (Mobile Friendly)
  useEffect(() => {
    // Check if there is a search query or title param, and ensure we aren't just loading the page for the first time
    if ((queryTitle || searchQuery.title) && jobs.length > 0) {
       // Small timeout to allow DOM to paint
       const timer = setTimeout(() => {
         resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
       }, 500);
       return () => clearTimeout(timer);
    }
  }, [queryTitle, searchQuery.title, jobs.length]);


  // ✅ FILTERING LOGIC
  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.title.toLowerCase()) &&
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

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="relative px-6 md:px-16 bg-[#D7DEDC] overflow-hidden py-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-black font-bold text-3xl md:text-5xl mb-8">
            Find Your Next Job Here
          </h1>
          <SearchForm />
        </div>

        <div className="hidden lg:block">
          <Image
            src="/woman-on-phone.jpg"
            alt="hero"
            width={220}
            height={500}
            className="absolute top-0 right-20 h-full object-cover opacity-80"
            style={{ clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          />
        </div>
      </div>

      <div className="w-[95%] max-w-[1400px] mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <div ref={resultsRef} className="scroll-mt-24">
            <h2 className="text-3xl font-bold">Recent Jobs</h2>
            <p className="text-gray-500 text-sm">Showing {filteredJobs.length} results</p>
          </div>
          
          <button 
            onClick={toggleGridColumns} 
            className="hidden md:flex items-center gap-2 border px-4 py-2 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-medium">
              {columns === 3 ? "Grid View" : columns === 2 ? "Table View" : "List View"}
            </span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[280px] shrink-0">
            <Filters />
          </div>

          <div className="flex-1">
            {loading ? (
                 <div className="flex flex-col items-center justify-center py-20">
                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
                     <p className="mt-4 text-gray-500">Loading jobs...</p>
                 </div>
            ) : filteredJobs.length > 0 ? (
              <div className={`grid gap-6 ${
                columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
                columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}>
                {filteredJobs.map((job: Job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No jobs found matching your criteria.</p>
                <button 
                  onClick={() => window.location.href = "/findwork"} 
                  className="mt-4 text-[#7263f3] text-sm underline underline-offset-4"
                >
                  Clear all filters
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

// ✅ MAIN EXPORT: Wrapped in Suspense to prevent "Client Side Exception" on build/runtime
export default function FindWorkPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7263F3]"></div>
      </div>
    }>
      <FindWorkContent />
    </Suspense>
  );
}