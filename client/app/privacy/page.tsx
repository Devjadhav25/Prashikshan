import React from "react";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { ShieldCheck, Database, Eye, Lock } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="bg-[#F8F9FB] min-h-screen">
      <Header />
      
      {/* Header Banner */}
      <div className="bg-[#1e1b4b] text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <ShieldCheck size={48} className="text-emerald-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-indigo-200 font-medium">Your data security and academic privacy are our top priorities.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-10">
            
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <Database className="text-emerald-500" /> 1. Data Collection
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                To facilitate the Academia-Industry interface, Prashikshan collects necessary personal and academic data. This includes your name, institutional affiliation (College/University), current CGPA, contact details, uploaded resumes, daily internship logs, and progress on Skill Readiness modules from external platforms (e.g., Swayam, Coursera).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <Eye className="text-emerald-500" /> 2. How We Use Your Data (Directorate Dashboard)
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium mb-4">
                Your data is never sold to third-party marketers. It is strictly utilized for academic and employment purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 font-medium">
                <li><strong>Skill Matching:</strong> To match your profile with relevant internship opportunities based on your skills and completed learning modules.</li>
                <li><strong>Credit Generation:</strong> To generate verified reports for your college faculty to award NEP 2020 credits.</li>
                <li><strong>State Analytics:</strong> Anonymized, aggregated data (such as total placements per college or region) is shared with the State Directorate Dashboard to help government officials make policy decisions regarding technical education in Maharashtra.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-3">
                <Lock className="text-emerald-500" /> 3. Third-Party Integrations
            </h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                Prashikshan integrates with several secure third-party platforms to enhance your experience. Authentication is handled securely via <strong>Auth0</strong>. Profile pictures and resumes are stored on <strong>Cloudinary</strong>. We also track course completions from partners like Swayam and Infosys Springboard. We only share the absolute minimum data required for these integrations to function.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed font-medium">
                Students hold the right to request a copy of their academic logbook data at any time. If you wish to delete your account, you may initiate a request through your affiliated college, as academic records linked to NEP credits require institutional approval for deletion to prevent credit fraud.
            </p>
          </section>

        </div>
      </div>
      <Footer />
    </main>
  );
}