import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";

export function LandlordSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState({
    propertyType: "apartment",
    numberOfProperties: 1,
    annualRent: 0,
    expenses: 0,
    tenantType: "individual",
  });

  return (
    <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {language === "fr" ? "Simulateur Bailleur" : "Landlord Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Calculez vos revenus fonciers" : "Calculate your rental income"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "fr" ? "Type de bien" : "Property type"}</Label>
            <Select value={input.propertyType} onValueChange={(value) => setInput({ ...input, propertyType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apartment">{language === "fr" ? "Appartement" : "Apartment"}</SelectItem>
                <SelectItem value="house">{language === "fr" ? "Maison" : "House"}</SelectItem>
                <SelectItem value="furnished">{language === "fr" ? "Meublé" : "Furnished"}</SelectItem>
                <SelectItem value="commercial">{language === "fr" ? "Commercial" : "Commercial"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Nombre de biens" : "Number of properties"}</Label>
            <Input
              type="number"
              min="1"
              value={input.numberOfProperties || ""}
              onChange={(e) => setInput({ ...input, numberOfProperties: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Loyer annuel total" : "Total annual rent"}</Label>
            <Input
              type="number"
              value={input.annualRent || ""}
              onChange={(e) => setInput({ ...input, annualRent: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Charges déductibles" : "Deductible expenses"}</Label>
            <Input
              type="number"
              value={input.expenses || ""}
              onChange={(e) => setInput({ ...input, expenses: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Type de locataire" : "Tenant type"}</Label>
            <Select value={input.tenantType} onValueChange={(value) => setInput({ ...input, tenantType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">{language === "fr" ? "Particulier" : "Individual"}</SelectItem>
                <SelectItem value="business">{language === "fr" ? "Entreprise" : "Business"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
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
              ? "Remplissez le formulaire pour estimer vos impôts sur les revenus fonciers"
              : "Fill in the form to estimate your property income taxes"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
