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
}
export type { Job };