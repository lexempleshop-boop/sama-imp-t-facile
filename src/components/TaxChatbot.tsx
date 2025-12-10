import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles, 
  Globe, 
  Mic, 
  MicOff, 
  Upload, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  GraduationCap,
  Lock,
  History
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Language = "fr" | "en" | "wo" | "ff";

type Contribution = {
  id: string;
  title: string;
  contribution_type: string;
  status: string;
  created_at: string;
};

const languages = {
  fr: { name: "Français", flag: "🇫🇷" },
  en: { name: "English", flag: "🇬🇧" },
  wo: { name: "Wolof", flag: "🇸🇳" },
  ff: { name: "Pulaar", flag: "🇸🇳" },
};

const welcomeMessages: Record<Language, string> = {
  fr: "Bonjour ! Je suis votre assistant fiscal. Posez-moi vos questions simplement.",
  en: "Hello! I'm your tax assistant. Ask me your questions simply.",
  wo: "Asalaa maalekum ! Laaj ma ci impôt yi.",
  ff: "Jam waali ! Naamnito mi e impôt.",
};

const suggestedQuestions: Record<Language, string[]> = {
  fr: [
    "Dois-je payer un impôt si je vends au marché ?",
    "C'est quoi la patente ?",
    "Quel impôt pour un bailleur ?",
  ],
  en: [
    "Do I need to pay tax as a market seller?",
    "What is the Patente?",
    "What tax applies to landlords?",
  ],
  wo: [
    "Ndax dama wara fey impôt su ma jënd ci marché ?",
    "Lan la Patente ?",
    "Impôt bi baay kër war ?",
  ],
  ff: [
    "Mi foti yiilaa so mi peeñata e marché ?",
    "Hol ko Patente ?",
    "Hol fayde jeeyoowo galle foti ?",
  ],
};

const contributionTypes = [
  { value: "case_study", label: { fr: "Étude de cas", en: "Case Study" } },
  { value: "jurisprudence", label: { fr: "Jurisprudence", en: "Jurisprudence" } },
  { value: "analysis", label: { fr: "Analyse technique", en: "Technical Analysis" } },
  { value: "correction", label: { fr: "Correction IA", en: "AI Correction" } },
  { value: "enrichment", label: { fr: "Enrichissement", en: "Enrichment" } },
];

export function TaxChatbot() {
  const { user, isFiscalist } = useAuth();
  const { toast } = useToast();
  
  const [language, setLanguage] = useState<Language>("fr");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessages.fr }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Fiscaliste states
  const [contributionType, setContributionType] = useState("");
  const [contributionTitle, setContributionTitle] = useState("");
  const [contributionContent, setContributionContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isFiscalist && user) {
      fetchContributions();
    }
  }, [isFiscalist, user]);

  const fetchContributions = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from("fiscalist_contributions")
        .select("id, title, contribution_type, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      
      if (data) setContributions(data);
    } catch (err) {
      console.error("Error fetching contributions:", err);
    }
  };

  const streamChat = async (userMessage: string) => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/tax-chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
          language,
          mode: isFiscalist ? "expert" : "citizen",
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Erreur", description: "Trop de requêtes, réessayez", variant: "destructive" });
          return;
        }
        if (resp.status === 402) {
          toast({ title: "Crédits", description: "Crédits insuffisants", variant: "destructive" });
          return;
        }
        throw new Error("Erreur de communication");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Add initial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        let newlineIndex;

        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.replace("data: ", "").trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              // Word-by-word streaming effect
              const words = content.split(/(\s+)/);
              for (const word of words) {
                assistantText += word;
                setMessages((prev) => {
                  const m = [...prev];
                  m[m.length - 1].content = assistantText;
                  return m;
                });
                // Small delay for typing effect
                await new Promise(resolve => setTimeout(resolve, 30));
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur", description: "Impossible de contacter l'IA", variant: "destructive" });
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setIsLoading(true);
    await streamChat(msg);
    setIsLoading(false);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setMessages([{ role: "assistant", content: welcomeMessages[lang] }]);
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      const langMap: Record<Language, string> = {
        fr: 'fr-FR', en: 'en-US', wo: 'wo-SN', ff: 'ff-SN'
      };
      recognitionRef.current.lang = langMap[language] || 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    return () => { recognitionRef.current?.stop(); };
  }, [language]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({ title: "Non supporté", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmitContribution = async () => {
    if (!user || !contributionType || !contributionTitle) {
      toast({
        title: language === "fr" ? "Champs requis" : "Required fields",
        description: language === "fr" ? "Veuillez remplir tous les champs obligatoires" : "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let filePath = null;

      if (uploadedFile) {
        const fileExt = uploadedFile.name.split(".").pop();
        const fileName = `${user.id}/contributions/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, uploadedFile);

        if (uploadError) throw uploadError;
        filePath = fileName;
      }

      const { error } = await supabase.from("fiscalist_contributions").insert({
        user_id: user.id,
        contribution_type: contributionType,
        title: contributionTitle,
        content: contributionContent || null,
        file_path: filePath,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: language === "fr" ? "Contribution soumise" : "Contribution submitted",
        description: language === "fr" 
          ? "Votre contribution sera examinée par notre équipe" 
          : "Your contribution will be reviewed by our team",
      });

      // Reset form
      setContributionType("");
      setContributionTitle("");
      setContributionContent("");
      setUploadedFile(null);
      fetchContributions();
    } catch (err) {
      console.error("Error submitting contribution:", err);
      toast({ title: "Erreur", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { label: language === "fr" ? "En attente" : "Pending", variant: "secondary" as const },
      validated: { label: language === "fr" ? "Validé" : "Validated", variant: "default" as const },
      rejected: { label: language === "fr" ? "Refusé" : "Rejected", variant: "destructive" as const },
    };
    const { label, variant } = config[status as keyof typeof config] || config.pending;
    return <Badge variant={variant}>{label}</Badge>;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="container mx-auto px-4 pb-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              {isFiscalist ? "Mode Expert Fiscaliste" : "Conseiller Fiscal IA"}
            </span>
            {isFiscalist && <GraduationCap className="w-4 h-4 text-primary" />}
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Assistant Fiscal
          </h1>
          <p className="text-muted-foreground">
            {isFiscalist 
              ? "Mode expert activé - Contribuez à améliorer l'IA"
              : "Posez vos questions fiscales en langage simple"
            }
          </p>

          {/* Language Selector */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
              <SelectTrigger className="w-[200px] bg-card border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languages).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    <span className="flex items-center gap-2">
                      <span>{v.flag}</span> {v.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="chat" className="w-full max-w-4xl mx-auto">
          <TabsList className={`grid w-full mb-6 ${isFiscalist ? 'grid-cols-4' : 'grid-cols-1'}`}>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            {isFiscalist && (
              <>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="contribute" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Contribuer
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historique
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="h-[600px] flex flex-col shadow-xl border-2 bg-gradient-to-b from-card to-card/80">
              <ScrollArea className="flex-1 p-6" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                          m.role === "user"
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground"
                            : "bg-gradient-to-r from-muted to-muted/80 border border-border"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <div className="flex items-center gap-1 mb-1 opacity-70">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-primary">Assistant</span>
                          </div>
                        )}
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted border rounded-2xl px-4 py-3">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Suggestions */}
              {messages.length <= 1 && (
                <div className="px-6 py-3 border-t bg-gradient-to-r from-muted/50 to-accent/10">
                  <p className="text-xs text-muted-foreground mb-2">Suggestions :</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions[language].map((q, i) => (
                      <Button 
                        key={i} 
                        variant="outline" 
                        size="sm" 
                        className="text-xs bg-card hover:bg-primary/10 hover:text-primary" 
                        onClick={() => setInput(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t bg-gradient-to-r from-card to-muted/20">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                    placeholder="Posez votre question..."
                    disabled={isLoading}
                    className="flex-1 border-2 focus:border-primary bg-background"
                  />
                  <Button
                    type="button"
                    onClick={toggleVoiceInput}
                    disabled={isLoading}
                    size="icon"
                    variant={isListening ? "default" : "outline"}
                    className={isListening ? "animate-pulse" : ""}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="gap-2">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Documents Tab - Fiscalistes only */}
          {isFiscalist && (
            <TabsContent value="documents">
              <Card className="border-2 bg-gradient-to-b from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Documents Fiscaux
                  </CardTitle>
                  <CardDescription>
                    Uploadez des documents pour enrichir l'IA (jurisprudences, analyses, cas pratiques)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-gradient-to-b from-muted/30 to-muted/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    />
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                        <span className="font-medium">{uploadedFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="font-medium">Cliquez pour uploader un document</p>
                        <p className="text-sm text-muted-foreground mt-1">PDF, DOC, DOCX, TXT</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Contribute Tab - Fiscalistes only */}
          {isFiscalist && (
            <TabsContent value="contribute">
              <Card className="border-2 bg-gradient-to-b from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Contribuer à l'IA
                  </CardTitle>
                  <CardDescription>
                    Proposez des corrections ou enrichissements pour améliorer l'assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg border bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">Validation requise</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Toutes les contributions sont vérifiées par notre équipe avant intégration
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Type de contribution *</label>
                      <Select value={contributionType} onValueChange={setContributionType}>
                        <SelectTrigger className="border-2">
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {contributionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label[language === "fr" ? "fr" : "en"]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Titre *</label>
                      <Input
                        value={contributionTitle}
                        onChange={(e) => setContributionTitle(e.target.value)}
                        placeholder="Ex: Correction sur le calcul de l'IR"
                        className="border-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Description / Contenu</label>
                      <Textarea
                        value={contributionContent}
                        onChange={(e) => setContributionContent(e.target.value)}
                        placeholder="Décrivez votre contribution en détail, incluez les sources officielles si possible (articles du CGI, circulaires, etc.)"
                        className="min-h-[150px] border-2"
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitContribution} 
                      className="w-full"
                      disabled={isSubmitting || !contributionType || !contributionTitle}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Soumettre la contribution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* History Tab - Fiscalistes only */}
          {isFiscalist && (
            <TabsContent value="history">
              <Card className="border-2 bg-gradient-to-b from-card to-card/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Historique des Contributions
                  </CardTitle>
                  <CardDescription>
                    Suivez le statut de vos contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contributions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune contribution pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contributions.map((contrib) => (
                        <div key={contrib.id} className="flex items-center gap-4 p-4 rounded-xl border bg-gradient-to-r from-card to-muted/20">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{contrib.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {contributionTypes.find(t => t.value === contrib.contribution_type)?.label.fr || contrib.contribution_type}
                              {" • "}
                              {new Date(contrib.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {getStatusBadge(contrib.status)}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Access info for non-fiscalists */}
        {!isFiscalist && user && (
          <div className="mt-6 text-center">
            <Card className="inline-block border-2 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="flex items-center gap-3 py-4">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Mode Expert réservé aux fiscalistes</p>
                  <a href="/expert-request" className="text-xs text-primary hover:underline">
                    Demander l'accès expert →
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          💡 Cet assistant simplifie les textes fiscaux pour une meilleure compréhension.
        </div>
      </div>
    </div>
  );
}
