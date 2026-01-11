"use client";
import { useGlobalContext } from "@/context/globalContext";
import { LogIn, UserPlus, Menu, X, Briefcase, LayoutDashboard, PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import Profile from "./profile";

function Header() {
  const { isAuthenticated } = useGlobalContext();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for glassmorphism
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Find Work", href: "/findwork", icon: <Briefcase className="w-4 h-4" /> },
    { name: "My Jobs", href: "/myjobs", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Post a Job", href: "/post", icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 px-4 md:px-10 py-4 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-[#F8F9FB] border-b border-gray-100"
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex justify-between items-center">
        
        {/* BRANDING WITH GRADIENT EFFECT */}
        <Link href={"/"} className="flex items-center gap-3 group transition-transform duration-300 hover:scale-105">
          <div className="relative w-11 h-11 transition-transform group-hover:rotate-12">
            <Image src="/appLogo.png" alt="logo" fill className="object-contain" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter bg-gradient-to-r from-[#7263f3] to-[#9a8fff] bg-clip-text text-transparent">
            Prashikshan
          </h1>
        </Link>

        {/* DESKTOP NAVIGATION WITH HOVER EFFECTS */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative py-2.5 px-5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group ${
                pathname === link.href
                  ? "text-[#7263f3] bg-[#7263f3]/5"
                  : "text-gray-500 hover:text-[#7263f3]"
              }`}
            >
              {link.icon}
              {link.name}
              {/* Animated underline */}
              <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 bg-[#7263f3] rounded-full transition-all duration-300 ${
                pathname === link.href ? "w-4" : "w-0 group-hover:w-4"
              }`}></span>
            </Link>
          ))}
        </nav>

        {/* AUTH BUTTONS & MOBILE TOGGLE */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
               <div className="hidden lg:block h-8 w-[1px] bg-gray-200"></div>
               <Profile />
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href={"https://prashikshan.onrender.com/login"}
                className="py-2.5 px-6 rounded-2xl text-sm font-black bg-[#7263f3] text-white shadow-lg shadow-[#7263f3]/20 hover:bg-[#5e4ee0] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href={"https://prashikshan.onrender.com/login"}
                className="py-2.5 px-6 rounded-2xl text-sm font-black border-2 border-gray-100 text-gray-700 hover:border-[#7263f3] hover:text-[#7263f3] transition-all duration-300 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-[#7263f3]/10 hover:text-[#7263f3] transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION - ANIMATED OVERLAY */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`py-3 px-5 rounded-2xl text-base font-bold flex items-center gap-4 transition-all ${
                  pathname === link.href
                    ? "text-[#7263f3] bg-[#7263f3]/5 border-l-4 border-[#7263f3]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 mt-4 pt-6 border-t border-gray-100">
                <Link
                  href={"https://prashikshan.onrender.com/login"}
                  className="py-3 rounded-2xl bg-[#7263f3] text-white font-black text-sm flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href={"https://prashikshan.onrender.com/login"}
                  className="py-3 rounded-2xl border-2 border-gray-100 text-gray-700 font-black text-sm flex items-center justify-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4" /> Join
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;