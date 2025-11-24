import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";

export function BusinessSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState({
    activityType: "commerce",
    annualRevenue: 0,
    expenses: 0,
    location: "",
    registered: false,
    hasLocal: false,
    employees: 0,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-green-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {language === "fr" ? "Simulateur Commerçant / Artisan" : "Business Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Estimez vos obligations fiscales" : "Estimate your tax obligations"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{language === "fr" ? "Type d'activité" : "Activity type"}</Label>
            <Select value={input.activityType} onValueChange={(value) => setInput({ ...input, activityType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commerce">{language === "fr" ? "Commerce" : "Commerce"}</SelectItem>
                <SelectItem value="artisanat">{language === "fr" ? "Artisanat" : "Crafts"}</SelectItem>
                <SelectItem value="services">{language === "fr" ? "Services" : "Services"}</SelectItem>
                <SelectItem value="liberal">{language === "fr" ? "Profession libérale" : "Liberal profession"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Chiffre d'affaires annuel" : "Annual revenue"}</Label>
            <Input
              type="number"
              value={input.annualRevenue || ""}
              onChange={(e) => setInput({ ...input, annualRevenue: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Charges / Dépenses" : "Expenses"}</Label>
            <Input
              type="number"
              value={input.expenses || ""}
              onChange={(e) => setInput({ ...input, expenses: Number(e.target.value) })}
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
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
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
              ? "Remplissez le formulaire pour estimer vos impôts (Patente, IR, CEL)"
              : "Fill in the form to estimate your taxes (Patente, IR, CEL)"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
