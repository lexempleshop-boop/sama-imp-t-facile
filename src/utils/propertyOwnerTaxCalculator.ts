import { PropertyOwnerTaxInput, PropertyOwnerTaxResult } from "@/types/tax";

// Taux CFPB (Contribution Foncière des Propriétés Bâties)
const CFPB_RATE = 0.05; // 5% de la valeur locative

// Taux CFPNB (Contribution Foncière des Propriétés Non Bâties)
const CFPNB_RATE = 0.05; // 5% de la valeur estimée

export function calculatePropertyOwnerTax(input: PropertyOwnerTaxInput): PropertyOwnerTaxResult {
  const { propertyType, estimatedValue, location } = input;

  let cfpb = 0;
  let cfpnb = 0;
  const taxableValue = estimatedValue;

  if (propertyType === "built") {
    cfpb = estimatedValue * CFPB_RATE;
  } else {
    cfpnb = estimatedValue * CFPNB_RATE;
  }

  const totalTax = cfpb + cfpnb;
  const effectiveRate = estimatedValue > 0 ? (totalTax / estimatedValue) * 100 : 0;

  return {
    propertyType,
    estimatedValue,
    taxableValue,
    cfpb,
    cfpnb,
    totalTax,
    effectiveRate,
    exemption: false,
  };
}
