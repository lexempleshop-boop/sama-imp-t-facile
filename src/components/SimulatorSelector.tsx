import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Home, Users, Calculator } from "lucide-react";
import { TaxSimulator } from "./TaxSimulator";
import { BusinessSimulator } from "./BusinessSimulator";
import { LandlordSimulator } from "./LandlordSimulator";
import { PropertySimulator } from "./PropertySimulator";
import { InformalSimulator } from "./InformalSimulator";
import { SimulatorType } from "@/types/tax";

export function SimulatorSelector() {
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState<SimulatorType | null>(null);

  const simulatorTypes = [
    {
      type: "salaried" as SimulatorType,
      icon: Calculator,
      title: { fr: "Salarié", en: "Salaried", wo: "Salarié", ff: "Salarié" },
      description: { fr: "Calculez votre IRPP", en: "Calculate your IRPP", wo: "Kajoor sa IRPP", ff: "Limtu IRPP maa" },
      color: "bg-blue-500/10 hover:bg-blue-500/20",
    },
    {
      type: "business" as SimulatorType,
      icon: Briefcase,
      title: { fr: "Commerçant / Artisan", en: "Merchant / Artisan", wo: "Sëriñ / Artisan", ff: "Ceeɗoowo / Artisan" },
      description: { fr: "Patente, IR, CEL", en: "Patente, IR, CEL", wo: "Patente, IR, CEL", ff: "Patente, IR, CEL" },
      color: "bg-green-500/10 hover:bg-green-500/20",
    },
    {
      type: "landlord" as SimulatorType,
      icon: Building2,
      title: { fr: "Bailleur", en: "Landlord", wo: "Bailleur", ff: "Bailleur" },
      description: { fr: "Revenus fonciers", en: "Rental income", wo: "Njëg ci kër", ff: "Yurnde suudu" },
      color: "bg-purple-500/10 hover:bg-purple-500/20",
    },
    {
      type: "property" as SimulatorType,
      icon: Home,
      title: { fr: "Propriétaire", en: "Property Owner", wo: "Boroom kër", ff: "Jom suudu" },
      description: { fr: "CFPB, CFPNB", en: "CFPB, CFPNB", wo: "CFPB, CFPNB", ff: "CFPB, CFPNB" },
      color: "bg-orange-500/10 hover:bg-orange-500/20",
    },
    {
      type: "informal" as SimulatorType,
      icon: Users,
      title: { fr: "Secteur Informel", en: "Informal Sector", wo: "Secteur Informel", ff: "Secteur Informel" },
      description: { fr: "Formalisation", en: "Formalization", wo: "Formalisation", ff: "Formalisation" },
      color: "bg-amber-500/10 hover:bg-amber-500/20",
    },
  ];

  if (selectedType) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedType(null)}>
          ← {language === "fr" ? "Retour" : language === "en" ? "Back" : language === "wo" ? "Dellu" : "Rutto"}
        </Button>
        {selectedType === "salaried" && <TaxSimulator />}
        {selectedType === "business" && <BusinessSimulator />}
        {selectedType === "landlord" && <LandlordSimulator />}
        {selectedType === "property" && <PropertySimulator />}
        {selectedType === "informal" && <InformalSimulator />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
          {language === "fr" && "Choisissez votre profil"}
          {language === "en" && "Choose your profile"}
          {language === "wo" && "Taan sa profil"}
          {language === "ff" && "Suɓo profil maa"}
        </h2>
        <p className="text-muted-foreground">
          {language === "fr" && "Sélectionnez le simulateur adapté à votre situation"}
          {language === "en" && "Select the simulator suited to your situation"}
          {language === "wo" && "Taan simulateur bu am solo ak sa xalaat"}
          {language === "ff" && "Suɓo simulateur ngoongɗinɗo e ngonka maa"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {simulatorTypes.map((simulator) => {
          const Icon = simulator.icon;
          return (
            <Card
              key={simulator.type}
              className={`cursor-pointer transition-all hover:scale-105 ${simulator.color} border-2`}
              onClick={() => setSelectedType(simulator.type)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{simulator.title[language]}</CardTitle>
                </div>
                <CardDescription>{simulator.description[language]}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
