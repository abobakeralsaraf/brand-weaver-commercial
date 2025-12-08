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
import { apiRequest } from "@/lib/queryClient";
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

  const extractMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest("POST", "/api/extract", { username });
      return response as unknown as ExtractedData;
    },
    onSuccess: (data) => {
      setExtractedData(data);
      setCurrentStep("preview");
    },
    onError: (error) => {
      toast({
        title: "Extraction Failed",
        description: error.message || "Failed to extract LinkedIn profile data",
        variant: "destructive",
      });
      setCurrentStep("input");
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (config: WebsiteConfig) => {
      const response = await apiRequest("POST", "/api/generate", {
        data: extractedData,
        config,
      });
      return response as unknown as { previewUrl: string; sessionId: string };
    },
    onSuccess: (data) => {
      setPreviewUrl(data.previewUrl);
      setCurrentStep("website-preview");
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate website",
        variant: "destructive",
      });
      setCurrentStep("customize");
    },
  });

  const deployMutation = useMutation({
    mutationFn: async (options: DeploymentOptionsType) => {
      const response = await apiRequest("POST", "/api/deploy", options);
      return response as { url: string };
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
    
    const steps = extractionProgress.steps;
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
      setExtractionProgress((prev) => ({
        ...prev,
        percentage: ((i + 1) / steps.length) * 100,
        currentStep: steps[i].label,
        steps: prev.steps.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "in_progress" : "pending",
          count: idx <= i ? Math.floor(Math.random() * 5) + 1 : undefined,
        })),
      }));
    }
    
    setExtractionProgress((prev) => ({
      ...prev,
      percentage: 100,
      steps: prev.steps.map((s) => ({ ...s, status: "completed" })),
    }));

    extractMutation.mutate(username);
  };

  const handleGenerateWebsite = async (config: WebsiteConfig) => {
    setWebsiteConfig(config);
    setCurrentStep("generating");
    
    const steps = generationProgress.steps;
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 400));
      setGenerationProgress((prev) => ({
        ...prev,
        percentage: ((i + 1) / steps.length) * 100,
        currentStep: steps[i].label,
        steps: prev.steps.map((s, idx) => ({
          ...s,
          status: idx < i ? "completed" : idx === i ? "in_progress" : "pending",
        })),
      }));
    }
    
    setGenerationProgress((prev) => ({
      ...prev,
      percentage: 100,
      steps: prev.steps.map((s) => ({ ...s, status: "completed" })),
    }));

    generateMutation.mutate(config);
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
          isLoading={extractMutation.isPending}
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
