import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COLOR_SCHEMES, type ColorScheme } from "@shared/schema";

interface ColorSchemeStepProps {
  value: ColorScheme;
  onChange: (value: ColorScheme) => void;
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-8 h-8 rounded-md border shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] text-muted-foreground uppercase">{label}</span>
    </div>
  );
}

export function ColorSchemeStep({ value, onChange }: ColorSchemeStepProps) {
  const [customColors, setCustomColors] = useState({
    primary: value.id === "custom" ? value.primary : "#2563eb",
    secondary: value.id === "custom" ? value.secondary : "#1e40af",
    accent: value.id === "custom" ? value.accent : "#60a5fa",
  });

  const handleCustomColorChange = (key: "primary" | "secondary" | "accent", color: string) => {
    const newColors = { ...customColors, [key]: color };
    setCustomColors(newColors);
    if (value.id === "custom") {
      onChange({
        id: "custom",
        name: "Custom Colors",
        ...newColors,
      });
    }
  };

  const handleSelectScheme = (scheme: ColorScheme) => {
    if (scheme.id === "custom") {
      onChange({
        ...scheme,
        ...customColors,
      });
    } else {
      onChange(scheme);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Palette className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Color Scheme</h2>
        <p className="text-muted-foreground">
          Choose a color palette for your website
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {COLOR_SCHEMES.map((scheme) => (
          <Card
            key={scheme.id}
            className={`cursor-pointer transition-all hover-elevate ${
              value.id === scheme.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectScheme(scheme)}
            data-testid={`card-color-${scheme.id}`}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{scheme.name}</span>
                {value.id === scheme.id && (
                  <Check className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex justify-center gap-2">
                <ColorSwatch
                  color={scheme.id === "custom" ? customColors.primary : scheme.primary}
                  label="Pri"
                />
                <ColorSwatch
                  color={scheme.id === "custom" ? customColors.secondary : scheme.secondary}
                  label="Sec"
                />
                <ColorSwatch
                  color={scheme.id === "custom" ? customColors.accent : scheme.accent}
                  label="Acc"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {value.id === "custom" && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="primary-color"
                    value={customColors.primary}
                    onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                    className="w-12 h-9 p-1 cursor-pointer"
                    data-testid="input-color-primary"
                  />
                  <Input
                    type="text"
                    value={customColors.primary}
                    onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                    className="flex-1 font-mono text-sm"
                    data-testid="input-color-primary-hex"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="secondary-color"
                    value={customColors.secondary}
                    onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                    className="w-12 h-9 p-1 cursor-pointer"
                    data-testid="input-color-secondary"
                  />
                  <Input
                    type="text"
                    value={customColors.secondary}
                    onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                    className="flex-1 font-mono text-sm"
                    data-testid="input-color-secondary-hex"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="accent-color"
                    value={customColors.accent}
                    onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                    className="w-12 h-9 p-1 cursor-pointer"
                    data-testid="input-color-accent"
                  />
                  <Input
                    type="text"
                    value={customColors.accent}
                    onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                    className="flex-1 font-mono text-sm"
                    data-testid="input-color-accent-hex"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
