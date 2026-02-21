"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { UserProfile, Skill } from "@/types/custom";
import { useGlobalContext } from "@/context/globalContext";
import { Plus, Trash2, Camera } from "lucide-react"; 
import axios from "axios";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

type SocialLinkKey = "github" | "twitter" | "linkedin" | "instagram";

export default function EditProfileModal({ user, isOpen, onClose }: EditProfileModalProps) {
  const { updateUserProfile } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    profession: "",
    location: "",
    bio: "",
    skills: [] as Skill[],
    socialLinks: {
      github: "",
      twitter: "",
      linkedin: "",
      instagram: ""
    },
    interests: [] as string[]
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [interestInput, setInterestInput] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        profession: user.profession || "",
        location: user.location || "",
        bio: user.bio || "",
        skills: user.skills || [],
        socialLinks: {
          github: user.socialLinks?.github || "",
          twitter: user.socialLinks?.twitter || "",
          linkedin: user.socialLinks?.linkedin || "",
          instagram: user.socialLinks?.instagram || ""
        },
        interests: user.interests || []
      });
      setPreview(user.profilePicture || null);
    }
  }, [user, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // ✅ Check file size (Limit to 2MB)
      const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
      
      if (file.size > MAX_FILE_SIZE) {
        toast.error("Image is too large! Please select an image under 2MB.");
        // Clear the input so they can try again
        e.target.value = ""; 
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSkillUpdate = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...formData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value } as Skill;
    setFormData({ ...formData, skills: newSkills });
  };

  const addInterest = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput.trim()] });
      setInterestInput("");
    }
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        addInterest(e);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required");

    setIsSubmitting(true);
    try {
      let currentAvatarUrl = user?.profilePicture;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("avatar", selectedFile);
        
        // Explicitly defining the headers for FormData ensures the backend parses the boundary correctly
        const res = await axios.post("/api/v1/user/upload-avatar", uploadData);
        currentAvatarUrl = res.data.profilePicture;
      }

      await updateUserProfile({
        ...formData,
        profilePicture: currentAvatarUrl,
      });

      toast.success("Profile updated!");
      onClose();
    } catch (error: unknown) {
      let errorMessage = "Failed to update profile";

      if (axios.isAxiosError(error)) {
        // If the backend returns a specific error (like "Invalid Cloudinary API Key"), it will show here
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Update Error:", error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-0 border-none">
        <div className="bg-[#7263f3] p-8 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase italic">Edit Professional Profile</DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="p-8 space-y-8">
          <div className="flex flex-col items-center -mt-20">
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl border-4 border-white overflow-hidden bg-gray-100 shadow-xl">
                <img src={preview || "/user.png"} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 p-2 bg-gray-900 text-white rounded-xl cursor-pointer hover:bg-[#7263f3] transition-all shadow-lg">
                <Camera size={18} />
                <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-gray-400">Full Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="rounded-xl border-gray-100 bg-gray-50 h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-gray-400">Profession</Label>
              <Input value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} className="rounded-xl border-gray-100 bg-gray-50 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Location</Label>
            <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="rounded-xl border-gray-100 bg-gray-50 h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-gray-400">Bio</Label>
            <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="rounded-xl border-gray-100 bg-gray-50 min-h-[100px]" />
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Social Presence</h4>
            <div className="grid grid-cols-2 gap-4">
              {(Object.keys(formData.socialLinks) as SocialLinkKey[]).map((key) => (
                <div key={key} className="space-y-1">
                  <Label className="capitalize text-[10px] text-gray-500 font-bold">{key}</Label>
                  <Input 
                    value={formData.socialLinks[key]} 
                    onChange={(e) => setFormData({
                      ...formData, 
                      socialLinks: { ...formData.socialLinks, [key]: e.target.value }
                    })} 
                    placeholder="URL"
                    className="rounded-lg border-gray-100 bg-gray-50 h-10 shadow-sm focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Interests</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="Design, AI... (Press Enter to add)" 
                value={interestInput} 
                onChange={(e) => setInterestInput(e.target.value)} 
                onKeyDown={handleInterestKeyDown} 
                className="rounded-xl bg-gray-50" 
              />
              <Button type="button" onClick={addInterest} className="bg-[#7263f3] rounded-xl px-6">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-50 text-[#7263f3] rounded-full text-xs font-bold border border-indigo-100 flex items-center gap-2">
                  {tag}
                  <button type="button" onClick={() => setFormData({...formData, interests: formData.interests.filter(t => t !== tag)})} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-50">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black text-gray-400 uppercase tracking-widest">Technical Skills</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, skills: [...formData.skills, { name: "", value: 80 }] })} className="rounded-lg border-[#7263f3] text-[#7263f3]">
                <Plus size={14} className="mr-1" /> Add
              </Button>
            </div>
            <div className="grid gap-3">
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <Input placeholder="Skill" value={skill.name} onChange={(e) => handleSkillUpdate(index, "name", e.target.value)} className="bg-white border-none h-9" />
                  <Input type="number" value={skill.value} onChange={(e) => handleSkillUpdate(index, "value", parseInt(e.target.value))} className="w-20 bg-white border-none h-9" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })} className="text-red-400"><Trash2 size={16} /></Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-gray-900 hover:bg-[#7263f3] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-gray-200">
              {isSubmitting ? "Updating Cloud..." : "Save Professional Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}