"use client";
import React, { useState } from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/globalContext";
import EditProfileModal from "@/component/EditProfileModal";
import Image from "next/image"; 
import { 
  Mail, MapPin, Calendar, Github, Linkedin, 
  Twitter, Globe, Edit3, Award, BookOpen, 
  Target, Trophy, ShieldCheck, Download, Star, Zap, 
  Check, Briefcase, Wallet, History, CheckCircle2 // ✅ FIXED: Added Wallet, History, and CheckCircle2 for NEP Ledger
} from "lucide-react";
import { Skill, UserProfile } from "@/types/custom";

interface ExtendedUser extends Partial<UserProfile> {
  bio?: string;
  interests?: string[];
  skills?: Skill[];
  [key: string]: unknown; 
}

export default function ProfilePage() {
  const { userProfile, isAuthenticated, loading } = useGlobalContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#7263F3]"></div>
      </div>
    );
  }

  if (!loading && !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] font-sans">
          <div className="text-center p-12 bg-white rounded-[40px] shadow-sm border border-gray-100 max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-[#7263f3]" />
            </div>
            <p className="text-2xl font-black text-gray-900 mb-2">Access Denied</p>
            <p className="text-gray-500 font-medium">Please log in to view and edit your professional profile.</p>
            <button 
                onClick={() => window.location.href = "/login"} 
                className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#7263f3] transition-all shadow-lg"
            >
                Return to Login
            </button>
          </div>
        </div>
      );
  }

  const stats = [
    { label: "Competitions", value: "24", icon: <Trophy className="w-6 h-6 text-blue-500" />, bg: "bg-blue-50" },
    { label: "Achievements", value: "12", icon: <Award className="w-6 h-6 text-purple-500" />, bg: "bg-purple-50" },
    { label: "Courses", value: "8", icon: <BookOpen className="w-6 h-6 text-indigo-500" />, bg: "bg-indigo-50" },
    { label: "Rank Points", value: "1,245", icon: <Target className="w-6 h-6 text-emerald-500" />, bg: "bg-emerald-50" },
  ];

  return (
    <main className="bg-[#F8F9FB] min-h-screen font-sans flex flex-col print:bg-white">
      {/* ✅ HIDE HEADER ON PRINT */}
      <div className="print:hidden">
        <Header />
      </div>

      <EditProfileModal
        user={userProfile} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={() => {}} 
      />
      
      {/* 🚀 MODERN PROFILE BANNER */}
      <div className="bg-[#1e1b4b] h-55 w-full relative overflow-hidden border-b border-[#7263f3]/20 print:hidden">
         <div className="absolute inset-0 bg-linear-to-r from-[#7263f3]/40 to-transparent"></div>
         <div className="absolute top-0 right-1/4 w-100 h-100 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      {/* ✅ Adjust margins for print mode to remove the negative offset */}
      <div className="w-[95%] max-w-325 mx-auto -mt-24 print:mt-0 relative z-10 pb-16 flex-1">
        
        {/* TOP CARD: PROFILE INFO & STATS */}
        <div className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12 flex flex-col xl:flex-row gap-12 items-center xl:items-start animate-in fade-in slide-in-from-bottom-4 duration-500 print:shadow-none print:border-none print:p-0">
            
            {/* Avatar & Actions */}
            <div className="flex flex-col items-center shrink-0">
                <div className="w-48 h-48 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-gray-100 relative group shrink-0 print:border-2 print:shadow-none">
                    <Image 
                      src={userProfile?.profilePicture || "/user.png"} 
                      alt="Profile" 
                      width={192}
                      height={192}
                      unoptimized
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { e.currentTarget.src = "/user.png" }}
                    />
                    <div 
                      onClick={() => setIsEditModalOpen(true)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm print:hidden"
                    >
                        <Edit3 className="text-white" size={32} />
                    </div>
                </div>
                
                <div className="flex flex-col gap-3 mt-6 w-full print:hidden">
                    <button 
                      onClick={() => setIsEditModalOpen(true)} 
                      className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-[#7263f3] transition-all flex items-center justify-center gap-2"
                    >
                        <Edit3 size={16}/> Edit Profile
                    </button>
                    <button 
                      onClick={() => window.print()} 
                      className="w-full py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-[#7263f3] hover:text-[#7263f3] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Download size={16}/> NEP Report
                    </button>
                </div>
            </div>

            {/* Info & Badges */}
            <div className="flex-1 text-center xl:text-left print:text-left">
                <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-4">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                      {userProfile?.name || "Student"}
                    </h1>
                    <span className="bg-linear-to-r from-[#7263f3] to-[#9a8fff] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#7263f3]/30 inline-flex items-center gap-1 w-max mx-auto xl:mx-0 print:border print:border-[#7263f3] print:text-[#7263f3] print:bg-none print:shadow-none">
                        <Star size={12} className="fill-[#7263f3] print:fill-current"/> Pro Member
                    </span>
                </div>
                
                <h3 className="text-xl font-bold text-[#7263f3] mb-6">{userProfile?.profession || "Aspiring Software Engineer"}</h3>

                <div className="flex flex-wrap justify-center xl:justify-start gap-3 mb-8 print:justify-start">
                    <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 border border-gray-100 print:bg-transparent print:px-0 print:border-none">
                        <MapPin size={16} className="text-[#7263f3]" /> {userProfile?.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 border border-gray-100 print:bg-transparent print:px-0 print:border-none">
                        <Mail size={16} className="text-[#7263f3]" /> {userProfile?.email || "student@university.edu"}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-sm font-bold text-gray-600 border border-gray-100 print:bg-transparent print:px-0 print:border-none">
                        <Calendar size={16} className="text-[#7263f3]" /> Joined 2023
                    </span>
                </div>

                {/* Social Links */}
                <div className="flex gap-3 justify-center xl:justify-start print:hidden">
                    {[
                      { Icon: Github, link: userProfile?.socialLinks?.github, color: "hover:bg-gray-900 hover:text-white hover:border-gray-900" },
                      { Icon: Twitter, link: userProfile?.socialLinks?.twitter, color: "hover:bg-blue-400 hover:text-white hover:border-blue-400" },
                      { Icon: Linkedin, link: userProfile?.socialLinks?.linkedin, color: "hover:bg-blue-700 hover:text-white hover:border-blue-700" },
                      { Icon: Globe, link: userProfile?.socialLinks?.portfolio, color: "hover:bg-emerald-500 hover:text-white hover:border-emerald-500" }
                    ].map(({ Icon, link, color }, i) => (
                      <a 
                        key={i} 
                        href={link ? (link.startsWith('http') ? link : `https://${link}`) : "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`p-3 border-2 border-gray-100 rounded-2xl bg-white transition-all shadow-sm 
                        ${!link ? 'opacity-30 grayscale pointer-events-none' : `text-gray-500 ${color} hover:-translate-y-1 hover:shadow-md`}`}
                      >
                        <Icon size={20} />
                      </a>
                    ))}
                </div>
            </div>

            {/* Gamification Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full xl:w-auto shrink-0 print:grid-cols-4 print:w-full print:mt-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center w-full xl:w-37.5 print:shadow-none print:border-2 print:border-gray-200">
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 print:bg-transparent`}>
                            {stat.icon}
                        </div>
                        <h4 className="text-3xl font-black text-gray-900">{stat.value}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* TABS NAVIGATION - HIDDEN ON PRINT */}
        <div className="mt-12 bg-white rounded-3xl p-2 border border-gray-100 shadow-sm flex overflow-x-auto no-scrollbar max-w-max print:hidden">
            {/* ✅ FIXED: Added "NEP Ledger" to tabs navigation array */}
            {["Overview", "Skills", "Participations", "Achievements", "NEP Ledger"].map((tab) => (
                <button 
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`py-3 px-8 text-xs font-black uppercase tracking-widest transition-all rounded-2xl whitespace-nowrap
                    ${activeTab === tab.toLowerCase() ? "bg-[#7263f3] text-white shadow-md shadow-[#7263f3]/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* TAB CONTENT AREA */}
        {/* ✅ ALWAYS show Overview and Skills in print mode, regardless of active tab */}
        <div className="mt-8 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 print:mt-12">
          <div className={`${activeTab === "overview" ? "block" : "hidden print:block"}`}>
             <OverviewSection user={userProfile} />
          </div>
          <div className={`${activeTab === "skills" ? "block" : "hidden print:block print:mt-8"}`}>
             <SkillsSection user={userProfile} />
          </div>
          <div className={`${activeTab === "participations" ? "block" : "hidden"}`}>
             <ParticipationsSection />
          </div>
          <div className={`${activeTab === "achievements" ? "block" : "hidden"}`}>
             <AchievementsSection />
          </div>
          {/* ✅ FIXED: Added NEP Ledger condition */}
          <div className={`${activeTab === "nep ledger" ? "block" : "hidden print:block print:mt-8"}`}>
             <NepLedgerSection />
          </div>
        </div>

      </div>
      
      {/* ✅ HIDE FOOTER ON PRINT */}
      <div className="print:hidden">
        <Footer />
      </div>
    </main>
  );
}

function OverviewSection({ user }: { user: ExtendedUser | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-sm h-full print:shadow-none print:border-none print:p-0">
          <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
            Professional Summary
            <div className="h-1 flex-1 bg-gray-100 rounded-full mt-1"></div>
          </h3>
          <p className="text-gray-600 leading-relaxed font-medium text-lg whitespace-pre-line">
            {user?.bio || "No professional summary added yet. Click 'Edit Profile' to introduce yourself to employers and highlight your academic journey."}
          </p>
          
          <div className="mt-12 pt-10 border-t border-gray-100">
            <h4 className="font-black text-xs text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-amber-500"/> Core Interests & Domains
            </h4>
            <div className="flex flex-wrap gap-3">
              {user?.interests && user.interests.length > 0 ? (
                user.interests.map((tag: string) => (
                  <span key={tag} className="px-5 py-2.5 bg-indigo-50 rounded-2xl text-sm text-[#7263f3] font-black border border-indigo-100 transition-transform hover:-translate-y-1 cursor-default print:border-gray-300 print:text-gray-700 print:bg-transparent">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="px-5 py-2.5 bg-gray-50 rounded-2xl text-sm text-gray-400 font-bold border border-gray-100">
                  No interests tagged yet.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm h-full print:shadow-none print:border-none print:p-0">
          <h3 className="font-black text-gray-900 text-xl mb-8 flex items-center gap-2">
            <Target className="text-[#7263f3]" size={24}/> Activity Timeline
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-gray-200 before:to-transparent print:before:hidden">
            {[
              { title: "Submitted Logbook", desc: "8 hours at Tech Corp", time: "2 days ago", color: "bg-blue-500" },
              { title: "Profile Updated", desc: "Added new React skills", time: "1 week ago", color: "bg-emerald-500" },
              { title: "Joined Platform", desc: "Started the journey", time: "Jan 2023", color: "bg-[#7263f3]" },
            ].map((activity, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active print:flex-row print:justify-start print:gap-4 print:mb-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${activity.color} text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 print:transform-none print:border-none print:w-8 print:h-8`}>
                  <Check size={14} strokeWidth={3}/>
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-gray-50 p-4 rounded-2xl border border-gray-100 print:w-full print:bg-transparent print:p-0 print:border-none">
                  <div className="flex items-center justify-between mb-1 print:justify-start print:gap-4">
                    <h4 className="font-bold text-gray-900 text-sm">{activity.title}</h4>
                    <span className="text-[10px] font-black text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{activity.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsSection({ user }: { user: ExtendedUser | null }) {
  return (
    <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
      <div className="text-center mb-16 print:text-left print:mb-8">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#7263f3] print:hidden">
           <Zap size={32} />
        </div>
        <h3 className="text-3xl font-black text-gray-900 mb-2 flex print:items-center gap-3">
          <Zap size={24} className="hidden print:block text-[#7263f3]"/>
          Technical Proficiency
        </h3>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Self-assessed skills and technologies</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl mx-auto print:mx-0">
        {user?.skills && user.skills.length > 0 ? (
          user.skills.map((skill: Skill, index: number) => (
            <div key={index} className="group">
              <div className="flex justify-between mb-3 items-end">
                <span className="font-black text-gray-900 text-lg">{skill.name}</span>
                <span className="text-sm font-black text-[#7263f3] bg-indigo-50 px-3 py-1 rounded-lg print:bg-transparent">{skill.value}%</span>
              </div>
              <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden p-1 border border-gray-200 shadow-inner print:border-gray-300">
                <div 
                  className="h-full bg-linear-to-r from-[#7263f3] to-[#9a8fff] rounded-full transition-all duration-1000 relative print:bg-[#7263f3]" 
                  style={{ width: `${skill.value}%` }} 
                >
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite] print:hidden"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 print:border-none print:bg-transparent print:text-left print:p-0">
             <Target className="w-12 h-12 text-gray-300 mx-auto mb-4 print:hidden" />
             <p className="text-gray-500 font-black text-lg">No skill records found.</p>
             <p className="text-gray-400 font-medium mt-1">Update your profile to showcase your tech stack.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ParticipationsSection() {
  const participations = [
    { title: "Smart India Hackathon 2024", status: "Ongoing", rank: "Finalist", color: "from-[#1e1b4b] to-[#7263f3]" },
    { title: "Google Cloud AI Sprint", status: "Completed", rank: "Top 10", color: "from-emerald-600 to-teal-400" },
    { title: "Web3 Builders Competition", status: "Ongoing", rank: "Participant", color: "from-blue-600 to-cyan-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {participations.map((item, i) => (
        <div key={i} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
          <div className={`h-40 bg-linear-to-br ${item.color} relative overflow-hidden p-8 flex items-end`}>
            <div className="absolute top-4 right-4 text-white/20 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12"><Target size={100} /></div>
            <span className="relative z-10 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
              {item.status}
            </span>
          </div>
          <div className="p-8 flex-1 flex flex-col justify-between">
            <h4 className="font-black text-xl text-gray-900 mb-6 group-hover:text-[#7263f3] transition-colors leading-tight">{item.title}</h4>
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Placement</span>
              <span className="text-sm font-black text-gray-900 bg-gray-100 px-4 py-1.5 rounded-xl">{item.rank}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AchievementsSection() {
  const badges = [
    { title: "Early Adopter", desc: "Joined the platform in its beta phase.", icon: <Star size={32} className="text-amber-500" />, bg: "bg-amber-50", border: "border-amber-200" },
    { title: "Logbook Master", desc: "Logged over 100 verified internship hours.", icon: <BookOpen size={32} className="text-[#7263f3]" />, bg: "bg-indigo-50", border: "border-indigo-200" },
    { title: "Top Applicant", desc: "Applied to 50+ verified industry jobs.", icon: <Briefcase size={32} className="text-emerald-500" />, bg: "bg-emerald-50", border: "border-emerald-200" },
    { title: "Profile Perfect", desc: "Achieved 100% profile completion.", icon: <ShieldCheck size={32} className="text-blue-500" />, bg: "bg-blue-50", border: "border-blue-200" },
  ];

  return (
    <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-black text-gray-900 mb-2">Gamified Badges</h3>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Unlock achievements by interacting with the platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-8 rounded-[32px] border-2 ${badge.border} ${badge.bg} flex flex-col items-center text-center transition-transform hover:-translate-y-2 cursor-default`}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-6">
              {badge.icon}
            </div>
            <h4 className="font-black text-lg text-gray-900 mb-2">{badge.title}</h4>
            <p className="text-sm font-medium text-gray-600">{badge.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ✅ FIXED: ADDED THE NEP LEDGER COMPONENT
function NepLedgerSection() {
  const internshipHours = 120; 
  const internshipCredits = Math.floor(internshipHours / 30);
  const learningCredits = 45; 
  const totalCredits = internshipCredits + learningCredits;

  const transactions = [
    { id: "TRX-8921", date: "Oct 12, 2025", type: "Internship Logbook", detail: "Tech Corp (30 Hours Approved)", credits: "+1", status: "Verified" },
    { id: "TRX-8922", date: "Nov 05, 2025", type: "Learning Hub", detail: "Advanced React Course", credits: "+15", status: "Verified" },
    { id: "TRX-8923", date: "Dec 20, 2025", type: "Internship Logbook", detail: "Tech Corp (90 Hours Approved)", credits: "+3", status: "Verified" },
    { id: "TRX-8924", date: "Jan 15, 2026", type: "Learning Hub", detail: "Machine Learning Basics", credits: "+30", status: "Verified" },
  ];

  return (
    <div className="bg-white p-10 md:p-12 rounded-[40px] border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 print:mb-6">
        <div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <Wallet size={28} className="text-[#7263f3] print:hidden"/>
            Academic Bank of Credits (ABC)
          </h3>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Official NEP 2020 Credit Engine Ledger</p>
        </div>
        <div className="mt-4 md:mt-0 px-5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl print:hidden">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Engine Formula:</span>
            <p className="text-sm font-bold text-gray-900 mt-1">30 Verified Hours = 1 Credit</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-linear-to-br from-indigo-50 to-blue-50 p-8 rounded-[32px] border border-indigo-100 print:border-gray-300 print:bg-transparent">
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Industry Internship</p>
            <h4 className="text-4xl font-black text-[#7263f3] mb-1">{internshipCredits} <span className="text-lg text-indigo-400">CR</span></h4>
            <p className="text-sm font-bold text-gray-600">{internshipHours} Total Hours Logged</p>
        </div>
        <div className="bg-linear-to-br from-emerald-50 to-teal-50 p-8 rounded-[32px] border border-emerald-100 print:border-gray-300 print:bg-transparent">
            <p className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2">Platform Skilling</p>
            <h4 className="text-4xl font-black text-emerald-500 mb-1">{learningCredits} <span className="text-lg text-emerald-400">CR</span></h4>
            <p className="text-sm font-bold text-gray-600">From Learning Hub Courses</p>
        </div>
        <div className="bg-linear-to-br from-gray-900 to-[#1e1b4b] p-8 rounded-[32px] shadow-lg shadow-gray-900/20 print:border-2 print:border-gray-900 print:bg-transparent print:shadow-none print:text-gray-900">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Total Accumulated</p>
            <h4 className="text-4xl font-black text-white mb-1 print:text-gray-900">{totalCredits} <span className="text-lg text-gray-400">CR</span></h4>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 print:text-gray-600">
                <CheckCircle2 size={14}/> Ready for University Transfer
            </p>
        </div>
      </div>

      <div>
        <h4 className="font-black text-lg text-gray-900 mb-6 flex items-center gap-2">
            <History size={20} className="text-gray-400"/> Verified Transaction History
        </h4>
        <div className="bg-gray-50 rounded-[32px] border border-gray-100 overflow-hidden print:bg-transparent print:border-gray-300">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date / ID</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Credits Earned</th>
                        <th className="py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((trx, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-white transition-colors print:border-gray-200">
                            <td className="py-5 px-6">
                                <p className="text-sm font-black text-gray-900">{trx.date}</p>
                                <p className="text-[10px] font-bold text-gray-400 tracking-wider">{trx.id}</p>
                            </td>
                            <td className="py-5 px-6">
                                <p className="text-sm font-bold text-gray-800">{trx.type}</p>
                                <p className="text-xs font-medium text-gray-500">{trx.detail}</p>
                            </td>
                            <td className="py-5 px-6">
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black border border-emerald-200 print:border-none print:bg-transparent print:px-0">
                                    {trx.credits} CR
                                </span>
                            </td>
                            <td className="py-5 px-6 text-right">
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    <CheckCircle2 size={12}/> {trx.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}