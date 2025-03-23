// components/Sidebar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { FormData, FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { ChromePicker } from "react-color";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function Sidebar({ isOpen, onClose, formData, setFormData }: SidebarProps) {
  const [inputBorderColor, setInputBorderColor] = useState(formData.theme.input.borderColor);
  const [buttonBgColor, setButtonBgColor] = useState(formData.theme.button.backgroundColor);
  const [labelColor, setLabelColor] = useState(formData.theme.label.color);
  const [buttonColor, setButtonColor] = useState(formData.theme.button.color);
  const [inputFontSize, setInputFontSize] = useState(formData.theme.input.fontSize.replace("px", ""));
  const [labelFontSize, setLabelFontSize] = useState(formData.theme.label.fontSize.replace("px", ""));
  const [customFieldName, setCustomFieldName] = useState("");
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  const addField = (type: FormField["type"], label?: string) => {
    const field: FormField = {
      id: uuidv4(),
      type,
      label: label || type.charAt(0).toUpperCase() + type.slice(1),
      required: true,
    };
    setFormData({ ...formData, fields: [...formData.fields, field] });
    if (type === "custom") setCustomFieldName("");
    onClose();
  };

  const updateTheme = (key: keyof FormData["theme"], subKey: string, value: string) => {
    setFormData({
      ...formData,
      theme: { ...formData.theme, [key]: { ...formData.theme[key], [subKey]: value } },
    });
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 w-full max-w-[320px] sm:w-80 bg-white shadow-lg transform transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-50 overflow-y-auto`}
    >
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-2 right-2 sm:top-4 sm:right-4 cursor-pointer">
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>

        <div className="mt-8 sm:mt-10 mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Components</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {["name", "email", "phone", "address", "date"].map((type) => (
              <Button key={type} variant="outline" onClick={() => addField(type as FormField["type"])} className="text-sm sm:text-base cursor-pointer">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Custom Component</h3>
          <div className="flex gap-2 mt-2">
            <Input
              value={customFieldName}
              onChange={(e) => setCustomFieldName(e.target.value)}
              placeholder="Enter field name"
              className="flex-1 text-sm sm:text-base"
            />
            <Button
              onClick={() => customFieldName.trim() && addField("custom", customFieldName.trim())}
              disabled={!customFieldName.trim()}
              className="text-sm sm:text-base cursor-pointer"
            >
              Add
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Theme Settings</h3>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-xs sm:text-sm block mb-1">Input Border Color</label>
              <ChromePicker
                color={inputBorderColor}
                className=" cursor-pointer"
                onChange={(color) => setInputBorderColor(color.hex)}
                onChangeComplete={(color) => updateTheme("input", "borderColor", color.hex)}
              />
              <p className="text-xs sm:text-sm mt-1">{inputBorderColor}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Input Font Size (px)</label>
              <Input
                type="number"
                value={inputFontSize}
                onChange={(e) => {
                  setInputFontSize(e.target.value);
                  updateTheme("input", "fontSize", `${e.target.value}px`);
                }}
                min="10"
                max="24"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Label Color</label>
              <ChromePicker
                color={labelColor}
                onChange={(color) => setLabelColor(color.hex)}
                className=" cursor-pointer"
                onChangeComplete={(color) => updateTheme("label", "color", color.hex)}
              />
              <p className="text-xs sm:text-sm mt-1">{labelColor}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Label Font Size (px)</label>
              <Input
                type="number"
                value={labelFontSize}
                onChange={(e) => {
                  setLabelFontSize(e.target.value);
                  updateTheme("label", "fontSize", `${e.target.value}px`);
                }}
                min="10"
                max="20"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Button Background Color</label>
              <ChromePicker
                color={buttonBgColor}
                onChange={(color) => setButtonBgColor(color.hex)}
                className=" cursor-pointer"
                onChangeComplete={(color) => updateTheme("button", "backgroundColor", color.hex)}
              />
              <p className="text-xs sm:text-sm mt-1">{buttonBgColor}</p>
            </div>
            <div>
              <label className="text-xs sm:text-sm block mb-1">Button Text Color</label>
              <ChromePicker
                color={buttonColor}
                onChange={(color) => setButtonColor(color.hex)}
                className=" cursor-pointer"
                onChangeComplete={(color) => updateTheme("button", "color", color.hex)}
              />
              <p className="text-xs sm:text-sm mt-1">{buttonColor}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base sm:text-lg font-semibold">Font Family</h3>
          <Select
            value={formData.theme.input.fontFamily}
            onValueChange={(value) => {
              updateTheme("input", "fontFamily", value);
              updateTheme("label", "fontFamily", value); // Sync input and label fonts
            }}
          >
            <SelectTrigger className="mt-2 w-full text-sm sm:text-base">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="font-sans">Sans</SelectItem>
              <SelectItem value="font-serif">Serif</SelectItem>
              <SelectItem value="font-mono">Mono</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}