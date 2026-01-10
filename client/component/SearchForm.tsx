"use client";
import { useJobsContext } from "@/context/jobContext";
import { Search, MapPin } from "lucide-react";
import React from "react";

function SearchForm() {
  const { searchJobs, handleSearchChange, searchQuery } = useJobsContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobs(searchQuery.tags, searchQuery.location, searchQuery.title);
  };

  return (
    <form
      className="flex flex-col md:flex-row items-stretch md:items-center bg-white/60 backdrop-blur-xl border border-white rounded-[32px] md:rounded-full shadow-2xl p-3 gap-2"
      onSubmit={handleSubmit}
    >
      <div className="flex-1 relative w-full border-b md:border-b-0 md:border-r border-gray-200/50">
        <input
          type="text"
          name="title"
          value={searchQuery.title}
          onChange={(e) => handleSearchChange("title", e.target.value)}
          placeholder="Job Title or Keywords"
          className="w-full py-4 md:py-6 text-lg text-gray-900 pl-14 outline-none rounded-full bg-transparent placeholder:text-gray-400 font-medium"
        />
        <Search size={22} className="text-[#7263f3] absolute left-6 top-1/2 -translate-y-1/2" />
      </div>

      <div className="flex-1 relative w-full">
        <input
          type="text"
          name="location"
          value={searchQuery.location}
          onChange={(e) => handleSearchChange("location", e.target.value)}
          placeholder="Enter Location"
          className="w-full py-4 md:py-6 text-lg text-gray-900 pl-14 outline-none rounded-full bg-transparent placeholder:text-gray-400 font-medium"
        />
        <MapPin size={22} className="text-[#7263f3] absolute left-6 top-1/2 -translate-y-1/2" />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-[#7263f3] hover:bg-[#5e4ee0] text-white text-lg font-black px-12 py-5 rounded-[24px] md:rounded-full transition-all shadow-xl shadow-[#7263f3]/20 hover:scale-[1.02] active:scale-95"
      >
        Search
      </button>
    </form>
  );
}

export default SearchForm;