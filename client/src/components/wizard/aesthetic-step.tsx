import { Sparkles, Check, Zap, Star, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AESTHETIC_LEVELS, type AestheticLevel } from "@shared/schema";

interface AestheticStepProps {
  value: AestheticLevel;
  onChange: (value: AestheticLevel) => void;
}

const levelIcons = {
  standard: Zap,
  enhanced: Star,
  premium: Crown,
};

export function AestheticStep({ value, onChange }: AestheticStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Sparkles className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Aesthetic Level</h2>
        <p className="text-muted-foreground">
          Choose the visual complexity of your website
        </p>
      </div>

      <div className="grid gap-4">
        {AESTHETIC_LEVELS.map((level) => {
          const Icon = levelIcons[level.id];
          return (
            <Card
              key={level.id}
              className={`cursor-pointer transition-all hover-elevate ${
                value === level.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onChange(level.id)}
              data-testid={`card-aesthetic-${level.id}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      value === level.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {level.name}
                        <span className="text-muted-foreground font-normal">
                          ({level.nameAr})
                        </span>
                      </CardTitle>
                      {value === level.id && (
                        <Check className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <CardDescription>{level.description}</CardDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {level.features.map((feature) => (
                        <Badge key={feature} variant="secondary" size="sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
