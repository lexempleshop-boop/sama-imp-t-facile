import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { calculateTax } from "@/utils/taxCalculator";
import { TaxCalculationInput, TaxCalculationResult, MaritalStatus } from "@/types/tax";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, RefreshCw } from "lucide-react";

export function TaxSimulator() {
  const { language } = useLanguage();
  const [input, setInput] = useState<TaxCalculationInput>({
    annualIncome: 0,
    maritalStatus: "single",
    numberOfChildren: 0,
  });
  const [result, setResult] = useState<TaxCalculationResult | null>(null);

  const handleCalculate = () => {
    if (input.annualIncome > 0) {
      const calculatedResult = calculateTax(input);
      setResult(calculatedResult);
    }
  };

  const handleReset = () => {
    setInput({
      annualIncome: 0,
      maritalStatus: "single",
      numberOfChildren: 0,
    });
    setResult(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(Math.round(amount)) + " FCFA";
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 w-full max-w-7xl mx-auto">
      <Card className="w-full bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            {t("taxSimulator", language)}
          </CardTitle>
          <CardDescription>{t("description", language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">{t("annualIncome", language)}</Label>
            <Input
              id="income"
              type="number"
              value={input.annualIncome || ""}
              onChange={(e) => setInput({ ...input, annualIncome: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">{t("maritalStatus", language)}</Label>
            <Select
              value={input.maritalStatus}
              onValueChange={(value) => setInput({ ...input, maritalStatus: value as MaritalStatus })}
            >
              <SelectTrigger id="maritalStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">{t("single", language)}</SelectItem>
                <SelectItem value="married">{t("married", language)}</SelectItem>
                <SelectItem value="divorced">{t("divorced", language)}</SelectItem>
                <SelectItem value="widowed">{t("widowed", language)}</SelectItem>
                <SelectItem value="separated">{t("separated", language)}</SelectItem>
                <SelectItem value="cohabiting">{t("cohabiting", language)}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="children">{t("numberOfChildren", language)}</Label>
            <Input
              id="children"
              type="number"
              min="0"
              max="8"
              value={input.numberOfChildren || ""}
              onChange={(e) => setInput({ ...input, numberOfChildren: Number(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCalculate} className="flex-1">
              <Calculator className="mr-2 h-4 w-4" />
              {t("calculate", language)}
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("reset", language)}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="lg:col-span-1 w-full bg-muted/30">
          <CardHeader>
            <CardTitle>{t("results", language)}</CardTitle>
            <CardDescription>{t("taxBreakdown", language)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">{t("yourSituation", language)}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("grossIncome", language)}</p>
                  <p className="font-semibold">{formatCurrency(result.grossIncome)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("familyParts", language)}</p>
                  <p className="font-semibold">{result.parts}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t("incomePerPart", language)}</p>
                  <p className="font-semibold">{formatCurrency(result.incomePerPart)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">{t("progressiveBrackets", language)}</h3>
              <div className="space-y-2">
                {result.brackets.map((bracket, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 rounded bg-muted/50">
                    <span className="text-muted-foreground">
                      {formatCurrency(bracket.min)} - {bracket.max ? formatCurrency(bracket.max) : "∞"}
                    </span>
                    <div className="flex gap-4">
                      <span className="font-medium">{(bracket.rate * 100).toFixed(0)}%</span>
                      <span className="font-semibold min-w-[120px] text-right">{formatCurrency(bracket.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm">{t("taxBeforeReduction", language)}</span>
                <span className="font-semibold">{formatCurrency(result.totalTaxBeforeReduction)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span className="text-sm">{t("taxReduction", language)}</span>
                <span className="font-semibold">- {formatCurrency(result.reduction)}</span>
              </div>
              <div className="flex justify-between text-info">
                <span className="text-sm">{t("minimumTax", language)}</span>
                <span className="font-semibold">{formatCurrency(result.trimf)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>{t("finalTax", language)}</span>
                <span className="text-primary">{formatCurrency(result.finalTax)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">{t("effectiveRate", language)}</p>
                <p className="text-xl font-bold text-primary">{result.effectiveRate.toFixed(2)}%</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-1">{t("marginalRate", language)}</p>
                <p className="text-xl font-bold text-accent">{result.marginalRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
