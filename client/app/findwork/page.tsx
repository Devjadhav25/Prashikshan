"use client";
import React from "react";
import Image from "next/image";
import Filters from "@/component/Filters";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import JobCard from "@/component/jobItem/jobCard";
import SearchForm from "@/component/SearchForm";
import { useJobsContext } from "@/context/jobContext";
import { Job } from "@/types/custom";
import { grip, list, table } from "@/utils/icons";

function Page() {
  const { jobs, filters, searchQuery } = useJobsContext();
  const [columns, setColumns] = React.useState(3);

  const toggleGridColumns = () => {
    setColumns((prev) => (prev === 3 ? 2 : prev === 2 ? 1 : 3));
  };

  // ✅ Filtering logic that includes search bar values
  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.title.toLowerCase()) &&
                          job.location.toLowerCase().includes(searchQuery.location.toLowerCase());

    const noFilters = !filters.fullTime && !filters.partTime && !filters.contract && !filters.internship;
    const matchesType = noFilters || 
                        (filters.fullTime && job.jobType.includes("Full Time")) ||
                        (filters.partTime && job.jobType.includes("Part Time")) ||
                        (filters.contract && job.jobType.includes("Contract")) ||
                        (filters.internship && job.jobType.includes("Internship"));

    return matchesSearch && matchesType;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />

      <div className="relative px-6 md:px-16 bg-[#D7DEDC] overflow-hidden py-12">
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-black font-bold text-3xl md:text-5xl mb-8">
            Find Your Next Job Here
          </h1>
          <SearchForm />
        </div>

        {/* Responsive Hero Images */}
        <div className="hidden lg:block">
          <Image
            src="/woman-on-phone.jpg"
            alt="hero"
            width={220}
            height={500}
            className="clip-path absolute top-0 right-20 h-full object-cover opacity-80"
          />
        </div>
      </div>

      <div className="w-[95%] max-w-[1400px] mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Jobs</h2>
          <button onClick={toggleGridColumns} className="hidden md:flex items-center gap-2 border px-4 py-2 rounded-full bg-white shadow-sm">
            <span>{columns === 3 ? "Grid View" : columns === 2 ? "Table View" : "List View"}</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[280px] shrink-0">
            <Filters />
          </div>

          <div className={`flex-1 grid gap-6 ${
            columns === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : 
            columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}>
            {filteredJobs.map((job: Job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default Page;