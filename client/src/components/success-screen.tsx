import { CheckCircle2, ExternalLink, Copy, Download, FileJson, Image, Code, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface SuccessScreenProps {
  websiteUrl: string;
  onDownloadSource: () => void;
  onDownloadData: () => void;
  onDownloadImages: () => void;
  onStartOver: () => void;
}

export function SuccessScreen({
  websiteUrl,
  onDownloadSource,
  onDownloadData,
  onDownloadImages,
  onStartOver,
}: SuccessScreenProps) {
  const { toast } = useToast();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(websiteUrl);
    toast({
      title: "Copied!",
      description: "Website URL copied to clipboard",
    });
  };

  const handleEmailLink = () => {
    const subject = encodeURIComponent("My Personal Brand Website");
    const body = encodeURIComponent(`Check out my new personal website: ${websiteUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Your Website is Live!</h1>
          <p className="text-muted-foreground">
            Congratulations! Your personal brand website has been deployed successfully.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Website URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={websiteUrl}
                readOnly
                className="font-mono"
                data-testid="input-website-url"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                data-testid="button-copy-url"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => window.open(websiteUrl, "_blank")}
                className="gap-2"
                data-testid="button-visit-site"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </Button>
              <Button
                variant="outline"
                onClick={handleEmailLink}
                className="gap-2"
                data-testid="button-email-link"
              >
                <Mail className="w-4 h-4" />
                Email Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Download Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={onDownloadSource}
                className="h-auto py-4 flex-col gap-2"
                data-testid="button-download-source"
              >
                <Code className="w-6 h-6" />
                <span className="text-sm">Source Code</span>
                <span className="text-xs text-muted-foreground">.zip</span>
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadData}
                className="h-auto py-4 flex-col gap-2"
                data-testid="button-download-data"
              >
                <FileJson className="w-6 h-6" />
                <span className="text-sm">Profile Data</span>
                <span className="text-xs text-muted-foreground">.json</span>
              </Button>
              <Button
                variant="outline"
                onClick={onDownloadImages}
                className="h-auto py-4 flex-col gap-2"
                data-testid="button-download-images"
              >
                <Image className="w-6 h-6" />
                <span className="text-sm">All Images</span>
                <span className="text-xs text-muted-foreground">.zip</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Share your website on LinkedIn and other social platforms
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Add your website URL to your LinkedIn profile
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Configure a custom domain for a more professional look
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Keep your LinkedIn profile updated and re-generate when needed
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" onClick={onStartOver} data-testid="button-start-over">
            Start Over with Another Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
