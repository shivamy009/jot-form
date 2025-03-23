// components/FormPreview.tsx (unchanged except for minor class adjustments)
"use client";

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormData } from "@/lib/types";
import { useState } from "react";

interface FormPreviewProps {
  formData: FormData;
  onSubmit: () => void;
}

export default function FormPreview({ formData, onSubmit }: FormPreviewProps) {
  const schema = z.object(
    Object.fromEntries(
      formData.fields.map((field) => [
        field.id,
        field.type === "email"
          ? z.string().email("Invalid email").min(1, "Required")
          : field.type === "phone"
          ? z
              .string()
              .min(10, "Phone number must be at least 10 digits")
              .max(15, "Phone number cannot exceed 15 digits")
              .regex(/^\d+$/, "Phone number must contain only digits")
          : field.type === "date"
          ? z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)").min(1, "Required")
          : z.string().min(1, "Required"),
      ])
    )
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(formData.fields.map((f) => [f.id, ""])),
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = (data: Record<string, string>) => {
    const allFieldsFilled = Object.values(data).every((value) => value?.trim().length > 0);
    if (allFieldsFilled) {
      console.log("Form submitted:", data);
      setSubmitError(null);
      onSubmit();
    } else {
      setSubmitError("Please fill out all required fields");
    }
  };

  const handlePhoneInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: UseFormReturn<Record<string, string>>,
    fieldId: string
  ) => {
    const value = e.target.value;
    const numericValue = value.replace(/\D/g, "");
    if (value !== numericValue) {
      form.setError(fieldId, { type: "manual", message: "Enter number not character" });
    } else {
      form.clearErrors(fieldId);
    }
    form.setValue(fieldId, numericValue, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold">{formData.name}</h2>
        {formData.fields.map((field) => (
          <FormField
            key={field.id}
            control={form.control}
            name={field.id}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel
                  style={{
                    color: formData.theme.label.color,
                    fontSize: formData.theme.label.fontSize,
                    fontFamily:
                      formData.theme.label.fontFamily === "font-sans"
                        ? "sans-serif"
                        : formData.theme.label.fontFamily === "font-serif"
                        ? "serif"
                        : "monospace",
                  }}
                >
                  {field.label} <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  {field.type === "select" ? (
                    <Select onValueChange={formField.onChange} value={formField.value}>
                      <SelectTrigger
                        style={{
                          borderColor: formData.theme.input.borderColor,
                          fontSize: formData.theme.input.fontSize,
                          fontFamily:
                            formData.theme.input.fontFamily === "font-sans"
                              ? "sans-serif"
                              : formData.theme.input.fontFamily === "font-serif"
                              ? "serif"
                              : "monospace",
                        }}
                      >
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "date" ? (
                    <Input
                      type="date"
                      style={{
                        borderColor: formData.theme.input.borderColor,
                        fontSize: formData.theme.input.fontSize,
                        fontFamily:
                          formData.theme.input.fontFamily === "font-sans"
                            ? "sans-serif"
                            : formData.theme.input.fontFamily === "font-serif"
                            ? "serif"
                            : "monospace",
                      }}
                      {...formField}
                      value={formField.value ?? ""}
                    />
                  ) : (
                    <Input
                      type={
                        field.type === "phone"
                          ? "tel"
                          : field.type === "email"
                          ? "email"
                          : "text"
                      }
                      style={{
                        borderColor: formData.theme.input.borderColor,
                        fontSize: formData.theme.input.fontSize,
                        fontFamily:
                          formData.theme.input.fontFamily === "font-sans"
                            ? "sans-serif"
                            : formData.theme.input.fontFamily === "font-serif"
                            ? "serif"
                            : "monospace",
                      }}
                      {...formField}
                      value={formField.value ?? ""}
                      onInput={
                        field.type === "phone"
                          ? (e) => handlePhoneInput(e as React.ChangeEvent<HTMLInputElement>, form, field.id)
                          : undefined
                      }
                      maxLength={field.type === "phone" ? 15 : undefined}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        {submitError && <p className="text-red-500 text-sm sm:text-base">{submitError}</p>}
        <Button
          type="submit"
          style={{
            backgroundColor: formData.theme.button.backgroundColor,
            color: formData.theme.button.color,
          }}
          className="text-sm sm:text-base"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}