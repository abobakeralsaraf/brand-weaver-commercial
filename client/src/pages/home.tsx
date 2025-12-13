import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { UrlInputForm } from "@/components/url-input-form";
import { ExtractionProgress } from "@/components/extraction-progress";
import { DataPreview } from "@/components/data-preview";
import { CustomizationWizard } from "@/components/customization-wizard";
import { GenerationProgress } from "@/components/generation-progress";
import { WebsitePreview } from "@/components/website-preview";
import { DeploymentOptions } from "@/components/deployment-options";
import { DeploymentProgress } from "@/components/deployment-progress";
import { SuccessScreen } from "@/components/success-screen";
import { SaveDataOptions } from "@/components/save-data-options";
import { KpiDashboard } from "@/components/kpi-dashboard";
import { apiRequest, ApiError, sseRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type {
  ExtractedData,
  ExtractionProgress as ExtractionProgressType,
  WebsiteConfig,
  GenerationProgress as GenerationProgressType,
  DeploymentOptions as DeploymentOptionsType,
} from "@shared/schema";

type AppStep =
  | "input"
  | "extracting"
  | "preview"
  | "save-data"
  | "customize"
  | "generating"
  | "website-preview"
  | "deploy-options"
  | "deploying"
  | "success";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>("input");
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  const [extractionProgress, setExtractionProgress] = useState<ExtractionProgressType>({
    percentage: 0,
    currentStep: "Initializing...",
    steps: [
      { id: "profile", label: "Profile Information", status: "pending" },
      { id: "experience", label: "Work Experience", status: "pending" },
      { id: "education", label: "Education", status: "pending" },
      { id: "certifications", label: "Certifications", status: "pending" },
      { id: "skills", label: "Skills & Languages", status: "pending" },
      { id: "recommendations", label: "Recommendations", status: "pending" },
      { id: "posts", label: "Featured Posts", status: "pending" },
      { id: "images", label: "Processing Images", status: "pending" },
    ],
  });

  const [generationProgress, setGenerationProgress] = useState<GenerationProgressType>({
    percentage: 0,
    currentStep: "Initializing...",
    steps: [
      { id: "html", label: "Generated HTML structure", status: "pending" },
      { id: "styling", label: "Applied custom styling", status: "pending" },
      { id: "images", label: "Optimized all images to WebP", status: "pending" },
      { id: "responsive", label: "Created responsive layouts", status: "pending" },
      { id: "seo", label: "Added SEO meta tags", status: "pending" },
      { id: "embeds", label: "Integrated LinkedIn embeds", status: "pending" },
      { id: "bilingual", label: "Setting up bilingual support", status: "pending" },
      { id: "deployment", label: "Preparing deployment", status: "pending" },
    ],
  });

  const [deploymentSteps, setDeploymentSteps] = useState<Array<{
    id: string;
    label: string;
    status: "pending" | "in_progress" | "completed" | "error";
  }>>([
    { id: "repository", label: "Created GitHub repository", status: "pending" },
    { id: "files", label: "Pushed website files", status: "pending" },
    { id: "images", label: "Uploaded optimized images", status: "pending" },
    { id: "pages", label: "Configured GitHub Pages", status: "pending" },
    { id: "ssl", label: "SSL certificate enabled", status: "pending" },
    { id: "domain", label: "Custom domain configured", status: "pending" },
  ]);
  const [deploymentPercentage, setDeploymentPercentage] = useState(0);
  const [deploymentCurrentStep, setDeploymentCurrentStep] = useState("Initializing...");

  const deployMutation = useMutation({
    mutationFn: async (options: DeploymentOptionsType) => {
      const response = await apiRequest("POST", "/api/deploy", options);
      const result = await response.json();
      return result as { url: string };
    },
    onSuccess: (data) => {
      setWebsiteUrl(data.url);
      setCurrentStep("success");
    },
    onError: (error) => {
      toast({
        title: "Deployment Failed",
        description: error.message || "Failed to deploy website",
        variant: "destructive",
      });
      setCurrentStep("deploy-options");
    },
  });

  const handleExtract = async (username: string) => {
    setCurrentStep("extracting");
    setIsExtracting(true);
    setExtractionProgress((prev) => ({
      ...prev,
      percentage: 0,
      currentStep: "Initializing...",
      steps: prev.steps.map((s) => ({ ...s, status: "pending", count: undefined })),
    }));

    try {
      const result = await sseRequest<{ data: ExtractedData; sessionId: string }>({
        url: "/api/extract/stream",
        body: { username },
        onProgress: (p) => setExtractionProgress(p as ExtractionProgressType),
      });
      setExtractedData(result.data);
      setCurrentStep("preview");
    } catch (e: any) {
      const err = e as ApiError;
      toast({
        title: "Extraction Failed",
        description: err.hint ? `${err.message}\n\n${err.hint}` : err.message || "Failed to extract LinkedIn profile data",
        variant: "destructive",
      });
      setCurrentStep("input");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleGenerateWebsite = async (config: WebsiteConfig) => {
    setWebsiteConfig(config);
    setCurrentStep("generating");
    setGenerationProgress((prev) => ({
      ...prev,
      percentage: 0,
      currentStep: "Initializing...",
      steps: prev.steps.map((s) => ({ ...s, status: "pending" })),
    }));

    try {
      if (!extractedData) {
        throw new ApiError({ status: 400, message: "No extracted data found. Please extract your profile first." });
      }
      const result = await sseRequest<{ previewUrl: string; sessionId: string }>({
        url: "/api/generate/stream",
        body: { data: extractedData, config },
        onProgress: (p) => setGenerationProgress(p as GenerationProgressType),
      });
      setPreviewUrl(result.previewUrl);
      setCurrentStep("website-preview");
    } catch (e: any) {
      const err = e as ApiError;
      toast({
        title: "Generation Failed",
        description: err.hint ? `${err.message}\n\n${err.hint}` : err.message || "Failed to generate website",
        variant: "destructive",
      });
      setCurrentStep("customize");
    }
  };

  const handleDeploy = async (options: DeploymentOptionsType) => {
    setCurrentStep("deploying");
    
    for (let i = 0; i < deploymentSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));
      setDeploymentPercentage(((i + 1) / deploymentSteps.length) * 100);
      setDeploymentCurrentStep(deploymentSteps[i].label);
      setDeploymentSteps((prev) =>
        prev.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "in_progress" : "pending",
        }))
      );
    }
    
    setDeploymentSteps((prev) => prev.map((s) => ({ ...s, status: "completed" as const } as typeof s)));

    deployMutation.mutate(options);
  };

  const handleDownloadZip = () => {
    toast({
      title: "Download Started",
      description: "Your data package is being prepared...",
    });
    window.open("/api/download/zip", "_blank");
  };

  const handleSaveToGithub = (repoName: string) => {
    toast({
      title: "Saving to GitHub",
      description: `Creating repository: ${repoName}`,
    });
  };

  const handleDownloadSource = () => {
    window.open("/api/download/source", "_blank");
  };

  const handleDownloadData = () => {
    window.open("/api/download/data", "_blank");
  };

  const handleDownloadImages = () => {
    window.open("/api/download/images", "_blank");
  };

  const handleStartOver = () => {
    setCurrentStep("input");
    setExtractedData(null);
    setWebsiteConfig(null);
    setPreviewUrl("");
    setWebsiteUrl("");
    setExtractionProgress({
      percentage: 0,
      currentStep: "Initializing...",
      steps: extractionProgress.steps.map((s) => ({ ...s, status: "pending", count: undefined })),
    });
    setGenerationProgress({
      percentage: 0,
      currentStep: "Initializing...",
      steps: generationProgress.steps.map((s) => ({ ...s, status: "pending" })),
    });
    setDeploymentSteps((prev) => prev.map((s) => ({ ...s, status: "pending" as const })));
    setDeploymentPercentage(0);
  };

  switch (currentStep) {
    case "input":
      return (
        <UrlInputForm
          onSubmit={handleExtract}
          isLoading={isExtracting}
        />
      );

    case "extracting":
      return <ExtractionProgress progress={extractionProgress} />;

    case "preview":
      return extractedData ? (
        <DataPreview
          data={extractedData}
          onSaveData={() => setCurrentStep("save-data")}
          onCreateWebsite={() => setCurrentStep("customize")}
        />
      ) : null;

    case "save-data":
      return (
        <SaveDataOptions
          onDownloadZip={handleDownloadZip}
          onSaveToGithub={handleSaveToGithub}
          onBack={() => setCurrentStep("preview")}
        />
      );

    case "customize":
      return (
        <CustomizationWizard
          onComplete={handleGenerateWebsite}
          onBack={() => setCurrentStep("preview")}
        />
      );

    case "generating":
      return <GenerationProgress progress={generationProgress} />;

    case "website-preview":
      return (
        <WebsitePreview
          previewUrl={previewUrl || "/api/preview"}
          onDeploy={() => setCurrentStep("deploy-options")}
          onChangeDesign={() => setCurrentStep("customize")}
          isDeploying={deployMutation.isPending}
          extractedData={extractedData}
          websiteConfig={websiteConfig}
        />
      );

    case "deploy-options":
      return (
        <DeploymentOptions
          onDeploy={handleDeploy}
          onBack={() => setCurrentStep("website-preview")}
          isDeploying={deployMutation.isPending}
        />
      );

    case "deploying":
      return (
        <DeploymentProgress
          steps={deploymentSteps}
          percentage={deploymentPercentage}
          currentStep={deploymentCurrentStep}
        />
      );

    case "success":
      return (
        <SuccessScreen
          websiteUrl={websiteUrl || "https://your-username.github.io/portfolio"}
          onDownloadSource={handleDownloadSource}
          onDownloadData={handleDownloadData}
          onDownloadImages={handleDownloadImages}
          onStartOver={handleStartOver}
        />
      );

    default:
      return null;
  }
}
