import { Check, Loader2, AlertCircle, FolderGit2, Upload, Image, Settings, Lock, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DeploymentStep {
  id: string;
  label: string;
  status: "pending" | "in_progress" | "completed" | "error";
}

interface DeploymentProgressProps {
  steps: DeploymentStep[];
  percentage: number;
  currentStep: string;
}

const stepIcons: Record<string, typeof FolderGit2> = {
  repository: FolderGit2,
  files: Upload,
  images: Image,
  pages: Settings,
  ssl: Lock,
  domain: Globe,
};

function StepItem({ step }: { step: DeploymentStep }) {
  const Icon = stepIcons[step.id] || FolderGit2;

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
  );
}

export function DeploymentProgress({ steps, percentage, currentStep }: DeploymentProgressProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl">Deploying Your Website</CardTitle>
          <p className="text-muted-foreground">
            Setting up your website on the web. Almost there!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{currentStep}</span>
              <span className="text-muted-foreground">{Math.round(percentage)}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>

          <div className="divide-y">
            {steps.map((step) => (
              <StepItem key={step.id} step={step} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
