// lib/types.ts
export interface FormField {
    id: string;
    type: "text" | "email" | "phone" | "address" | "date" | "select" | "number" | "custom"; // Added "custom"
    label: string;
    required: boolean;
    options?: string[];
  }
  
  export interface ThemeConfig {
    input: { borderColor: string; fontSize: string; fontFamily: string };
    label: { color: string; fontSize: string; fontFamily: string };
    button: { backgroundColor: string; color: string };
  }
  
  export interface FormData {
    name: string;
    fields: FormField[];
    theme: ThemeConfig;
  }