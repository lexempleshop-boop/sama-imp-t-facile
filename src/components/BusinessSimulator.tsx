import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator, RefreshCw } from "lucide-react";
import { BusinessTaxInput, BusinessTaxResult, ActivityType } from "@/types/tax";
import { calculateBusinessTax } from "@/utils/businessTaxCalculator";

export function BusinessSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState<BusinessTaxInput>({
    activityType: "commerce",
    annualRevenue: 0,
    expenses: 0,
    useRealExpenses: false,
    location: "",
    rentalValue: 0,
    numberOfEmployees: 0,
    isFormal: true,
  });
  const [result, setResult] = useState<BusinessTaxResult | null>(null);

  const handleCalculate = () => {
    if (input.annualRevenue > 0) {
      const calculatedResult = calculateBusinessTax(input);
      setResult(calculatedResult);
    }
  };

  const handleReset = () => {
    setInput({
      activityType: "commerce",
      annualRevenue: 0,
      expenses: 0,
      useRealExpenses: false,
      location: "",
      rentalValue: 0,
      numberOfEmployees: 0,
      isFormal: true,
    });
    setResult(null);
  };

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
            <Select value={input.activityType} onValueChange={(value) => setInput({ ...input, activityType: value as ActivityType })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="commerce">{language === "fr" ? "Commerce" : "Commerce"}</SelectItem>
                <SelectItem value="artisanat">{language === "fr" ? "Artisanat" : "Crafts"}</SelectItem>
                <SelectItem value="services">{language === "fr" ? "Services" : "Services"}</SelectItem>
                <SelectItem value="liberal">{language === "fr" ? "Profession libérale" : "Liberal profession"}</SelectItem>
                <SelectItem value="other">{language === "fr" ? "Autre" : "Other"}</SelectItem>
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

          <div className="flex items-center space-x-2">
            <Switch
              checked={input.useRealExpenses}
              onCheckedChange={(checked) => setInput({ ...input, useRealExpenses: checked })}
            />
            <Label>{language === "fr" ? "Utiliser les charges réelles" : "Use real expenses"}</Label>
          </div>

          {input.useRealExpenses && (
            <div className="space-y-2">
              <Label>{language === "fr" ? "Charges annuelles" : "Annual Expenses"}</Label>
              <Input
                type="number"
                value={input.expenses || ""}
                onChange={(e) => setInput({ ...input, expenses: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>{language === "fr" ? "Valeur locative du local" : "Rental Value"}</Label>
            <Input
              type="number"
              value={input.rentalValue || ""}
              onChange={(e) => setInput({ ...input, rentalValue: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>{language === "fr" ? "Nombre d'employés" : "Number of Employees"}</Label>
            <Input
              type="number"
              value={input.numberOfEmployees || ""}
              onChange={(e) => setInput({ ...input, numberOfEmployees: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="mr-2 h-4 w-4" />
              {language === "fr" ? "Calculer" : "Calculate"}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {language === "fr" ? "Réinitialiser" : "Reset"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="lg:col-span-1 w-full bg-muted/30">
          <CardHeader>
            <CardTitle>{language === "fr" ? "Résultats" : "Results"}</CardTitle>
            <CardDescription>{language === "fr" ? "Détail de vos impôts" : "Your tax breakdown"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {language === "fr" ? "Revenus" : "Income"}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{language === "fr" ? "Revenu net imposable" : "Net Taxable Income"}</p>
                  <p className="font-semibold">{formatCurrency(result.netIncome)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm">{language === "fr" ? "Impôt sur le Revenu (IR)" : "Income Tax (IR)"}</span>
                <span className="font-semibold">{formatCurrency(result.ir)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{language === "fr" ? "CEL - Valeur Ajoutée" : "CEL - Added Value"}</span>
                <span className="font-semibold">{formatCurrency(result.celVA)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">{language === "fr" ? "CEL - Locaux" : "CEL - Property"}</span>
                <span className="font-semibold">{formatCurrency(result.celLocaux)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{language === "fr" ? "Total Impôts" : "Total Tax"}</span>
                <span className="text-primary">{formatCurrency(result.totalTax)}</span>
              </div>
            </div>

            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1">{language === "fr" ? "Taux effectif" : "Effective Rate"}</p>
              <p className="text-xl font-bold text-primary">{result.effectiveRate.toFixed(2)}%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
