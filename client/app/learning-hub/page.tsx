"use client";
import React, { useEffect, useState } from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import axios from "axios";
import Image from "next/image";
import { PlayCircle, CheckCircle, BookOpen, Award, X, Loader2, ExternalLink, FileText, Search, FastForward, ShieldAlert } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import toast from "react-hot-toast";

interface Resource {
  _id: string;
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  platform?: string;
  thumbnail?: string;
  tags?: string[];
  skillsAwarded?: string[];
  credits?: number;
}

export default function LearningHub() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Progress & Modal State
  const [activeCourse, setActiveCourse] = useState<Resource | null>(null);
  const [localProgress, setLocalProgress] = useState<Record<string, number>>({});
  const [localCompletedIds, setLocalCompletedIds] = useState<string[]>([]);
  
  // Anti-Cheating State
  const [courseNotes, setCourseNotes] = useState("");

  const { userProfile, isAuthenticated, getUserProfile, auth0User } = useGlobalContext();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get("/api/v1/resources");
        setResources(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching resources", error);
        toast.error("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();

    try {
      const savedProgress = localStorage.getItem("courseProgress");
      if (savedProgress) setLocalProgress(JSON.parse(savedProgress));
    } catch (e) {
      console.error("Failed to parse local progress", e);
    }
  }, []);

  useEffect(() => {
    if (userProfile?.completedCourses && Array.isArray(userProfile.completedCourses)) {
      const ids = userProfile.completedCourses.map((course: unknown) => {
        if (typeof course === 'string') return course;
        if (typeof course === 'object' && course !== null && '_id' in course) {
            return String((course as { _id: unknown })._id);
        }
        return String(course);
      });
      setLocalCompletedIds(ids);
    }
  }, [userProfile]);

  const filteredResources = resources.filter(course => {
    const query = searchQuery.toLowerCase();
    const matchTitle = course.title?.toLowerCase().includes(query) || false;
    const matchPlatform = course.platform?.toLowerCase().includes(query) || false;
    const matchTags = course.tags?.some(tag => tag?.toLowerCase().includes(query)) || false;
    return matchTitle || matchPlatform || matchTags;
  });

  const updateProgress = (courseId: string, amount: number) => {
    setLocalProgress(prev => {
      const current = prev[courseId] || 0;
      const updated = Math.min(current + amount, 100);
      const newState = { ...prev, [courseId]: updated };
      localStorage.setItem("courseProgress", JSON.stringify(newState));
      return newState;
    });
  };

  const handleComplete = async (courseId: string, credits: number) => {
    if (!isAuthenticated) return toast.error("Please login to claim credits.");
    
    // Final check to ensure they didn't bypass the notes requirement
    if (courseNotes.length < 30) return toast.error("Please provide sufficient proof of learning.");

    try {
      const res = await axios.post("/api/v1/resources/complete", { courseId });
      toast.success(res.data.message || `Course completed! +${credits} Credits`);
      
      setLocalCompletedIds(prev => [...prev, courseId]);
      updateProgress(courseId, 100); 
      
      if (auth0User?.sub) {
        getUserProfile(auth0User.sub);
      }
      setActiveCourse(null); 
      setCourseNotes(""); // Reset notes for next time
    } catch (error: unknown) { 
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Course already completed");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const openCourse = (item: Resource) => {
    setActiveCourse(item);
    setCourseNotes(""); // Clear notes when opening a new course
  };

  return (
    <main className="bg-[#F8F9FB] min-h-screen relative">
      <Header />
      
      {/* HERO SECTION */}
      <div className="bg-[#1e1b4b] text-white py-20 px-6 md:px-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-125 h-125 bg-[#7263f3]/20 rounded-full blur-[120px]"></div>
        <div className="max-w-350 mx-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="flex-1 w-full">
            <span className="flex items-center gap-2 text-[#a5b4fc] font-bold text-sm uppercase tracking-widest mb-4">
              <BookOpen size={18} /> Skill Readiness Hub
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Learn. Build. <br /> Get Verified.
            </h1>
            
            <div className="relative max-w-xl mt-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search roles, skills, or platforms (e.g., MERN, Java, MDN)..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-300 rounded-full py-4 pl-12 pr-6 outline-none focus:bg-white/20 transition-all font-medium"
                />
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="hidden md:flex flex-col items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shrink-0">
              <span className="text-xs font-black uppercase tracking-widest text-[#a5b4fc]">Your Earned Credits</span>
              <span className="text-5xl font-black text-white mt-2 flex items-center gap-2">
                {userProfile?.earnedCredits || 0} <Award size={36} className="text-amber-400"/>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="max-w-350 mx-auto py-16 px-6 md:px-16">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-[#7263f3] animate-spin" />
          </div>
        ) : filteredResources.length === 0 ? (
            <div className="text-center py-20">
                <p className="text-gray-500 font-bold text-xl">No courses found matching &quot;{searchQuery}&quot;</p>
                <button onClick={() => setSearchQuery("")} className="mt-4 text-[#7263f3] font-bold hover:underline">Clear Search</button>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredResources.map((item) => {
              const isCompleted = localCompletedIds.includes(item._id);
              const currentProgress = isCompleted ? 100 : (localProgress[item._id] || 0);
              const fallbackImage = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop";
              
              return (
                <div key={item._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col hover:shadow-xl transition-all">
                  
                  <div className="relative h-48 w-full overflow-hidden cursor-pointer" onClick={() => openCourse(item)}>
                    <Image src={item.thumbnail || fallbackImage} alt={item.title || "Course"} fill className="object-cover group-hover:scale-105 transition-transform duration-700"/>
                    <div className="absolute inset-0 bg-linear-to-t from-gray-900/90 to-transparent flex items-center justify-center">
                        <PlayCircle size={40} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {item.platform || "Platform"}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex justify-between items-center text-white mb-2">
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Award size={10}/> {item.credits || 0} Credits
                            </span>
                            <span className="text-[10px] font-bold">{currentProgress}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-[#7263f3]'}`} style={{ width: `${currentProgress}%` }}></div>
                        </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col grow">
                    <h3 className="text-lg font-black text-gray-900 mb-2 leading-tight line-clamp-2">{item.title || "Untitled Course"}</h3>
                    
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {item.tags?.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[9px] font-bold text-[#7263f3] bg-indigo-50 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-gray-100">
                        {isCompleted ? (
                             <div className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl flex justify-center items-center gap-2 font-black text-[10px] uppercase tracking-widest">
                                <CheckCircle size={14}/> Claimed
                             </div>
                        ) : (
                            <button 
                                onClick={() => openCourse(item)}
                                className="w-full py-3 bg-gray-50 hover:bg-[#7263f3] text-gray-600 hover:text-white rounded-xl flex justify-center items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-colors"
                            >
                                {currentProgress > 0 ? "Continue" : "Start"} <PlayCircle size={14} />
                            </button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* --- SMART MODAL WITH ACADEMIC VERIFICATION --- */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm p-4 md:p-8">
          <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
            
            <div className="p-5 flex justify-between items-center border-b border-gray-100 shrink-0">
                <div>
                    <h2 className="text-xl font-black text-gray-900">{activeCourse.title}</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{activeCourse.platform}</p>
                </div>
                <button onClick={() => setActiveCourse(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="w-full h-[40vh] md:h-[50vh] bg-[#0f1115] relative flex flex-col items-center justify-center shrink-0">
                {activeCourse.url?.includes("embed") ? (
                    <iframe width="100%" height="100%" src={`${activeCourse.url}?autoplay=1`} title="Course Player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                ) : (
                    <div className="text-center p-6 flex flex-col items-center">
                        <FileText size={48} className="text-[#7263f3] mb-4" />
                        <h3 className="text-xl font-black text-white mb-2">External Learning Resource</h3>
                        <p className="text-gray-400 font-medium text-sm max-w-md mb-6">Hosted securely on <strong>{activeCourse.platform}</strong>. Launch the resource, read the material, and return here to submit your proof of learning.</p>
                        <a href={activeCourse.url} target="_blank" rel="noopener noreferrer" className="bg-[#7263f3] hover:bg-[#5e4ee0] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2">
                            Launch {activeCourse.platform} <ExternalLink size={16} />
                        </a>
                    </div>
                )}
            </div>

            <div className="p-6 bg-gray-50 overflow-y-auto grow">
                
                {/* Anti-Cheating Section */}
                {!localCompletedIds.includes(activeCourse._id) && (
                  <div className="mb-6 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                          <ShieldAlert size={18} className="text-amber-500" />
                          <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest">Academic Verification</h4>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mb-3">To claim your {activeCourse.credits} NEP Credits, you must provide a brief summary (minimum 30 characters) of the key concepts you learned.</p>
                      
                      <textarea 
                          value={courseNotes}
                          onChange={(e) => setCourseNotes(e.target.value)}
                          placeholder="e.g., I learned how to implement authentication using JWT and secure routes..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#7263f3] focus:bg-white outline-none transition-all resize-none h-24 font-medium"
                      ></textarea>
                      <div className="text-right mt-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${courseNotes.length >= 30 ? 'text-emerald-500' : 'text-gray-400'}`}>
                              {courseNotes.length}/30 characters minimum
                          </span>
                      </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                    <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                            <span>Module Progress</span>
                            <span className={(localProgress[activeCourse._id] || 0) >= 100 || localCompletedIds.includes(activeCourse._id) ? "text-emerald-500" : ""}>
                                {localCompletedIds.includes(activeCourse._id) ? 100 : (localProgress[activeCourse._id] || 0)}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-linear-to-r from-[#7263f3] to-[#9a8fff] rounded-full transition-all duration-300" style={{ width: `${localCompletedIds.includes(activeCourse._id) ? 100 : (localProgress[activeCourse._id] || 0)}%` }}></div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        {!localCompletedIds.includes(activeCourse._id) && (
                            <button 
                                onClick={() => updateProgress(activeCourse._id, 100)}
                                className="w-full sm:w-auto py-3 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest bg-indigo-50 text-[#7263f3] hover:bg-indigo-100 flex items-center justify-center gap-2 border border-indigo-100"
                                title="Simulate finishing course for demo"
                            >
                                <FastForward size={14}/> Skip to 100%
                            </button>
                        )}

                        <button 
                            onClick={() => handleComplete(activeCourse._id, activeCourse.credits || 0)}
                            disabled={localCompletedIds.includes(activeCourse._id) || (localProgress[activeCourse._id] || 0) < 100 || courseNotes.length < 30}
                            className={`w-full sm:w-auto py-3 px-8 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md whitespace-nowrap flex justify-center ${
                                localCompletedIds.includes(activeCourse._id)
                                ? "bg-emerald-500 text-white cursor-not-allowed shadow-emerald-500/20"
                                : (localProgress[activeCourse._id] || 0) >= 100 && courseNotes.length >= 30
                                    ? "bg-gray-900 text-white hover:bg-[#7263f3] hover:-translate-y-1" 
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {localCompletedIds.includes(activeCourse._id) ? "Credits Claimed" : "Submit & Claim"}
                        </button>
                    </div>
                </div>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}