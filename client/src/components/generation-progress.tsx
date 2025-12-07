import { Check, Loader2, AlertCircle, Code, Palette, Image, Layout, Search, Link2, Globe, Rocket } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GenerationProgress as GenerationProgressType, GenerationStep } from "@shared/schema";

interface GenerationProgressProps {
  progress: GenerationProgressType;
}

const stepIcons: Record<string, typeof Code> = {
  html: Code,
  styling: Palette,
  images: Image,
  responsive: Layout,
  seo: Search,
  embeds: Link2,
  bilingual: Globe,
  deployment: Rocket,
};

function StepItem({ step }: { step: GenerationStep }) {
  const Icon = stepIcons[step.id] || Code;

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
      </div>
    </div>
  );
}

export function GenerationProgress({ progress }: GenerationProgressProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Rocket className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Building Your Website</CardTitle>
          <p className="text-muted-foreground">
            Creating your personalized website. This takes about a minute.
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
