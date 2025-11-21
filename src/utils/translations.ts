import { Language } from "@/types/tax";

export const languages = {
  fr: { name: "Français", flag: "🇫🇷" },
  en: { name: "English", flag: "🇬🇧" },
  wo: { name: "Wolof", flag: "🇸🇳" },
  ff: { name: "Pulaar", flag: "🇸🇳" },
};

export const translations: Record<Language, Record<string, string>> = {
  fr: {
    appName: "Sama Wareef",
    tagline: "Comprendre l'impôt, Contribuer au développement local",
    description: "L'IA au service du citoyen contribuable et de l'inclusion fiscale au Sénégal",
    
    // Navigation
    home: "Accueil",
    simulator: "Simulateur",
    chatbot: "Assistant IA",
    formalization: "Formalisation",
    about: "À propos",
    
    // Hero
    heroTitle: "Comprendre l'impôt pour mieux contribuer",
    heroSubtitle: "Votre conseiller fiscal digital inclusif",
    startSimulation: "Démarrer une simulation",
    talkToAssistant: "Parler à l'assistant",
    
    // Simulator
    taxSimulator: "Simulateur d'Impôt",
    annualIncome: "Revenu annuel (FCFA)",
    maritalStatus: "Situation familiale",
    single: "Célibataire",
    married: "Marié(e)",
    numberOfChildren: "Nombre d'enfants",
    calculate: "Calculer",
    reset: "Réinitialiser",
    
    // Results
    results: "Résultats de la simulation",
    yourSituation: "Votre situation",
    taxBreakdown: "Détail de l'impôt",
    grossIncome: "Revenu brut",
    familyParts: "Parts fiscales",
    incomePerPart: "Revenu par part",
    taxBeforeReduction: "Impôt avant réduction",
    taxReduction: "Réduction d'impôt",
    minimumTax: "Impôt minimum (TRIMF)",
    finalTax: "Impôt final à payer",
    effectiveRate: "Taux effectif",
    marginalRate: "Taux marginal",
    
    // Brackets
    progressiveBrackets: "Tranches progressives",
    bracket: "Tranche",
    rate: "Taux",
    taxAmount: "Montant impôt",
    
    // Chatbot
    chatbotTitle: "Assistant Fiscal IA",
    inDevelopment: "En cours de développement",
    comingSoon: "Cette fonctionnalité sera bientôt disponible. Elle vous permettra de poser vos questions fiscales en langage naturel.",
    backToHome: "Retour à l'accueil",
    
    // About
    aboutTitle: "À propos de Sama Wareef",
    mission: "Notre Mission",
    missionText: "Démocratiser l'accès à l'information fiscale et accompagner les citoyens sénégalais dans la compréhension de leurs obligations fiscales.",
  },
  
  en: {
    appName: "Sama Wareef",
    tagline: "Understand taxes, Contribute to local development",
    description: "AI-powered citizen taxpayer assistance and tax inclusion in Senegal",
    
    home: "Home",
    simulator: "Simulator",
    chatbot: "AI Assistant",
    formalization: "Formalization",
    about: "About",
    
    heroTitle: "Understand taxes to contribute better",
    heroSubtitle: "Your inclusive digital tax advisor",
    startSimulation: "Start simulation",
    talkToAssistant: "Talk to assistant",
    
    taxSimulator: "Tax Simulator",
    annualIncome: "Annual income (FCFA)",
    maritalStatus: "Marital status",
    single: "Single",
    married: "Married",
    numberOfChildren: "Number of children",
    calculate: "Calculate",
    reset: "Reset",
    
    results: "Simulation results",
    yourSituation: "Your situation",
    taxBreakdown: "Tax breakdown",
    grossIncome: "Gross income",
    familyParts: "Tax parts",
    incomePerPart: "Income per part",
    taxBeforeReduction: "Tax before reduction",
    taxReduction: "Tax reduction",
    minimumTax: "Minimum tax (TRIMF)",
    finalTax: "Final tax to pay",
    effectiveRate: "Effective rate",
    marginalRate: "Marginal rate",
    
    progressiveBrackets: "Progressive brackets",
    bracket: "Bracket",
    rate: "Rate",
    taxAmount: "Tax amount",
    
    chatbotTitle: "Tax AI Assistant",
    inDevelopment: "Under development",
    comingSoon: "This feature will be available soon. It will allow you to ask your tax questions in natural language.",
    backToHome: "Back to home",
    
    aboutTitle: "About Sama Wareef",
    mission: "Our Mission",
    missionText: "Democratize access to tax information and support Senegalese citizens in understanding their tax obligations.",
  },
  
  wo: {
    appName: "Sama Wareef",
    tagline: "Xam impôt bi, Walluwaat ci yoneent bi",
    description: "IA yi di yeesal ci citoyen yi ngir xam impôt yi",
    
    home: "Kër",
    simulator: "Simulateur",
    chatbot: "Assistant IA",
    formalization: "Formalisation",
    about: "Ay xibaar",
    
    heroTitle: "Xam impôt bi ngir yeesal bu baax",
    heroSubtitle: "Sa conseiller fiscal numérique",
    startSimulation: "Tambali simulation",
    talkToAssistant: "Wax ak assistant bi",
    
    taxSimulator: "Simulateur bu Impôt",
    annualIncome: "Njëg bi ci at (FCFA)",
    maritalStatus: "Sa liggeey bi ci kër",
    single: "Am solo",
    married: "Jëkër",
    numberOfChildren: "Limu doom",
    calculate: "Kajoor",
    reset: "Delloo",
    
    results: "Résultats simulation bi",
    yourSituation: "Sa liggeey",
    taxBreakdown: "Détail impôt bi",
    grossIncome: "Njëg bu mat",
    familyParts: "Parts fiscales",
    incomePerPart: "Njëg ci benn part",
    taxBeforeReduction: "Impôt avant réduction",
    taxReduction: "Réduction d'impôt",
    minimumTax: "Impôt minimum (TRIMF)",
    finalTax: "Impôt bu mag mu ñuy fay",
    effectiveRate: "Taux effectif",
    marginalRate: "Taux marginal",
    
    progressiveBrackets: "Tranches progressives",
    bracket: "Tranche",
    rate: "Taux",
    taxAmount: "Montant impôt",
    
    chatbotTitle: "Assistant Fiscal IA",
    inDevelopment: "Dafa ci liggéey",
    comingSoon: "Bii dina am ba laaj. Dinaa mën laaj sa xalaatu impôt ci làkk bu yaatu.",
    backToHome: "Dellu ci kër",
    
    aboutTitle: "Ci Sama Wareef",
    mission: "Suñu mission",
    missionText: "Démocratiser l'accès à l'information fiscale ak walluwaat citoyens yu Senegaal ci xam impôt yi.",
  },
  
  ff: {
    appName: "Sama Wareef",
    tagline: "Faamu impôt, Wallite e yurnde leydi",
    description: "IA hawri yimɓe Senegal ngam faamu impôt",
    
    home: "Jaɓɓugol",
    simulator: "Simulateur",
    chatbot: "Assistant IA",
    formalization: "Formalisation",
    about: "Humpito",
    
    heroTitle: "Faamu impôt ngam wallitde heen",
    heroSubtitle: "Conseiller fiscal digital maa",
    startSimulation: "Fuɗɗo simulation",
    talkToAssistant: "Haala e assistant",
    
    taxSimulator: "Simulateur Impôt",
    annualIncome: "Yurnde hitaande (FCFA)",
    maritalStatus: "Ngonka suudu",
    single: "Gooto",
    married: "Renndo",
    numberOfChildren: "Limu ɓiɓɓe",
    calculate: "Limtu",
    reset: "Artir",
    
    results: "Jaabawol simulation",
    yourSituation: "Ngonka maa",
    taxBreakdown: "Ɓeydagol impôt",
    grossIncome: "Yurnde timmoonde",
    familyParts: "Parts fiscales",
    incomePerPart: "Yurnde e part",
    taxBeforeReduction: "Impôt avant réduction",
    taxReduction: "Réduction d'impôt",
    minimumTax: "Impôt minimum (TRIMF)",
    finalTax: "Impôt battinɗo maa",
    effectiveRate: "Taux effectif",
    marginalRate: "Taux marginal",
    
    progressiveBrackets: "Tranches progressives",
    bracket: "Tranche",
    rate: "Taux",
    taxAmount: "Montant impôt",
    
    chatbotTitle: "Assistant Fiscal IA",
    inDevelopment: "Ko gollaama",
    comingSoon: "Ɗuum mbaawi ɓeydude yeeso. Maa waawi naamndaade mbelu impôt e ɗemngal ganndal.",
    backToHome: "Rutto e jaɓɓugol",
    
    aboutTitle: "Faati Sama Wareef",
    mission: "Golle amen",
    missionText: "Démocratiser l'accès à l'information fiscale e wallitde yimɓe Senegal ngam faamde impôt maɓɓe.",
  },
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] || translations.fr[key] || key;
}
