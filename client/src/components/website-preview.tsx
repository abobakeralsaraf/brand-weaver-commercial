import { useState, useRef, useEffect } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, Rocket, ExternalLink, Maximize2, Minimize2 } from "lucide-react";
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

const viewportConfig: Record<ViewportSize, { width: number; height: number; icon: typeof Monitor; label: string }> = {
  desktop: { width: 1280, height: 800, icon: Monitor, label: "Desktop" },
  tablet: { width: 768, height: 1024, icon: Tablet, label: "Tablet" },
  mobile: { width: 375, height: 667, icon: Smartphone, label: "Mobile" },
};

export function WebsitePreview({
  previewUrl,
  onDeploy,
  onChangeDesign,
  isDeploying,
}: WebsitePreviewProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 32;
      const containerHeight = container.clientHeight - 32;
      
      const config = viewportConfig[viewport];
      const scaleX = containerWidth / config.width;
      const scaleY = containerHeight / config.height;
      
      const newScale = Math.min(scaleX, scaleY, 1);
      setScale(newScale);
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [viewport]);

  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };

  const openInNewTab = () => {
    window.open(previewUrl, '_blank');
  };

  const config = viewportConfig[viewport];

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'min-h-screen p-4 md:p-8'}`}>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap shrink-0 border-b">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl">Website Preview</CardTitle>
            <span className="text-sm text-muted-foreground">
              {config.width} x {config.height}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Tabs
              value={viewport}
              onValueChange={(v) => setViewport(v as ViewportSize)}
            >
              <TabsList>
                {(Object.keys(viewportConfig) as ViewportSize[]).map((size) => {
                  const Icon = viewportConfig[size].icon;
                  return (
                    <TabsTrigger
                      key={size}
                      value={size}
                      className="gap-2"
                      data-testid={`button-viewport-${size}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{viewportConfig[size].label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={refreshPreview}
                title="Refresh preview"
                data-testid="button-refresh-preview"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={openInNewTab}
                title="Open in new tab"
                data-testid="button-open-new-tab"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                data-testid="button-fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onChangeDesign}
                className="gap-2"
                data-testid="button-change-design"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Change Design</span>
              </Button>
              <Button
                onClick={onDeploy}
                disabled={isDeploying}
                className="gap-2"
                data-testid="button-deploy"
              >
                <Rocket className="w-4 h-4" />
                {isDeploying ? "Deploying..." : "Deploy"}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 bg-muted/30 overflow-hidden"
        >
          <div 
            className="relative bg-background rounded-lg shadow-2xl border-8 border-muted overflow-hidden transition-all duration-300"
            style={{
              width: config.width * scale,
              height: config.height * scale,
            }}
          >
            <iframe
              key={iframeKey}
              src={previewUrl}
              className="absolute top-0 left-0 origin-top-left bg-white"
              style={{
                width: config.width,
                height: config.height,
                transform: `scale(${scale})`,
              }}
              title="Website Preview"
              data-testid="iframe-preview"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
