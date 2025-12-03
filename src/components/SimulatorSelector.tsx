import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, Home, Calculator, ArrowLeft, Sparkles } from "lucide-react";
import { TaxSimulator } from "./TaxSimulator";
import { BusinessSimulator } from "./BusinessSimulator";
import { LandlordSimulator } from "./LandlordSimulator";
import { PropertySimulator } from "./PropertySimulator";
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
      gradient: "from-blue-500/20 to-blue-600/10",
      iconBg: "bg-blue-500",
      borderColor: "border-blue-500/30 hover:border-blue-500/60",
    },
    {
      type: "business" as SimulatorType,
      icon: Briefcase,
      title: { fr: "Commerçant / Artisan", en: "Merchant / Artisan", wo: "Sëriñ / Artisan", ff: "Ceeɗoowo / Artisan" },
      description: { fr: "Patente, IR, CEL", en: "Patente, IR, CEL", wo: "Patente, IR, CEL", ff: "Patente, IR, CEL" },
      gradient: "from-emerald-500/20 to-emerald-600/10",
      iconBg: "bg-emerald-500",
      borderColor: "border-emerald-500/30 hover:border-emerald-500/60",
    },
    {
      type: "landlord" as SimulatorType,
      icon: Building2,
      title: { fr: "Bailleur", en: "Landlord", wo: "Bailleur", ff: "Bailleur" },
      description: { fr: "Revenus fonciers", en: "Rental income", wo: "Njëg ci kër", ff: "Yurnde suudu" },
      gradient: "from-violet-500/20 to-violet-600/10",
      iconBg: "bg-violet-500",
      borderColor: "border-violet-500/30 hover:border-violet-500/60",
    },
    {
      type: "property" as SimulatorType,
      icon: Home,
      title: { fr: "Propriétaire", en: "Property Owner", wo: "Boroom kër", ff: "Jom suudu" },
      description: { fr: "CFPB, CFPNB", en: "CFPB, CFPNB", wo: "CFPB, CFPNB", ff: "CFPB, CFPNB" },
      gradient: "from-amber-500/20 to-amber-600/10",
      iconBg: "bg-amber-500",
      borderColor: "border-amber-500/30 hover:border-amber-500/60",
    },
  ];

  if (selectedType) {
    return (
      <div className="space-y-6">
        <Button 
          variant="ghost" 
          onClick={() => setSelectedType(null)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "fr" ? "Retour aux simulateurs" : language === "en" ? "Back to simulators" : language === "wo" ? "Dellu ci simulateurs yi" : "Rutto e simulateurs"}
        </Button>
        {selectedType === "salaried" && <TaxSimulator />}
        {selectedType === "business" && <BusinessSimulator />}
        {selectedType === "landlord" && <LandlordSimulator />}
        {selectedType === "property" && <PropertySimulator />}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {language === "fr" ? "Simulateurs Fiscaux" : "Tax Simulators"}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          {language === "fr" && "Choisissez votre profil"}
          {language === "en" && "Choose your profile"}
          {language === "wo" && "Taan sa profil"}
          {language === "ff" && "Suɓo profil maa"}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "fr" && "Sélectionnez le simulateur adapté à votre situation pour estimer vos obligations fiscales"}
          {language === "en" && "Select the simulator suited to your situation to estimate your tax obligations"}
          {language === "wo" && "Taan simulateur bu am solo ak sa xalaat"}
          {language === "ff" && "Suɓo simulateur ngoongɗinɗo e ngonka maa"}
        </p>
      </div>

      {/* Simulator Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {simulatorTypes.map((simulator) => {
          const Icon = simulator.icon;
          return (
            <Card
              key={simulator.type}
              className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br ${simulator.gradient} border-2 ${simulator.borderColor} group`}
              onClick={() => setSelectedType(simulator.type)}
            >
              <CardHeader className="space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${simulator.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {simulator.title[language]}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {simulator.description[language]}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
