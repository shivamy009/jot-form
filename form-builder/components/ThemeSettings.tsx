// components/ThemeSettings.tsx
"use client";

import { FormData, ThemeConfig } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ThemeSettingsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function ThemeSettings({ formData, setFormData }: ThemeSettingsProps) {
  const updateTheme = (key: keyof ThemeConfig, subKey: string, value: string) => {
    setFormData({
      ...formData,
      theme: {
        ...formData.theme,
        [key]: { ...formData.theme[key], [subKey]: value },
      },
    });
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Theme Settings</h2>
      <div className="space-y-4">
        <div>
          <Label>Input Border Color</Label>
          <Input
            type="text"
            value={formData.theme.input.borderColor}
            onChange={(e) => updateTheme("input", "borderColor", e.target.value)}
            placeholder="e.g., border-blue-500"
          />
        </div>
        <div>
          <Label>Button Background</Label>
          <Input
            type="text"
            value={formData.theme.button.backgroundColor}
            onChange={(e) => updateTheme("button", "backgroundColor", e.target.value)}
            placeholder="e.g., bg-green-500"
          />
        </div>
      </div>
    </div>
  );
}