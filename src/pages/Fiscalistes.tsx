import { Header } from "@/components/Header";
import { FiscalisteHub } from "@/components/FiscalisteHub";

export default function Fiscalistes() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <FiscalisteHub />
      </div>
    </div>
  );
}
