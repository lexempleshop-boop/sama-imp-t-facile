import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from "react-router-dom";
import { Calculator, MessageCircle, TrendingUp, Users, Shield, Lightbulb, FileCheck } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import Autoplay from "embla-carousel-autoplay";

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
      link: "/simulator"
    },
    {
      icon: MessageCircle,
      titleKey: "chatbot",
      descriptionFr: "Posez vos questions fiscales à notre assistant IA multilingue",
      descriptionEn: "Ask your tax questions to our multilingual AI assistant",
      descriptionWo: "Laaj sa xalaatu impôt ci assistant IA bi",
      descriptionFf: "Naamna mbelu impôt maa e assistant IA amen",
      link: "/chatbot"
    },
    {
      icon: FileCheck,
      titleFr: "Formalisation",
      titleEn: "Formalization",
      titleWo: "Formalisation",
      titleFf: "Formalisation",
      descriptionFr: "Guide personnalisé pour formaliser votre activité",
      descriptionEn: "Personalized guide to formalize your business",
      descriptionWo: "Guide bu personal ngir formaliser sa liggéey",
      descriptionFf: "Jaaynirde personal ngam formaliser golle maa",
      link: "/formalization"
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
      link: "/about"
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
      link: "/about"
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
      link: "/about"
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
      link: "/about"
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

      {/* Features Carousel Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-primary">
            {language === "fr" && "Nos Services"}
            {language === "en" && "Our Services"}
            {language === "wo" && "Ñu Services"}
            {language === "ff" && "Ballal Amen"}
          </h2>
          <div className="max-w-6xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 3500,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <CarouselItem key={index} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                        <Card 
                          className="h-full hover:shadow-lg transition-all cursor-pointer hover:scale-105"
                          onClick={() => navigate(feature.link)}
                        >
                          <CardHeader className="text-center pb-3">
                            <div className="flex justify-center mb-3">
                              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                              </div>
                            </div>
                            <CardTitle className="text-lg sm:text-xl mb-2">
                              {feature.titleKey ? t(feature.titleKey, language) : getFeatureText(feature, "title")}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {getFeatureText(feature, "description")}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-center pb-4">
                            <Button variant="ghost" size="sm" className="text-primary">
                              {language === "fr" ? "Découvrir →" : language === "en" ? "Discover →" : language === "wo" ? "Xam →" : "Ɓeydu →"}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="-left-12" />
                <CarouselNext className="-right-12" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-background py-12 sm:py-16">
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
