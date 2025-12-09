import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { t } from "@/utils/translations";
import { LanguageSelector } from "./LanguageSelector";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calculator, MessageCircle, Home, Info, User, LogOut, FileText, GraduationCap, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { language } = useLanguage();
  const { user, signOut, isFiscalist } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: t("home", language), icon: Home },
    { path: "/simulator", label: t("simulator", language), icon: Calculator },
    { path: "/chatbot", label: t("chatbot", language), icon: MessageCircle },
    { path: "/formalization", label: t("formalization", language), icon: FileText },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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

          <nav className="hidden md:flex items-center space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 ${
                  location.pathname === path
                    ? "text-primary bg-primary/10 font-semibold"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSelector />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {user.email?.split("@")[0]}
                    </span>
                    {isFiscalist && (
                      <GraduationCap className="h-4 w-4 text-primary" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/documents" className="flex items-center gap-2 cursor-pointer">
                      <Folder className="h-4 w-4" />
                      {language === "fr" ? "Mes Documents" : "My Documents"}
                    </Link>
                  </DropdownMenuItem>
                  {!isFiscalist && (
                    <DropdownMenuItem asChild>
                      <Link to="/expert-request" className="flex items-center gap-2 cursor-pointer">
                        <GraduationCap className="h-4 w-4" />
                        {language === "fr" ? "Devenir Expert" : "Become Expert"}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isFiscalist && (
                    <DropdownMenuItem className="flex items-center gap-2 text-primary">
                      <GraduationCap className="h-4 w-4" />
                      {language === "fr" ? "Accès Expert" : "Expert Access"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    {language === "fr" ? "Déconnexion" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" size="sm" asChild>
                <Link to="/auth" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === "fr" ? "Connexion" : "Login"}
                  </span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="flex md:hidden items-center justify-around pb-3 border-t border-border mt-3 pt-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 text-[10px] transition-all duration-200 rounded-md px-1.5 py-1 ${
                location.pathname === path
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
