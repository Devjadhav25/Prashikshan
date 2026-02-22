"use client";
import React, { useState, useEffect } from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import toast from "react-hot-toast";
import { Clock, Award, FileText, CheckCircle, Target, Briefcase, Building2 } from "lucide-react";

interface LogEntry {
  _id: string;
  internshipTitle: string;
  companyName: string;
  date: string;
  hoursWorked: number;
  taskDescription: string;
  status: string;
}

export default function LogbookPage() {
  const { isAuthenticated, loading } = useGlobalContext();
  
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [analytics, setAnalytics] = useState({ totalApprovedHours: 0, earnedCredits: 0, hoursToNextCredit: 30 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    internshipTitle: "",
    companyName: "",
    date: new Date().toISOString().split("T")[0],
    hoursWorked: "",
    taskDescription: ""
  });

  const fetchLogs = async () => {
    try {
      const res = await axios.get("/api/v1/logbook/student");
      setLogs(res.data.logs);
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error("Failed to fetch logs", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.internshipTitle || !formData.hoursWorked || !formData.taskDescription) {
      return toast.error("Please fill all required fields");
    }

    setIsSubmitting(true);
    try {
      await axios.post("/api/v1/logbook", {
        ...formData,
        hoursWorked: Number(formData.hoursWorked)
      });
      toast.success("Log submitted successfully!");
      setFormData({ ...formData, hoursWorked: "", taskDescription: "" }); 
      fetchLogs(); 
    } catch (error) {
      toast.error("Failed to submit log");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7263F3]"></div></div>;
  
  if (!isAuthenticated) return (
    <main className="bg-[#F8F9FB] min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center font-bold text-2xl text-gray-500">
            Please login to access your Academic Logbook.
        </div>
    </main>
  );

  return (
    <main className="bg-[#F8F9FB] min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 py-12 max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">Academic Logbook</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mt-2">NEP 2020 Compliant Tracker</p>
        </div>

        {/* --- NEP CREDIT ENGINE DASHBOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl"><Award size={36} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NEP Credits Earned</p>
              <h2 className="text-4xl font-black text-gray-900 leading-none mt-1">{analytics.earnedCredits}</h2>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><Clock size={36} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified Hours</p>
              <h2 className="text-4xl font-black text-gray-900 leading-none mt-1">{analytics.totalApprovedHours} <span className="text-lg text-gray-400">hrs</span></h2>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
             <div className="flex justify-between items-end mb-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1"><Target size={14}/> Next Credit Milestone</p>
                <span className="font-black text-[#7263f3] text-sm bg-indigo-50 px-3 py-1 rounded-full">{analytics.hoursToNextCredit} hrs left</span>
             </div>
             <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                <div 
                  className="h-full bg-linear-to-r from-[#7263f3] to-[#9a8fff] rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${((30 - analytics.hoursToNextCredit) / 30) * 100}%` }}
                ></div>
             </div>
             <p className="text-xs text-center text-gray-400 font-medium mt-3 italic">*30 Hours = 1 Academic Credit</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* --- SUBMIT LOG FORM --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><FileText size={20} className="text-[#7263f3]"/> Daily Entry</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internship Role</label>
                  <input type="text" placeholder="e.g. Frontend Intern" className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#7263f3] transition-all font-medium" value={formData.internshipTitle} onChange={(e) => setFormData({...formData, internshipTitle: e.target.value})} required />
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Company Name</label>
                  <input type="text" placeholder="e.g. Tech Mahindra" className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#7263f3] transition-all font-medium" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</label>
                    <input type="date" className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white font-medium text-gray-600" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hours</label>
                    <input type="number" min="1" max="12" placeholder="e.g. 8" className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white font-medium" value={formData.hoursWorked} onChange={(e) => setFormData({...formData, hoursWorked: e.target.value})} required />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tasks Completed</label>
                  <textarea rows={4} placeholder="What did you work on today?" className="w-full mt-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-[#7263f3] transition-all resize-none font-medium" value={formData.taskDescription} onChange={(e) => setFormData({...formData, taskDescription: e.target.value})} required></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-4 mt-2 bg-gray-900 hover:bg-[#7263f3] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg">
                  {isSubmitting ? "Saving..." : "Submit Log & Request Approval"}
                </button>
              </form>
            </div>
          </div>

          {/* --- LOG HISTORY --- */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-black text-gray-900 mb-6">Verified Academic Records</h3>
            
            {logs.length === 0 ? (
              <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Briefcase size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-900 text-xl font-black mb-2">No logs submitted yet</p>
                <p className="text-sm text-gray-500 font-medium max-w-md mx-auto">Start tracking your daily internship hours to automatically generate your official college report and earn academic credits.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log._id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start hover:border-[#7263f3]/30 transition-all group">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-[10px] font-black bg-gray-100 px-3 py-1.5 rounded-lg text-gray-600 uppercase tracking-widest">
                        {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#7263f3] bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                        {log.hoursWorked} Hours
                      </span>
                      <span className="text-sm font-black text-gray-900 flex items-center gap-2">
                        <Building2 size={16} className="text-gray-400"/> {log.companyName}
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm font-bold mb-1">{log.internshipTitle}</p>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{log.taskDescription}</p>
                  </div>
                  
                  <div className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shrink-0 border shadow-sm ${
                    log.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    log.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' : 
                    'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {log.status === 'Approved' && <CheckCircle size={14} />}
                    Faculty {log.status}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}