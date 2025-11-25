import { PropertyOwnerTaxInput, PropertyOwnerTaxResult } from "@/types/tax";

// Taux CFPB (Contribution Foncière des Propriétés Bâties)
const CFPB_RATE = 0.05; // 5% de la valeur locative

// Taux CFPNB (Contribution Foncière des Propriétés Non Bâties)
const CFPNB_RATE = 0.03; // 3% de la valeur estimée

export function calculatePropertyOwnerTax(input: PropertyOwnerTaxInput): PropertyOwnerTaxResult {
  const { propertyType, rentalValue, estimatedValue, hasExemption } = input;

  let cfpb = 0;
  let cfpnb = 0;
  let taxableBase = 0;

  if (propertyType === "built") {
    // Propriété bâtie -> CFPB
    taxableBase = rentalValue;
    cfpb = hasExemption ? 0 : rentalValue * CFPB_RATE;
  } else {
    // Terrain nu -> CFPNB
    taxableBase = estimatedValue;
    cfpnb = hasExemption ? 0 : estimatedValue * CFPNB_RATE;
  }

  const totalTax = cfpb + cfpnb;

  return {
    taxableBase,
    cfpb,
    cfpnb,
    totalTax,
  };
}
