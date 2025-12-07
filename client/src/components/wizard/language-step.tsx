import { Globe, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LanguageSelection } from "@shared/schema";

interface LanguageStepProps {
  value: LanguageSelection;
  onChange: (value: LanguageSelection) => void;
}

const languageOptions: { id: LanguageSelection; label: string; labelAr: string; description: string }[] = [
  { id: "english", label: "English Only", labelAr: "", description: "Website in English with LTR layout" },
  { id: "arabic", label: "العربية فقط", labelAr: "Arabic Only", description: "Website in Arabic with RTL layout" },
  { id: "both", label: "Both Languages", labelAr: "EN | AR", description: "Bilingual with language switcher" },
];

export function LanguageStep({ value, onChange }: LanguageStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Language Selection</h2>
        <p className="text-muted-foreground">
          Choose the language(s) for your personal website
        </p>
      </div>

      <div className="grid gap-4">
        {languageOptions.map((option) => (
          <Card
            key={option.id}
            className={`cursor-pointer transition-all hover-elevate ${
              value === option.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onChange(option.id)}
            data-testid={`card-language-${option.id}`}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  value === option.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                }`}
              >
                {value === option.id && <Check className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {option.label}
                  {option.labelAr && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({option.labelAr})
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
