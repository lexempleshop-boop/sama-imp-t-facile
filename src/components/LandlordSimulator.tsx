import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw, Building2, AlertCircle } from "lucide-react";
import { LandlordTaxInput, LandlordTaxResult, PropertyType, TenantType } from "@/types/tax";
import { calculateLandlordTax } from "@/utils/landlordTaxCalculator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function LandlordSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState<LandlordTaxInput>({
    propertyType: "apartment",
    numberOfProperties: 1,
    annualRent: 0,
    expenses: 0,
    tenantType: "individual",
    location: "",
    rentalValue: 0,
  });
  const [result, setResult] = useState<LandlordTaxResult | null>(null);

  const handleCalculate = () => {
    if (input.annualRent > 0) {
      const calculatedResult = calculateLandlordTax(input);
      setResult(calculatedResult);
    }
  };

  const handleReset = () => {
    setInput({
      propertyType: "apartment",
      numberOfProperties: 1,
      annualRent: 0,
      expenses: 0,
      tenantType: "individual",
      location: "",
      rentalValue: 0,
    });
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-gradient-to-br from-violet-500/10 to-violet-600/5 border-2 border-violet-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {language === "fr" ? "Simulateur Bailleur" : "Landlord Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Calculez vos impôts sur les revenus fonciers" : "Calculate your rental income taxes"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Type de bien" : "Property type"}
            </Label>
            <Select 
              value={input.propertyType} 
              onValueChange={(value: PropertyType) => setInput({ ...input, propertyType: value })}
            >
              <SelectTrigger className="border-2 focus:border-violet-500">
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
            <Label className="text-sm font-medium">
              {language === "fr" ? "Nombre de biens loués" : "Number of rented properties"}
            </Label>
            <Input
              type="number"
              min="1"
              value={input.numberOfProperties || ""}
              onChange={(e) => setInput({ ...input, numberOfProperties: Number(e.target.value) })}
              className="border-2 focus:border-violet-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Loyer annuel total (FCFA)" : "Total annual rent (FCFA)"}
            </Label>
            <Input
              type="number"
              value={input.annualRent || ""}
              onChange={(e) => setInput({ ...input, annualRent: Number(e.target.value) })}
              placeholder="Ex: 3 600 000"
              className="border-2 focus:border-violet-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Charges déductibles (FCFA)" : "Deductible expenses (FCFA)"}
            </Label>
            <Input
              type="number"
              value={input.expenses || ""}
              onChange={(e) => setInput({ ...input, expenses: Number(e.target.value) })}
              placeholder="0"
              className="border-2 focus:border-violet-500"
            />
            <p className="text-xs text-muted-foreground">
              {language === "fr" 
                ? "Travaux, assurance, taxe foncière, intérêts d'emprunt..."
                : "Repairs, insurance, property tax, loan interest..."}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Valeur locative cadastrale (FCFA)" : "Cadastral rental value (FCFA)"}
            </Label>
            <Input
              type="number"
              value={input.rentalValue || ""}
              onChange={(e) => setInput({ ...input, rentalValue: Number(e.target.value) })}
              placeholder="0"
              className="border-2 focus:border-violet-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Type de locataire" : "Tenant type"}
            </Label>
            <Select 
              value={input.tenantType} 
              onValueChange={(value: TenantType) => setInput({ ...input, tenantType: value })}
            >
              <SelectTrigger className="border-2 focus:border-violet-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">{language === "fr" ? "Particulier" : "Individual"}</SelectItem>
                <SelectItem value="company">{language === "fr" ? "Entreprise (retenue 5%)" : "Company (5% withholding)"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1 bg-violet-600 hover:bg-violet-700">
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

      <Card className="lg:col-span-1 w-full bg-card/50 backdrop-blur border-2">
        <CardHeader>
          <CardTitle>{language === "fr" ? "Résultats" : "Results"}</CardTitle>
          <CardDescription>
            {language === "fr" ? "Détail de vos impôts fonciers" : "Your property tax breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "Remplissez le formulaire pour estimer vos impôts sur les revenus locatifs"
                  : "Fill in the form to estimate your rental income taxes"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {language === "fr" ? "Revenus" : "Income"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Loyers bruts" : "Gross rent"}
                    </p>
                    <p className="font-semibold">{formatCurrency(result.grossRent)}</p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Revenu net imposable" : "Net taxable income"}
                    </p>
                    <p className="font-semibold">{formatCurrency(result.netRent)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                {result.withholdingTax > 0 && (
                  <div className="flex justify-between text-amber-600">
                    <span className="text-sm">
                      {language === "fr" ? "Retenue à la source (5%)" : "Withholding tax (5%)"}
                    </span>
                    <span className="font-semibold">{formatCurrency(result.withholdingTax)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">{language === "fr" ? "IR Foncier" : "Property IR"}</span>
                  <span className="font-semibold">{formatCurrency(result.irFoncier)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CFPB (5%)</span>
                  <span className="font-semibold">{formatCurrency(result.cfpb)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>{language === "fr" ? "Total Impôts" : "Total Tax"}</span>
                  <span className="text-primary">{formatCurrency(result.totalTax)}</span>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === "fr" ? "Taux effectif" : "Effective rate"}
                </p>
                <p className="text-2xl font-bold text-violet-600">{result.effectiveRate.toFixed(2)}%</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {language === "fr" 
                    ? "L'IR foncier est calculé selon le barème progressif. La CFPB est basée sur la valeur locative cadastrale."
                    : "Property IR is calculated using the progressive scale. CFPB is based on cadastral rental value."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
