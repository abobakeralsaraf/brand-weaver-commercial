import { useState } from "react";
import { Monitor, Tablet, Smartphone, ArrowLeft, Rocket, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WebsitePreviewProps {
  previewUrl: string;
  onDeploy: () => void;
  onChangeDesign: () => void;
  isDeploying?: boolean;
}

type ViewportSize = "desktop" | "tablet" | "mobile";

const viewportSizes: Record<ViewportSize, { width: string; icon: typeof Monitor }> = {
  desktop: { width: "100%", icon: Monitor },
  tablet: { width: "768px", icon: Tablet },
  mobile: { width: "375px", icon: Smartphone },
};

export function WebsitePreview({
  previewUrl,
  onDeploy,
  onChangeDesign,
  isDeploying,
}: WebsitePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
          <CardTitle className="text-xl">Website Preview</CardTitle>
          <div className="flex items-center gap-4 flex-wrap">
            <Tabs
              value={viewport}
              onValueChange={(v) => setViewport(v as ViewportSize)}
            >
              <TabsList>
                {(Object.keys(viewportSizes) as ViewportSize[]).map((size) => {
                  const Icon = viewportSizes[size].icon;
                  return (
                    <TabsTrigger
                      key={size}
                      value={size}
                      className="gap-2"
                      data-testid={`button-viewport-${size}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline capitalize">{size}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onChangeDesign}
                className="gap-2"
                data-testid="button-change-design"
              >
                <RefreshCw className="w-4 h-4" />
                Change Design
              </Button>
              <Button
                onClick={onDeploy}
                disabled={isDeploying}
                className="gap-2"
                data-testid="button-deploy"
              >
                <Rocket className="w-4 h-4" />
                {isDeploying ? "Deploying..." : "Deploy to Web"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <div
            className="mx-auto h-full min-h-[600px] bg-muted rounded-lg overflow-hidden transition-all duration-300 border"
            style={{ maxWidth: viewportSizes[viewport].width }}
          >
            <iframe
              src={previewUrl}
              className="w-full h-full"
              title="Website Preview"
              data-testid="iframe-preview"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
