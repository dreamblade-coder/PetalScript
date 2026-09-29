import { GoogleGenAI } from "@google/genai";
import { getCuratedStickerSvg, createUniversalCustomStickerSvg } from "./stickerArtwork";

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface AssistNoteRequest {
  originalNote?: string;
  mood: string; // 'joyful' | 'nostalgic' | 'apologetic' | 'romantic' | 'grateful' | 'poetic';
  action?: 'rewrite' | 'suggest';
  recipient?: string;
  sender?: string;
  occasion?: string;
  language?: string; // e.g. 'English', 'Spanish', 'French', 'German', 'Italian', 'Japanese', etc.
}

export interface GenerateStickerRequest {
  prompt: string;
}

export interface GeneratedStickerResponse {
  name: string;
  emoji: string;
  badgeLabel?: string;
  color: string;
  bgGrad: string;
  styleDescription: string;
  imageUrl?: string;
}

export async function generateStickerWithAI(params: GenerateStickerRequest): Promise<GeneratedStickerResponse> {
  const ai = getGeminiClient();
  const userPrompt = (params.prompt || '').trim();

  if (!userPrompt) {
    return generateFallbackSticker('Chibi Gift Charm');
  }

  // Check if we have a curated high-fidelity illustrated vector sticker first (e.g. Spiderman, Dragon holding tulip, Boba Panda)
  let generatedImageUrl: string | undefined = undefined;
  const curatedSvg = getCuratedStickerSvg(userPrompt);
  if (curatedSvg) {
    generatedImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(curatedSvg)}`;
  }

  // If not curated, attempt Gemini Image Generation or Gemini SVG vector creation
  if (!generatedImageUrl && ai) {
    try {
      const imageRes = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: `Cute kawaii die-cut vinyl sticker illustration of ${userPrompt}. Clean colorful vector art style, thick white sticker die-cut contour border, isolated on white background, no text, high quality digital sticker.`,
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      if (imageRes.candidates?.[0]?.content?.parts) {
        for (const part of imageRes.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch {
      // If image model unavailable, try Gemini SVG vector generation
      try {
        const svgRes = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: `You are an expert vector artist. Create a cute kawaii die-cut vector sticker illustration of "${userPrompt}".
Return a valid raw SVG with viewBox="0 0 200 200", width="200", height="200".
Include a thick white vinyl contour border stroke (#ffffff), colorful vector paths, cute chibi eyes/face, shading, and details.
No markdown backticks or explanations. Output ONLY raw <svg>...</svg>.`
        });
        const text = svgRes.text?.trim() || "";
        const match = text.match(/<svg[\s\S]*?<\/svg>/i);
        if (match) {
          generatedImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(match[0])}`;
        }
      } catch (svgErr) {
        console.warn("Gemini SVG generation error:", svgErr);
      }
    }
  }

  // Get name & metadata from Gemini 3.8 Flash (or fallback)
  if (!ai) {
    const fallback = generateFallbackSticker(userPrompt);
    return {
      ...fallback,
      imageUrl: generatedImageUrl || fallback.imageUrl,
    };
  }

  const prompt = `You are a creative sticker designer for a cute floral boutique gift studio.
The user wants to create a custom cute sticker: "${userPrompt}".

Return a JSON object with:
- "name": Cute short name for the sticker (e.g. "Chibi Spidey", "Baby Dragon with Tulip", "Boba Panda", "Midnight Cat")
- "emoji": The single best fitting or creative unicode emoji representing the character/item
- "badgeLabel": Short punchy badge text, 1-3 words max, all-caps or title (e.g. "SPIDEY", "DRAGON", "CUTE", "SWEET")
- "color": A vibrant hex color code matching the character (e.g. "#dc2626" for Spider-man, "#16a34a" for Dragon, "#ec4899" for pink, etc.)
- "bgGrad": Tailwind gradient class pair like "from-red-100 to-blue-100" or "from-pink-100 to-amber-100"
- "styleDescription": A 1-sentence whimsical description of the custom sticker.

Output ONLY valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text);
    const color = parsed.color || "#e11d48";
    const stickerName = parsed.name || userPrompt.slice(0, 20);

    // If image is still not generated, use our universal custom SVG generator
    if (!generatedImageUrl) {
      const customSvg = createUniversalCustomStickerSvg(stickerName, color);
      generatedImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(customSvg)}`;
    }

    return {
      name: stickerName,
      emoji: parsed.emoji || "✨",
      badgeLabel: parsed.badgeLabel || "CUSTOM",
      color,
      bgGrad: parsed.bgGrad || "from-amber-100 to-rose-100",
      styleDescription: parsed.styleDescription || `Custom sticker inspired by ${userPrompt}`,
      imageUrl: generatedImageUrl,
    };
  } catch (err) {
    console.error("Gemini sticker metadata error:", err);
    const fallback = generateFallbackSticker(userPrompt);
    return {
      ...fallback,
      imageUrl: generatedImageUrl || fallback.imageUrl,
    };
  }
}

function generateFallbackSticker(prompt: string): GeneratedStickerResponse {
  const p = prompt.toLowerCase();
  const curated = getCuratedStickerSvg(prompt);
  const fallbackSvgUrl = curated
    ? `data:image/svg+xml;utf8,${encodeURIComponent(curated)}`
    : `data:image/svg+xml;utf8,${encodeURIComponent(createUniversalCustomStickerSvg(prompt || 'Chibi Sticker'))}`;

  if (p.includes('dragon')) {
    return {
      name: 'Baby Dragon with Tulip',
      emoji: '🐲',
      badgeLabel: 'TULIP DRAGON',
      color: '#16a34a',
      bgGrad: 'from-emerald-100 to-teal-200',
      styleDescription: 'A cute baby green dragon holding a blooming pink tulip flower',
      imageUrl: fallbackSvgUrl,
    };
  }
  if (p.includes('spiderman') || p.includes('spider')) {
    return {
      name: 'Chibi Spiderman',
      emoji: '🕷️',
      badgeLabel: 'SPIDEY',
      color: '#dc2626',
      bgGrad: 'from-red-100 to-blue-100',
      styleDescription: 'Chibi Spider-man superhero in iconic red and blue suit with web lines',
      imageUrl: fallbackSvgUrl,
    };
  }
  if (p.includes('panda')) {
    return {
      name: 'Boba Panda',
      emoji: '🐼',
      badgeLabel: 'BOBA PANDA',
      color: '#1e293b',
      bgGrad: 'from-slate-100 to-slate-200',
      styleDescription: 'Chubby playful panda chewing sweet boba milk tea',
      imageUrl: fallbackSvgUrl,
    };
  }
  if (p.includes('cat') || p.includes('kitten')) {
    return {
      name: 'Astronaut Kitty',
      emoji: '🐱',
      badgeLabel: 'SPACE CAT',
      color: '#ea580c',
      bgGrad: 'from-orange-50 to-amber-100',
      styleDescription: 'Cute ginger astronaut kitten floating in space with flowers',
      imageUrl: fallbackSvgUrl,
    };
  }
  if (p.includes('dog') || p.includes('puppy') || p.includes('corgi')) {
    return {
      name: 'Strawberry Corgi',
      emoji: '🐶',
      badgeLabel: 'CORGI LOAF',
      color: '#d97706',
      bgGrad: 'from-amber-50 to-yellow-100',
      styleDescription: 'Happy smiling golden corgi loaf wearing a strawberry hat',
      imageUrl: fallbackSvgUrl,
    };
  }
  return {
    name: prompt ? prompt.slice(0, 20) : 'Custom Sticker',
    emoji: '✨',
    badgeLabel: 'SPECIAL',
    color: '#ec4899',
    bgGrad: 'from-pink-100 to-rose-100',
    styleDescription: `Cute artisan illustrated sticker for ${prompt || 'your bouquet'}`,
    imageUrl: fallbackSvgUrl,
  };
}

export async function assistNoteWithAI(params: AssistNoteRequest) {
  const ai = getGeminiClient();
  const {
    originalNote = '',
    mood = 'joyful',
    action = 'rewrite',
    recipient = '',
    sender = '',
    occasion = '',
    language = 'English',
  } = params;

  if (!ai) {
    return generateFallback(originalNote, mood, action, recipient, sender, language);
  }

  const isRewrite = action === 'rewrite' && originalNote.trim().length > 0;

  const prompt = isRewrite
    ? `You are an expert wordsmith and floral editor for "Petalscript", an artisan digital florist.
Task: Read the sender's already written note and improve its eloquence, flow, grammar, and emotional warmth WITHOUT changing its literal meaning, key points, or personal intent.

Current Written Message: "${originalNote}"
Target Mood / Tone: ${mood} (e.g. joyful, nostalgic, apologetic, romantic, grateful, poetic)
Target Language: ${language || 'English'}
To: ${recipient || 'Recipient'}
From: ${sender || 'Sender'}
Occasion: ${occasion || 'Special moment'}

Strict Guidelines:
- PRESERVE LITERAL MEANING: Keep every specific sentiment, mention, promise, or core thought from the original note intact. Do not invent unrelated stories or alter what the sender meant.
- ELEVATE & POLISH: Fix awkward phrasing, enhance vocabulary, smooth transitions, and add gentle poetic resonance suited for a flower greeting card.
- Write ENTIRELY in ${language || 'English'} with natural cultural flow.
- Keep length comparable (2-4 sentences). Do not leave placeholders like "[Your Name]".
- Return a JSON object with:
  "suggestedNote": "the improved note preserving the exact literal meaning in ${language || 'English'}",
  "moodLabel": "${mood}",
  "alternativeNote": "a second slightly different phrasing that also strictly preserves the original literal meaning"

Output ONLY valid JSON.`
    : `You are an expert wordsmith and greeting card author for "Petalscript", an artisan digital florist.
Task: Suggest a beautiful, heartfelt message to accompany a flower bouquet based on the chosen mood and language.

Target Mood: ${mood} (e.g. joyful, nostalgic, apologetic, romantic, grateful, poetic)
Target Language: ${language || 'English'}
To: ${recipient || 'Dear friend'}
From: ${sender || 'Warm regards'}
Occasion: ${occasion || 'Special moment'}

Guidelines:
- Write the message ENTIRELY in ${language || 'English'} with authentic, natural cultural phrasing and poetic elegance.
- Compose a touching greeting card message that embodies the "${mood}" mood.
- Keep it natural, warm, and poetic (2-4 sentences).
- Return a JSON object with:
  "suggestedNote": "the primary suggested note text in ${language || 'English'}",
  "moodLabel": "${mood}",
  "alternativeNote": "a second alternative suggestion in the same mood in ${language || 'English'}"

Output ONLY valid JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text);
    return {
      suggestedNote: parsed.suggestedNote || originalNote || generateFallback(originalNote, mood, action, recipient, sender, language).suggestedNote,
      moodLabel: parsed.moodLabel || mood,
      alternativeNote: parsed.alternativeNote || "",
    };
  } catch (error) {
    console.error("Gemini AI note assistant error:", error);
    return generateFallback(originalNote, mood, action, recipient, sender, language);
  }
}

function generateFallback(
  original: string,
  mood: string,
  action: 'rewrite' | 'suggest',
  recipient?: string,
  sender?: string,
  language: string = 'English'
) {
  const to = recipient ? `Dear ${recipient}, ` : '';
  const from = sender ? ` With love, ${sender}` : '';

  if (language === 'Spanish' || language === 'Español') {
    switch (mood.toLowerCase()) {
      case 'apologetic':
        return {
          suggestedNote: `${recipient ? `Para ${recipient}, ` : ''}Desde lo más profundo de mi corazón, te pido sinceras disculpas. Valoro nuestra conexión infinitamente y espero que estas flores traigan paz y un nuevo comienzo.${sender ? ` Con cariño, ${sender}` : ''}`,
          moodLabel: 'apologetic',
          alternativeNote: 'Las palabras no pueden deshacer errores, pero mi arrepentimiento es sincero. Acepta este ramo con toda mi esperanza de reconciliación.',
        };
      case 'grateful':
        return {
          suggestedNote: `${recipient ? `Para ${recipient}, ` : ''}No hay palabras suficientes para agradecer tu generosidad, apoyo y bondad. Eres un regalo maravilloso en mi vida.${sender ? ` Con gratitud, ${sender}` : ''}`,
          moodLabel: 'grateful',
          alternativeNote: 'Gracias infinitas por estar siempre a mi lado en cada paso.',
        };
      case 'joyful':
      default:
        return {
          suggestedNote: `${recipient ? `Para ${recipient}, ` : ''}¡Que estas flores llenen tu día de alegría, sonrisas y luz radiante como tú lo haces con todos los que te rodean!${sender ? ` Con amor, ${sender}` : ''}`,
          moodLabel: mood,
          alternativeNote: '¡Te deseo una celebración llena de bendiciones, risas y momentos inolvidables!',
        };
    }
  }

  if (language === 'French' || language === 'Français') {
    switch (mood.toLowerCase()) {
      case 'apologetic':
        return {
          suggestedNote: `${recipient ? `Chère/Cher ${recipient}, ` : ''}Du fond du cœur, je te présente mes sincères excuses. Je tiens infiniment à toi et j'espère que ces fleurs apporteront paix et réconciliation.${sender ? ` Avec tendresse, ${sender}` : ''}`,
          moodLabel: 'apologetic',
          alternativeNote: 'Pardonne-moi mes maladresses. Ces quelques fleurs portent tout mon regret sincère et mon affection.',
        };
      case 'grateful':
        return {
          suggestedNote: `${recipient ? `Chère/Cher ${recipient}, ` : ''}Les mots sont trop doux pour exprimer toute ma gratitude pour ta gentillesse et ton soutien précieux.${sender ? ` Avec reconnaissance, ${sender}` : ''}`,
          moodLabel: 'grateful',
          alternativeNote: 'Merci infiniment pour tout ce que tu fais et pour ta présence chaleureuse.',
        };
      case 'joyful':
      default:
        return {
          suggestedNote: `${recipient ? `Chère/Cher ${recipient}, ` : ''}Que ces fleurs apportent autant d'éclat et de bonheur à ta journée que ta présence en apporte autour de toi !${sender ? ` Avec tout mon amour, ${sender}` : ''}`,
          moodLabel: mood,
          alternativeNote: 'Un souffle de bonheur et de douceur fleurie pour illuminer ta journée !',
        };
    }
  }

  switch (mood.toLowerCase()) {
    case 'joyful':
      return {
        suggestedNote: `${to}May these bright blooms bring as much pure sunshine and laughter to your day as you bring to everyone around you! Celebrating you today and always.${from}`,
        moodLabel: 'joyful',
        alternativeNote: `${to}Sending you a radiant bundle of joy! Here's to making wonderful memories and celebrating all the good things in life.${from}`,
      };
    case 'nostalgic':
      return {
        suggestedNote: `${to}Looking at these flowers brings back so many sweet memories of the times we've shared. Time moves forward, but those golden moments remain as vibrant as ever in my heart.${from}`,
        moodLabel: 'nostalgic',
        alternativeNote: `${to}Like a familiar melody or the scent of rain, every memory with you is a treasure I hold dear. Thinking of our journey together today.${from}`,
      };
    case 'apologetic':
      return {
        suggestedNote: `${to}From the quietest corner of my heart, I am truly sorry for my words and actions. I value you more than I can express, and I hope these blossoms bring peace and a gentle beginning to healing.${from}`,
        moodLabel: 'apologetic',
        alternativeNote: `${to}Words cannot undo mistakes, but my regret is sincere. Please accept this bouquet as a humble token of my deep affection and hope for reconciliation.${from}`,
      };
    case 'romantic':
      return {
        suggestedNote: `${to}Like petals opening under morning light, every thought of you fills my world with warmth and wonder. Loving you is my favorite adventure.${from}`,
        moodLabel: 'romantic',
        alternativeNote: `${to}In a universe full of fleeting moments, you will always be my most cherished constant. Forever yours.${from}`,
      };
    case 'grateful':
      return {
        suggestedNote: `${to}Words feel too small for the gratitude I hold in my heart. Thank you for your kindness, patience, and for being such an extraordinary blessing in my life.${from}`,
        moodLabel: 'grateful',
        alternativeNote: `${to}Thank you endlessly for always standing by me. Your generosity and warmth mean the entire world to me.${from}`,
      };
    case 'poetic':
    default:
      return {
        suggestedNote: `${to}Soft as morning dew and timeless as the seasons, may these blossoms carry whispers of what words cannot fully hold. Thinking of you today.${from}`,
        moodLabel: 'poetic',
        alternativeNote: `${to}Where petals bloom, hope whispers. Sending you this quiet garden of warmth and peace.${from}`,
      };
  }
}
