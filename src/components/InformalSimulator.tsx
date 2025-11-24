import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";

export function InformalSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState({
    activityType: "shop",
    monthlyRevenue: 0,
    location: "",
    hasLocal: false,
    employees: 0,
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-amber-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {language === "fr" ? "Simulateur Secteur Informel" : "Informal Sector Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Estimez le coût de la formalisation" : "Estimate formalization cost"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "fr" ? "Type d'activité informelle" : "Informal activity type"}</Label>
            <Select value={input.activityType} onValueChange={(value) => setInput({ ...input, activityType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shop">{language === "fr" ? "Boutique / Épicerie" : "Shop / Grocery"}</SelectItem>
                <SelectItem value="hairdressing">{language === "fr" ? "Coiffure" : "Hairdressing"}</SelectItem>
                <SelectItem value="tailoring">{language === "fr" ? "Couture" : "Tailoring"}</SelectItem>
                <SelectItem value="transport">{language === "fr" ? "Transport" : "Transport"}</SelectItem>
                <SelectItem value="street_vendor">{language === "fr" ? "Vente de rue" : "Street vendor"}</SelectItem>
                <SelectItem value="mechanic">{language === "fr" ? "Mécanique" : "Mechanic"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Chiffre d'affaires mensuel (approximatif)" : "Monthly revenue (approximate)"}</Label>
            <Input
              type="number"
              value={input.monthlyRevenue || ""}
              onChange={(e) => setInput({ ...input, monthlyRevenue: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Lieu d'activité" : "Activity location"}</Label>
            <Input
              value={input.location}
              onChange={(e) => setInput({ ...input, location: e.target.value })}
              placeholder={language === "fr" ? "Marché, quartier, mobile..." : "Market, neighborhood, mobile..."}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Nombre d'employés" : "Number of employees"}</Label>
            <Input
              type="number"
              min="0"
              value={input.employees || ""}
              onChange={(e) => setInput({ ...input, employees: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
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
          <CardTitle>{language === "fr" ? "Guide de formalisation" : "Formalization guide"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === "fr"
              ? "Ce simulateur vous aide à estimer les coûts et obligations liés à la formalisation de votre activité."
              : "This simulator helps you estimate costs and obligations related to formalizing your activity."}
          </p>
          <div className="text-sm">
            <p className="font-semibold mb-1">{language === "fr" ? "Avantages de la formalisation :" : "Benefits of formalization:"}</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>{language === "fr" ? "Accès au crédit bancaire" : "Access to bank credit"}</li>
              <li>{language === "fr" ? "Protection légale" : "Legal protection"}</li>
              <li>{language === "fr" ? "Marchés publics" : "Public contracts"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
