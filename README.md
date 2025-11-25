# 🇸🇳 Sama Wareef - Simulateur Fiscal Sénégalais

**Sama Wareef** (Mon Impôt en Wolof) est une plateforme web interactive qui aide les citoyens sénégalais à comprendre leurs obligations fiscales et à calculer facilement leurs impôts.

## 📖 Description du Projet

Sama Wareef a été conçu pour démocratiser l'accès à l'information fiscale au Sénégal. L'application s'adresse principalement aux citoyens non-salariés et aux acteurs du secteur informel qui souhaitent :
- Comprendre leurs obligations fiscales
- Estimer leurs impôts avant de les payer
- Se formaliser en toute connaissance de cause
- Accéder à l'information en plusieurs langues (Français, Anglais, Wolof, Pulaar)

### 🎯 Public Cible

- 🏪 Commerçants et épiciers
- 👔 Artisans (menuisiers, couturiers, mécaniciens, etc.)
- 💼 Prestataires de services et professions libérales
- 🏠 Bailleurs et propriétaires immobiliers
- 👥 Acteurs du secteur informel en voie de formalisation
- 💰 Salariés qui veulent comprendre leur IRPP

---

## 🌟 Fonctionnalités Principales

### 1. 📊 Simulateurs Fiscaux Interactifs

**Pages concernées :** `/simulator`

L'application propose **5 simulateurs fiscaux** adaptés à différents profils :

#### a) Simulateur IRPP Salarié
- **Pour qui ?** Les salariés qui veulent calculer leur Impôt sur le Revenu des Personnes Physiques
- **Que fait-il ?** 
  - Calcule l'impôt selon le barème progressif sénégalais
  - Prend en compte la situation familiale (célibataire, marié, divorcé, veuf, séparé, union libre)
  - Applique les parts fiscales selon le nombre d'enfants
  - Calcule les réductions d'impôts
  - Applique le TRIMF (Taxe Représentative de l'Impôt Minimum Forfaitaire)
- **Résultats fournis :**
  - Parts familiales
  - Revenu par part
  - Détail par tranche d'imposition
  - Réductions d'impôts appliquées
  - Impôt final à payer
  - Taux effectif et taux marginal

#### b) Simulateur Commerçant / Artisan
- **Pour qui ?** Les indépendants (commerçants, artisans, prestataires de services, professions libérales)
- **Que fait-il ?**
  - Calcule l'Impôt sur le Revenu (IR)
  - Calcule la CEL (Contribution Économique Locale) - Part Valeur Ajoutée
  - Calcule la CEL - Part Locaux professionnels
  - Applique les abattements forfaitaires par type d'activité (30% commerce, 50% artisanat/services, 34% libéral)
  - Permet de choisir entre charges réelles ou abattement forfaitaire
- **Résultats fournis :**
  - Revenu net imposable
  - IR calculé selon le barème progressif
  - CEL - Valeur Ajoutée
  - CEL - Locaux
  - Total des impôts
  - Taux effectif

#### c) Simulateur Bailleur
- **Pour qui ?** Les propriétaires qui louent des biens immobiliers
- **Que fait-il ?**
  - Calcule l'IR sur les revenus fonciers
  - Calcule la retenue à la source (5% si locataire entreprise)
  - Calcule la CFPB (Contribution Foncière des Propriétés Bâties)
  - Prend en compte le type de bien (appartement, maison, meublé, commercial)
  - Gère plusieurs biens immobiliers
- **Résultats fournis :**
  - Loyers bruts totaux
  - Revenus nets après charges
  - Retenue à la source (si applicable)
  - IR foncier
  - CFPB
  - Total des impôts
  - Taux effectif

#### d) Simulateur Propriétaire
- **Pour qui ?** Les propriétaires de biens immobiliers (bâtis ou terrains nus)
- **Que fait-il ?**
  - Calcule la CFPB pour les propriétés bâties (5% de la valeur locative)
  - Calcule la CFPNB pour les terrains non bâtis (3% de la valeur estimée)
  - Prend en compte les exonérations éventuelles
- **Résultats fournis :**
  - Base imposable
  - CFPB ou CFPNB selon le type
  - Total des impôts fonciers

#### e) Simulateur Secteur Informel
- **Pour qui ?** Les acteurs du secteur informel qui veulent se formaliser
- **Types d'activités :** Boutique/épicerie, coiffure, couture, transport, vendeur de rue, mécanique, etc.
- **Que fait-il ?**
  - Estime les impôts avec des abattements simplifiés (40-50% selon l'activité)
  - Calcule l'IR sur le revenu estimé
  - Calcule la CEL - Valeur Ajoutée
  - Calcule la CEL - Locaux (si l'activité dispose d'un local)
  - Accepte des estimations approximatives du chiffre d'affaires
- **Résultats fournis :**
  - CA annuel estimé (mensuel × 12)
  - Revenu net après abattement
  - IR simplifié
  - CEL - Valeur Ajoutée
  - CEL - Locaux (si applicable)
  - Total des impôts estimés
  - Taux effectif

---

### 2. 🤖 Assistant Fiscal IA (Chatbot)

**Page concernée :** `/chatbot`

Un assistant virtuel intelligent qui répond à vos questions fiscales en temps réel.

**Fonctionnalités :**
- Répond aux questions sur la fiscalité sénégalaise
- Explique les démarches administratives
- Guide dans le choix du bon simulateur
- Disponible en 4 langues (Français, Anglais, Wolof, Pulaar)
- Interface conversationnelle intuitive
- Historique des conversations
- Réponses personnalisées selon votre situation

**Exemples de questions :**
- "Comment calculer mon impôt si je suis commerçant ?"
- "C'est quoi le TRIMF ?"
- "Quelles sont les démarches pour se formaliser ?"
- "Quelle est la différence entre CFPB et CFPNB ?"

---

### 3. 📚 Centre d'Information Fiscale

**Page concernée :** `/information` (accessible via le menu)

Un guide complet sur le système fiscal sénégalais.

**Contenu disponible :**
- Lexique fiscal (définitions des termes techniques)
- Guides par type de contribuable
- Barèmes fiscaux actualisés
- Calendrier fiscal
- Démarches administratives
- Questions fréquentes (FAQ)
- Contacts utiles (DGID, Centres des Impôts)

**Organisation :**
- Informations organisées par thématiques
- Recherche facilitée
- Exemples concrets et cas pratiques
- Téléchargement de documents utiles

---

### 4. 📝 Guide de Formalisation

**Page concernée :** `/formalization`

Un parcours guidé pour transformer votre activité informelle en entreprise formelle.

**Fonctionnalités :**
- **Questionnaire personnalisé** : Répondez à quelques questions sur votre activité
- **Recommandations adaptées** : Régime fiscal et forme juridique recommandés selon votre profil
- **Parcours étape par étape** : Guide détaillé des démarches à suivre

**Étapes couvertes :**

Pour les petites activités (CA < 50M FCFA) :
1. Inscription au Registre du Commerce
2. Déclaration Fiscale et obtention du NINEA
3. Affiliation IPRES/CSS
4. Paiement de la CGU (Contribution Globale Unique)

Pour les activités plus importantes (CA > 50M FCFA) :
1. Rédaction des statuts
2. Enregistrement à l'APIX
3. Ouverture d'un compte bancaire professionnel
4. Déclarations et cotisations régulières

**Informations fournies pour chaque étape :**
- Documents requis
- Frais approximatifs
- Lieux où se rendre
- Délais de traitement

---

### 5. 🌍 Multilingue

**Disponible sur toutes les pages**

L'application est entièrement traduite en 4 langues :
- 🇫🇷 **Français** : Langue principale
- 🇬🇧 **Anglais** : English
- 🇸🇳 **Wolof** : Langue nationale
- 🇸🇳 **Pulaar** : Langue nationale

**Changement de langue :**
- Sélecteur de langue dans l'en-tête (coin supérieur droit)
- Changement instantané sans rechargement
- Toutes les fonctionnalités disponibles dans toutes les langues

---

### 6. 🏠 Page d'Accueil

**Page concernée :** `/` (page d'accueil)

Point d'entrée de l'application avec :
- **Section Hero** : Présentation du projet et actions principales
- **Carrousel de services** : Découverte interactive des fonctionnalités
- **Appel à l'action** : Accès rapide aux simulateurs

**Navigation :**
- Accès direct aux simulateurs
- Lien vers le chatbot
- Présentation des services
- Menu de navigation complet

---

## 🧮 Barèmes et Calculs Fiscaux Appliqués

### Barème Progressif de l'IR (Impôt sur le Revenu)

| Tranche | Revenu annuel (FCFA) | Taux |
|---------|---------------------|------|
| 1 | 0 - 630 000 | 0% |
| 2 | 630 001 - 1 500 000 | 20% |
| 3 | 1 500 001 - 4 000 000 | 30% |
| 4 | 4 000 001 - 8 000 000 | 35% |
| 5 | 8 000 001 - 13 500 000 | 37% |
| 6 | 13 500 001 et plus | 40% |

### TRIMF (Taxe Représentative de l'Impôt Minimum Forfaitaire)

| Revenu annuel (FCFA) | Montant TRIMF |
|---------------------|---------------|
| 0 - 599 999 | 900 FCFA |
| 600 000 - 999 999 | 3 600 FCFA |
| 1 000 000 - 1 999 999 | 4 800 FCFA |
| 2 000 000 - 6 999 999 | 12 000 FCFA |
| 7 000 000 - 11 999 999 | 18 000 FCFA |
| 12 000 000 et plus | 36 000 FCFA |

### Réductions d'Impôts selon les Parts Familiales

| Parts | Taux réduction | Minimum | Maximum |
|-------|---------------|---------|---------|
| 1 | 0% | 0 | 0 |
| 1.5 | 10% | 100 000 | 300 000 |
| 2 | 15% | 200 000 | 650 000 |
| 2.5 | 20% | 300 000 | 1 100 000 |
| 3 | 25% | 400 000 | 1 650 000 |
| 3.5 | 30% | 500 000 | 2 030 000 |
| 4 | 35% | 600 000 | 2 490 000 |
| 4.5 | 40% | 700 000 | 2 755 000 |
| 5 | 45% | 800 000 | 3 180 000 |

### Abattements Forfaitaires

**Secteur formel :**
- Commerce : 30%
- Artisanat : 50%
- Services : 50%
- Profession libérale : 34%

**Secteur informel :**
- Boutique/Épicerie : 40%
- Coiffure : 50%
- Couture : 50%
- Transport : 35%
- Vendeur de rue : 45%
- Mécanique : 45%

### Autres Taux

- **CEL - Part Valeur Ajoutée** : 0,5%
- **CEL - Part Locaux** : 10%
- **CFPB** (Propriétés bâties) : 5%
- **CFPNB** (Terrains nus) : 3%
- **Retenue à la source** (locataire entreprise) : 5%

### Calcul des Parts Familiales

```
Base : 1 part (célibataire)
Marié(e) ou union libre : 2 parts
Divorcé(e), veuf/veuve, séparé(e) avec enfants : 1.5 parts
+ 0.5 part par enfant
Maximum : 5 parts
```

---

## 📱 Navigation dans l'Application

### Structure des Pages

```
🏠 Accueil (/)
│
├── 📊 Simulateurs (/simulator)
│   ├── 💼 Salarié IRPP
│   ├── 🏪 Commerçant / Artisan
│   ├── 🏠 Bailleur
│   ├── 🏗️ Propriétaire
│   └── 👥 Secteur Informel
│
├── 🤖 Assistant IA (/chatbot)
│
├── 📚 Information Fiscale (/information)
│
├── 📝 Guide Formalisation (/formalization)
│
└── ℹ️ À Propos (/about)
```

### Menu Principal

Accessible depuis toutes les pages, le menu en haut permet de :
- Changer de langue (FR, EN, WO, FF)
- Naviguer entre les sections
- Accéder rapidement aux simulateurs
- Retourner à l'accueil

---

## 💡 Comment Utiliser l'Application

### Étape 1 : Choisir votre profil
Allez sur la page `/simulator` et sélectionnez le simulateur correspondant à votre situation :
- Salarié → Simulateur IRPP
- Commerçant/Artisan → Simulateur Business
- Propriétaire louant → Simulateur Bailleur
- Propriétaire simple → Simulateur Propriétaire
- Activité informelle → Simulateur Secteur Informel

### Étape 2 : Remplir le formulaire
Entrez vos informations :
- Revenus ou chiffre d'affaires
- Charges et dépenses
- Situation familiale (pour salarié)
- Type de bien (pour propriétaire)
- Type d'activité

### Étape 3 : Obtenir vos résultats
- Cliquez sur "Calculer"
- Visualisez le détail de vos impôts
- Comprenez chaque ligne de calcul
- Notez votre taux effectif

### Étape 4 : Aller plus loin
- Posez des questions au chatbot
- Consultez le guide de formalisation
- Lisez les informations complémentaires

---

## 🔧 Technologies Utilisées

### Frontend
- **React 18** : Framework JavaScript
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling moderne
- **shadcn/ui** : Composants UI
- **Vite** : Build tool rapide

### Backend
- **Lovable Cloud** : Backend automatique
- **Supabase** : Base de données (futur)

### Navigation
- **React Router** : Routing
- **Context API** : Gestion d'état global

---

## 🎨 Design et Accessibilité

- ✅ **Responsive** : Fonctionne sur mobile, tablette et desktop
- ✅ **Multilingue** : 4 langues disponibles
- ✅ **Accessible** : Interfaces claires et intuitives
- ✅ **Moderne** : Design épuré et professionnel
- ✅ **Performant** : Chargement rapide

---

## 📞 Contact et Support

Pour toute question ou suggestion :
- 🤖 Utilisez notre chatbot intelligent
- 📧 Contactez la DGID (Direction Générale des Impôts et des Domaines)
- 🏢 Visitez votre Centre des Impôts local

---

## 🚀 Évolutions Futures

### Fonctionnalités à venir :
- 📊 Graphiques et visualisations interactives
- 💾 Sauvegarde de l'historique des simulations
- 📄 Export PDF des résultats
- 🔐 Espace personnel avec authentification
- 📱 Application mobile native
- 🧾 Génération de déclarations fiscales
- 📅 Rappels et alertes fiscales

---

## 📄 Licence

Ce projet est développé dans le cadre de l'initiative **Sama Wareef** pour améliorer l'inclusion fiscale au Sénégal.

---

**Sama Wareef** - Rendons la fiscalité accessible à tous les Sénégalais 🇸🇳

*"Comprendre ses impôts, c'est participer au développement de son pays"*
