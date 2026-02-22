"use client";
import React from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { 
  BarChart3, Users, Building2, Award, MapPin, 
  TrendingUp, Briefcase, FileCheck, PieChart as PieChartIcon 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from "recharts";

export default function DirectorateDashboard() {
  // --- EXISTING MAHARASHTRA DATA ---
  const stateStats = {
    totalStudents: "142,500",
    activeInternships: "38,420",
    creditsAwarded: "115,000",
    partnerCompanies: "1,240"
  };

  const topColleges = [
    { name: "Shri Sant Gadge Baba College of Engineering and Technology, Bhusawal", students: 1240, credits: 4500, score: 98 },
    { name: "College of Engineering Pune (COEP)", students: 1100, credits: 4100, score: 95 },
    { name: "Veermata Jijabai Technological Institute (VJTI), Mumbai", students: 950, credits: 3800, score: 92 },
    { name: "Government College of Engineering, Chhatrapati Sambhajinagar", students: 820, credits: 3100, score: 88 },
  ];

  const topPartners = [
    { name: "Tech Mahindra", roles: "Software, IT", hired: 450 },
    { name: "Tata Consultancy Services (TCS)", roles: "Full Stack, Cloud", hired: 410 },
    { name: "Infosys", roles: "Data Analytics", hired: 380 },
    { name: "Reliance Jio", roles: "Networks, Telecom", hired: 320 },
  ];

  const regionalData = [
    { region: "Mumbai Metropolitan", percentage: 85 },
    { region: "Pune & Western Maharashtra", percentage: 78 },
    { region: "Khandesh & Northern Maharashtra", percentage: 65 },
    { region: "Vidarbha", percentage: 55 },
    { region: "Marathwada", percentage: 50 },
  ];

  // --- NEW RECHARTS MOCK DATA ---
  const collegeHoursData = [
    { name: "SSGBCOET", hours: 12500 },
    { name: "COEP Pune", hours: 10200 },
    { name: "VJTI Mumbai", hours: 8400 },
    { name: "PICT Pune", hours: 9100 },
    { name: "VIT Mumbai", hours: 7500 },
  ];

  const logbookStatusData = [
    { name: "Approved", value: 65, color: "#10b981" }, // Emerald
    { name: "Pending", value: 25, color: "#f59e0b" }, // Amber
    { name: "Rejected", value: 10, color: "#f43f5e" }, // Rose
  ];

  return (
    <main className="bg-[#F8F9FB] min-h-screen font-sans print:bg-white">
      <div className="print:hidden"><Header /></div>
      
      {/* 🚀 HEADER BANNER */}
      <div className="bg-[#1e1b4b] text-white py-16 px-6 md:px-12 relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#7263f3]/20 rounded-full blur-[120px]"></div>
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <span className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-4 border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full w-fit">
              <MapPin size={14} /> Maharashtra State Directorate
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
              State NEP & Internship <br /> Analytics Portal
            </h1>
            <p className="text-indigo-200 font-medium max-w-xl text-sm leading-relaxed">
              Real-time monitoring of Academia-Industry integration across technical institutions in Maharashtra. Tracking NEP 2020 credit distribution and corporate hiring metrics.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 flex items-center gap-4">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-black uppercase tracking-widest text-white">Live Data Feed Active</span>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 bg-white text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg hover:bg-gray-100 transition-all w-full"
            >
              Export State Report
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto py-12 px-6 md:px-12 space-y-8">
        
        {/* 1️⃣ TOP LEVEL METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform print:shadow-none print:border-2">
            <div className="p-4 bg-indigo-50 text-[#7263f3] rounded-2xl"><Users size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Students</p>
              <h2 className="text-3xl font-black text-gray-900 mt-1">{stateStats.totalStudents}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform print:shadow-none print:border-2">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><Briefcase size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Internships</p>
              <h2 className="text-3xl font-black text-gray-900 mt-1">{stateStats.activeInternships}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform print:shadow-none print:border-2">
            <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl"><Award size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NEP Credits Awarded</p>
              <h2 className="text-3xl font-black text-gray-900 mt-1">{stateStats.creditsAwarded}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:-translate-y-1 transition-transform print:shadow-none print:border-2">
            <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><Building2 size={28} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Industry Partners</p>
              <h2 className="text-3xl font-black text-gray-900 mt-1">{stateStats.partnerCompanies}</h2>
            </div>
          </div>
        </div>

        {/* 2️⃣ NEW: INTERACTIVE CHARTS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: BAR CHART (2/3 width) */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:shadow-none print:border-2">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                            <BarChart3 className="text-[#7263f3]" size={24} /> NEP Credits by Institute
                        </h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Total Internship Hours Logged</p>
                    </div>
                </div>
                {/* Recharts BarChart */}
                <div className="w-full h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={collegeHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 600 }} />
                            <Tooltip 
                                cursor={{ fill: '#f8f9fb' }}
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                            />
                            <Bar dataKey="hours" fill="#7263f3" radius={[8, 8, 0, 0]} barSize={45} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RIGHT: PIE CHART (1/3 width) */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col print:shadow-none print:border-2">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <FileCheck className="text-emerald-500" size={24} /> Verification Status
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Statewide Logbook Approvals</p>
                </div>

                {/* Recharts PieChart */}
                <div className="w-full flex-1 min-h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={logbookStatusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {logbookStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontWeight: 'bold' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                    {logbookStatusData.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-bold text-gray-600">{item.name} ({item.value}%)</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3️⃣ TWO COLUMN DATA LAYOUT (TABLES & BARS) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Top Colleges Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 print:shadow-none print:border-2">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><PieChartIcon className="text-amber-500" size={24}/> Leaderboard</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Based on student placement & credits</p>
                </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Institution Name</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Placed Students</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">NEP Credits</th>
                    <th className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Success Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topColleges.map((college, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-5 pr-4 flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${idx === 0 ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                            {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-gray-900 max-w-[300px] truncate" title={college.name}>{college.name}</span>
                      </td>
                      <td className="py-5 text-center text-sm font-bold text-gray-600">{college.students.toLocaleString()}</td>
                      <td className="py-5 text-center text-sm font-bold text-[#7263f3] bg-indigo-50/50 rounded-lg print:bg-transparent">{college.credits.toLocaleString()}</td>
                      <td className="py-5 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 print:bg-transparent print:border-none">
                           <TrendingUp size={12}/> {college.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Partners & Regions */}
          <div className="space-y-8">
            
            {/* Top Industry Partners */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 print:shadow-none print:border-2">
                <h3 className="text-xl font-black text-gray-900 mb-6">Top Industry Partners</h3>
                <div className="space-y-5">
                    {topPartners.map((partner, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                    <Building2 size={16} className="text-gray-400"/>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{partner.roles}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-gray-900">{partner.hired}</p>
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Hired</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Regional Engagement */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 print:shadow-none print:border-2">
                <h3 className="text-xl font-black text-gray-900 mb-6">Regional Engagement</h3>
                <div className="space-y-4">
                    {regionalData.map((region, idx) => (
                        <div key={idx}>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-gray-600">{region.region}</span>
                                <span className="text-[#7263f3]">{region.percentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden print:border print:border-gray-200">
                                <div 
                                    className="h-full bg-gradient-to-r from-[#7263f3] to-[#9a8fff] rounded-full print:bg-[#7263f3]" 
                                    style={{ width: `${region.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        </div>

      </div>
      <div className="print:hidden"><Footer /></div>
    </main>
  );
}