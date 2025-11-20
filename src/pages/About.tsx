import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Heart, Users } from "lucide-react";

export default function About() {
  const { language } = useLanguage();

  const content = {
    fr: {
      vision: "Notre Vision",
      visionText: "Démocratiser l'accès à l'information fiscale et transformer le Code Général des Impôts en un outil accessible à tous les citoyens sénégalais, quels que soient leur niveau d'éducation ou leur langue maternelle.",
      values: "Nos Valeurs",
      inclusion: "Inclusion",
      inclusionText: "Rendre la fiscalité accessible à tous, y compris au secteur informel",
      transparency: "Transparence",
      transparencyText: "Expliquer clairement les obligations fiscales et leur utilité",
      citizenship: "Citoyenneté",
      citizenshipText: "Renforcer le contrat social par la compréhension et la participation",
    },
    en: {
      vision: "Our Vision",
      visionText: "Democratize access to tax information and transform the General Tax Code into a tool accessible to all Senegalese citizens, regardless of their education level or mother tongue.",
      values: "Our Values",
      inclusion: "Inclusion",
      inclusionText: "Make taxation accessible to all, including the informal sector",
      transparency: "Transparency",
      transparencyText: "Clearly explain tax obligations and their usefulness",
      citizenship: "Citizenship",
      citizenshipText: "Strengthen the social contract through understanding and participation",
    },
    wo: {
      vision: "Suñu Vision",
      visionText: "Démocratiser l'accès à l'information fiscale te jël Code Général des Impôts ci outil bu ñuy mën jëfandikoo ci citoyen yu Senegaal yépp.",
      values: "Suñu Valeurs",
      inclusion: "Inclusion",
      inclusionText: "Jëfandikoo fiscalité ci ñépp yépp, ak secteur informel",
      transparency: "Xëfandaay",
      transparencyText: "Feeñ bu baax obligations fiscales ak sa utilisé",
      citizenship: "Citoyenneté",
      citizenshipText: "Nata contrat social ci xam-xam te walluwaat",
    },
    ff: {
      vision: "Vision amen",
      visionText: "Démocratiser l'accès à l'information fiscale e jeyaa Code Général des Impôts e outil ɓurɗo yimɓe Senegal fof mbaawɗo huutoraade.",
      values: "Values amen",
      inclusion: "Inclusion",
      inclusionText: "Waɗde fiscalité heɓde kala neɗɗo, e secteur informel",
      transparency: "Yaajde",
      transparencyText: "Ɓeydude seniiɗo obligations fiscales e huutoraande maɓɓe",
      citizenship: "Citoyenneté",
      citizenshipText: "Mooftan contrat social e faamde e wallitde",
    },
  };

  const localContent = content[language] || content.fr;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">{t("aboutTitle", language)}</h1>
            <p className="text-xl text-muted-foreground">{t("tagline", language)}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                {t("mission", language)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{t("missionText", language)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                {localContent.vision}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{localContent.visionText}</p>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Users className="h-6 w-6" />
              {localContent.values}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{localContent.inclusion}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{localContent.inclusionText}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{localContent.transparency}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{localContent.transparencyText}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{localContent.citizenship}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{localContent.citizenshipText}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
