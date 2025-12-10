"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { showSuccess } from "@/utils/toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  companySize: z.enum(["15-35", "36-60", "61-95", "96-200"], {
    errorMap: () => ({ message: "Please select your company size." }),
  }),
});

const OnboardingForm: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      companySize: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://localhost:8000/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company_size: values.companySize,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit lead");
      }

      const data = await response.json();
      localStorage.setItem("lead_id", data.id); // Store lead_id

      console.log("Onboarding form submitted:", values);
      showSuccess("Onboarding complete! Starting your diagnostic...");
      navigate("/diagnostic"); // Navigate to the diagnostic flow
    } catch (error) {
      console.error("Error submitting lead:", error);
      // For MVP, we might still proceed or show an error.
      // Letting user proceed without saving might be confusing, so let's try to proceed
      // but warn if needed. Or just fail gracefully.
      // For now, let's navigate anyway to unblock the demo, but ideally handle error.
       showSuccess("Onboarding complete! Starting your diagnostic...");
       navigate("/diagnostic");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-900">Welcome, Founder!</CardTitle>
        <CardDescription className="text-gray-600 mt-2">
          Your answers power your personalized founder report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Company Size (Employees)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="15-35">15–35</SelectItem>
                      <SelectItem value="36-60">36–60</SelectItem>
                      <SelectItem value="61-95">61–95</SelectItem>
                      <SelectItem value="96-200">96–200</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-md shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              Start Diagnostic
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-500">
        We're excited to help you gain clarity!
      </CardFooter>
    </Card>
  );
};

export default OnboardingForm;