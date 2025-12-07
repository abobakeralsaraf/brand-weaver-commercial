import { useState } from "react";
import { Download, Github, FolderUp, ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SaveDataOptionsProps {
  onDownloadZip: () => void;
  onSaveToGithub: (repoName: string) => void;
  onBack: () => void;
  isDownloading?: boolean;
  isSaving?: boolean;
}

export function SaveDataOptions({
  onDownloadZip,
  onSaveToGithub,
  onBack,
  isDownloading,
  isSaving,
}: SaveDataOptionsProps) {
  const [githubRepoName, setGithubRepoName] = useState("");
  const [selectedOption, setSelectedOption] = useState<"download" | "github" | null>(null);

  const handleGithubSave = () => {
    if (githubRepoName) {
      onSaveToGithub(githubRepoName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Save Your Data</h1>
          <p className="text-muted-foreground">
            Download your extracted LinkedIn profile data and images
          </p>
        </div>

        <div className="grid gap-4">
          <Card
            className={`cursor-pointer transition-all hover-elevate ${
              selectedOption === "download" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedOption("download")}
            data-testid="card-download-zip"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Download ZIP</CardTitle>
                    {selectedOption === "download" && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>
                    Download a ZIP file containing your profile data (JSON) and all optimized images (WebP)
                  </CardDescription>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="secondary" size="sm">JSON Data</Badge>
                    <Badge variant="secondary" size="sm">WebP Images</Badge>
                    <Badge variant="secondary" size="sm">Instant Download</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover-elevate ${
              selectedOption === "github" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedOption("github")}
            data-testid="card-save-github"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                  <Github className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Save to GitHub</CardTitle>
                    {selectedOption === "github" && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>
                    Create a new GitHub repository with your profile data and images
                  </CardDescription>
                  <div className="flex gap-2 pt-2">
                    <Badge variant="secondary" size="sm">Version Control</Badge>
                    <Badge variant="secondary" size="sm">Cloud Backup</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedOption === "github" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GitHub Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github-repo">Repository Name</Label>
                <Input
                  id="github-repo"
                  placeholder="my-linkedin-data"
                  value={githubRepoName}
                  onChange={(e) => setGithubRepoName(e.target.value)}
                  data-testid="input-github-repo"
                />
                <p className="text-xs text-muted-foreground">
                  A new private repository will be created with this name
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-between gap-4">
          <Button variant="outline" onClick={onBack} className="gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          {selectedOption === "download" ? (
            <Button
              onClick={onDownloadZip}
              disabled={isDownloading}
              className="gap-2"
              data-testid="button-download"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download ZIP
                </>
              )}
            </Button>
          ) : selectedOption === "github" ? (
            <Button
              onClick={handleGithubSave}
              disabled={!githubRepoName || isSaving}
              className="gap-2"
              data-testid="button-save-github"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FolderUp className="w-4 h-4" />
                  Save to GitHub
                </>
              )}
            </Button>
          ) : (
            <Button disabled className="gap-2">
              Select an Option
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
