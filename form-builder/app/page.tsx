// app/page.tsx
"use client";

import { useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import FormPreview from "@/components/FormPreview";
import Sidebar from "@/components/Sidebar";
import { FormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const createForm = () => {
    setFormData({
      name: "Form",
      fields: [],
      theme: {
        input: { borderColor: "#D1D5DB", fontSize: "16px", fontFamily: "font-sans" },
        label: { color: "#4B5563", fontSize: "14px", fontFamily: "font-sans" },
        button: { backgroundColor: "#3B82F6", color: "#FFFFFF" },
      },
    });
    setIsSubmitted(false);
    setIsPreview(false);
  };

  const handleFormSubmit = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="w-full max-w-md mx-auto sm:max-w-6xl">
        {!formData ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)]">
            <Button
              onClick={createForm}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-lg font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer"
            >
              Create New Form
            </Button>
          </div>
        ) : isSubmitted ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)]">
            <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-4">Form Submitted Successfully!</h2>
            <Button
              onClick={createForm}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-base sm:text-lg font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer"
            >
              Create Your Own
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="fixed top-0 left-0 right-0 bg-gray-100 p-2 sm:p-4 z-10 flex justify-between items-center w-full max-w-md mx-auto sm:max-w-6xl">
              <Button variant="outline" onClick={() => setIsSidebarOpen(true)} className="text-sm sm:text-base cursor-pointer">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" /> Add
              </Button>
              <Button onClick={() => setIsPreview(!isPreview)} className="text-sm sm:text-base cursor-pointer">
                {isPreview ? "Edit" : "Preview"}
              </Button>
            </div>

            <div className="pt-12 sm:pt-14">
              {isPreview ? (
                <FormPreview formData={formData} onSubmit={handleFormSubmit} />
              ) : (
                <FormBuilder formData={formData} setFormData={setFormData} />
              )}
            </div>

            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
      </div>
    </div>
  );
}