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
      className="flex flex-col md:flex-row items-stretch md:items-center bg-white rounded-2xl md:rounded-full shadow-lg overflow-hidden p-2 gap-2"
      onSubmit={handleSubmit}
    >
      {/* Title Input */}
      <div className="flex-1 relative w-full border-b md:border-b-0 md:border-r border-gray-100">
        <input
          type="text"
          name="title"
          value={searchQuery.title}
          onChange={(e) => handleSearchChange("title", e.target.value)}
          placeholder="Job Title or Keywords"
          className="w-full py-4 md:py-5 text-base md:text-lg text-black pl-12 outline-none rounded-full"
        />
        <Search
          size={20}
          className="text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
        />
      </div>

      {/* Location Input */}
      <div className="flex-1 relative w-full">
        <input
          type="text"
          name="location"
          value={searchQuery.location}
          onChange={(e) => handleSearchChange("location", e.target.value)}
          placeholder="Enter Location"
          className="w-full py-4 md:py-5 text-base md:text-lg text-black pl-12 outline-none rounded-full"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2">
          <MapPin size={20} className="text-gray-400" />
        </span>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="w-full md:w-auto bg-[#7263F3] hover:bg-[#6355d8] text-white text-lg font-semibold px-10 py-4 md:h-[56px] rounded-xl md:rounded-full transition-all shrink-0"
      >
        Search
      </button>
    </form>
  );
}

export default SearchForm;