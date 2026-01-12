import { Request, Response } from 'express';
import { aiClient } from '../../shared/ai-models/ai-client';

export const englishGrammarController = async (req: Request, res: Response) => {
  try {
    const { level, concept, description, example, theme } = req.body;

    const topic = {
      level: level || 'B1',
      concept: concept || 'Grammar',
      description: description || 'No description provided',
      example: example || 'No example provided',
      theme: theme || "light",
    };

    const prompt = `Act as a professional English teacher. Provide a detailed, easy-to-understand grammar explanation in English for:
- Level: ${topic.level}
- Concept: ${topic.concept}
- Description: ${topic.description}
- Example: ${topic.example}

Give your answer in B1/B2 English.

IMPORTANT: Please provide the response in valid, semantic HTML format with Tailwind classes with the theme ${topic.theme} (without \`\`\`html code blocks or markdown). 
Do NOT use markdown symbols like **, ##, or -.`;

    const { text: generatedText } = await aiClient.ask(prompt);
    const text = generatedText || "Sorry, I couldn't generate an explanation at this moment.";

    // Basic formatting: replace double newlines with <br/><br/> and **bold** with <b>
    // Although the prompt asks for no markdown, the fallback logic is requested by the user.
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    res.status(200).json({ data: formattedText });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({ errors: [{ message: 'Internal server error' }] });
  }
};


export const englishPhrasalVerbMasterController = async (req: Request, res: Response) => {
  try {
    const { verb } = req.body;

    const input = { verb: verb || 'Not provided' };

    const prompt = `**Act as an expert English teacher and linguist for a Spanish-speaking student.**
I will provide you with a **phrasal verb**. Your task is to generate a strictly formatted **JSON object** containing detailed grammatical, semantic, and morphological information about that verb.
**Requirements:**
1. **Role:** You are teaching a Spanish speaker. All \`translation\` and \`es\` fields must be in natural, accurate Spanish.
2. **Format:** Output **only** the JSON code. Do not include markdown formatting like \`\`\`json or intro text.
3. **Completeness:** Do not leave any field empty. If a meaning doesn't exist for a specific context, omit that specific context object, but ensure the main keys remain.
4. **Tenses:** You must provide examples for exactly these 8 tenses: *Present Simple, Present Continuous, Past Simple, Past Continuous, Future (Will), Future (Going to), Present Perfect, Past Perfect.*
5. **Grammar:** Clearly explain if the verb is separable or inseparable. If it varies by meaning, explain the distinction.

**JSON Structure & Example:**
You must follow this exact schema (using "take off" as the template):

\`\`\`json
{
  "verb": "take off",
  "translation": "Despegar / Quitarse",
  "level": "B1",
  "meanings": [
    { "context": "Aviation", "definition": "To leave the ground and begin to fly.", "translation": "Despegar" },
    { "context": "Clothing", "definition": "To remove a piece of clothing from one's body.", "translation": "Quitarse (ropa)" },
    { "context": "Success", "definition": "To become successful or popular very suddenly.", "translation": "Tener éxito repentino" }
  ],
  "morphology": {
    "infinitive": "To take off",
    "thirdPerson": "Takes off",
    "pastSimple": "Took off",
    "pastParticiple": "Taken off",
    "gerund": "Taking off"
  },
  "tenses": [
    { "name": "Present Simple", "en": "The plane takes off at 8:00 AM.", "es": "El avión despega a las 8:00 AM." },
    { "name": "Present Continuous", "en": "He is taking off his jacket now.", "es": "Él se está quitando la chaqueta ahora." },
    { "name": "Past Simple", "en": "Her career finally took off last year.", "es": "Su carrera finalmente despegó el año pasado." },
    { "name": "Past Continuous", "en": "I was taking off my shoes when the phone rang.", "es": "Me estaba quitando los zapatos cuando sonó el teléfono." },
    { "name": "Future (Will)", "en": "I think the new product will take off soon.", "es": "Creo que el nuevo producto tendrá éxito pronto." },
    { "name": "Future (Going to)", "en": "The flight is going to take off on time.", "es": "El vuelo va a despegar a tiempo." },
    { "name": "Present Perfect", "en": "Have you taken off your hat?", "es": "¿Te has quitado el sombrero?" },
    { "name": "Past Perfect", "en": "The plane had already taken off when I arrived.", "es": "El avión ya había despegado cuando llegué." }
  ],
  "grammar": {
    "type": "Separable / Inseparable",
    "details": [
      { "label": "Separable", "text": "Yes (for clothing): Take it off / Take off your coat.", "translation": "Es separable (para ropa/objetos)." },
      { "label": "Inseparable", "text": "No (for aviation/success): The plane took off.", "translation": "Es inseparable (para aviación/éxito)." }
    ]
  }
}
\`\`\`

**My Phrasal Verb is:** "${input.verb}"
`;

    const { text } = await aiClient.ask(prompt);

    // The prompt requests only JSON. Gemini may still wrap it in ```json ... ```.
    // Strip fences and, if possible, parse to real JSON.
    const rawText = typeof text === 'string' ? text.trim() : '';
    const unfenced = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    try {
      const parsed = JSON.parse(unfenced);
      res.status(200).json({ data: parsed });
    } catch {
      res.status(500).send({ errors: [{ message: "Sorry, I couldn't generate an explanation at this moment." }] });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send({ errors: [{ message: 'Internal server error' }] });
  }
};
