"use client";
import React, { useState, useEffect } from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/globalContext";
import axios from "axios";
import toast from "react-hot-toast";
import { ShieldCheck, CheckCircle, XCircle, Clock, User, FileText } from "lucide-react";
import Image from "next/image";

interface LogEntry {
  _id: string;
  student: { name: string; email: string; profilePicture?: string };
  internshipTitle: string;
  companyName: string;
  date: string;
  hoursWorked: number;
  taskDescription: string;
  status: string;
}

export default function FacultyDashboard() {
  const { isAuthenticated, loading, userProfile } = useGlobalContext();
  const [allLogs, setAllLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    let isMounted = true; 

    const fetchAdminData = async () => {
      try {
        const logRes = await axios.get("/api/v1/admin/logbooks");
        if (isMounted) setAllLogs(logRes.data);
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      }
    };

    if (isAuthenticated && userProfile?.email === "sanketjadhav2504@gmail.com") {
      fetchAdminData();
    }

    return () => { isMounted = false; };
  }, [isAuthenticated, userProfile]);

  const handleUpdateLogStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`/api/v1/admin/logbook/${id}`, { status: newStatus });
      toast.success(`Log ${newStatus} successfully!`);
      setAllLogs(prev => prev.map(log => log._id === id ? { ...log, status: newStatus } : log));
    } catch (error) {
      toast.error("Failed to update log status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#7263F3]"></div></div>;
  
  if (!isAuthenticated) return (
    <main className="bg-[#F8F9FB] min-h-screen flex flex-col"><Header /><div className="flex-1 flex items-center justify-center font-bold text-2xl text-gray-500">Please login.</div></main>
  );

  // SUPER ADMIN LOCK
  if (userProfile?.email !== "sanketjadhav2504@gmail.com") {
      return (
          <main className="bg-[#F8F9FB] min-h-screen flex flex-col"><Header /><div className="flex-1 flex flex-col items-center justify-center"><XCircle size={64} className="text-red-500 mb-4" /><h1 className="font-black text-3xl text-gray-900 mb-2">Access Denied</h1><p className="font-bold text-gray-500">Only authorized Administrators can view this page.</p></div></main>
      )
  }

  return (
    <main className="bg-[#F8F9FB] min-h-screen">
      <Header />
      
      {/* HEADER BANNER */}
      <div className="bg-[#1e1b4b] text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#7263f3]/20 rounded-full blur-[100px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex items-center gap-4">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <ShieldCheck size={36} className="text-emerald-400" />
            </div>
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Master Administration</span>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">Academic Logbook Verification</h1>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2"><FileText className="text-[#7263f3]" size={20}/> Student Logbook Submissions</h2>
                  <span className="text-amber-500 text-sm font-bold flex items-center gap-1"><Clock size={16}/> Pending: {allLogs.filter(l => l.status === 'Pending').length}</span>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-gray-100 bg-white">
                              <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                              <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Internship Details</th>
                              <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Log</th>
                              <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                              <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                      </thead>
                      <tbody>
                          {allLogs.length === 0 ? (
                            <tr><td colSpan={5} className="p-10 text-center text-gray-500 font-medium">No logs submitted yet.</td></tr>
                          ) : allLogs.map((log) => (
                              <tr key={log._id} className="border-b border-gray-50 hover:bg-gray-50">
                                  <td className="p-5">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500"><User size={20}/></div>
                                          <div>
                                              <p className="text-sm font-bold text-gray-900">{log.student?.name || "Student"}</p>
                                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{log.student?.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="p-5">
                                      <p className="text-sm font-bold text-gray-900">{log.internshipTitle}</p>
                                      <p className="text-xs text-[#7263f3] font-medium">{log.companyName}</p>
                                  </td>
                                  <td className="p-5 max-w-xs">
                                      <div className="flex items-center gap-2 mb-1">
                                          <span className="text-[10px] font-black bg-indigo-50 text-[#7263f3] px-2 py-0.5 rounded-md">{log.hoursWorked} Hours</span>
                                      </div>
                                      <p className="text-xs text-gray-600 font-medium truncate" title={log.taskDescription}>{log.taskDescription}</p>
                                  </td>
                                  <td className="p-5 text-center">
                                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${log.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : log.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>{log.status}</span>
                                  </td>
                                  <td className="p-5 text-right space-x-2">
                                      {log.status === 'Pending' ? (
                                          <>
                                              <button onClick={() => handleUpdateLogStatus(log._id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors"><CheckCircle size={18} /></button>
                                              <button onClick={() => handleUpdateLogStatus(log._id, 'Rejected')} className="p-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-xl transition-colors"><XCircle size={18} /></button>
                                          </>
                                      ) : <span className="text-xs text-gray-400 font-bold italic">Processed</span>}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      <Footer />
    </main>
  );
}