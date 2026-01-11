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
      
    </footer>
  );
}

export default Footer;