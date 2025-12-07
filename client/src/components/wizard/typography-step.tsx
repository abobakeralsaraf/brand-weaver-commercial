import { Type, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { TYPOGRAPHY_OPTIONS, type Typography } from "@shared/schema";

interface TypographyStepProps {
  value: Typography;
  onChange: (value: Typography) => void;
}

export function TypographyStep({ value, onChange }: TypographyStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Type className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Typography</h2>
        <p className="text-muted-foreground">
          Select a font combination for your website
        </p>
      </div>

      <div className="grid gap-4">
        {TYPOGRAPHY_OPTIONS.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover-elevate ${
              value.id === option.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onChange(option)}
            data-testid={`card-typography-${option.id}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{option.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {option.headingFont} + {option.bodyFont}
                  </p>
                </div>
                {value.id === option.id && (
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="space-y-2 pt-4 border-t">
                <h4
                  className="text-2xl"
                  style={{ fontFamily: option.headingFont }}
                >
                  The quick brown fox
                </h4>
                <p
                  className="text-muted-foreground"
                  style={{ fontFamily: option.bodyFont }}
                >
                  jumps over the lazy dog. This is how your body text will look with{" "}
                  {option.bodyFont} font family.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
