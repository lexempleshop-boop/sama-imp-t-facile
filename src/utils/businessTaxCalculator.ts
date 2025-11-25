import { BusinessTaxInput, BusinessTaxResult } from "@/types/tax";
import { calculateTax } from "./taxCalculator";

// Abattements forfaitaires par type d'activité
const ABATTEMENT_RATES: Record<string, number> = {
  commerce: 0.30,
  artisanat: 0.50,
  services: 0.50,
  liberal: 0.34,
  other: 0.30,
};

// Taux CEL (Contribution Économique Locale)
const CEL_VA_RATE = 0.005; // 0.5% sur la valeur ajoutée
const CEL_LOCAUX_RATE = 0.10; // 10% sur la valeur locative

export function calculateBusinessTax(input: BusinessTaxInput): BusinessTaxResult {
  const { 
    activityType, 
    annualRevenue, 
    expenses, 
    useRealExpenses, 
    rentalValue, 
    isFormal 
  } = input;

  // Calcul du revenu net imposable
  let netIncome: number;
  if (useRealExpenses && isFormal) {
    netIncome = annualRevenue - expenses;
  } else {
    const abattement = ABATTEMENT_RATES[activityType] || 0.30;
    netIncome = annualRevenue * (1 - abattement);
  }

  // Arrondir au millier inférieur pour l'IR
  const netIncomeRounded = Math.floor(netIncome / 1000) * 1000;

  // Calcul de l'IR avec le barème progressif
  const irResult = calculateTax({
    annualIncome: netIncomeRounded,
    maritalStatus: "single",
    numberOfChildren: 0,
  });
  const ir = irResult.finalTax;

  // Calcul de la Valeur Ajoutée (VA)
  const va = annualRevenue - (useRealExpenses ? expenses : annualRevenue * (ABATTEMENT_RATES[activityType] || 0.30));
  
  // VA imposable = clamp(VA, CA*0.0015, CA*0.70)
  const vaMin = annualRevenue * 0.0015;
  const vaMax = annualRevenue * 0.70;
  const vaImposable = Math.max(vaMin, Math.min(va, vaMax));

  // CEL - Part VA
  const celVA = vaImposable * CEL_VA_RATE;

  // CEL - Part locaux
  const celLocaux = rentalValue * CEL_LOCAUX_RATE;

  // Total impôts
  const totalTax = ir + celVA + celLocaux;
  const effectiveRate = (totalTax / annualRevenue) * 100;

  return {
    netIncome: netIncomeRounded,
    ir,
    celVA,
    celLocaux,
    totalTax,
    effectiveRate,
  };
}
