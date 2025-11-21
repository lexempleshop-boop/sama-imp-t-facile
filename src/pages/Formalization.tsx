import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, FileText, Building2, Users, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

type BusinessType = "commerce" | "artisanat" | "service" | "agriculture" | "";
type LegalForm = "individuelle" | "sarl" | "sa" | "gie" | "";

export default function Formalization() {
  const { language } = useLanguage();
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType>("");
  const [turnover, setTurnover] = useState("");
  const [employees, setEmployees] = useState("");
  const [legalForm, setLegalForm] = useState<LegalForm>("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const getRecommendation = () => {
    const turnoverNum = parseFloat(turnover) || 0;
    
    if (turnoverNum < 50000000) {
      return {
        regime: language === "fr" ? "Contribution Globale Unique (CGU)" : "Single Global Contribution (CGU)",
        legalFormRecommended: language === "fr" ? "Entreprise Individuelle" : "Sole Proprietorship",
        steps: [
          {
            title: language === "fr" ? "1. Inscription au Registre du Commerce" : "1. Commercial Register Registration",
            items: [
              language === "fr" ? "Se rendre au Tribunal de Commerce ou à l'APIX" : "Go to Commercial Court or APIX",
              language === "fr" ? "Documents requis: CNI, certificat de résidence, bail commercial" : "Required: ID, residence certificate, commercial lease",
              language === "fr" ? "Frais: environ 25 000 FCFA" : "Fee: approximately 25,000 FCFA"
            ]
          },
          {
            title: language === "fr" ? "2. Déclaration Fiscale" : "2. Tax Declaration",
            items: [
              language === "fr" ? "Se présenter au Centre des Impôts de votre localité" : "Visit your local Tax Center",
              language === "fr" ? "Remplir le formulaire de déclaration d'activité" : "Complete business activity form",
              language === "fr" ? "Obtenir votre NINEA (Numéro d'Identification National des Entreprises)" : "Obtain your NINEA (National Business ID)"
            ]
          },
          {
            title: language === "fr" ? "3. Affiliation IPRES/CSS" : "3. IPRES/CSS Affiliation",
            items: [
              language === "fr" ? "Inscription à l'Institution de Prévoyance Retraite du Sénégal" : "Register with Senegal Retirement Fund",
              language === "fr" ? "Documents: NINEA, CNI, formulaire d'affiliation" : "Documents: NINEA, ID, affiliation form",
              language === "fr" ? "Si vous avez des employés: inscription à la Caisse de Sécurité Sociale" : "If you have employees: register with Social Security"
            ]
          },
          {
            title: language === "fr" ? "4. Paiement CGU" : "4. CGU Payment",
            items: [
              language === "fr" ? "Taux: 2% pour commerce, 5% pour prestations de service" : "Rate: 2% commerce, 5% services",
              language === "fr" ? "Paiement en 3 acomptes: février, avril, juin" : "Payment in 3 installments: February, April, June",
              language === "fr" ? "Retirer votre vignette à afficher dans votre établissement" : "Get your sticker to display in your establishment"
            ]
          }
        ]
      };
    } else {
      return {
        regime: language === "fr" ? "Régime du Bénéfice Réel Simplifié" : "Simplified Real Profit Regime",
        legalFormRecommended: language === "fr" ? "SARL (Société à Responsabilité Limitée)" : "LLC (Limited Liability Company)",
        steps: [
          {
            title: language === "fr" ? "1. Rédaction des Statuts" : "1. Draft Articles of Association",
            items: [
              language === "fr" ? "Faire appel à un notaire ou avocat" : "Hire a notary or lawyer",
              language === "fr" ? "Définir le capital social (minimum 1 000 000 FCFA)" : "Define share capital (minimum 1,000,000 FCFA)",
              language === "fr" ? "Désigner les gérants et associés" : "Appoint managers and partners"
            ]
          },
          {
            title: language === "fr" ? "2. Enregistrement APIX" : "2. APIX Registration",
            items: [
              language === "fr" ? "Guichet unique à l'APIX" : "One-stop shop at APIX",
              language === "fr" ? "Documents: statuts, CNI gérants, bail, PV AG constitutive" : "Documents: articles, manager IDs, lease, founding minutes",
              language === "fr" ? "Obtention: NINEA, RC, agrément" : "Obtain: NINEA, RC, approval"
            ]
          },
          {
            title: language === "fr" ? "3. Ouverture Compte Bancaire Professionnel" : "3. Open Business Bank Account",
            items: [
              language === "fr" ? "Choisir une banque commerciale" : "Choose a commercial bank",
              language === "fr" ? "Déposer le capital social" : "Deposit share capital",
              language === "fr" ? "Documents: RC, NINEA, CNI gérants" : "Documents: RC, NINEA, manager IDs"
            ]
          },
          {
            title: language === "fr" ? "4. Déclarations et Cotisations" : "4. Declarations and Contributions",
            items: [
              language === "fr" ? "Tenir une comptabilité régulière" : "Maintain regular accounting",
              language === "fr" ? "Déclarations mensuelles TVA si applicable" : "Monthly VAT declarations if applicable",
              language === "fr" ? "Déclaration annuelle IS avant le 30 avril" : "Annual corporate tax declaration before April 30",
              language === "fr" ? "Affiliation employés à IPRES/CSS" : "Employee affiliation to IPRES/CSS"
            ]
          }
        ]
      };
    }
  };

  const recommendation = showResults ? getRecommendation() : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {language === "fr" ? "Guide de Formalisation" : "Formalization Guide"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === "fr" 
              ? "Transformez votre activité informelle en entreprise formelle. Suivez notre parcours guidé pour découvrir les démarches adaptées à votre situation."
              : "Transform your informal activity into a formal business. Follow our guided path to discover the steps suited to your situation."}
          </p>
        </div>

        {!showResults ? (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {language === "fr" ? "Questionnaire de Profil" : "Profile Questionnaire"}
              </CardTitle>
              <CardDescription>
                {language === "fr"
                  ? "Répondez à quelques questions pour obtenir un parcours personnalisé"
                  : "Answer a few questions to get a personalized path"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="businessType">
                    {language === "fr" ? "Type d'activité" : "Business Type"}
                  </Label>
                  <Select value={businessType} onValueChange={(value) => setBusinessType(value as BusinessType)}>
                    <SelectTrigger id="businessType">
                      <SelectValue placeholder={language === "fr" ? "Sélectionnez votre activité" : "Select your activity"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commerce">{language === "fr" ? "Commerce (achat-revente)" : "Commerce (buy-sell)"}</SelectItem>
                      <SelectItem value="artisanat">{language === "fr" ? "Artisanat (menuiserie, couture, etc.)" : "Craft (carpentry, sewing, etc.)"}</SelectItem>
                      <SelectItem value="service">{language === "fr" ? "Service (consultation, réparation, etc.)" : "Service (consulting, repair, etc.)"}</SelectItem>
                      <SelectItem value="agriculture">{language === "fr" ? "Agriculture" : "Agriculture"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="turnover">
                    {language === "fr" ? "Chiffre d'affaires annuel estimé (FCFA)" : "Estimated annual turnover (FCFA)"}
                  </Label>
                  <Input
                    id="turnover"
                    type="number"
                    placeholder="Ex: 25000000"
                    value={turnover}
                    onChange={(e) => setTurnover(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees">
                    {language === "fr" ? "Nombre d'employés" : "Number of employees"}
                  </Label>
                  <Input
                    id="employees"
                    type="number"
                    placeholder="0"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>{language === "fr" ? "Forme juridique souhaitée" : "Desired legal form"}</Label>
                  <RadioGroup value={legalForm} onValueChange={(value) => setLegalForm(value as LegalForm)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individuelle" id="individuelle" />
                      <Label htmlFor="individuelle" className="font-normal cursor-pointer">
                        {language === "fr" ? "Entreprise Individuelle" : "Sole Proprietorship"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sarl" id="sarl" />
                      <Label htmlFor="sarl" className="font-normal cursor-pointer">
                        {language === "fr" ? "SARL (Société à Responsabilité Limitée)" : "LLC (Limited Liability Company)"}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gie" id="gie" />
                      <Label htmlFor="gie" className="font-normal cursor-pointer">
                        {language === "fr" ? "GIE (Groupement d'Intérêt Économique)" : "GIE (Economic Interest Group)"}
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {language === "fr" ? "Obtenir mon parcours personnalisé" : "Get my personalized path"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-2 border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  {language === "fr" ? "Recommandations pour votre profil" : "Recommendations for your profile"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">
                    {language === "fr" ? "Régime fiscal recommandé:" : "Recommended tax regime:"}
                  </h3>
                  <p className="text-lg text-primary font-medium">{recommendation?.regime}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    {language === "fr" ? "Forme juridique recommandée:" : "Recommended legal form:"}
                  </h3>
                  <p className="text-lg text-primary font-medium">{recommendation?.legalFormRecommended}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {language === "fr" ? "Étapes de formalisation" : "Formalization steps"}
              </h2>
              {recommendation?.steps.map((step, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {index === 0 && <Building2 className="h-5 w-5 text-primary" />}
                      {index === 1 && <FileText className="h-5 w-5 text-primary" />}
                      {index === 2 && <Users className="h-5 w-5 text-primary" />}
                      {index === 3 && <ClipboardCheck className="h-5 w-5 text-primary" />}
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle>
                  {language === "fr" ? "Besoin d'aide ?" : "Need help?"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {language === "fr"
                    ? "Pour des questions spécifiques ou un accompagnement personnalisé, vous pouvez:"
                    : "For specific questions or personalized support, you can:"}
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                    <span>
                      {language === "fr"
                        ? "Consulter notre Assistant IA pour des réponses immédiates"
                        : "Consult our AI Assistant for immediate answers"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                    <span>
                      {language === "fr"
                        ? "Contacter le Centre des Impôts de votre localité"
                        : "Contact your local Tax Center"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1" />
                    <span>
                      {language === "fr"
                        ? "Visiter l'APIX pour le guichet unique de création d'entreprise"
                        : "Visit APIX for one-stop business creation"}
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Button
              onClick={() => {
                setShowResults(false);
                setBusinessType("");
                setTurnover("");
                setEmployees("");
                setLegalForm("");
              }}
              variant="outline"
              className="w-full"
            >
              {language === "fr" ? "Recommencer" : "Start over"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
