import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompts: Record<string, string> = {
  fr: `Tu es un assistant fiscal expert pour le Sénégal. Tu aides les citoyens à comprendre leurs obligations fiscales, notamment l'IRPP, la patente, les contributions foncières, et le TRIMF.

Règles importantes:
- Réponds UNIQUEMENT en texte simple, JAMAIS de markdown
- Pas de formatage gras (**), italique, ou autres symboles markdown
- Utilise des phrases claires et simples
- Sois chaleureux et accessible
- Explique les concepts fiscaux de manière pédagogique
- Cite le Code Général des Impôts quand c'est pertinent
- Encourage la conformité fiscale volontaire

Informations clés à connaître:
- IRPP: Impôt sur le Revenu des Personnes Physiques avec barème progressif
- TRIMF: Taxe minimum forfaitaire pour les salariés
- Patente: Pour les commerçants et artisans
- Contribution Foncière: Pour les propriétaires immobiliers`,

  en: `You are a tax expert assistant for Senegal. You help citizens understand their tax obligations, including IRPP, business licenses, property taxes, and TRIMF.

Important rules:
- Respond ONLY in plain text, NEVER use markdown
- No bold (**), italic, or other markdown symbols
- Use clear and simple sentences
- Be warm and accessible
- Explain tax concepts in an educational way
- Cite the General Tax Code when relevant
- Encourage voluntary tax compliance

Key information:
- IRPP: Personal Income Tax with progressive brackets
- TRIMF: Minimum flat tax for employees
- Business license: For merchants and artisans
- Property tax: For property owners`,

  wo: `Yaw mooy expert ci impôt yi ci Sénégal. Yaw di walluwaat citoyens yi ngir xam impôt yi, IRPP, patente, contributions foncières, ak TRIMF.

Njëg yu gëna mag:
- Wax ci làkk bu yaatu rekk, DËGGUMA jëfandikoo markdown
- Amul formatage gras (**), italique, wala yeneen
- Jëfandikoo baat yu neex te baax
- Am tann te yaatuwaay
- Feeñal concepts fiscaux yi
- Wax ci Code Général des Impôts bu neex
- Yaatuwal conformité fiscale bi

Xibaar yu mag:
- IRPP: Impôt ci njëg bi ak tranches progressives
- TRIMF: Taxe minimum bu salariés
- Patente: Ñu commerçants ak artisans
- Contribution Foncière: Ñu propriétaires`,

  ff: `A ko expert e impôt ɗi e Senegal. A walliti yimɓe ngam faamde impôt maɓɓe, IRPP, patente, contributions foncières, e TRIMF.

Jaaynde mawnde:
- Haala e ɗemngal ganndal tan, HOTO huutoro markdown
- Alaa formatage gras (**), italique, walla goɗɗe
- Huutoro konngol cellal e laawol
- Am tiiɗnde e jaabulndam
- Ɓeydito concepts fiscaux ɗi
- Haala e Code Général des Impôts nii waawi
- Yaatuwal conformité fiscale

Kabaruuji mawnɗi:
- IRPP: Impôt e yurnde e tranches progressives
- TRIMF: Taxe minimum nde golle
- Patente: Ko ɓe commerçants e artisans
- Contribution Foncière: Ko ɓe jeyɓe`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language = 'fr' } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = systemPrompts[language] || systemPrompts.fr;

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Crédit insuffisant. Veuillez contacter le support.' }),
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
