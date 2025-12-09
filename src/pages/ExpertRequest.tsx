import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  GraduationCap,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";

type RequestStatus = "none" | "pending" | "approved" | "rejected";

export default function ExpertRequest() {
  const { language } = useLanguage();
  const { user, isFiscalist, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("none");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [professionalCard, setProfessionalCard] = useState<File | null>(null);
  const [fiscalAttestation, setFiscalAttestation] = useState<File | null>(null);
  const [nineaDoc, setNineaDoc] = useState<File | null>(null);

  const professionalCardRef = useRef<HTMLInputElement>(null);
  const fiscalAttestationRef = useRef<HTMLInputElement>(null);
  const nineaRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      setEmail(user.email || "");
      checkExistingRequest();
    }
  }, [user, authLoading, navigate]);

  const checkExistingRequest = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("expert_requests")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setRequestStatus(data.status as RequestStatus);
      }
    } catch (err) {
      // No existing request
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!professionalCard) {
      toast({
        title: language === "fr" ? "Document requis" : "Required document",
        description: language === "fr"
          ? "Veuillez uploader votre carte professionnelle"
          : "Please upload your professional card",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files
      const professionalCardPath = await uploadFile(professionalCard, "expert-requests");
      const fiscalAttestationPath = fiscalAttestation
        ? await uploadFile(fiscalAttestation, "expert-requests")
        : null;
      const nineaPath = nineaDoc
        ? await uploadFile(nineaDoc, "expert-requests")
        : null;

      if (!professionalCardPath) {
        throw new Error("Failed to upload professional card");
      }

      // Create expert request
      const { error } = await supabase.from("expert_requests").insert({
        user_id: user.id,
        full_name: fullName,
        email,
        phone,
        professional_card_path: professionalCardPath,
        fiscal_attestation_path: fiscalAttestationPath,
        ninea_path: nineaPath,
        additional_info: additionalInfo,
        status: "pending",
      });

      if (error) throw error;

      setRequestStatus("pending");
      toast({
        title: language === "fr" ? "Demande envoyée" : "Request sent",
        description: language === "fr"
          ? "Votre demande d'accès expert a été envoyée. Nous la traiterons dans les plus brefs délais."
          : "Your expert access request has been sent. We will process it as soon as possible.",
      });
    } catch (err) {
      console.error("Error submitting request:", err);
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: language === "fr"
          ? "Une erreur est survenue lors de l'envoi de votre demande"
          : "An error occurred while sending your request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isFiscalist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-lg text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
            <ShieldCheck className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {language === "fr" ? "Accès Expert Actif" : "Expert Access Active"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === "fr"
              ? "Vous disposez déjà d'un accès expert. Profitez de toutes les fonctionnalités avancées du chatbot."
              : "You already have expert access. Enjoy all advanced chatbot features."}
          </p>
          <Button onClick={() => navigate("/chatbot")}>
            {language === "fr" ? "Accéder au Chatbot Expert" : "Access Expert Chatbot"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === "fr" ? "Espace Fiscalistes" : "Fiscalist Space"}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {language === "fr" ? "Demande d'Accès Expert" : "Expert Access Request"}
          </h1>
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Obtenez un accès privilégié pour enrichir l'IA avec vos connaissances fiscales"
              : "Get privileged access to enrich the AI with your tax knowledge"}
          </p>
        </div>

        {requestStatus === "pending" ? (
          <Card className="border-2 border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6 text-center">
              <Clock className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {language === "fr" ? "Demande en cours de traitement" : "Request being processed"}
              </h2>
              <p className="text-muted-foreground">
                {language === "fr"
                  ? "Votre demande a été reçue et est en cours de vérification. Nous vous notifierons dès qu'elle sera traitée."
                  : "Your request has been received and is being verified. We will notify you once it's processed."}
              </p>
            </CardContent>
          </Card>
        ) : requestStatus === "rejected" ? (
          <Card className="border-2 border-destructive/30 bg-destructive/5">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {language === "fr" ? "Demande refusée" : "Request rejected"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "fr"
                  ? "Votre demande n'a pas pu être validée. Veuillez vérifier vos documents et réessayer."
                  : "Your request could not be validated. Please check your documents and try again."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {language === "fr" ? "Formulaire de Demande" : "Request Form"}
              </CardTitle>
              <CardDescription>
                {language === "fr"
                  ? "Remplissez ce formulaire et uploadez les documents justificatifs"
                  : "Fill out this form and upload supporting documents"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {language === "fr" ? "Nom complet *" : "Full name *"}
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    {language === "fr" ? "Téléphone" : "Phone"}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+221 77 123 45 67"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">
                    {language === "fr" ? "Documents justificatifs" : "Supporting documents"}
                  </h3>

                  {/* Professional Card */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => professionalCardRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={professionalCardRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setProfessionalCard(e.target.files?.[0] || null)}
                    />
                    <div className="flex items-center gap-3">
                      {professionalCard ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {language === "fr" ? "Carte professionnelle *" : "Professional card *"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {professionalCard
                            ? professionalCard.name
                            : language === "fr"
                            ? "PDF, JPG ou PNG"
                            : "PDF, JPG or PNG"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fiscal Attestation */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fiscalAttestationRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fiscalAttestationRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFiscalAttestation(e.target.files?.[0] || null)}
                    />
                    <div className="flex items-center gap-3">
                      {fiscalAttestation ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {language === "fr" ? "Attestation fiscale" : "Fiscal attestation"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fiscalAttestation
                            ? fiscalAttestation.name
                            : language === "fr"
                            ? "PDF, JPG ou PNG (optionnel)"
                            : "PDF, JPG or PNG (optional)"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* NINEA */}
                  <div
                    className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => nineaRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={nineaRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setNineaDoc(e.target.files?.[0] || null)}
                    />
                    <div className="flex items-center gap-3">
                      {nineaDoc ? (
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">NINEA</p>
                        <p className="text-xs text-muted-foreground">
                          {nineaDoc
                            ? nineaDoc.name
                            : language === "fr"
                            ? "PDF, JPG ou PNG (optionnel)"
                            : "PDF, JPG or PNG (optional)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">
                    {language === "fr" ? "Informations complémentaires" : "Additional information"}
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder={
                      language === "fr"
                        ? "Décrivez votre expérience en fiscalité, vos spécialisations..."
                        : "Describe your tax experience, specializations..."
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <GraduationCap className="h-4 w-4 mr-2" />
                  )}
                  {language === "fr" ? "Soumettre ma demande" : "Submit my request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
