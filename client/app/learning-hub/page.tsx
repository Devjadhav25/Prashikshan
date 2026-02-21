"use client";
import React, { useEffect, useState } from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import axios from "axios";
import Image from "next/image";
import { PlayCircle, CheckCircle, BookOpen, Award, X, Loader2, ExternalLink, FileText } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import toast from "react-hot-toast";

interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  platform: string;
  thumbnail: string;
  tags: string[];
  skillsAwarded: string[];
  credits: number;
}

export default function LearningHub() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Embedded Video State
  const [activeCourse, setActiveCourse] = useState<Resource | null>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  
  const { userProfile, isAuthenticated, getUserProfile, auth0User } = useGlobalContext();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("/api/v1/resources");
        setResources(res.data);
      } catch (error) {
        console.error("Error fetching resources", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  // Simulate watching progress when a course is opened
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCourse && watchProgress < 100) {
      interval = setInterval(() => {
        setWatchProgress(prev => Math.min(prev + 10, 100)); 
      }, 800); // Progresses slightly faster for demo purposes
    }
    return () => clearInterval(interval);
  }, [activeCourse, watchProgress]);

  const handleComplete = async (courseId: string, credits: number) => {
    if (!isAuthenticated) return toast.error("Please login to claim credits.");
    if (watchProgress < 100) return toast.error("Please complete the module first!");

    try {
      const res = await axios.post("/api/v1/resources/complete", { courseId });
      toast.success(res.data.message || `Course completed! +${credits} Credits`);
      
      if (auth0User?.sub) {
        getUserProfile(auth0User.sub);
      }
      setActiveCourse(null); 
    } catch (error: unknown) { 
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Error completing course");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const completedCourses = userProfile?.completedCourses || [];

  return (
    <main className="bg-[#F8F9FB] min-h-screen relative">
      <Header />
      
      {/* HERO SECTION */}
      <div className="bg-[#1e1b4b] text-white py-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7263f3]/20 rounded-full blur-[120px]"></div>
        <div className="max-w-[1400px] mx-auto relative z-10 flex justify-between items-end">
          <div>
            <span className="flex items-center gap-2 text-[#a5b4fc] font-bold text-sm uppercase tracking-widest mb-4">
              <BookOpen size={18} /> Official Partner Modules
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Learn. Build. <br /> Get Hired.
            </h1>
            <p className="text-lg text-indigo-200 max-w-2xl font-medium">
              Complete free courses from Swayam, Coursera, OpenLearn, and DataFlair to automatically inject verified skills and NEP Credits into your profile.
            </p>
          </div>
          
          {isAuthenticated && (
            <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
              <span className="text-xs font-black uppercase tracking-widest text-[#a5b4fc]">Your Earned Credits</span>
              <span className="text-5xl font-black text-white mt-2 flex items-center gap-2">
                {userProfile?.earnedCredits || 0} <Award size={36} className="text-amber-400"/>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-[1400px] mx-auto py-16 px-6 md:px-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#7263f3] animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((item) => {
              const isCompleted = completedCourses.includes(item._id);
              
              return (
                <div key={item._id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100 group flex flex-col hover:shadow-2xl transition-all">
                  
                  {/* Thumbnail */}
                  <div className="relative h-56 w-full overflow-hidden cursor-pointer" onClick={() => { setWatchProgress(0); setActiveCourse(item); }}>
                    <Image src={item.thumbnail} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex items-center justify-center">
                        <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest border border-white/20">
                      {item.platform}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                        <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 px-3 py-1 rounded-full flex items-center gap-1">
                          <Award size={12}/> {item.credits} Credits
                        </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-6 line-clamp-3">{item.description}</p>
                    
                    <div className="mb-6 mt-auto">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rewards:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.skillsAwarded.map(skill => (
                          <span key={skill} className="text-[10px] font-bold text-[#7263f3] bg-indigo-50 px-2 py-1 rounded-md">
                            +{skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    {isCompleted ? (
                         <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl flex justify-center items-center gap-2 font-black text-xs uppercase tracking-widest">
                            <CheckCircle size={16}/> Completed
                         </div>
                    ) : (
                        <button 
                            onClick={() => { setWatchProgress(0); setActiveCourse(item); }}
                            className="w-full py-4 bg-gray-900 hover:bg-[#7263f3] text-white rounded-2xl flex justify-center items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors shadow-lg"
                        >
                            Start Module <PlayCircle size={16} />
                        </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- SMART MODAL (Handles Video AND Documents/Courses) --- */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 md:p-10">
          <div className="bg-white w-full max-w-5xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <div>
                    <h2 className="text-2xl font-black text-gray-900">{activeCourse.title}</h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{activeCourse.platform}</p>
                </div>
                <button onClick={() => setActiveCourse(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Smart Viewer */}
            <div className="w-full aspect-video bg-[#0f1115] relative flex flex-col items-center justify-center">
                {activeCourse.url.includes("embed") ? (
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src={`${activeCourse.url}?autoplay=1`} 
                        title="Course Player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                ) : (
                    <div className="text-center p-8 flex flex-col items-center">
                        <FileText size={64} className="text-[#7263f3] mb-6" />
                        <h3 className="text-2xl font-black text-white mb-3">External Resource Area</h3>
                        <p className="text-gray-400 font-medium max-w-md mb-8">
                            This {activeCourse.type} is hosted securely on <strong>{activeCourse.platform}</strong>. Click below to open it in a new tab, then return here to claim your credits.
                        </p>
                        <a 
                            href={activeCourse.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-[#7263f3] hover:bg-[#5e4ee0] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center gap-3 transition-transform hover:scale-105"
                        >
                            Launch {activeCourse.platform} <ExternalLink size={18} />
                        </a>
                    </div>
                )}
            </div>

            {/* Progress & Claim Area */}
            <div className="p-8 bg-gray-50 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex-1 w-full">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Verification Status</span>
                        <span className={watchProgress === 100 ? "text-emerald-500" : ""}>{watchProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#7263f3] transition-all duration-1000"
                            style={{ width: `${watchProgress}%` }}
                        ></div>
                    </div>
                </div>

                <button 
                    onClick={() => handleComplete(activeCourse._id, activeCourse.credits)}
                    disabled={watchProgress < 100}
                    className={`py-4 px-10 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl whitespace-nowrap ${
                        watchProgress === 100 
                        ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {watchProgress === 100 ? "Claim Rewards" : "Verifying..."}
                </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
