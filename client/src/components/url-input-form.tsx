import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Linkedin, ArrowRight, Sparkles, Globe, Briefcase, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const urlSchema = z.object({
  linkedinUrl: z
    .string()
    .min(1, "Please enter a LinkedIn URL")
    .refine(
      (url) => {
        const trimmed = url.trim();
        // Accept either a full profile URL or just the username.
        const linkedinPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
        const usernamePattern = /^[a-zA-Z0-9\-_]+$/;
        return linkedinPattern.test(trimmed) || usernamePattern.test(trimmed);
      },
      "Please enter a valid LinkedIn profile URL (e.g., linkedin.com/in/username) or a username"
    ),
});

type UrlFormValues = z.infer<typeof urlSchema>;

interface UrlInputFormProps {
  onSubmit: (username: string) => void;
  isLoading?: boolean;
}

export function UrlInputForm({ onSubmit, isLoading }: UrlInputFormProps) {
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      linkedinUrl: "",
    },
  });

  const handleSubmit = (values: UrlFormValues) => {
    const input = values.linkedinUrl.trim();
    const match = input.match(/linkedin\.com\/in\/([\w-]+)/i);
    if (match?.[1]) return onSubmit(match[1]);
    return onSubmit(input);
  };

  const features = [
    { icon: Briefcase, label: "Work Experience", description: "Complete career history" },
    { icon: GraduationCap, label: "Education", description: "Academic background" },
    { icon: Award, label: "Certifications", description: "Professional credentials" },
    { icon: Globe, label: "Bilingual Sites", description: "English & Arabic support" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Linkedin className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            LinkedIn to{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Personal Brand
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Transform your LinkedIn profile into a stunning, professional website in minutes.
            Extract your data, customize the design, and deploy with one click.
          </p>
        </div>

        <Card className={`transition-all duration-300 ${isFocused ? "ring-2 ring-primary/50" : ""}`}>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="https://linkedin.com/in/username"
                            className="pl-12 pr-4 h-14 text-lg"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            data-testid="input-linkedin-url"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 text-lg gap-2"
                  disabled={isLoading}
                  data-testid="button-extract"
                >
                  {isLoading ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      Extracting Data...
                    </>
                  ) : (
                    <>
                      Extract My Data
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
            <p className="text-sm text-muted-foreground mt-4">
              Example: linkedin.com/in/williamhgates or williamhgates
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50"
            >
              <feature.icon className="w-6 h-6 text-primary" />
              <span className="font-medium text-sm">{feature.label}</span>
              <span className="text-xs text-muted-foreground">{feature.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
