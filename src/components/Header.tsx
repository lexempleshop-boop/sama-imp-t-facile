import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/utils/translations";
import { LanguageSelector } from "./LanguageSelector";
import { Link, useLocation } from "react-router-dom";
import { Calculator, MessageCircle, Home, Info } from "lucide-react";

export function Header() {
  const { language } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: "/", label: t("home", language), icon: Home },
    { path: "/simulator", label: t("simulator", language), icon: Calculator },
    { path: "/chatbot", label: t("chatbot", language), icon: MessageCircle },
    { path: "/formalization", label: t("formalization", language), icon: Info },
    { path: "/about", label: t("about", language), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Calculator className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">{t("appName", language)}</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 ${location.pathname === path
                  ? "text-primary bg-primary/10 font-semibold"
                  : "text-muted-foreground hover:bg-accent"
                  }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <LanguageSelector />
        </div>

        {/* Mobile navigation */}
        <nav className="flex md:hidden items-center justify-around pb-3 border-t border-border mt-3 pt-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 text-[10px] transition-all duration-200 rounded-md px-1.5 py-1 ${location.pathname === path
                ? "text-primary bg-primary/10 font-semibold"
                : "text-muted-foreground"
                }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-center leading-tight">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
