"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ Add this import
import { useGlobalContext } from "@/context/globalContext"; // ✅ Add this import

function Footer() {
  const pathname = usePathname(); // Get current URL
  const { isAuthenticated } = useGlobalContext(); // Check login status

  // ✅ Only show the "Get Started" box on the Home page
  // and only if the user is NOT authenticated
  const showCTA = pathname === "/" && !isAuthenticated;

  return (
    <footer className="bg-[#F8F9FB] pt-24 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        
        {/* --- CONDITIONAL GLASS CTA BOX --- */}
        {showCTA && (
          <div className="bg-white/40 backdrop-blur-md rounded-[50px] p-12 md:p-20 border border-white shadow-sm mb-20 text-center animate-in fade-in zoom-in duration-700">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
              Ready to Get <span className="text-[#7263f3]">Started?</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/findwork" 
                className="px-12 py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-[#7263f3] transition-all shadow-xl"
              >
                Find Work
              </Link>
              <Link 
                href="/post" 
                className="px-12 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[24px] font-black uppercase tracking-widest text-sm hover:border-[#7263f3] hover:text-[#7263f3] transition-all"
              >
                Post a Job
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Bar (Always stays visible) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-gray-200">
          <h1 className="font-black text-xl tracking-tighter bg-gradient-to-r from-[#7263f3] to-[#9a8fff] bg-clip-text text-transparent">
            Prashikshan
          </h1>
          <p className="text-gray-400 font-bold text-sm tracking-wide">
            &copy; {new Date().getFullYear()} Prashikshan. All rights reserved.
          </p>
          <div className="flex gap-10">
            <Link href="#" className="text-gray-400 hover:text-[#7263f3] transition-colors font-bold text-sm">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-[#7263f3] transition-colors font-bold text-sm">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;