import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function TaxChatbot() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/tax-chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language,
        }),
      });

      if (response.status === 429 || response.status === 402) {
        const errorData = await response.json();
        toast({
          title: "Erreur",
          description: errorData.error,
          variant: "destructive",
        });
        setIsLoading(false);
        setIsTyping(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Erreur de communication avec le chatbot");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";
      let hasStartedTyping = false;

      // Initial 3 second delay before starting to type
      await new Promise((resolve) => setTimeout(resolve, 3000));
      hasStartedTyping = true;

      // Add assistant message placeholder
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const updateAssistantMessage = (newContent: string) => {
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.role === "assistant") {
            lastMessage.content = newContent;
          }
          return newMessages;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            
            if (content) {
              // Simulate word-by-word typing with delays
              const words = content.split(" ");
              for (const word of words) {
                assistantMessage += (assistantMessage ? " " : "") + word;
                updateAssistantMessage(assistantMessage);
                // Small delay between words for natural typing effect
                await new Promise((resolve) => setTimeout(resolve, 50));
              }
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const lines = buffer.split("\n");
        for (const line of lines) {
          if (!line || line.startsWith(":") || !line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantMessage += content;
              updateAssistantMessage(assistantMessage);
            }
          } catch {
            // Ignore parse errors in final flush
          }
        }
      }

      setIsTyping(false);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
      // Remove the placeholder assistant message on error
      setMessages((prev) => prev.filter((msg) => msg.content !== ""));
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const welcomeMessages: Record<string, string> = {
    fr: "Bonjour ! Je suis votre assistant fiscal. Posez-moi vos questions sur l'impôt au Sénégal.",
    en: "Hello! I'm your tax assistant. Ask me questions about taxes in Senegal.",
    wo: "Asalaa maalekum ! Man mooy assistant bi ci impôt yi. Laaj ma sa xalaatu ci impôt yi ci Sénégal.",
    ff: "Jam waali! Mi ko assistant maa e impôt. Naamna mbelu maa e impôt e Senegal.",
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] md:h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          {t("chatbotTitle", language)}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="space-y-4">
                <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">{welcomeMessages[language]}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-2`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm sm:text-base">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              language === "fr"
                ? "Posez votre question..."
                : language === "en"
                ? "Ask your question..."
                : language === "wo"
                ? "Laaj sa xalaat..."
                : "Naamna mbelu maa..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
