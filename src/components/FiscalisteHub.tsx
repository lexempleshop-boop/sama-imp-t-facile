import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  FileText, 
  MessageSquare, 
  Send, 
  Loader2, 
  Sparkles, 
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  BookOpen
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function FiscalisteHub() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: language === "fr" 
        ? "Bienvenue dans l'espace Fiscalistes ! Je suis prêt à être challengé sur mes connaissances fiscales sénégalaises. Vous pouvez me poser des questions complexes, me soumettre des cas pratiques, ou uploader des documents fiscaux pour vérifier mes réponses. N'hésitez pas à me corriger si je me trompe - cela m'aidera à m'améliorer !"
        : "Welcome to the Tax Expert Hub! I'm ready to be challenged on my Senegalese tax knowledge. You can ask me complex questions, submit practical cases, or upload tax documents to verify my answers. Don't hesitate to correct me if I'm wrong - it will help me improve!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const streamChat = async (userMessage: string, context?: string) => {
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

      const systemContext = context 
        ? `[CONTEXTE DOCUMENT]\n${context}\n\n[QUESTION]` 
        : "";

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/tax-chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: systemContext + userMessage }],
          language,
          mode: "expert",
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Erreur de communication");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

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
              assistantText += content;
              setMessages((prev) => {
                const m = [...prev];
                m[m.length - 1].content = assistantText;
                return m;
              });
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
      toast({
        title: language === "fr" ? "Fichier(s) ajouté(s)" : "File(s) added",
        description: language === "fr" 
          ? `${newFiles.length} fichier(s) prêt(s) pour analyse` 
          : `${newFiles.length} file(s) ready for analysis`,
      });
    }
  };

  const handleAnalyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: language === "fr" ? "Aucun fichier" : "No file",
        description: language === "fr" ? "Veuillez uploader un document d'abord" : "Please upload a document first",
        variant: "destructive",
      });
      return;
    }

    const fileNames = uploadedFiles.map(f => f.name).join(", ");
    const userMessage = language === "fr"
      ? `J'ai uploadé les documents suivants: ${fileNames}. Pouvez-vous analyser leur contenu fiscal et me donner votre avis d'expert ?`
      : `I've uploaded the following documents: ${fileNames}. Can you analyze their tax content and give me your expert opinion?`;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);
    
    // Note: In a real implementation, you would send the file content to the backend
    const mockContext = `Documents fiscaux uploadés: ${fileNames}. Ces documents semblent contenir des informations relatives à la fiscalité sénégalaise.`;
    
    await streamChat(
      language === "fr" 
        ? "Analysez ces documents et identifiez les points clés, les erreurs potentielles, et les recommandations."
        : "Analyze these documents and identify key points, potential errors, and recommendations.",
      mockContext
    );
    
    setIsLoading(false);
    setUploadedFiles([]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <GraduationCap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {language === "fr" ? "Espace Expert" : "Expert Hub"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">
          {language === "fr" ? "Hub Fiscalistes" : "Tax Expert Hub"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {language === "fr" 
            ? "Challengez l'IA, vérifiez ses réponses, et contribuez à son amélioration en uploadant des documents fiscaux officiels."
            : "Challenge the AI, verify its answers, and contribute to its improvement by uploading official tax documents."}
        </p>
      </div>

      <Tabs defaultValue="challenge" className="w-full max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenge" className="gap-2">
            <MessageSquare className="w-4 h-4" />
            {language === "fr" ? "Challenger" : "Challenge"}
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            {language === "fr" ? "Documents" : "Documents"}
          </TabsTrigger>
          <TabsTrigger value="contribute" className="gap-2">
            <BookOpen className="w-4 h-4" />
            {language === "fr" ? "Contribuer" : "Contribute"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenge" className="mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {language === "fr" ? "Chat Expert" : "Expert Chat"}
              </CardTitle>
              <CardDescription>
                {language === "fr" 
                  ? "Posez des questions complexes pour tester les connaissances de l'IA"
                  : "Ask complex questions to test the AI's knowledge"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted border"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <div className="flex items-center gap-1 mb-1 opacity-70">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold text-primary">Expert IA</span>
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

              <div className="flex gap-2 mt-4">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                  placeholder={language === "fr" ? "Posez une question technique..." : "Ask a technical question..."}
                  disabled={isLoading}
                  className="flex-1 border-2"
                />
                <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                {language === "fr" ? "Analyse de Documents" : "Document Analysis"}
              </CardTitle>
              <CardDescription>
                {language === "fr" 
                  ? "Uploadez des documents fiscaux pour vérifier les réponses de l'IA"
                  : "Upload tax documents to verify AI responses"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileUpload}
                />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="font-medium">
                  {language === "fr" ? "Cliquez pour uploader" : "Click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, DOC, DOCX, TXT
                </p>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">
                    {language === "fr" ? "Fichiers uploadés" : "Uploaded files"}
                  </h4>
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className="text-sm flex-1 truncate">{file.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                  <Button onClick={handleAnalyzeDocuments} className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {language === "fr" ? "Analyser les documents" : "Analyze documents"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="mt-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {language === "fr" ? "Contribuer à l'Apprentissage" : "Contribute to Learning"}
              </CardTitle>
              <CardDescription>
                {language === "fr" 
                  ? "Aidez l'IA à s'améliorer en signalant des erreurs ou en ajoutant des connaissances"
                  : "Help the AI improve by reporting errors or adding knowledge"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">
                        {language === "fr" ? "Signaler une erreur" : "Report an error"}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === "fr" 
                          ? "Si vous constatez une erreur dans les réponses de l'IA, décrivez-la ci-dessous"
                          : "If you notice an error in the AI responses, describe it below"}
                      </p>
                    </div>
                  </div>
                </div>

                <Textarea
                  placeholder={
                    language === "fr" 
                      ? "Décrivez l'erreur constatée, la réponse correcte, et si possible la source officielle (article du CGI, circulaire, etc.)..."
                      : "Describe the error found, the correct answer, and if possible the official source (CGI article, circular, etc.)..."
                  }
                  className="min-h-[150px] border-2"
                />

                <Button className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {language === "fr" ? "Soumettre la correction" : "Submit correction"}
                </Button>
              </div>

              <div className="pt-6 border-t">
                <h4 className="font-medium mb-3">
                  {language === "fr" ? "Documents de référence suggérés" : "Suggested reference documents"}
                </h4>
                <div className="grid gap-3">
                  {[
                    { name: "Code Général des Impôts (CGI)", type: "PDF" },
                    { name: "Circulaires DGID", type: "PDF" },
                    { name: "Jurisprudence fiscale", type: "DOC" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        {language === "fr" ? "Uploader" : "Upload"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
