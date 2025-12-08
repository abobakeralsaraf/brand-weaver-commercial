import { useState } from "react";
import { ArrowLeft, ArrowRight, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LanguageStep } from "./wizard/language-step";
import { ColorSchemeStep } from "./wizard/color-scheme-step";
import { TypographyStep } from "./wizard/typography-step";
import { AestheticStep } from "./wizard/aesthetic-step";
import { ContactStep } from "./wizard/contact-step";
import { WizardStepper } from "./wizard/wizard-stepper";
import {
  COLOR_SCHEMES,
  TYPOGRAPHY_OPTIONS,
  type WebsiteConfig,
  type LanguageSelection,
  type ColorScheme,
  type Typography,
  type AestheticLevel,
} from "@shared/schema";

interface CustomizationWizardProps {
  onComplete: (config: WebsiteConfig) => void;
  onBack: () => void;
}

const WIZARD_STEPS = [
  { id: "language", label: "Language" },
  { id: "colors", label: "Colors" },
  { id: "typography", label: "Typography" },
  { id: "aesthetic", label: "Aesthetic" },
  { id: "contact", label: "Contact" },
];

export function CustomizationWizard({ onComplete, onBack }: CustomizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<WebsiteConfig>({
    language: "english",
    colorScheme: COLOR_SCHEMES[0],
    typography: TYPOGRAPHY_OPTIONS[0],
    aestheticLevel: "enhanced",
    whatsappNumber: "",
    phoneNumber: "",
    portfolioProjects: [],
    analytics: undefined,
  });

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(config);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const updateConfig = <K extends keyof WebsiteConfig>(key: K, value: WebsiteConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <LanguageStep
            value={config.language}
            onChange={(v: LanguageSelection) => updateConfig("language", v)}
          />
        );
      case 1:
        return (
          <ColorSchemeStep
            value={config.colorScheme}
            onChange={(v: ColorScheme) => updateConfig("colorScheme", v)}
          />
        );
      case 2:
        return (
          <TypographyStep
            value={config.typography}
            onChange={(v: Typography) => updateConfig("typography", v)}
          />
        );
      case 3:
        return (
          <AestheticStep
            value={config.aestheticLevel}
            onChange={(v: AestheticLevel) => updateConfig("aestheticLevel", v)}
          />
        );
      case 4:
        return (
          <ContactStep
            whatsappNumber={config.whatsappNumber || ""}
            phoneNumber={config.phoneNumber || ""}
            onWhatsappChange={(v) => updateConfig("whatsappNumber", v)}
            onPhoneChange={(v) => updateConfig("phoneNumber", v)}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === WIZARD_STEPS.length - 1;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <WizardStepper steps={WIZARD_STEPS} currentStep={currentStep} />

        <Card>
          <CardContent className="p-6 min-h-[400px]">
            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between gap-4 p-6 pt-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="gap-2"
              data-testid="button-wizard-back"
            >
              <ArrowLeft className="w-4 h-4" />
              {currentStep === 0 ? "Back to Preview" : "Previous"}
            </Button>
            <Button
              onClick={handleNext}
              className="gap-2"
              data-testid="button-wizard-next"
            >
              {isLastStep ? (
                <>
                  <Wand2 className="w-4 h-4" />
                  Generate Website
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
