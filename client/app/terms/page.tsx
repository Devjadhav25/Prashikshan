import React from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { Scale, BookOpen, ShieldAlert, Award } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="bg-[#F8F9FB] min-h-screen">
      <Header />
      
      {/* Header Banner */}
      <div className="bg-[#1e1b4b] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7263f3]/20 rounded-full blur-[100px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <Scale size={48} className="text-[#a5b4fc] mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-indigo-200 font-medium">Last Updated: February 2026 | Compliant with NEP 2020 Guidelines</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">
            
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <BookOpen className="text-[#7263f3]" /> 1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                Welcome to <strong>Prashikshan</strong>, the official Academia-Industry Interface platform. By accessing or using our platform as a Student, Faculty member, Industry Recruiter, or Government Official, you agree to be bound by these Terms. Our platform facilitates the bridging of the skill gap and the tracking of academic internships in accordance with the National Education Policy (NEP) 2020.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <Award className="text-[#7263f3]" /> 2. NEP 2020 Credit Integration Engine
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Prashikshan utilizes an automated Logbook to track internship and upskilling hours. The credit calculation is governed by the following rules:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
                <li><strong>Credit Ratio:</strong> As per NEP guidelines, thirty (30) verified hours of industry internship or approved skill-readiness modules equate to one (1) Academic Credit.</li>
                <li><strong>Verification:</strong> Hours logged by students remain in a &quot;Pending&quot; state until verified and approved by the respective Industry Mentor or College Faculty.</li>
                <li><strong>Final Authority:</strong> Prashikshan acts as a tracking facilitator. The final awarding of credits to the student&apos;s degree is at the sole discretion of their affiliated University or College Directorate.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <ShieldAlert className="text-amber-500" /> 3. Academic Integrity & Anti-Cheating
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                Academic honesty is the core pillar of Prashikshan. Any student found engaging in fraudulent activities, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium mt-4 mb-4">
                <li>Logging fake internship hours in the Logbook.</li>
                <li>Pasting plagiarized summaries in the Skill Readiness &quot;Proof of Learning&quot; verification gate.</li>
                <li>Falsifying identity or college affiliation.</li>
            </ul>
            <p className="text-gray-600 leading-relaxed font-medium">
                ...will face immediate account suspension. Their affiliated college Directorate and the hiring company will be notified automatically, resulting in the forfeiture of all accrued NEP credits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Employer & Recruiter Obligations</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                Companies posting internships on Prashikshan agree to provide genuine, skill-enhancing roles. Employers are strictly prohibited from posting &quot;pay-to-work&quot; internships or demanding financial compensation from students for training certificates.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}