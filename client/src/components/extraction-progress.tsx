import { Check, Loader2, AlertCircle, User, Briefcase, GraduationCap, Award, Languages, MessageSquare, FileText, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ExtractionProgress as ExtractionProgressType, ExtractionStep } from "@shared/schema";

interface ExtractionProgressProps {
  progress: ExtractionProgressType;
}

const stepIcons: Record<string, typeof User> = {
  profile: User,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  skills: Languages,
  recommendations: MessageSquare,
  posts: FileText,
  images: Image,
};

function StepItem({ step }: { step: ExtractionStep }) {
  const Icon = stepIcons[step.id] || User;
  
  return (
    <div className="flex items-center gap-4 py-3">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
          step.status === "completed"
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : step.status === "in_progress"
            ? "bg-primary/10 text-primary"
            : step.status === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {step.status === "completed" ? (
          <Check className="w-5 h-5" />
        ) : step.status === "in_progress" ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : step.status === "error" ? (
          <AlertCircle className="w-5 h-5" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`font-medium ${
              step.status === "completed"
                ? "text-green-600 dark:text-green-400"
                : step.status === "in_progress"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
          {step.count !== undefined && step.status === "completed" && (
            <span className="text-sm text-muted-foreground">
              {step.count} {step.count === 1 ? "item" : "items"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function ExtractionProgress({ progress }: ExtractionProgressProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <CardTitle className="text-2xl">Extracting Your Profile</CardTitle>
          <p className="text-muted-foreground">
            We're gathering all your LinkedIn data. This usually takes about 30 seconds.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{progress.currentStep}</span>
              <span className="text-muted-foreground">{Math.round(progress.percentage)}%</span>
            </div>
            <Progress value={progress.percentage} className="h-2" />
          </div>

          <div className="divide-y">
            {progress.steps.map((step) => (
              <StepItem key={step.id} step={step} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
