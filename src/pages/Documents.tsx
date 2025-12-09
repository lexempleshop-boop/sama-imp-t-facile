import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Folder,
  Trash2,
  Eye,
} from "lucide-react";

type DocumentStatus = "pending" | "validated" | "rejected" | "needs_correction";

interface Document {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  document_category: string;
  status: DocumentStatus;
  admin_notes: string | null;
  created_at: string;
}

const documentCategories = [
  { value: "cni", label: { fr: "Carte Nationale d'Identité", en: "National ID Card" } },
  { value: "ninea", label: { fr: "NINEA", en: "NINEA" } },
  { value: "rc", label: { fr: "Registre du Commerce", en: "Commercial Register" } },
  { value: "bail", label: { fr: "Bail Commercial", en: "Commercial Lease" } },
  { value: "certificat_residence", label: { fr: "Certificat de Résidence", en: "Residence Certificate" } },
  { value: "statuts", label: { fr: "Statuts de l'Entreprise", en: "Company Statutes" } },
  { value: "attestation_fiscale", label: { fr: "Attestation Fiscale", en: "Tax Attestation" } },
  { value: "autre", label: { fr: "Autre Document", en: "Other Document" } },
];

const statusConfig: Record<DocumentStatus, { icon: React.ElementType; color: string; label: { fr: string; en: string } }> = {
  pending: { icon: Clock, color: "bg-amber-500/10 text-amber-600 border-amber-500/30", label: { fr: "En attente", en: "Pending" } },
  validated: { icon: CheckCircle2, color: "bg-success/10 text-success border-success/30", label: { fr: "Validé", en: "Validated" } },
  rejected: { icon: XCircle, color: "bg-destructive/10 text-destructive border-destructive/30", label: { fr: "Refusé", en: "Rejected" } },
  needs_correction: { icon: AlertTriangle, color: "bg-orange-500/10 text-orange-600 border-orange-500/30", label: { fr: "À corriger", en: "Needs Correction" } },
};

export default function Documents() {
  const { language } = useLanguage();
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchDocuments();
    }
  }, [user, authLoading, navigate]);

  const fetchDocuments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !selectedFile || !selectedCategory) {
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        description: language === "fr"
          ? "Veuillez sélectionner un fichier et une catégorie"
          : "Please select a file and category",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}/formalization/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from("documents").insert({
        user_id: user.id,
        file_name: selectedFile.name,
        file_path: fileName,
        file_type: selectedFile.type,
        document_category: selectedCategory,
        status: "pending",
      });

      if (dbError) throw dbError;

      toast({
        title: language === "fr" ? "Document uploadé" : "Document uploaded",
        description: language === "fr"
          ? "Votre document a été ajouté et sera traité prochainement"
          : "Your document has been added and will be processed soon",
      });

      setSelectedFile(null);
      setSelectedCategory("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDocuments();
    } catch (err) {
      console.error("Upload error:", err);
      toast({
        title: language === "fr" ? "Erreur d'upload" : "Upload error",
        description: language === "fr"
          ? "Une erreur est survenue lors de l'upload"
          : "An error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string, filePath: string) => {
    try {
      await supabase.storage.from("documents").remove([filePath]);
      await supabase.from("documents").delete().eq("id", docId);

      toast({
        title: language === "fr" ? "Document supprimé" : "Document deleted",
      });

      fetchDocuments();
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: language === "fr" ? "Erreur" : "Error",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getCategoryLabel = (value: string) => {
    const cat = documentCategories.find((c) => c.value === value);
    return cat ? cat.label[language === "fr" ? "fr" : "en"] : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Folder className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === "fr" ? "Espace Documents" : "Document Space"}
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {language === "fr" ? "Mes Documents" : "My Documents"}
          </h1>
          <p className="text-muted-foreground">
            {language === "fr"
              ? "Uploadez vos documents pour compléter votre dossier de formalisation"
              : "Upload your documents to complete your formalization file"}
          </p>
        </div>

        {/* Upload Section */}
        <Card className="border-2 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              {language === "fr" ? "Nouveau Document" : "New Document"}
            </CardTitle>
            <CardDescription>
              {language === "fr"
                ? "Uploadez un document en sélectionnant sa catégorie"
                : "Upload a document by selecting its category"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={language === "fr" ? "Type de document" : "Document type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {documentCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label[language === "fr" ? "fr" : "en"]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div
                className="border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors flex items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileSelect}
                />
                {selectedFile ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">
                      {language === "fr" ? "Choisir un fichier" : "Choose a file"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedCategory || isUploading}
              className="w-full"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              {language === "fr" ? "Uploader le document" : "Upload document"}
            </Button>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {language === "fr" ? "Documents Uploadés" : "Uploaded Documents"}
              <Badge variant="secondary" className="ml-2">
                {documents.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>
                  {language === "fr"
                    ? "Aucun document uploadé"
                    : "No documents uploaded"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => {
                  const StatusIcon = statusConfig[doc.status].icon;
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                    >
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{doc.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {getCategoryLabel(doc.document_category)} •{" "}
                          {new Date(doc.created_at).toLocaleDateString()}
                        </p>
                        {doc.admin_notes && doc.status === "needs_correction" && (
                          <p className="text-xs text-orange-600 mt-1">{doc.admin_notes}</p>
                        )}
                      </div>
                      <Badge className={`${statusConfig[doc.status].color} border`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[doc.status].label[language === "fr" ? "fr" : "en"]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(doc.id, doc.file_path)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
