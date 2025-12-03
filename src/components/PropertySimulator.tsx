import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw, Home, AlertCircle, CheckCircle2 } from "lucide-react";
import { PropertyOwnerTaxInput, PropertyOwnerTaxResult, PropertyOwnershipType } from "@/types/tax";
import { calculatePropertyTax } from "@/utils/propertyTaxCalculator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PropertySimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState<PropertyOwnerTaxInput>({
    propertyType: "built",
    estimatedValue: 0,
    location: "",
    surfaceArea: 0,
  });
  const [result, setResult] = useState<PropertyOwnerTaxResult | null>(null);

  const handleCalculate = () => {
    if (input.estimatedValue > 0) {
      const calculatedResult = calculatePropertyTax(input);
      setResult(calculatedResult);
    }
  };

  const handleReset = () => {
    setInput({
      propertyType: "built",
      estimatedValue: 0,
      location: "",
      surfaceArea: 0,
    });
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 border-amber-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            {language === "fr" ? "Simulateur Propriétaire" : "Property Owner Simulator"}
          </CardTitle>
          <CardDescription>
            {language === "fr" ? "Calculez vos impôts fonciers (CFPB, CFPNB)" : "Calculate your property taxes (CFPB, CFPNB)"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Type de propriété" : "Property type"}
            </Label>
            <Select 
              value={input.propertyType} 
              onValueChange={(value: PropertyOwnershipType) => setInput({ ...input, propertyType: value })}
            >
              <SelectTrigger className="border-2 focus:border-amber-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="built">{language === "fr" ? "Propriété bâtie (CFPB)" : "Built property (CFPB)"}</SelectItem>
                <SelectItem value="unbuilt">{language === "fr" ? "Terrain nu (CFPNB)" : "Vacant land (CFPNB)"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Valeur locative annuelle (FCFA)" : "Annual rental value (FCFA)"}
            </Label>
            <Input
              type="number"
              value={input.estimatedValue || ""}
              onChange={(e) => setInput({ ...input, estimatedValue: Number(e.target.value) })}
              placeholder="Ex: 2 400 000"
              className="border-2 focus:border-amber-500"
            />
            <p className="text-xs text-muted-foreground">
              {language === "fr" 
                ? "Valeur locative = loyer mensuel x 12 (ou estimation de l'administration)"
                : "Rental value = monthly rent x 12 (or administration estimate)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {language === "fr" ? "Localisation" : "Location"}
            </Label>
            <Select 
              value={input.location} 
              onValueChange={(value) => setInput({ ...input, location: value })}
            >
              <SelectTrigger className="border-2 focus:border-amber-500">
                <SelectValue placeholder={language === "fr" ? "Sélectionnez une zone" : "Select a zone"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dakar">Dakar</SelectItem>
                <SelectItem value="thies">Thiès</SelectItem>
                <SelectItem value="saint-louis">Saint-Louis</SelectItem>
                <SelectItem value="kaolack">Kaolack</SelectItem>
                <SelectItem value="ziguinchor">Ziguinchor</SelectItem>
                <SelectItem value="other">{language === "fr" ? "Autre région" : "Other region"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCalculate} className="flex-1 bg-amber-600 hover:bg-amber-700">
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
            {language === "fr" ? "Estimation de vos impôts fonciers" : "Your property tax estimate"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                {language === "fr"
                  ? "Remplissez le formulaire pour estimer vos contributions foncières"
                  : "Fill in the form to estimate your property contributions"}
              </p>
            </div>
          ) : result.exemption ? (
            <Alert className="border-emerald-500/50 bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <AlertTitle className="text-emerald-600">
                {language === "fr" ? "Exonération applicable" : "Exemption applies"}
              </AlertTitle>
              <AlertDescription className="text-emerald-600/80">
                {result.exemptionReason}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {language === "fr" ? "Détail du calcul" : "Calculation details"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Type" : "Type"}
                    </p>
                    <p className="font-semibold">
                      {result.propertyType === "built" 
                        ? (language === "fr" ? "Bâti" : "Built") 
                        : (language === "fr" ? "Non bâti" : "Land")}
                    </p>
                  </div>
                  <div className="space-y-1 p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                      {language === "fr" ? "Valeur imposable" : "Taxable value"}
                    </p>
                    <p className="font-semibold">{formatCurrency(result.taxableValue)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                {result.cfpb > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm">CFPB (5%)</span>
                    <span className="font-semibold">{formatCurrency(result.cfpb)}</span>
                  </div>
                )}
                {result.cfpnb > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm">CFPNB (5%)</span>
                    <span className="font-semibold">{formatCurrency(result.cfpnb)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>{language === "fr" ? "Total à payer" : "Total to pay"}</span>
                  <span className="text-primary">{formatCurrency(result.totalTax)}</span>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-muted-foreground mb-1">
                  {language === "fr" ? "Taux effectif" : "Effective rate"}
                </p>
                <p className="text-2xl font-bold text-amber-600">{result.effectiveRate.toFixed(2)}%</p>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {language === "fr" 
                    ? "Ce calcul est une estimation. Le montant exact dépend de l'évaluation officielle de l'administration fiscale."
                    : "This calculation is an estimate. The exact amount depends on the official assessment by the tax administration."}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
