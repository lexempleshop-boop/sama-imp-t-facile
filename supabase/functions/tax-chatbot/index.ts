import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompts: Record<string, string> = {
  fr: `Tu es un conseiller fiscal bienveillant pour le Sénégal. Tu accompagnes les citoyens avec empathie.

STYLE OBLIGATOIRE:
- Sois CONCIS: réponds en 2-4 phrases maximum pour les questions simples
- Utilise un ton chaleureux et accessible
- Évite le jargon, explique simplement
- JAMAIS de markdown: pas de **, *, #, -, puces
- Texte simple uniquement avec paragraphes courts
- Cite les articles du CGI naturellement dans le texte
- Si la question est complexe, structure en courts paragraphes

CONNAISSANCES FISCALES CLÉS:

IMPÔT SUR LE REVENU (IR):
- Seuil exonération: <630 000 FCFA/an
- Barème: 0-630k=0%, 630k-1,5M=20%, 1,5M-4M=30%, 4M-8M=35%, 8M-13,5M=37%, >13,5M=40%

COMMERÇANTS ET ARTISANS:
- CGU si CA <50M: 2% commerçants, 5% prestataires (Article 141)
- Déclaration et paiement: 3 acomptes (février, avril, juin)

REVENUS FONCIERS (LOYERS):
- Abattement 30% sur revenus nets
- CGF si loyers <30M/an: forfait 1-2 mois de loyer
- Déclaration avant 30 avril

TRIMF (Taxe Minimum Salariés):
- Montant selon tranche de salaire annuel
- Plancher obligatoire même si IR calculé est inférieur

OBLIGATIONS:
- Sociétés: déclaration avant 30 avril
- Personnes physiques: avant 1er mai
- Plafond légal: impôt ne dépasse jamais 40% du revenu`,

  en: `You are a friendly tax advisor for Senegal. You help citizens with empathy.

MANDATORY STYLE:
- Be CONCISE: answer in 2-4 sentences max for simple questions
- Use warm and accessible tone
- Avoid jargon, explain simply
- NEVER use markdown: no **, *, #, -, bullets
- Plain text only with short paragraphs
- Cite CGI articles naturally in text

KEY TAX KNOWLEDGE:

INCOME TAX (IR):
- Exemption threshold: <630,000 FCFA/year
- Brackets: 0-630k=0%, 630k-1.5M=20%, 1.5M-4M=30%, 4M-8M=35%, 8M-13.5M=37%, >13.5M=40%

MERCHANTS AND ARTISANS:
- CGU if turnover <50M: 2% merchants, 5% services (Article 141)

RENTAL INCOME:
- 30% allowance on net income
- CGF if rent <30M/year

OBLIGATIONS:
- Companies: declaration before April 30
- Individuals: before May 1
- Legal cap: tax never exceeds 40% of income`,

  wo: `Yaw mooy expert ci impôt yi ci Sénégal. Wax ci làkk bu neex.

NJËG:
- Wax ci baat yu ndaw, 2-4 baat rekk
- Amul formatage markdown
- Jëfandikoo baat yu yaatu

IMPÔT:
- Seuil: <630 000 FCFA
- CGU: 2% commerçants, 5% prestations`,

  ff: `A ko expert e impôt ɗi e Senegal. Haala e ɗemngal ganndal.

JAAYNDE:
- Haala e konngol cellal, 2-4 tan
- Alaa markdown
- Huutoro konngol laawol

IMPÔT:
- Seuil: <630 000 FCFA
- CGU: 2% njulaaku, 5% golle`,
};

const expertPromptAddition = `

MODE EXPERT FISCALISTE:
Tu parles maintenant à un professionnel de la fiscalité. Tu peux être plus technique et précis:
- Cite les articles du CGI avec précision
- Mentionne les circulaires et jurisprudences pertinentes
- Donne des réponses plus détaillées et techniques
- Évite les simplifications excessives`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'fr', mode = 'citizen' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    let systemPrompt = systemPrompts[language] || systemPrompts.fr;
    
    // Add expert mode instructions
    if (mode === 'expert') {
      systemPrompt += expertPromptAddition;
    }

    console.log(`Tax chatbot request - Language: ${language}, Mode: ${mode}`);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
        max_tokens: mode === 'expert' ? 1000 : 400, // Shorter responses for citizens
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédit insuffisant.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error('Erreur du service IA');
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Tax chatbot error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
