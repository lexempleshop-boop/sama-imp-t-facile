import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Chatbot() {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">{t("chatbotTitle", language)}</CardTitle>
              <CardDescription className="text-lg">{t("inDevelopment", language)}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                {t("comingSoon", language)}
              </p>
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-lg bg-muted/50 text-left">
                  <h3 className="font-semibold mb-2">
                    {language === "fr" && "Fonctionnalités à venir :"}
                    {language === "en" && "Coming features:"}
                    {language === "wo" && "Li ñuy def :"}
                    {language === "ff" && "Ko mbiyɗaa:"}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      {language === "fr" && "Questions en langage naturel"}
                      {language === "en" && "Natural language questions"}
                      {language === "wo" && "Xalaatu ci làkk bu yaatu"}
                      {language === "ff" && "Mbelu e ɗemngal ganndal"}
                    </li>
                    <li>
                      {language === "fr" && "Support multilingue (Français, Wolof, Pulaar)"}
                      {language === "en" && "Multilingual support (French, Wolof, Pulaar)"}
                      {language === "wo" && "Dimbali làkk yu bari (Français, Wolof, Pulaar)"}
                      {language === "ff" && "Wallitde ɗemɗe keewɗe (Français, Wolof, Pulaar)"}
                    </li>
                    <li>
                      {language === "fr" && "Réponses personnalisées"}
                      {language === "en" && "Personalized answers"}
                      {language === "wo" && "Jaabawool yam"}
                      {language === "ff" && "Jaabawol momtum maa"}
                    </li>
                    <li>
                      {language === "fr" && "Guide de formalisation"}
                      {language === "en" && "Formalization guide"}
                      {language === "wo" && "Guide formalisation"}
                      {language === "ff" && "Jaabawgol formalisation"}
                    </li>
                  </ul>
                </div>
              </div>
              <Button onClick={() => navigate("/")} variant="outline" className="mt-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("backToHome", language)}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
