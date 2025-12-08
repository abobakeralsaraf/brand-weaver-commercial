import { useState } from "react";
import { Github, Globe, ExternalLink, Lock, Zap, Triangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { DeploymentOptions as DeploymentOptionsType } from "@shared/schema";

interface DeploymentOptionsProps {
  onDeploy: (options: DeploymentOptionsType) => void;
  onBack: () => void;
  isDeploying?: boolean;
}

const platforms = [
  {
    id: "github_pages" as const,
    name: "GitHub Pages",
    description: "Free hosting with automatic SSL",
    icon: Github,
    recommended: true,
    features: ["Free forever", "Custom domain support", "Automatic SSL"],
  },
  {
    id: "netlify" as const,
    name: "Netlify",
    description: "Modern web hosting platform",
    icon: Zap,
    recommended: false,
    features: ["Edge functions", "Form handling", "Better CDN"],
  },
  {
    id: "vercel" as const,
    name: "Vercel",
    description: "The platform for frontend developers",
    icon: Triangle,
    recommended: false,
    features: ["Edge runtime", "Analytics", "Preview deployments"],
  },
];

export function DeploymentOptions({ onDeploy, onBack, isDeploying }: DeploymentOptionsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<"github_pages" | "netlify" | "vercel">("github_pages");
  const [repositoryName, setRepositoryName] = useState("");
  const [siteName, setSiteName] = useState("");
  const [customDomain, setCustomDomain] = useState("");

  const handleDeploy = () => {
    onDeploy({
      platform: selectedPlatform,
      repositoryName: repositoryName || undefined,
      siteName: siteName || undefined,
      customDomain: customDomain || undefined,
    });
  };

  const previewUrl =
    selectedPlatform === "github_pages"
      ? `${repositoryName || "your-site"}.github.io`
      : selectedPlatform === "vercel"
      ? `${siteName || "your-site"}.vercel.app`
      : `${siteName || "your-site"}.netlify.app`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Deploy Your Website</h1>
          <p className="text-muted-foreground">
            Choose a platform to host your personal website
          </p>
        </div>

        <div className="grid gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all hover-elevate ${
                selectedPlatform === platform.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPlatform(platform.id)}
              data-testid={`card-platform-${platform.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                    <platform.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      {platform.recommended && (
                        <Badge variant="default" size="sm">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{platform.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {platform.features.map((feature) => (
                        <Badge key={feature} variant="secondary" size="sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedPlatform === "github_pages" ? (
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository Name</Label>
                <Input
                  id="repo-name"
                  placeholder="my-personal-website"
                  value={repositoryName}
                  onChange={(e) => setRepositoryName(e.target.value)}
                  data-testid="input-repo-name"
                />
                <p className="text-xs text-muted-foreground">
                  A new GitHub repository will be created with this name
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="site-name">
                  {selectedPlatform === "vercel" ? "Project Name" : "Site Name"}
                </Label>
                <Input
                  id="site-name"
                  placeholder="my-personal-website"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  data-testid="input-site-name"
                />
                <p className="text-xs text-muted-foreground">
                  {selectedPlatform === "vercel" 
                    ? "Your site will be deployed to Vercel with this project name"
                    : "Your site will be deployed to Netlify with this name"}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="custom-domain">Custom Domain (Optional)</Label>
              <Input
                id="custom-domain"
                placeholder="yourname.com"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                data-testid="input-custom-domain"
              />
            </div>

            <div className="flex items-center gap-2 pt-2 text-sm text-muted-foreground">
              <ExternalLink className="w-4 h-4" />
              <span>Preview URL: </span>
              <code className="bg-muted px-2 py-0.5 rounded">{previewUrl}</code>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>SSL certificate will be enabled automatically</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} data-testid="button-back">
            Back to Preview
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="gap-2"
            data-testid="button-start-deploy"
          >
            <Globe className="w-4 h-4" />
            {isDeploying ? "Deploying..." : "Deploy Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
