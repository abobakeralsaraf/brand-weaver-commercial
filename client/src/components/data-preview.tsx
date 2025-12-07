import { Briefcase, GraduationCap, FileText, MessageSquare, Image, Download, Globe, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExtractedData } from "@shared/schema";

interface DataPreviewProps {
  data: ExtractedData;
  onSaveData: () => void;
  onCreateWebsite: () => void;
}

export function DataPreview({ data, onSaveData, onCreateWebsite }: DataPreviewProps) {
  const stats = [
    {
      icon: Briefcase,
      label: "Work Experience",
      value: data.experience.length,
      suffix: data.experience.length === 1 ? "position" : "positions",
    },
    {
      icon: GraduationCap,
      label: "Education",
      value: data.education.length,
      suffix: data.education.length === 1 ? "entry" : "entries",
    },
    {
      icon: FileText,
      label: "Featured Posts",
      value: data.featuredPosts.length,
      suffix: `/ 6`,
    },
    {
      icon: MessageSquare,
      label: "Recommendations",
      value: data.recommendations.length,
      suffix: "total",
    },
  ];

  const initials = data.profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-3xl space-y-8">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarImage src={data.profile.profilePicture} alt={data.profile.fullName} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left space-y-2 flex-1">
                <CardTitle className="text-2xl">{data.profile.fullName}</CardTitle>
                {data.profile.headline && (
                  <p className="text-muted-foreground">{data.profile.headline}</p>
                )}
                {data.profile.location && (
                  <Badge variant="secondary" className="text-xs">
                    {data.profile.location}
                  </Badge>
                )}
              </div>
              {(data.profile.profilePicture || data.profile.headerImage) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  <span>
                    {[data.profile.profilePicture, data.profile.headerImage].filter(Boolean).length} images
                  </span>
                  <Badge size="sm" variant="outline">WebP</Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.profile.summary && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.profile.summary}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="w-8 h-8 mx-auto text-primary mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                  <span className="block">{stat.suffix}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What would you like to do?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-auto py-6 flex-col gap-3"
                onClick={onSaveData}
                data-testid="button-save-data"
              >
                <Download className="w-8 h-8" />
                <div className="space-y-1">
                  <div className="font-semibold">Save Data Only</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    Download JSON + Images or save to GitHub
                  </div>
                </div>
              </Button>

              <Button
                size="lg"
                className="h-auto py-6 flex-col gap-3"
                onClick={onCreateWebsite}
                data-testid="button-create-website"
              >
                <Globe className="w-8 h-8" />
                <div className="space-y-1">
                  <div className="font-semibold flex items-center gap-2">
                    Create Personal Website
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div className="text-xs text-primary-foreground/80 font-normal">
                    Customize design and deploy to web
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
