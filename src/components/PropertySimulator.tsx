import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";

export function PropertySimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState({
    propertyType: "built",
    estimatedValue: 0,
    location: "",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {language === "fr" ? "Simulateur Propriétaire" : "Property Owner Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Calculez vos impôts fonciers (CFPB, CFPNB)" : "Calculate your property taxes (CFPB, CFPNB)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "fr" ? "Type de propriété" : "Property type"}</Label>
            <Select value={input.propertyType} onValueChange={(value) => setInput({ ...input, propertyType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="built">{language === "fr" ? "Propriété bâtie" : "Built property"}</SelectItem>
                <SelectItem value="land">{language === "fr" ? "Terrain nu" : "Vacant land"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Valeur estimée" : "Estimated value"}</Label>
            <Input
              type="number"
              value={input.estimatedValue || ""}
              onChange={(e) => setInput({ ...input, estimatedValue: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Localisation" : "Location"}</Label>
            <Input
              value={input.location}
              onChange={(e) => setInput({ ...input, location: e.target.value })}
              placeholder={language === "fr" ? "Dakar, Thiès, etc." : "Dakar, Thiès, etc."}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-orange-600 hover:bg-orange-700">
              <Calculator className="mr-2 h-4 w-4" />
              {language === "fr" ? "Calculer" : "Calculate"}
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {language === "fr" ? "Réinitialiser" : "Reset"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 w-full bg-muted/30">
        <CardHeader>
          <CardTitle>{language === "fr" ? "Informations" : "Information"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {language === "fr"
              ? "Remplissez le formulaire pour estimer vos contributions foncières"
              : "Fill in the form to estimate your property contributions"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
