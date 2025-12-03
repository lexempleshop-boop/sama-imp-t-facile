import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, ArrowLeft, Loader2, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormData {
    firstName: string;
    lastName: string;
    phone: string;
    paymentMethod: "wave" | "orange" | "";
    paymentPhone: string;
    cni: File | null;
    certificatResidence: File | null;
    bailCommercial: File | null;
}

export function OnlineRegistrationForm({ onBack }: { onBack: () => void }) {
    const { language } = useLanguage();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState<RegistrationFormData>({
        firstName: "",
        lastName: "",
        phone: "",
        paymentMethod: "",
        paymentPhone: "",
        cni: null,
        certificatResidence: null,
        bailCommercial: null,
    });

    const handleFileChange = (field: keyof RegistrationFormData, file: File | null) => {
        setFormData(prev => ({ ...prev, [field]: file }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.phone) {
            toast({
                title: language === "fr" ? "Erreur" : "Error",
                description: language === "fr"
                    ? "Veuillez remplir tous les champs obligatoires"
                    : "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (!formData.cni || !formData.certificatResidence || !formData.bailCommercial) {
            toast({
                title: language === "fr" ? "Documents manquants" : "Missing documents",
                description: language === "fr"
                    ? "Veuillez télécharger tous les documents requis"
                    : "Please upload all required documents",
                variant: "destructive",
            });
            return;
        }

        if (!formData.paymentMethod || !formData.paymentPhone) {
            toast({
                title: language === "fr" ? "Informations de paiement manquantes" : "Missing payment information",
                description: language === "fr"
                    ? "Veuillez sélectionner un mode de paiement et entrer votre numéro"
                    : "Please select a payment method and enter your number",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            toast({
                title: language === "fr" ? "Demande envoyée !" : "Request sent!",
                description: language === "fr"
                    ? "Votre demande d'inscription a été envoyée avec succès. Vous recevrez une confirmation par téléphone."
                    : "Your registration request has been sent successfully. You will receive a confirmation by phone.",
            });
        }, 2000);
    };

    if (isSubmitted) {
        return (
            <Card className="border-2 border-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <CheckCircle2 className="h-6 w-6" />
                        {language === "fr" ? "Demande envoyée avec succès !" : "Request sent successfully!"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-primary/5 p-6 rounded-lg space-y-3">
                        <p className="font-medium">
                            {language === "fr"
                                ? "Merci pour votre demande d'inscription au Registre du Commerce."
                                : "Thank you for your Commerce Registry registration request."}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {language === "fr"
                                ? "Votre dossier est en cours de traitement. Un agent vous contactera dans les 48 heures pour finaliser votre inscription."
                                : "Your application is being processed. An agent will contact you within 48 hours to finalize your registration."}
                        </p>
                        <div className="pt-4 space-y-2">
                            <p className="text-sm font-semibold">
                                {language === "fr" ? "Prochaines étapes :" : "Next steps:"}
                            </p>
                            <ul className="text-sm space-y-1 text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{language === "fr" ? "Vérification de vos documents" : "Document verification"}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{language === "fr" ? "Appel téléphonique de confirmation" : "Confirmation phone call"}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{language === "fr" ? "Paiement des frais (25 000 FCFA)" : "Fee payment (25,000 FCFA)"}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>{language === "fr" ? "Réception de votre numéro RC" : "Receipt of your RC number"}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Button onClick={onBack} variant="outline" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {language === "fr" ? "Retour au guide" : "Back to guide"}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <Button onClick={onBack} variant="ghost" size="sm" className="w-fit mb-2">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {language === "fr" ? "Retour" : "Back"}
                </Button>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {language === "fr" ? "Inscription en ligne au Registre du Commerce" : "Online Commerce Registry Registration"}
                </CardTitle>
                <CardDescription>
                    {language === "fr"
                        ? "Remplissez le formulaire ci-dessous pour soumettre votre demande d'inscription sans vous déplacer"
                        : "Fill out the form below to submit your registration request without traveling"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</div>
                            {language === "fr" ? "Informations personnelles" : "Personal information"}
                        </h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">
                                    {language === "fr" ? "Prénom" : "First name"} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                    placeholder={language === "fr" ? "Votre prénom" : "Your first name"}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">
                                    {language === "fr" ? "Nom" : "Last name"} <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                    placeholder={language === "fr" ? "Votre nom" : "Your last name"}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                {language === "fr" ? "Numéro de téléphone" : "Phone number"} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder={language === "fr" ? "Ex: 77 123 45 67" : "Ex: 77 123 45 67"}
                                required
                            />
                        </div>
                    </div>

                    {/* Documents Upload */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</div>
                            {language === "fr" ? "Documents requis" : "Required documents"}
                        </h3>

                        {/* CNI */}
                        <div className="space-y-2">
                            <Label htmlFor="cni">
                                {language === "fr" ? "Carte Nationale d'Identité (CNI)" : "National Identity Card"} <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    id="cni"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange('cni', e.target.files?.[0] || null)}
                                    className="cursor-pointer flex-1"
                                />
                                {formData.cni && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 self-center" />}
                            </div>
                            {formData.cni && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {formData.cni.name}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {language === "fr"
                                    ? "💡 Astuce: Sur mobile, vous pouvez scanner directement avec votre caméra"
                                    : "💡 Tip: On mobile, you can scan directly with your camera"}
                            </p>
                        </div>

                        {/* Certificat de résidence */}
                        <div className="space-y-2">
                            <Label htmlFor="certificat">
                                {language === "fr" ? "Certificat de résidence" : "Residence certificate"} <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    id="certificat"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange('certificatResidence', e.target.files?.[0] || null)}
                                    className="cursor-pointer flex-1"
                                />
                                {formData.certificatResidence && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 self-center" />}
                            </div>
                            {formData.certificatResidence && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {formData.certificatResidence.name}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {language === "fr"
                                    ? "💡 Astuce: Sur mobile, vous pouvez scanner directement avec votre caméra"
                                    : "💡 Tip: On mobile, you can scan directly with your camera"}
                            </p>
                        </div>

                        {/* Bail commercial */}
                        <div className="space-y-2">
                            <Label htmlFor="bail">
                                {language === "fr" ? "Bail commercial" : "Commercial lease"} <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    id="bail"
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => handleFileChange('bailCommercial', e.target.files?.[0] || null)}
                                    className="cursor-pointer flex-1"
                                />
                                {formData.bailCommercial && <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 self-center" />}
                            </div>
                            {formData.bailCommercial && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    {formData.bailCommercial.name}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {language === "fr"
                                    ? "💡 Vous pouvez prendre une photo ou choisir un fichier existant"
                                    : "💡 You can take a photo or choose an existing file"}
                            </p>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</div>
                            {language === "fr" ? "Paiement des frais d'inscription" : "Registration fee payment"}
                        </h3>

                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                            <p className="text-sm font-semibold mb-2">
                                {language === "fr" ? "Montant à payer: 25 000 FCFA" : "Amount to pay: 25,000 FCFA"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {language === "fr"
                                    ? "Le paiement sera effectué immédiatement lors de l'envoi du formulaire"
                                    : "Payment will be processed immediately upon form submission"}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>
                                {language === "fr" ? "Mode de paiement" : "Payment method"} <span className="text-destructive">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "wave" }))}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.paymentMethod === "wave"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Smartphone className="h-8 w-8 text-blue-600" />
                                        <span className="font-semibold text-sm">Wave</span>
                                        {formData.paymentMethod === "wave" && (
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "orange" }))}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.paymentMethod === "orange"
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                        }`}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <Smartphone className="h-8 w-8 text-orange-600" />
                                        <span className="font-semibold text-sm">Orange Money</span>
                                        {formData.paymentMethod === "orange" && (
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="paymentPhone">
                                {language === "fr" ? "Numéro de téléphone pour le paiement" : "Phone number for payment"} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="paymentPhone"
                                type="tel"
                                value={formData.paymentPhone}
                                onChange={(e) => setFormData(prev => ({ ...prev, paymentPhone: e.target.value }))}
                                placeholder={language === "fr" ? "Ex: 77 123 45 67" : "Ex: 77 123 45 67"}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                {language === "fr"
                                    ? "Assurez-vous que ce numéro est associé à votre compte Wave ou Orange Money"
                                    : "Make sure this number is associated with your Wave or Orange Money account"}
                            </p>
                        </div>
                    </div>

                    {/* Info box */}
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <p className="text-sm font-medium">
                            {language === "fr" ? "📋 Informations importantes" : "📋 Important information"}
                        </p>
                        <ul className="text-xs space-y-1 text-muted-foreground">
                            <li>• {language === "fr" ? "Formats acceptés: PDF, JPG, PNG" : "Accepted formats: PDF, JPG, PNG"}</li>
                            <li>• {language === "fr" ? "Taille maximale par fichier: 5 MB" : "Maximum file size: 5 MB"}</li>
                            <li>• {language === "fr" ? "Frais d'inscription: 25 000 FCFA (à payer après validation)" : "Registration fee: 25,000 FCFA (payable after validation)"}</li>
                            <li>• {language === "fr" ? "Délai de traitement: 48-72 heures" : "Processing time: 48-72 hours"}</li>
                        </ul>
                    </div>

                    {/* Submit button */}
                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {language === "fr" ? "Envoi en cours..." : "Sending..."}
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                {language === "fr" ? "Envoyer ma demande" : "Submit my request"}
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
