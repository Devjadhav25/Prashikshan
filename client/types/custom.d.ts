// declare module '*.css';
// declare module 'react-quill-new/dist/quill.snow.css' {
//   export = {};
// }

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  salaryType: "Yearly" | "Monthly" | "Weekly" | "Hourly";
  negotiable: boolean;
  jobType: string[];
  tags: string[];
  likes: string[];
  skills: string[];
  applicants: string[];
  createdBy: {
    _id: string;
    profilePicture: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  source?: string; 
  externalId?: string;
  externalLink?: string; // ✅ Add this (The URL to apply)
  employer_logo?: string;
  job_apply_link?: string;
  job_google_link?: string;
  job_publisher?: string;

}
// Add this to your types/custom.ts or at the top of your files
export interface Skill {
  name: string;
  value: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  profession?: string;
  location?: string;
  bio?: string;
  skills?: Skill[];
  socialLinks?: SocialLinks;
  interests?: string[];
  
}
export type { Job  , UserProfile, Skill};