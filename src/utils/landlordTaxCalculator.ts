import { LandlordTaxInput, LandlordTaxResult } from "@/types/tax";
import { calculateTax } from "./taxCalculator";

// Taux de retenue à la source pour les entreprises
const WITHHOLDING_RATE = 0.05; // 5%

// Taux CFPB (Contribution Foncière des Propriétés Bâties)
const CFPB_RATE = 0.05; // 5% de la valeur locative

export function calculateLandlordTax(input: LandlordTaxInput): LandlordTaxResult {
  const { 
    annualRent, 
    expenses, 
    tenantType, 
    rentalValue,
    numberOfProperties 
  } = input;

  // Revenu brut = somme des loyers
  const grossRent = annualRent * numberOfProperties;

  // Revenu net = loyers - charges
  const netRent = grossRent - expenses;

  // Retenue à la source (si locataire = entreprise)
  const withholdingTax = tenantType === "company" ? grossRent * WITHHOLDING_RATE : 0;

  // Arrondir au millier inférieur pour l'IR foncier
  const netRentRounded = Math.floor(netRent / 1000) * 1000;

  // Calcul de l'IR foncier avec le barème progressif
  const irResult = calculateTax({
    annualIncome: netRentRounded,
    maritalStatus: "single",
    numberOfChildren: 0,
  });
  const irFoncier = irResult.finalTax;

  // CFPB (Contribution Foncière des Propriétés Bâties)
  const cfpb = rentalValue * CFPB_RATE * numberOfProperties;

  // Total impôts
  const totalTax = withholdingTax + irFoncier + cfpb;
  const effectiveRate = (totalTax / grossRent) * 100;

  return {
    grossRent,
    netRent: netRentRounded,
    withholdingTax,
    irFoncier,
    cfpb,
    totalTax,
    effectiveRate,
  };
}
