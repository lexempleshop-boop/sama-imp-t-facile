import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, MessageCircle, TrendingUp, Users, Shield, Lightbulb } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export default function Index() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      titleKey: "simulator",
      descriptionFr: "Calculez votre impôt en quelques clics avec notre simulateur précis",
      descriptionEn: "Calculate your taxes in a few clicks with our accurate simulator",
      descriptionWo: "Kajoor sa impôt ci benn cliquer ak simulateur bu baax",
      descriptionFf: "Limtu impôt maa e clik keewɗe e simulateur amen",
    },
    {
      icon: MessageCircle,
      titleKey: "chatbot",
      descriptionFr: "Posez vos questions fiscales à notre assistant IA multilingue",
      descriptionEn: "Ask your tax questions to our multilingual AI assistant",
      descriptionWo: "Laaj sa xalaatu impôt ci assistant IA bi",
      descriptionFf: "Naamna mbelu impôt maa e assistant IA amen",
    },
    {
      icon: Users,
      titleFr: "Inclusion Fiscale",
      titleEn: "Tax Inclusion",
      titleWo: "Inclusion Fiscale",
      titleFf: "Inclusion Fiscale",
      descriptionFr: "Accompagner le secteur informel vers la formalisation",
      descriptionEn: "Supporting the informal sector towards formalization",
      descriptionWo: "Walluwaat secteur informel ci formalisation",
      descriptionFf: "Wallitde secteur informel e formalisation",
    },
    {
      icon: Shield,
      titleFr: "Transparence",
      titleEn: "Transparency",
      titleWo: "Xëfandaay",
      titleFf: "Yaajde",
      descriptionFr: "Comprendre où va votre contribution fiscale",
      descriptionEn: "Understand where your tax contribution goes",
      descriptionWo: "Xam fan sa contribution fiscale di dem",
      descriptionFf: "Faamu ɗo contribution maa yaha",
    },
    {
      icon: TrendingUp,
      titleFr: "Développement",
      titleEn: "Development",
      titleWo: "Yoneent",
      titleFf: "Yurnde",
      descriptionFr: "Contribuer au développement de votre communauté",
      descriptionEn: "Contribute to your community's development",
      descriptionWo: "Walluwaat ci yoneent sa réew",
      descriptionFf: "Wallitde e yurnde leydi maa",
    },
    {
      icon: Lightbulb,
      titleFr: "Éducation",
      titleEn: "Education",
      titleWo: "Janngaleelu",
      titleFf: "Daartol",
      descriptionFr: "Apprendre et comprendre vos obligations fiscales",
      descriptionEn: "Learn and understand your tax obligations",
      descriptionWo: "Jàng te xam sa obligations fiscales",
      descriptionFf: "Jango e faamu obligations maa",
    },
  ];

  const getFeatureText = (feature: any, key: string) => {
    const langKey = `${key}${language.charAt(0).toUpperCase() + language.slice(1)}`;
    return feature[langKey] || feature[`${key}Fr`] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-4 sm:mb-6 px-4">
              {t("heroTitle", language)}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4 px-4">
              {t("tagline", language)}
            </p>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-4">
              {t("description", language)}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" onClick={() => navigate("/simulator")} className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t("startSimulation", language)}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/chatbot")} className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto">
                <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {t("talkToAssistant", language)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3 sm:mb-4 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg sm:text-xl font-semibold text-card-foreground">
                    {feature.titleKey ? t(feature.titleKey, language) : getFeatureText(feature, "title")}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {getFeatureText(feature, "description")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 px-4">
            {language === "fr" && "Prêt à calculer votre impôt ?"}
            {language === "en" && "Ready to calculate your taxes?"}
            {language === "wo" && "Jëkk ngir kajoor sa impôt ?"}
            {language === "ff" && "A heɓii limtude impôt maa?"}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            {language === "fr" && "Utilisez notre simulateur gratuit pour estimer votre contribution fiscale."}
            {language === "en" && "Use our free simulator to estimate your tax contribution."}
            {language === "wo" && "Jëfandikoo simulateur bu njël ngir xam sa contribution fiscale."}
            {language === "ff" && "Huutoro simulateur amen ngam anndugo contribution maa."}
          </p>
          <Button size="lg" onClick={() => navigate("/simulator")} className="text-base sm:text-lg px-6 sm:px-8">
            <Calculator className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            {t("startSimulation", language)}
          </Button>
        </div>
      </section>
    </div>
  );
}
