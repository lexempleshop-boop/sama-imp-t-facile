import { Header } from "@/components/Header";
import { TaxChatbot } from "@/components/TaxChatbot";

export default function Chatbot() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <TaxChatbot />
      </div>
    </div>
  );
}
