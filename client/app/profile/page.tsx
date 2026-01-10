"use client";
import React, { useState } from "react";
import Image from "next/image";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/globalContext";
import EditProfileModal from "@/component/EditProfileModal";
import { 
  Mail, MapPin, Calendar, Github, Linkedin, 
  Twitter, Globe, Edit3, Award, BookOpen, 
  Target, Trophy, ExternalLink, ShieldCheck
} from "lucide-react";
import { Skill, UserProfile } from "@/types/custom";

export default function ProfilePage() {
  const { userProfile, isAuthenticated } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
      <div className="text-center p-10 bg-white rounded-[40px] shadow-xl border border-gray-100">
        <ShieldCheck className="w-16 h-16 text-[#7263f3] mx-auto mb-4" />
        <p className="text-2xl font-black text-gray-900">Access Denied</p>
        <p className="text-gray-500 mt-2 font-medium">Please login to view your professional profile.</p>
      </div>
    </div>
  );

  const stats = [
    { label: "Competitions", value: "24", icon: <Trophy className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
    { label: "Achievements", value: "12", icon: <Award className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
    { label: "Courses", value: "8", icon: <BookOpen className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
    { label: "Rank Points", value: "1,245", icon: <Target className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50" },
  ];

  return (
    <main className="bg-[#F8F9FB] min-h-screen font-sans">
      <Header />

      <EditProfileModal
        user={userProfile} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={() => {}} 
      />
      
      {/* --- HERO PROFILE SECTION --- */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100 pt-16 pb-12">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#7263f3]/5 rounded-full blur-[100px]"></div>
        
        <div className="container mx-auto px-4 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            
            <div className="relative">
              <div className="w-44 h-44 rounded-[40px] border-4 border-white shadow-2xl overflow-hidden bg-white ring-1 ring-gray-100">
                <Image 
                  src={userProfile?.profilePicture || "/user.png"} 
                  alt="Profile" 
                  width={176} 
                  height={176} 
                  className="object-cover h-full w-full"
                />
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)} 
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black shadow-xl hover:bg-[#7263f3] transition-all transform hover:scale-105 active:scale-95"
              >
                <Edit3 size={14} /> EDIT PROFILE
              </button>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter">
                  {userProfile?.name || "Member Name"}
                </h1>
                <span className="bg-[#7263f3] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-lg shadow-[#7263f3]/20">
                  Pro Member
                </span>
              </div>
              
              <p className="text-xl text-[#7263f3] font-bold mb-6 italic opacity-80">
                {userProfile?.profession || "Aspiring Tech Professional"}
              </p>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-500 mb-8 font-bold">
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <MapPin size={16} className="text-[#7263f3]" /> {userProfile?.location || "India"}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <Mail size={16} className="text-[#7263f3]" /> {userProfile?.email}
                </span>
                <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <Calendar size={16} className="text-[#7263f3]" /> Joined Jan 2023
                </span>
              </div>

              <div className="flex justify-center lg:justify-start gap-3">
                {[
                  { Icon: Github, link: userProfile?.socialLinks?.github, color: "hover:bg-gray-900 hover:text-white" },
                  { Icon: Twitter, link: userProfile?.socialLinks?.twitter, color: "hover:bg-blue-400 hover:text-white" },
                  { Icon: Linkedin, link: userProfile?.socialLinks?.linkedin, color: "hover:bg-blue-700 hover:text-white" },
                  { Icon: Globe, link: userProfile?.socialLinks?.instagram, color: "hover:bg-pink-500 hover:text-white" }
                ].map(({ Icon, link, color }, i) => (
                  <a 
                    key={i} 
                    href={link ? (link.startsWith('http') ? link : `https://${link}`) : "#"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-3 border-2 border-gray-50 rounded-2xl bg-white transition-all shadow-sm ${!link ? 'opacity-20 grayscale pointer-events-none' : `text-gray-400 ${color} hover:-translate-y-1`}`}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center justify-center min-w-[140px] transition-transform hover:scale-105">
                  <div className={`p-3 ${stat.bg} rounded-2xl mb-3`}>{stat.icon}</div>
                  <span className="text-2xl font-black text-gray-900 leading-none">{stat.value}</span>
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --- STICKY NAVIGATION --- */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex gap-10">
            {["Overview", "Participations", "Achievements", "Skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-6 text-xs font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.toLowerCase() ? "text-[#7263f3]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab.toLowerCase() && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#7263f3] rounded-t-full shadow-[0_0_10px_#7263f3]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-12 py-12">
        <div className="transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          {activeTab === "overview" && <OverviewSection user={userProfile} />}
          {activeTab === "skills" && <SkillsSection user={userProfile} />}
          {activeTab === "participations" && <ParticipationsSection />}
        </div>
      </div>

      <Footer />
    </main>
  );
}

function OverviewSection({ user }: { user: UserProfile | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-10">
        <div className="bg-white p-10 rounded-[40px] border border-gray-50 shadow-sm">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            About Professional
            <div className="h-1 flex-1 bg-gray-50 rounded-full"></div>
          </h3>
          <p className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-line">
            {user?.bio || "No professional summary added yet. Click 'Edit Profile' to introduce yourself to employers."}
          </p>
          
          <div className="mt-10 pt-10 border-t border-gray-50">
            <h4 className="font-black text-xs text-gray-400 mb-6 uppercase tracking-widest">Core Interests</h4>
            <div className="flex flex-wrap gap-3">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map(tag => (
                  <span key={tag} className="px-5 py-2.5 bg-[#7263f3]/5 rounded-2xl text-sm text-[#7263f3] font-black border border-[#7263f3]/10">
                    #{tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No interests tagged yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm">
          <h3 className="font-black text-gray-900 text-xl mb-8">Recent Milestones</h3>
          <div className="space-y-6">
            {[
              { title: "AI Challenge Winner", rank: "1st Place", date: "Jan 2024", color: "bg-amber-50 text-amber-500" },
              { title: "Web Dev Sprint", rank: "2nd Place", date: "Dec 2023", color: "bg-slate-50 text-slate-400" },
              { title: "Design Battle", rank: "3rd Place", date: "Nov 2023", color: "bg-orange-50 text-orange-400" },
            ].map((win, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${win.color}`}><Trophy size={20} /></div>
                  <div>
                    <p className="font-black text-sm text-gray-900">{win.title}</p>
                    <p className="text-xs font-bold text-gray-400">{win.rank}</p>
                  </div>
                </div>
                <ExternalLink size={14} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsSection({ user }: { user: UserProfile | null }) {
  return (
    <div className="bg-white p-12 rounded-[50px] border border-gray-50 shadow-sm max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-black text-gray-900 mb-2">Technical Proficiency</h3>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Expertise metrics based on project contributions</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
        {user?.skills && user.skills.length > 0 ? (
          user.skills.map((skill: Skill, index: number) => (
            <div key={index} className="group">
              <div className="flex justify-between mb-4">
                <span className="font-black text-gray-900 tracking-tight">{skill.name}</span>
                <span className="text-sm font-black text-[#7263f3]">{skill.value}%</span>
              </div>
              <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden p-1 shadow-inner border border-gray-100">
                <div 
                  className="h-full bg-gradient-to-r from-[#7263f3] to-[#9a8fff] rounded-full transition-all duration-1000 shadow-lg shadow-[#7263f3]/20" 
                  style={{ width: `${skill.value}%` }} 
                />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
             <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
             <p className="text-gray-400 font-bold italic">No skill records found. Update your profile to show off.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipationsSection() {
  const participations = [
    { title: "AI Innovation Challenge 2024", status: "Ongoing", rank: "Top 10", color: "from-blue-500 to-indigo-600" },
    { title: "Full Stack Development Bootcamp", status: "Completed", rank: "Certified", color: "from-emerald-500 to-teal-600" },
    { title: "Design Sprint Competition", status: "Ongoing", rank: "Top 25", color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {participations.map((item, i) => (
        <div key={i} className="bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
          <div className={`h-44 bg-gradient-to-br ${item.color} relative overflow-hidden p-8 flex items-end`}>
            <div className="absolute top-4 right-4 text-white/20"><Award size={80} /></div>
            <span className="relative z-10 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
              {item.status}
            </span>
          </div>
          <div className="p-8">
            <h4 className="font-black text-xl text-gray-900 mb-6 group-hover:text-[#7263f3] transition-colors leading-tight">{item.title}</h4>
            <div className="flex justify-between items-center pt-6 border-t border-gray-50">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Final Placement</span>
              <span className="text-sm font-black text-[#7263f3] bg-[#7263f3]/5 px-4 py-1.5 rounded-xl">{item.rank}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}