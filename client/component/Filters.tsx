"use client";
import React from "react";
import { useJobsContext } from "@/context/jobContext";
import formatMoney from "@/utils/formatMoney";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Filters() {
  const {
    handleFilterChange,
    filters,
    setFilters,
    minSalary,
    maxSalary,
    setMinSalary,
    setMaxSalary,
    searchJobs,
    setSearchQuery,
  } = useJobsContext();

  const clearAllFilters = () => {
    setFilters({
      fullTime: false,
      partTime: false,
      contract: false,
      internship: false,
      fullStack: false,
      backend: false,
      devOps: false,
      uiUx: false,
    });
    setSearchQuery({ tags: "", location: "", title: "" });
    // Reset Salary too
    setMinSalary(30000);
    setMaxSalary(3000000);
  };

  const handleMinSalaryChange = (value: number[]) => {
    setMinSalary(value[0]);
    if (value[0] > maxSalary) setMaxSalary(value[0]);
  };

  const handleMaxSalaryChange = (value: number[]) => {
    setMaxSalary(value[0]);
    if (value[0] < minSalary) setMinSalary(value[0]);
  };

  return (
    <div className="w-full md:w-[280px] space-y-8 p-4 bg-white rounded-lg border border-gray-100 md:border-none shadow-sm md:shadow-none">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Job Type</h2>
          <Button
            variant="ghost"
            className="h-auto p-0 text-red-500 hover:text-red-700 font-medium text-sm"
            onClick={() => {
              clearAllFilters();
              searchJobs();
            }}
          >
            Clear All
          </Button>
        </div>
        <div className="space-y-3">
          {["fullTime", "partTime", "contract", "internship"].map((type) => (
            <div key={type} className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                id={type}
                checked={filters[type as keyof typeof filters]}
                onCheckedChange={() => handleFilterChange(type)}
              />
              <Label htmlFor={type} className="text-sm font-medium cursor-pointer">
                {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Tags</h2>
        <div className="space-y-3">
          {["fullStack", "backend", "devOps", "uiUx"].map((tag) => (
            <div key={tag} className="flex items-center space-x-3 cursor-pointer">
              <Checkbox
                id={tag}
                checked={filters[tag as keyof typeof filters]}
                onCheckedChange={() => handleFilterChange(tag)}
              />
              <Label htmlFor={tag} className="text-sm font-medium cursor-pointer">
                {tag === "uiUx" ? "UI/UX" : tag.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-bold">Salary Range</h2>
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            {/* ✅ FIXED: Changed GBP to INR */}
            <Label htmlFor="minSalary" className="text-sm">Min: <span className="font-bold text-[#7263f3]">{formatMoney(minSalary, "INR")}</span></Label>
            <Slider
              id="minSalary"
              min={0}
              max={3000000} 
              step={50000} 
              value={[minSalary]}
              onValueChange={handleMinSalaryChange}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            {/* ✅ FIXED: Changed GBP to INR */}
            <Label htmlFor="maxSalary" className="text-sm">Max: <span className="font-bold text-[#7263f3]">{formatMoney(maxSalary, "INR")}</span></Label>
            <Slider
              id="maxSalary"
              min={0}
              max={3000000}
              step={50000}
              value={[maxSalary]}
              onValueChange={handleMaxSalaryChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Filters;