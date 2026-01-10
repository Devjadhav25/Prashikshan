"use client";
import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";
import { Badge } from "@/components/ui/badge";

function Profile() {
  const { userProfile, auth0User, loading } = useGlobalContext();
  const router = useRouter();

  const profileImg = userProfile?.profilePicture || auth0User?.picture || "/user.png";
  const profileName = userProfile?.name || auth0User?.name;
  const profileEmail = userProfile?.email || auth0User?.email;
  const profileProfession = userProfile?.profession;

  const [imgSrc, setImgSrc] = useState(profileImg);

  useEffect(() => {
    setImgSrc(profileImg);
  }, [profileImg]);

  return (
    <DropdownMenu>
      <div className="flex items-center gap-3">
        {/* --- PROFESSION SKELETON --- */}
        {loading && !profileProfession ? (
          <div className="h-7 w-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <Badge className="hidden md:flex bg-[#7263f3]/10 text-[#7263f3] border-none hover:bg-[#7263f3]/20 transition-all font-bold px-3 py-1 rounded-lg">
            {profileProfession || "Member"}
          </Badge>
        )}
        
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <div className="relative group">
            <div className={`p-0.5 rounded-full border-2 transition-all duration-300 shadow-sm ${loading ? "border-gray-100 animate-pulse" : "border-transparent group-hover:border-[#7263f3]"}`}>
              <Image
                src={imgSrc}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full object-cover aspect-square"
                onError={() => setImgSrc("/user.png")}
                unoptimized
              />
            </div>
            {!loading && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>}
          </div>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-xl border-gray-100" align="end">
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                <Image src={imgSrc} alt="small-avatar" width={40} height={40} className="rounded-full" />
             </div>
             
             <div className="flex flex-col space-y-2 overflow-hidden w-full">
                {/* --- NAME & EMAIL SKELETONS --- */}
                {loading && !profileName ? (
                  <>
                    <div className="h-3 w-3/4 bg-gray-200 animate-pulse rounded-full"></div>
                    <div className="h-2 w-1/2 bg-gray-100 animate-pulse rounded-full"></div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-gray-900 truncate tracking-tight">{profileName || "Loading..."}</p>
                    <p className="text-[11px] font-medium text-gray-400 truncate">{profileEmail}</p>
                  </>
                )}
             </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-50" />

        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 focus:bg-[#7263f3]/5 group" asChild>
            <Link href="/profile" className="flex items-center w-full">
              <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-[#7263f3]/10 mr-3 transition-colors">
                <User className="h-4 w-4 text-gray-500 group-hover:text-[#7263f3]" />
              </div>
              <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">View Profile</span>
            </Link>
          </DropdownMenuItem>
          
          
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2.5 focus:bg-[#7263f3]/5 group" asChild>
          <Link href="/settings" className="flex items-center w-full">
            <div className="p-1.5 rounded-lg bg-gray-50 group-hover:bg-[#7263f3]/10 mr-3 transition-colors">
              <Settings className="h-4 w-4 text-gray-500 group-hover:text-[#7263f3]" />
            </div>
            <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">Settings</span>
          </Link>
        </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-gray-50" />

        <div className="p-1">
          <DropdownMenuItem
            className="cursor-pointer rounded-xl py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700 group transition-all"
            onClick={() => router.push("http://localhost:8000/logout")}
          >
            <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 mr-3 transition-colors">
               <LogOut className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;