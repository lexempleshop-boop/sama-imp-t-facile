// import { useState, useRef, useEffect } from "react";
// import { useLanguage } from "@/contexts/LanguageContext";
// import { t } from "@/utils/translations";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MessageCircle, Send, Loader2 } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// export function TaxChatbot() {
//   const { language } = useLanguage();
//   const { toast } = useToast();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isTyping, setIsTyping] = useState(false);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessage = async () => {
//     if (!input.trim() || isLoading) return;

//     const userMessage: Message = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setIsLoading(true);
//     setIsTyping(true);

//     try {
//       const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
//       const response = await fetch(`${SUPABASE_URL}/functions/v1/tax-chatbot`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
//         },
//         body: JSON.stringify({
//           messages: [...messages, userMessage],
//           language,
//         }),
//       });

//       if (response.status === 429 || response.status === 402) {
//         const errorData = await response.json();
//         toast({
//           title: "Erreur",
//           description: errorData.error,
//           variant: "destructive",
//         });
//         setIsLoading(false);
//         setIsTyping(false);
//         return;
//       }

//       if (!response.ok || !response.body) {
//         throw new Error("Erreur de communication avec le chatbot");
//       }

//       const reader = response.body.getReader();
//       const decoder = new TextDecoder();
//       let assistantMessage = "";
//       let buffer = "";
//       let hasStartedTyping = false;

//       // Initial 3 second delay before starting to type
//       await new Promise((resolve) => setTimeout(resolve, 3000));
//       hasStartedTyping = true;

//       // Add assistant message placeholder
//       setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

//       const updateAssistantMessage = (newContent: string) => {
//         setMessages((prev) => {
//           const newMessages = [...prev];
//           const lastMessage = newMessages[newMessages.length - 1];
//           if (lastMessage?.role === "assistant") {
//             lastMessage.content = newContent;
//           }
//           return newMessages;
//         });
//       };

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });

//         let newlineIndex: number;
//         while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
//           let line = buffer.slice(0, newlineIndex);
//           buffer = buffer.slice(newlineIndex + 1);

//           if (line.endsWith("\r")) line = line.slice(0, -1);
//           if (line.startsWith(":") || line.trim() === "") continue;
//           if (!line.startsWith("data: ")) continue;

//           const jsonStr = line.slice(6).trim();
//           if (jsonStr === "[DONE]") continue;

//           try {
//             const parsed = JSON.parse(jsonStr);
//             const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
//             if (content) {
//               // Simulate word-by-word typing with delays
//               const words = content.split(" ");
//               for (const word of words) {
//                 assistantMessage += (assistantMessage ? " " : "") + word;
//                 updateAssistantMessage(assistantMessage);
//                 // Small delay between words for natural typing effect
//                 await new Promise((resolve) => setTimeout(resolve, 50));
//               }
//             }
//           } catch {
//             buffer = line + "\n" + buffer;
//             break;
//           }
//         }
//       }

//       // Process any remaining buffer
//       if (buffer.trim()) {
//         const lines = buffer.split("\n");
//         for (const line of lines) {
//           if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
//           const jsonStr = line.slice(6).trim();
//           if (jsonStr === "[DONE]") continue;
          
//           try {
//             const parsed = JSON.parse(jsonStr);
//             const content = parsed.choices?.[0]?.delta?.content as string | undefined;
//             if (content) {
//               assistantMessage += content;
//               updateAssistantMessage(assistantMessage);
//             }
//           } catch {
//             // Ignore parse errors in final flush
//           }
//         }
//       }

//       setIsTyping(false);
//     } catch (error) {
//       console.error("Chatbot error:", error);
//       toast({
//         title: "Erreur",
//         description: error instanceof Error ? error.message : "Une erreur est survenue",
//         variant: "destructive",
//       });
//       // Remove the placeholder assistant message on error
//       setMessages((prev) => prev.filter((msg) => msg.content !== ""));
//       setIsTyping(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const welcomeMessages: Record<string, string> = {
//     fr: "Bonjour ! Je suis votre assistant fiscal. Posez-moi vos questions sur l'impôt au Sénégal.",
//     en: "Hello! I'm your tax assistant. Ask me questions about taxes in Senegal.",
//     wo: "Asalaa maalekum ! Man mooy assistant bi ci impôt yi. Laaj ma sa xalaatu ci impôt yi ci Sénégal.",
//     ff: "Jam waali! Mi ko assistant maa e impôt. Naamna mbelu maa e impôt e Senegal.",
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto h-[600px] md:h-[700px] flex flex-col">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <MessageCircle className="h-5 w-5" />
//           {t("chatbotTitle", language)}
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex-1 flex flex-col gap-4 p-4">
//         <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
//           {messages.length === 0 && (
//             <div className="flex items-center justify-center h-full text-center p-8">
//               <div className="space-y-4">
//                 <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
//                   <MessageCircle className="h-8 w-8 text-primary" />
//                 </div>
//                 <p className="text-muted-foreground">{welcomeMessages[language]}</p>
//               </div>
//             </div>
//           )}
          
//           <div className="space-y-4">
//             {messages.map((message, index) => (
//               <div
//                 key={index}
//                 className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}
//               >
//                 <div
//                   className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
//                     message.role === "user"
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-muted text-foreground"
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{message.content}</p>
//                 </div>
//               </div>
//             ))}
            
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-muted text-foreground rounded-lg px-4 py-2">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>
//         </ScrollArea>

//         <div className="flex gap-2">
//           <Input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder={
//               language === "fr"
//                 ? "Posez votre question..."
//                 : language === "en"
//                 ? "Ask your question..."
//                 : language === "wo"
//                 ? "Laaj sa xalaat..."
//                 : "Naamna mbelu maa..."
//             }
//             disabled={isLoading}
//             className="flex-1"
//           />
//           <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Loader2, Sparkles, Globe, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TypeScript interface for SpeechRecognition
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

const languages = {
  fr: { name: "Français", flag: "🇫🇷" },
  en: { name: "English", flag: "🇬🇧" },
  wo: { name: "Wolof", flag: "🇸🇳" },
  ff: { name: "Pulaar", flag: "🇸🇳" },
};

const welcomeMessages: Record<Language, string> = {
  fr: "Bonjour ! Je suis votre assistant fiscal virtuel. Posez-moi vos questions.",
  en: "Hello! I'm your virtual tax assistant. Ask me anything.",
  wo: "Asalaa maalekum ! Laaj ma ci impôt yi.",
  ff: "Jam waali ! Naamnito mi e impôt e Senegal.",
};

const suggestedQuestions: Record<Language, string[]> = {
  fr: [
    "Je vends au marché. Dois-je payer un impôt ?",
    "C'est quoi la patente ?",
    "Je loue une maison : quel impôt payer ?",
  ],
  en: [
    "I sell at the market. Do I need to pay tax?",
    "What is the Patente?",
    "I rent a house: what tax applies?",
  ],
  wo: [
    "Dama jënd ci marché. Ndax dafay am impôt?",
    "Lan la Patente ?",
    "Dama lokk kër, lan tax laa war?",
  ],
  ff: [
    "Mi peeñata e marché. Ndaɗa foti yiilaa?",
    "Hol ko Patente?",
    "Mi jeya galle. Hol fayde mi foti?",
  ],
};

export function TaxChatbot() {
  const [language, setLanguage] = useState<Language>("fr");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: welcomeMessages.fr }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Erreur", description: "Trop de requêtes", variant: "destructive" });
          return;
        }
        if (resp.status === 402) {
          toast({ title: "Crédits insuffisants", description: "Rechargez vos crédits", variant: "destructive" });
          return;
        }
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
        fr: 'fr-FR',
        en: 'en-US',
        wo: 'wo-SN',
        ff: 'ff-SN'
      };
      recognitionRef.current.lang = langMap[language] || 'fr-FR';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Erreur vocale",
          description: "Impossible de capturer la voix",
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language, toast]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 pb-8">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Conseiller Fiscal IA</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">Assistant Fiscal</h1>
          <p className="text-muted-foreground">Posez vos questions fiscales en langage simple</p>

          {/* LANG SELECTOR */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
              <SelectTrigger className="w-[200px]">
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

        {/* CHAT CARD */}
        <Card className="h-[600px] flex flex-col shadow-xl border-2">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border"
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
                  <div className="bg-card border rounded-2xl px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* SUGGESTED QUESTIONS */}
          {messages.length <= 1 && (
            <div className="px-6 py-3 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Suggestions :</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions[language].map((q, i) => (
                  <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => setInput(q)}>
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <div className="p-4 border-t bg-card/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
                placeholder="Posez votre question..."
                disabled={isLoading}
                className="flex-1 border-2 focus:border-primary"
              />
              <Button 
                type="button" 
                onClick={toggleVoiceInput}
                disabled={isLoading}
                size="icon"
                variant={isListening ? "default" : "outline"}
                className={isListening ? "animate-pulse" : ""}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="gap-2">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>

        </Card>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          💡 Cet assistant simplifie les textes fiscaux pour une meilleure compréhension.
        </div>

      </div>
    </div>
  );
}
