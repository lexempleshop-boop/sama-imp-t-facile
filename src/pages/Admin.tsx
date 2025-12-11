import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ShieldCheck,
  Users,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  BookOpen,
  AlertTriangle,
} from "lucide-react";

interface ExpertRequest {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  professional_card_path: string | null;
  fiscal_attestation_path: string | null;
  ninea_path: string | null;
  additional_info: string | null;
}

interface Contribution {
  id: string;
  user_id: string;
  contribution_type: string;
  title: string;
  content: string | null;
  file_path: string | null;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

interface Document {
  id: string;
  user_id: string;
  file_name: string;
  document_category: string;
  status: string;
  created_at: string;
  admin_notes: string | null;
}

export default function Admin() {
  const { language } = useLanguage();
  const { user, userRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [expertRequests, setExpertRequests] = useState<ExpertRequest[]>([]);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "admin")) {
      navigate("/");
      return;
    }

    if (user && userRole === "admin") {
      fetchAllData();
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchAllData = async () => {
    try {
      const [requestsRes, contributionsRes, documentsRes] = await Promise.all([
        supabase.from("expert_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("fiscalist_contributions").select("*").order("created_at", { ascending: false }),
        supabase.from("documents").select("*").order("created_at", { ascending: false }),
      ]);

      if (requestsRes.data) setExpertRequests(requestsRes.data);
      if (contributionsRes.data) setContributions(contributionsRes.data);
      if (documentsRes.data) setDocuments(documentsRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveExpert = async (request: ExpertRequest) => {
    try {
      // Update request status
      await supabase
        .from("expert_requests")
        .update({ status: "approved", reviewed_at: new Date().toISOString() })
        .eq("id", request.id);

      // Update user role to fiscalist
      await supabase
        .from("user_roles")
        .update({ role: "fiscalist" })
        .eq("user_id", request.user_id);

      toast({
        title: language === "fr" ? "Expert approuvé" : "Expert approved",
        description: language === "fr"
          ? `${request.full_name} a maintenant accès expert`
          : `${request.full_name} now has expert access`,
      });

      fetchAllData();
    } catch (err) {
      console.error("Error approving expert:", err);
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleRejectExpert = async (request: ExpertRequest) => {
    try {
      await supabase
        .from("expert_requests")
        .update({ 
          status: "rejected", 
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes[request.id] || null
        })
        .eq("id", request.id);

      toast({
        title: language === "fr" ? "Demande refusée" : "Request rejected",
      });

      fetchAllData();
    } catch (err) {
      console.error("Error rejecting expert:", err);
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleContributionAction = async (id: string, status: "validated" | "rejected") => {
    try {
      await supabase
        .from("fiscalist_contributions")
        .update({ 
          status, 
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes[id] || null
        })
        .eq("id", id);

      toast({
        title: status === "validated" 
          ? (language === "fr" ? "Contribution validée" : "Contribution validated")
          : (language === "fr" ? "Contribution refusée" : "Contribution rejected"),
      });

      fetchAllData();
    } catch (err) {
      console.error("Error updating contribution:", err);
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDocumentAction = async (id: string, status: "validated" | "rejected" | "needs_correction") => {
    try {
      await supabase
        .from("documents")
        .update({ 
          status, 
          admin_notes: adminNotes[id] || null
        })
        .eq("id", id);

      toast({
        title: language === "fr" ? "Document mis à jour" : "Document updated",
      });

      fetchAllData();
    } catch (err) {
      console.error("Error updating document:", err);
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  const pendingRequests = expertRequests.filter(r => r.status === "pending");
  const pendingContributions = contributions.filter(c => c.status === "pending");
  const pendingDocuments = documents.filter(d => d.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Administration</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            {language === "fr" ? "Tableau de Bord Admin" : "Admin Dashboard"}
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Demandes experts" : "Expert requests"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/20">
                  <BookOpen className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingContributions.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Contributions" : "Contributions"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <FileText className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingDocuments.length}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === "fr" ? "Documents" : "Documents"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="experts" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="experts" className="gap-2">
              <Users className="w-4 h-4" />
              {language === "fr" ? "Experts" : "Experts"}
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="contributions" className="gap-2">
              <BookOpen className="w-4 h-4" />
              {language === "fr" ? "Contributions" : "Contributions"}
              {pendingContributions.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingContributions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              {language === "fr" ? "Documents" : "Documents"}
              {pendingDocuments.length > 0 && (
                <Badge variant="destructive" className="ml-1">{pendingDocuments.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Expert Requests Tab */}
          <TabsContent value="experts">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Demandes d'Accès Expert" : "Expert Access Requests"}</CardTitle>
                <CardDescription>
                  {language === "fr" ? "Validez ou refusez les demandes des fiscalistes" : "Validate or reject fiscalist requests"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {expertRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {language === "fr" ? "Aucune demande" : "No requests"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {expertRequests.map((request) => (
                      <div key={request.id} className="p-4 rounded-xl border bg-card">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{request.full_name}</h3>
                              <Badge variant={
                                request.status === "pending" ? "secondary" :
                                request.status === "approved" ? "default" : "destructive"
                              }>
                                {request.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                                {request.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {request.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.email}</p>
                            {request.phone && <p className="text-sm text-muted-foreground">{request.phone}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(request.created_at).toLocaleDateString()}
                            </p>
                            {request.additional_info && (
                              <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{request.additional_info}</p>
                            )}
                          </div>
                          {request.status === "pending" && (
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveExpert(request)}
                                className="gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                {language === "fr" ? "Approuver" : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectExpert(request)}
                                className="gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                                {language === "fr" ? "Refuser" : "Reject"}
                              </Button>
                            </div>
                          )}
                        </div>
                        {request.status === "pending" && (
                          <Textarea
                            placeholder={language === "fr" ? "Notes admin (optionnel)" : "Admin notes (optional)"}
                            value={adminNotes[request.id] || ""}
                            onChange={(e) => setAdminNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                            className="mt-3"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributions Tab */}
          <TabsContent value="contributions">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Contributions des Fiscalistes" : "Fiscalist Contributions"}</CardTitle>
                <CardDescription>
                  {language === "fr" ? "Validez les contributions avant intégration à l'IA" : "Validate contributions before AI integration"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {contributions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {language === "fr" ? "Aucune contribution" : "No contributions"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {contributions.map((contrib) => (
                      <div key={contrib.id} className="p-4 rounded-xl border bg-card">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{contrib.title}</h3>
                              <Badge variant="outline">{contrib.contribution_type}</Badge>
                              <Badge variant={
                                contrib.status === "pending" ? "secondary" :
                                contrib.status === "validated" ? "default" : "destructive"
                              }>
                                {contrib.status}
                              </Badge>
                            </div>
                            {contrib.content && (
                              <p className="text-sm p-3 bg-muted/50 rounded-lg mt-2">{contrib.content}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(contrib.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {contrib.status === "pending" && (
                            <div className="flex flex-col gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleContributionAction(contrib.id, "validated")}
                                className="gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleContributionAction(contrib.id, "rejected")}
                                className="gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {contrib.status === "pending" && (
                          <Textarea
                            placeholder={language === "fr" ? "Notes admin" : "Admin notes"}
                            value={adminNotes[contrib.id] || ""}
                            onChange={(e) => setAdminNotes(prev => ({ ...prev, [contrib.id]: e.target.value }))}
                            className="mt-3"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>{language === "fr" ? "Documents Utilisateurs" : "User Documents"}</CardTitle>
                <CardDescription>
                  {language === "fr" ? "Gérez les documents de formalisation" : "Manage formalization documents"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {language === "fr" ? "Aucun document" : "No documents"}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-xl border bg-card">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="w-5 h-5 text-primary" />
                              <h3 className="font-semibold">{doc.file_name}</h3>
                              <Badge variant="outline">{doc.document_category}</Badge>
                              <Badge variant={
                                doc.status === "pending" ? "secondary" :
                                doc.status === "validated" ? "default" :
                                doc.status === "needs_correction" ? "outline" : "destructive"
                              }>
                                {doc.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {doc.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleDocumentAction(doc.id, "validated")}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDocumentAction(doc.id, "needs_correction")}
                              >
                                <AlertTriangle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDocumentAction(doc.id, "rejected")}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {doc.status === "pending" && (
                          <Textarea
                            placeholder={language === "fr" ? "Notes (corrections requises, etc.)" : "Notes (corrections required, etc.)"}
                            value={adminNotes[doc.id] || ""}
                            onChange={(e) => setAdminNotes(prev => ({ ...prev, [doc.id]: e.target.value }))}
                            className="mt-3"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
