import { Phone, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactStepProps {
  whatsappNumber: string;
  phoneNumber: string;
  onWhatsappChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export function ContactStep({
  whatsappNumber,
  phoneNumber,
  onWhatsappChange,
  onPhoneChange,
}: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
          <Phone className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Contact Integration</h2>
        <p className="text-muted-foreground">
          Add floating contact buttons to your website
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="whatsapp" className="text-base font-semibold">
                    WhatsApp Number
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Include country code (e.g., +1234567890)
                  </p>
                </div>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={whatsappNumber}
                  onChange={(e) => onWhatsappChange(e.target.value)}
                  className="max-w-xs"
                  data-testid="input-whatsapp"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor="phone" className="text-base font-semibold">
                    Phone Number
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Include country code (e.g., +1234567890)
                  </p>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => onPhoneChange(e.target.value)}
                  className="max-w-xs"
                  data-testid="input-phone"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        These buttons will appear as floating action buttons in the bottom-right corner of your website.
      </div>
    </div>
  );
}
