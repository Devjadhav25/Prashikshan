"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import useGlobalContext from "@/context/globalContext";
import Header from "@/component/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Building, SearchIcon, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Footer from "@/component/Footer";

export default function Home() {
  // ✅ Connected to Global Context for the search state
  const { jobTitle, handleTitleChange } = useGlobalContext(); 
  const router = useRouter();

  // ✅ Search logic to redirect to Find Work with the query
  const handleSearch = () => {
    if (jobTitle.trim()) {
      router.push(`/findwork?title=${encodeURIComponent(jobTitle.trim())}`);
    } else {
      router.push("/findwork");
    }
  };

  const features = [
    {
      icon: <Briefcase className="w-6 h-6 text-[#7263f3]" />,
      title: "Diverse Opportunities",
      description:
        "Access thousands of job listings across various industries and experience levels.",
      benefits: [
        "100,000+ active job listings",
        "50+ job categories",
        "Remote and on-site options",
      ],
      cta: "Explore Jobs",
      ctaLink: "/findwork",
    },
    {
      icon: <Building className="w-6 h-6 text-[#7263f3]" />,
      title: "Top Companies",
      description:
        "Connect with leading companies, from innovative startups to Fortune 500 corporations.",
      benefits: [
        "500+ verified employers",
        "Exclusive partnerships",
        "Direct application process",
      ],
      cta: "View Companies",
      ctaLink: "/findwork",
    },
    {
      icon: <Users className="w-6 h-6 text-[#7263f3]" />,
      title: "Talent Pool",
      description:
        "Employers can access a diverse pool of qualified candidates for their open positions.",
      benefits: [
        "1M+ registered job seekers",
        "Advanced search filters",
        "AI-powered matching",
      ],
      cta: "Post a Job",
      ctaLink: "/post",
    },
  ];

  return (
    <main>
      <Header />

      {/* Hero Section with Search Functionality */}
      <section className="py-20 bg-gradient-to-b from-[#d7dedc] to-[#7263f3]/5 text-primary-foreground">
        <div className="container mx-auto px-4 text-center text-black">
          <h1 className="text-4xl text-[#7263f3] md:text-5xl font-bold mb-6">
            Find Your Dream Job or Perfect Candidate
          </h1>
          <p className="text-xl mb-8">
            Connect with thousands of employers and job seekers on our platform
          </p>
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Job title or keyword"
              className="flex-grow bg-white text-black"
              // ✅ Controlled input linked to context
              value={jobTitle}
              onChange={handleTitleChange}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              className="bg-[#7263f3] text-white"
            >
              <SearchIcon className="w-6 h-6" />
              Search Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-[#f0f5fa]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose{" "}
            <span className="text-[#7263f3] font-extrabold">JobHelper</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex flex-col h-full rounded-xl border-none shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, bIndex) => (
                      <li key={bIndex} className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={feature.ctaLink}>{feature.cta}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Badge
              variant={"outline"}
              className="text-sm font-medium border-gray-400"
            >
              Trusted by 10,000+ companies worldwide
            </Badge>
          </div>
        </div>
      </section>

      
      <section className="py-24 relative overflow-hidden bg-[#F8F9FB]">
  {/* Decorative Background Blur Orbs */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#7263f3]/10 rounded-full blur-[120px]"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-5xl mx-auto bg-white/40 backdrop-blur-md rounded-[50px] p-12 md:p-20 border border-white shadow-sm text-center transition-all hover:shadow-2xl duration-500">
      
      <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter leading-tight">
        Ready to Get <span className="bg-gradient-to-r from-[#7263f3] to-[#9a8fff] bg-clip-text text-transparent">Started?</span>
      </h2>
      
      <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
        Join thousands of professionals and companies already growing their careers and teams on Prashikshan.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link 
          href="/findwork" 
          className="group relative px-12 py-5 bg-gray-900 text-white rounded-[24px] font-black uppercase tracking-widest text-sm shadow-xl shadow-gray-200 transition-all hover:bg-[#7263f3] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
        >
          Find Work
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
        
        <Link 
          href="/post" 
          className="px-12 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[24px] font-black uppercase tracking-widest text-sm transition-all hover:border-[#7263f3] hover:text-[#7263f3] hover:-translate-y-1 active:scale-95 flex items-center justify-center"
        >
          Post a Job
        </Link>
      </div>

      {/* Trust Badge */}
      <div className="mt-12 pt-8 border-t border-gray-100/50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
          Trusted by 10,000+ companies worldwide
        </p>
      </div>
    </div>
  </div>
</section>

      <Footer />
    </main>
  );
}