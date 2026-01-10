"use client";
import React from "react";
import { useTheme } from "next-themes";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useGlobalContext } from "@/context/globalContext";
import { 
  Moon, Sun, Bell, Shield, Eye, 
  Trash2, Monitor, Globe, ChevronRight 
} from "lucide-react";
import { Switch } from "@/components/ui/switch"; // Ensure you have shadcn switch

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { userProfile, isAuthenticated } = useGlobalContext();

  if (!isAuthenticated) return null;

  const settingSections = [
    {
      title: "Appearance",
      description: "Customize how Prashikshan looks on your screen.",
      options: [
        { 
          name: "Dark Mode", 
          desc: "Switch between light and dark themes", 
          icon: theme === "dark" ? <Moon size={20}/> : <Sun size={20}/>,
          action: (
            <Switch 
              checked={theme === "dark"} 
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} 
            />
          )
        },
      ]
    },
    {
      title: "Notifications",
      description: "Manage how you receive alerts and updates.",
      options: [
        { name: "Email Alerts", desc: "Get job matches via email", icon: <Bell size={20}/>, action: <Switch defaultChecked /> },
        { name: "Desktop Notifications", desc: "Real-time browser alerts", icon: <Monitor size={20}/>, action: <Switch /> },
      ]
    },
    {
      title: "Privacy & Security",
      description: "Control your data and account safety.",
      options: [
        { name: "Public Profile", desc: "Allow employers to find you", icon: <Eye size={20}/>, action: <Switch defaultChecked /> },
        { name: "Two-Factor Auth", desc: "Add extra layer of security", icon: <Shield size={20}/>, action: <ChevronRight size={20} className="text-gray-400"/> },
      ]
    }
  ];

  return (
    <main className="bg-[#F8F9FB] dark:bg-[#0F1115] min-h-screen transition-colors duration-500">
      <Header />
      
      <div className="container mx-auto px-4 md:px-12 py-16 max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-2">Account Settings</h1>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">Manage your professional preferences</p>
        </div>

        <div className="space-y-10">
          {settingSections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1A1D23] rounded-[40px] p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{section.title}</h2>
                <p className="text-gray-400 font-medium text-sm">{section.description}</p>
              </div>

              <div className="space-y-4">
                {section.options.map((opt, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-gray-50 dark:bg-[#23272F] border border-transparent hover:border-[#7263f3]/20 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-white dark:bg-[#1A1D23] rounded-2xl text-[#7263f3] shadow-sm">
                        {opt.icon}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 dark:text-white text-sm tracking-tight">{opt.name}</p>
                        <p className="text-xs text-gray-400 font-bold">{opt.desc}</p>
                      </div>
                    </div>
                    {opt.action}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="bg-red-50/50 dark:bg-red-900/10 rounded-[40px] p-8 md:p-12 border border-red-100 dark:border-red-900/30">
             <h2 className="text-2xl font-black text-red-600 mb-2">Danger Zone</h2>
             <p className="text-red-400 font-medium text-sm mb-8">Permanently delete your professional data and account.</p>
             <button className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-200 dark:shadow-none">
               <Trash2 size={16}/> Delete Account
             </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}