import { InformalTaxInput, InformalTaxResult } from "@/types/tax";
import { calculateTax } from "./taxCalculator";

// Abattements forfaitaires par type d'activité informelle
const INFORMAL_ABATTEMENT_RATES: Record<string, number> = {
  shop: 0.40,
  hairdressing: 0.50,
  tailoring: 0.50,
  transport: 0.35,
  street_vendor: 0.45,
  mechanic: 0.45,
  other: 0.40,
};

// Taux CEL (Contribution Économique Locale)
const CEL_VA_RATE = 0.005; // 0.5% sur la valeur ajoutée
const CEL_LOCAUX_RATE = 0.10; // 10% sur la valeur locative

export function calculateInformalTax(input: InformalTaxInput): InformalTaxResult {
  const { 
    activityType, 
    monthlyRevenue, 
    hasLocal, 
    rentalValue 
  } = input;

  // CA annuel = CA mensuel * 12
  const annualRevenue = monthlyRevenue * 12;

  // Abattement forfaitaire simplifié
  const abattement = INFORMAL_ABATTEMENT_RATES[activityType] || 0.40;
  const netIncome = annualRevenue * (1 - abattement);

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
  const va = annualRevenue * (1 - abattement);
  
  // VA imposable = clamp(VA, CA*0.0015, CA*0.70)
  const vaMin = annualRevenue * 0.0015;
  const vaMax = annualRevenue * 0.70;
  const vaImposable = Math.max(vaMin, Math.min(va, vaMax));

  // CEL - Part VA
  const celVA = vaImposable * CEL_VA_RATE;

  // CEL - Part locaux (si possession d'un local)
  const celLocaux = hasLocal ? rentalValue * CEL_LOCAUX_RATE : 0;

  // Total impôts
  const totalTax = ir + celVA + celLocaux;
  const effectiveRate = (totalTax / annualRevenue) * 100;

  return {
    annualRevenue,
    netIncome: netIncomeRounded,
    ir,
    celVA,
    celLocaux,
    totalTax,
    effectiveRate,
  };
}
