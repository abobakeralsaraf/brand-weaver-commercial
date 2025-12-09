import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Smartphone, 
  FileText,
  BarChart3,
  Eye,
  MousePointerClick,
  Clock
} from "lucide-react";
import type { ExtractedData, WebsiteConfig } from "@shared/schema";

interface KpiDashboardProps {
  extractedData: ExtractedData | null;
  websiteConfig: WebsiteConfig | null;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: typeof CheckCircle2;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "success" | "warning" | "destructive";
  "data-testid"?: string;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, color = "default", "data-testid": testId }: MetricCardProps) {
  const colorClasses = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    destructive: "text-red-600 dark:text-red-400",
  };

  return (
    <Card data-testid={testId}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="shrink-0">
            <div className="p-3 rounded-full bg-muted">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>
        {trend && (
          <div className="mt-2">
            <Badge variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"} className="text-xs">
              {trend === "up" ? "Trending Up" : trend === "down" ? "Needs Attention" : "Stable"}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QualityScoreCard({ score, label, details }: { score: number; label: string; details: string[] }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-green-600 dark:text-green-400";
    if (s >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return "bg-green-600";
    if (s >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 mb-2">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-sm text-muted-foreground mb-1">/100</span>
        </div>
        <Progress value={score} className="h-2 mb-3" />
        <ul className="space-y-1">
          {details.map((detail, idx) => (
            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {detail}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function KpiDashboard({ extractedData, websiteConfig }: KpiDashboardProps) {
  const calculateExtractionScore = () => {
    if (!extractedData) return { score: 0, details: [] };
    
    let score = 0;
    const details: string[] = [];
    
    if (extractedData.profile?.fullName) {
      score += 15;
      details.push("Profile info extracted");
    }
    if (extractedData.profile?.summary) {
      score += 10;
      details.push("Bio/summary included");
    }
    if (extractedData.experience && extractedData.experience.length > 0) {
      score += 20;
      details.push(`${extractedData.experience.length} work experiences`);
    }
    if (extractedData.education && extractedData.education.length > 0) {
      score += 15;
      details.push(`${extractedData.education.length} education entries`);
    }
    if (extractedData.skills && extractedData.skills.length > 0) {
      score += 15;
      details.push(`${extractedData.skills.length} skills listed`);
    }
    if (extractedData.certifications && extractedData.certifications.length > 0) {
      score += 10;
      details.push(`${extractedData.certifications.length} certifications`);
    }
    if (extractedData.recommendations && extractedData.recommendations.length > 0) {
      score += 10;
      details.push(`${extractedData.recommendations.length} recommendations`);
    }
    if (extractedData.featuredPosts && extractedData.featuredPosts.length > 0) {
      score += 5;
      details.push(`${extractedData.featuredPosts.length} featured posts`);
    }
    
    return { score: Math.min(score, 100), details };
  };

  const calculateWebsiteQuality = () => {
    if (!websiteConfig) return { score: 0, details: [] };
    
    let score = 40;
    const details: string[] = [];
    
    details.push("Responsive design enabled");
    
    if (websiteConfig.language === "both") {
      score += 20;
      details.push("Bilingual support (EN/AR)");
    } else {
      score += 10;
      details.push(`Single language: ${websiteConfig.language}`);
    }
    
    if (websiteConfig.aestheticLevel === "premium") {
      score += 20;
      details.push("Premium GSAP animations");
    } else if (websiteConfig.aestheticLevel === "enhanced") {
      score += 15;
      details.push("Enhanced AOS animations");
    } else {
      score += 5;
      details.push("Standard styling");
    }
    
    if (websiteConfig.whatsappNumber || websiteConfig.phoneNumber) {
      score += 10;
      details.push("Contact buttons enabled");
    }
    
    if (websiteConfig.portfolioProjects && websiteConfig.portfolioProjects.length > 0) {
      score += 10;
      details.push(`${websiteConfig.portfolioProjects.length} portfolio projects`);
    }
    
    if (websiteConfig.analytics?.googleAnalyticsId) {
      score += 10;
      details.push("Analytics tracking enabled");
    }
    
    return { score: Math.min(score, 100), details };
  };

  const calculateMobileScore = () => {
    let score = 85;
    const details: string[] = [];
    
    details.push("Mobile-first responsive layout");
    details.push("Touch-friendly navigation");
    details.push("Optimized font sizes");
    
    if (websiteConfig?.aestheticLevel !== "premium") {
      score += 10;
      details.push("Lightweight animations");
    }
    
    return { score: Math.min(score, 100), details };
  };

  const extractionMetrics = calculateExtractionScore();
  const websiteQuality = calculateWebsiteQuality();
  const mobileScore = calculateMobileScore();

  const totalEngagement = extractedData?.featuredPosts?.reduce((sum, post) => {
    const engagement = post.engagement;
    return sum + (engagement?.likes || 0) + (engagement?.comments || 0) + (engagement?.shares || 0);
  }, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold" data-testid="text-kpi-title">Website Quality Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Data Extraction"
          value={`${extractionMetrics.score}%`}
          subtitle="Profile completeness"
          icon={CheckCircle2}
          color={extractionMetrics.score >= 80 ? "success" : extractionMetrics.score >= 50 ? "warning" : "destructive"}
          data-testid="metric-extraction"
        />
        <MetricCard
          title="Featured Content"
          value={extractedData?.featuredPosts?.length || 0}
          subtitle={`${totalEngagement} total engagements`}
          icon={FileText}
          color="default"
          data-testid="metric-featured"
        />
        <MetricCard
          title="Skills Showcased"
          value={extractedData?.skills?.length || 0}
          subtitle="Professional skills"
          icon={TrendingUp}
          color="success"
          data-testid="metric-skills"
        />
        <MetricCard
          title="Recommendations"
          value={extractedData?.recommendations?.length || 0}
          subtitle="Social proof"
          icon={Users}
          color={extractedData?.recommendations?.length ? "success" : "warning"}
          data-testid="metric-recommendations"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QualityScoreCard
          score={extractionMetrics.score}
          label="Data Extraction Score"
          details={extractionMetrics.details}
        />
        <QualityScoreCard
          score={websiteQuality.score}
          label="Website Quality Score"
          details={websiteQuality.details}
        />
        <QualityScoreCard
          score={mobileScore.score}
          label="Mobile Responsiveness"
          details={mobileScore.details}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Engagement Insights
          </CardTitle>
          <CardDescription>
            Performance metrics for your featured content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">
                {extractedData?.featuredPosts?.reduce((sum, p) => sum + (p.engagement?.likes || 0), 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Likes</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">
                {extractedData?.featuredPosts?.reduce((sum, p) => sum + (p.engagement?.comments || 0), 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Comments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">
                {extractedData?.featuredPosts?.reduce((sum, p) => sum + (p.engagement?.shares || 0), 0) || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Shares</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">
                {extractedData?.experience?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Years of Experience</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Website Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Responsive Design</Badge>
            <Badge variant="secondary">SEO Optimized</Badge>
            {websiteConfig?.language === "both" && <Badge variant="secondary">Bilingual (EN/AR)</Badge>}
            {websiteConfig?.aestheticLevel === "premium" && <Badge variant="secondary">GSAP Animations</Badge>}
            {websiteConfig?.aestheticLevel === "enhanced" && <Badge variant="secondary">AOS Animations</Badge>}
            {(websiteConfig?.whatsappNumber || websiteConfig?.phoneNumber) && <Badge variant="secondary">Contact Buttons</Badge>}
            {extractedData?.featuredPosts && extractedData.featuredPosts.length > 0 && <Badge variant="secondary">Swiper Carousel</Badge>}
            {websiteConfig?.analytics?.googleAnalyticsId && <Badge variant="secondary">Analytics</Badge>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
