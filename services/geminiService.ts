
import { GoogleGenAI, Type, FunctionDeclaration, GenerateContentResponse } from "@google/genai";
import type { VerseAnalysis, ThematicAnalysis, QaAnalysis, EventAnalysis, StoryArcAnalysis, PassageReference, ChatMessage, SystematicAnalysis, KnowledgeLevel, StudySession } from '../types';
import { SYSTEMATIC_STUDY_TOPICS } from '../systematicTopics';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- API Call Wrapper with Error Handling ---
const runGenerativeModel = async (config: any, errorMessage: string) => {
    try {
        const response = await ai.models.generateContent(config);
        // Add a check for empty candidates which can happen with recitation blocks
        if (!response.candidates || response.candidates.length === 0) {
            console.error("AI response was blocked or empty:", JSON.stringify(response, null, 2));
            throw new Error("The AI's response was blocked, likely due to safety settings or recitation concerns. Please try a different query.");
        }
        return response;
    } catch (error: any) {
        console.error(errorMessage, error);
        
        const errorString = error.toString();
        // Check for specific permission-related error messages from the API
        if (errorString.includes('PERMISSION_DENIED') || errorString.includes('API key not valid')) {
            throw new Error(
`API call failed due to a permission issue. Please check the following:
1. Your API key is correct and active in your project environment.
2. The "Generative Language API" (also known as "Vertex AI API") is enabled in your Google Cloud project.
3. Billing is enabled for your project, as some models require it.`
            );
        }
        
        throw new Error(`An error occurred with the AI service. Details: ${error.message || 'Unknown error'}`);
    }
}


// --- Helper for robust response parsing ---
const parseAiResponse = <T>(response: any): T => {
    let rawText = response.text;

    if (!rawText && response.candidates?.[0]?.content?.parts) {
        const textPart = response.candidates[0].content.parts.find((part: any) => !!part.text);
        if (textPart) {
            rawText = textPart.text;
        }
    }

    if (!rawText) {
        console.error("AI response missing text:", JSON.stringify(response, null, 2));
        throw new Error("The AI failed to generate a valid text response. The response was empty.");
    }

    const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    
    try {
        return JSON.parse(cleanedText) as T;
    } catch (e) {
        console.error("JSON Parse Error:", e, "Raw Text:", rawText);
        throw new SyntaxError("Failed to parse the AI's response. The format was invalid.");
    }
};

export const isTopicBiblicallyRelevant = async (topicOrQuestion: string, language: 'en' | 'tl'): Promise<boolean> => {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const prompt = `You are a topic classification assistant for a Bible study app. Your task is to determine if a user's input can be answered from a biblical, theological, church history, or Christian living perspective.
Do not be overly strict. For example, philosophical questions like "What is the meaning of life?" are relevant.
However, questions about specific non-religious historical figures (unless in a biblical context), modern politics unrelated to Christian ethics, hard science, or general trivia are NOT relevant.

The user's input is in ${languageName}. Respond also in ${languageName}.

Your entire response MUST be a single word: YES or NO.

User input: "${topicOrQuestion}"`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        const resultText = response.text.trim().toUpperCase();
        console.log(`Relevance check for "${topicOrQuestion}": ${resultText}`);
        return resultText === 'YES';
    } catch (error) {
        console.warn("Relevance check API call failed. Defaulting to relevant to avoid blocking user.", error);
        // Default to true to avoid blocking a valid query due to a transient error on the pre-flight check.
        return true; 
    }
};

const perspectiveItemSchema = {
    type: Type.OBJECT,
    properties: {
        viewpoint: { type: Type.STRING },
        description: { type: Type.STRING }
    },
    required: ["viewpoint", "description"]
};

const wordAnalysisItemSchema = {
    type: Type.OBJECT,
    properties: {
      word: { type: Type.STRING },
      original: { type: Type.STRING },
      transliteration: { type: Type.STRING },
      strongs: { type: Type.STRING },
      meaning: { type: Type.STRING },
      grammar: { type: Type.STRING },
      translationJourney: { type: Type.STRING, description: "Explains how the original word is translated into modern English, including etymology and any nuances lost or gained in translation." },
    },
    required: ["word", "original", "transliteration", "strongs", "meaning", "grammar", "translationJourney"],
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    connections: {
        type: Type.ARRAY,
        description: "A synthesized list of key connections found in the passage, drawing from all other analysis sections. This serves as a high-level summary.",
        items: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, enum: ['Story Arc', 'Key Theme', 'Key Figure', 'Key Doctrine', 'Symbol', 'Typology', 'Prophetic Link', 'Covenant'] },
                title: { type: Type.STRING, description: "The name of the connected item (e.g., 'The Life of David', 'Redemption', 'Abraham')." },
                description: { type: Type.STRING, description: "A brief explanation of the connection's relevance to the passage." }
            },
            required: ["type", "title", "description"]
        }
    },
    verseText: {
      type: Type.OBJECT,
      description: "The full text of the passage from the King James Version.",
      properties: {
        KJV: { type: Type.STRING },
      },
      required: ["KJV"],
    },
    verses: {
        type: Type.ARRAY,
        description: "An array of objects, one for each verse in the passage. Provides the verse number and its text from the KJV.",
        items: {
            type: Type.OBJECT,
            properties: {
                verse: { type: Type.INTEGER },
                text: { type: Type.STRING }
            },
            required: ["verse", "text"]
        }
    },
    wordAnalysis: {
      type: Type.ARRAY,
      description: "An array of objects for the most theologically significant words.",
      items: wordAnalysisItemSchema,
    },
    gospelHarmony: {
        type: Type.OBJECT,
        properties: {
            isGospel: { type: Type.BOOLEAN },
            parallels: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        reference: { type: Type.STRING },
                        text: { type: Type.STRING, description: "Short snippet of the parallel text." }
                    },
                    required: ["reference", "text"]
                }
            },
            uniqueFeatures: { type: Type.STRING, description: "Details unique to this specific gospel account." },
            synopticComparison: { type: Type.STRING, description: "Comparison with other gospels." }
        },
        required: ["isGospel", "parallels", "uniqueFeatures", "synopticComparison"]
    },
    textualCriticism: {
        type: Type.OBJECT,
        properties: {
            hasVariants: { type: Type.BOOLEAN },
            variants: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        verse: { type: Type.STRING },
                        variantText: { type: Type.STRING },
                        manuscripts: { type: Type.STRING, description: "e.g. Codex Sinaiticus, Textus Receptus" },
                        significance: { type: Type.STRING }
                    },
                    required: ["verse", "variantText", "manuscripts", "significance"]
                }
            },
            manuscriptReliability: { type: Type.STRING, description: "Discussion on the reliability of the text in this passage." }
        },
        required: ["hasVariants", "variants", "manuscriptReliability"]
    },
    proverbialConnections: {
      type: Type.ARRAY,
      description: "For Wisdom Books only. Thematically related verses from other Wisdom literature.",
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          verseText: { type: Type.STRING },
          connection: { type: Type.STRING, description: "Explanation of the thematic link." }
        },
        required: ["reference", "verseText", "connection"]
      }
    },
    propheticFulfillment: {
        type: Type.ARRAY,
        description: "Identifies Old Testament prophecies and their New Testament fulfillments.",
        items: {
            type: Type.OBJECT,
            properties: {
                reference: { type: Type.STRING },
                verseText: { type: Type.STRING },
                explanation: { type: Type.STRING, description: "Explanation of the prophetic link." },
                type: { type: Type.STRING, enum: ["Prophecy", "Fulfillment"], description: "Indicates if the linked verse is the Prophecy or the Fulfillment." }
            },
            required: ["reference", "verseText", "explanation", "type"]
        }
    },
    covenantalAnalysis: {
        type: Type.OBJECT,
        description: "For books of the Law (Genesis-Deuteronomy).",
        properties: {
            hasCovenantLink: { type: Type.BOOLEAN },
            links: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        covenant: { type: Type.STRING },
                        connection: { type: Type.STRING },
                        significance: { type: Type.STRING }
                    },
                    required: ["covenant", "connection", "significance"]
                }
            }
        },
        required: ["hasCovenantLink", "links"]
    },
    historicalCharacterAnalysis: {
        type: Type.OBJECT,
        description: "For Historical books (Joshua-Esther, Acts).",
        properties: {
            hasCharacters: { type: Type.BOOLEAN },
            characters: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        significance: { type: Type.STRING }
                    },
                    required: ["name", "role", "significance"]
                }
            }
        },
        required: ["hasCharacters", "characters"]
    },
    epistolaryAnalysis: {
        type: Type.OBJECT,
        description: "For Epistles (Romans-Jude).",
        properties: {
            isEpistle: { type: Type.BOOLEAN },
            argumentStructure: { type: Type.STRING },
            keyDoctrines: { type: Type.ARRAY, items: { type: Type.STRING } },
            originalApplication: { type: Type.STRING }
        },
        required: ["isEpistle", "argumentStructure", "keyDoctrines", "originalApplication"]
    },
    symbolismAnalysis: {
        type: Type.OBJECT,
        description: "Analysis of key symbols (objects, numbers, colors, actions) within the text.",
        properties: {
            hasSymbols: { type: Type.BOOLEAN },
            symbols: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        symbol: { type: Type.STRING },
                        meaning: { type: Type.STRING, description: "The cultural and literary meaning of the symbol." },
                        significance: { type: Type.STRING, description: "The theological significance of the symbol in this context." }
                    },
                    required: ["symbol", "meaning", "significance"]
                }
            }
        },
        required: ["hasSymbols", "symbols"]
    },
     typologyAnalysis: {
        type: Type.OBJECT,
        description: "Analysis of biblical typology, where an OT person, event, or institution prefigures one in the NT.",
        properties: {
            hasTypology: { type: Type.BOOLEAN },
            connections: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        type: { type: Type.STRING, description: "The Old Testament type (e.g., 'The Passover Lamb')." },
                        antitype: { type: Type.STRING, description: "The New Testament fulfillment (e.g., 'Jesus Christ')." },
                        explanation: { type: Type.STRING, description: "How the type prefigures the antitype." }
                    },
                    required: ["type", "antitype", "explanation"]
                }
            }
        },
        required: ["hasTypology", "connections"]
    },
    apocalypticSymbolism: {
        type: Type.OBJECT,
        description: "For the book of Revelation. Decodes symbols by grounding them in their OT context.",
        properties: {
            hasSymbols: { type: Type.BOOLEAN },
            symbols: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        symbol: { type: Type.STRING, description: "The symbol found in the text, e.g., 'Seven Lampstands'." },
                        otBackground: { type: Type.STRING, description: "Explanation of the symbol's roots in the Old Testament." },
                        symbolicMeaning: { type: Type.STRING, description: "The symbol's probable meaning in the context of Revelation." },
                        crossReferences: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key OT and NT cross-references." }
                    },
                    required: ["symbol", "otBackground", "symbolicMeaning", "crossReferences"]
                }
            }
        },
        required: ["hasSymbols", "symbols"]
    },
    storyArcConnection: {
      type: Type.OBJECT,
      nullable: true,
      description: "If this passage is a key part of a major biblical narrative arc (e.g., 'The Life of David'), provide the name of the arc and its relevance. Otherwise, null.",
      properties: {
        name: { type: Type.STRING },
        relevance: { type: Type.STRING }
      }
    },
    structuralAnalysis: {
        type: Type.OBJECT,
        properties: {
            literaryGenre: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            narrativeFlow: {
                type: Type.OBJECT,
                description: "For narrative genres only. Analyzes the story elements of the passage.",
                properties: {
                    isNarrative: { type: Type.BOOLEAN },
                    setting: { type: Type.STRING },
                    characters: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                role: { type: Type.STRING }
                            },
                            required: ["name", "role"]
                        }
                    },
                    plotSummary: { type: Type.STRING },
                    narrativeTechnique: { type: Type.STRING },
                    thematicDevelopment: { type: Type.STRING }
                },
                required: ["isNarrative", "setting", "characters", "plotSummary", "narrativeTechnique", "thematicDevelopment"]
            },
            literaryDevices: {
                type: Type.OBJECT,
                 properties: { items: { type: Type.ARRAY, items: { type: Type.STRING } }, relevance: { type: Type.STRING } },
                required: ["items", "relevance"]
            },
            figuresOfSpeech: {
                type: Type.ARRAY,
                description: "Identifies figures of speech like metaphors, similes, hyperbole, etc.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        figure: { type: Type.STRING },
                        example: { type: Type.STRING, description: "The specific text from the passage." },
                        explanation: { type: Type.STRING }
                    },
                    required: ["figure", "example", "explanation"]
                }
            },
            passageOutline: {
                type: Type.OBJECT,
                properties: {
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { point: { type: Type.STRING }, verses: { type: Type.STRING } },
                            required: ["point", "verses"]
                        }
                    },
                    relevance: { type: Type.STRING }
                },
                required: ["items", "relevance"]
            },
            discourseAnalysis: {
                 type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            grammaticalHighlights: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            }
        },
        required: ["literaryGenre", "narrativeFlow", "literaryDevices", "passageOutline", "discourseAnalysis", "grammaticalHighlights", "figuresOfSpeech"],
    },
    contextAnalysis: {
        type: Type.OBJECT,
        properties: {
            historicalAndCultural: {
                 type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            originalAudience: {
                 type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            authorialIntent: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            canonicalContext: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            },
            thematicConnections: {
                type: Type.OBJECT,
                properties: { content: { type: Type.STRING }, relevance: { type: Type.STRING } },
                required: ["content", "relevance"]
            }
        },
        required: ["historicalAndCultural", "originalAudience", "authorialIntent", "canonicalContext", "thematicConnections"],
    },
    commentaryAnalysis: {
        type: Type.OBJECT,
        properties: {
            bookSummary: { type: Type.STRING },
            chapterContext: { type: Type.STRING },
            passageCommentary: { type: Type.STRING },
            theologicalPerspectives: {
                type: Type.ARRAY,
                items: perspectiveItemSchema
            },
            practicalApplication: { type: Type.ARRAY, items: { type: Type.STRING } },
            devotionalThought: { type: Type.STRING },
            sources: {
              type: Type.ARRAY,
              items: { 
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING } },
                required: ["name"],
               },
            }
        },
        required: ["bookSummary", "chapterContext", "passageCommentary", "theologicalPerspectives", "practicalApplication", "devotionalThought", "sources"],
    },
    crossReferenceAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          verseText: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["reference", "verseText", "explanation"],
      },
    },
  },
  required: ["connections", "verseText", "verses", "wordAnalysis", "gospelHarmony", "textualCriticism", "structuralAnalysis", "contextAnalysis", "commentaryAnalysis", "crossReferenceAnalysis", "proverbialConnections", "propheticFulfillment", "covenantalAnalysis", "historicalCharacterAnalysis", "epistolaryAnalysis", "symbolismAnalysis", "typologyAnalysis", "apocalypticSymbolism", "storyArcConnection"],
};


export async function* getVerseAnalysis(book: string, chapter: number, startVerse: number, endVerse: number, language: 'en' | 'tl'): AsyncGenerator<{ section: keyof VerseAnalysis, data: any }> {
  const reference = startVerse === endVerse ? `${book} ${chapter}:${startVerse}` : `${book} ${chapter}:${startVerse}-${endVerse}`;
  const languageName = language === 'tl' ? 'Tagalog' : 'English';

  const prompt = `
    You are an expert biblical scholar. Analyze: ${reference}.
    **Core Principles:**
    1.  **Sola Scriptura**: Your analysis MUST be anchored in the biblical text. Prioritize what the scripture says above any single theological system.
    2.  **Objective Presentation**: When discussing theological points, especially in the commentary section, present the main orthodox viewpoints fairly if differences exist. Do not advocate for one view over another.

    IMPORTANT: Your entire response must be in ${languageName}. All fields, explanations, titles, and text must be in ${languageName}.
    Provide a JSON response strictly matching the schema. For genre-specific sections, only populate them if relevant to the book's genre, otherwise use the specified default values (e.g., isGospel: false, hasCharacters: false, etc.).

    1.  **Translation**: Provide the full passage text from the KJV in \`verseText.KJV\`. Additionally, provide a verse-by-verse breakdown in the \`verses\` array, where each object has \`verse\` (number) and \`text\` (string).
    2.  **Word Analysis**: 5-10 key theological words. For each, include 'translationJourney' which explains how the original word is translated into modern English, noting etymology and any nuances lost or gained in translation.
    3.  **Gospel Harmony**: If the book is Matthew, Mark, Luke, or John, set isGospel to true and populate. Otherwise, set isGospel to false and leave arrays empty.
    4.  **Textual Criticism**: Note any manuscript variants. If none, set hasVariants to false.
    5.  **Structure**: 
        - Genre, Devices, Figures of Speech, Outline, Discourse, Grammar.
        - **Narrative Flow**: If the genre is narrative (e.g., Genesis, Joshua, Gospels, Acts), set isNarrative to true and populate all fields. Otherwise, set isNarrative to false.
    6.  **Context**: History, Audience, Intent, Canon, Themes.
    7.  **Commentary**: Summary, Context, Detailed Commentary, Perspectives (balanced), Application, Devotional, Sources.
    8.  **Cross-References**: Relevant verses with explanations.
    9.  **Proverbial Connections**: If the book is a Wisdom Book (Job, Psalms, Proverbs, Ecclesiastes, Song of Solomon), provide connections. Otherwise, return an empty array.
    10. **Prophetic Fulfillment**: Analyze for prophetic links. If none, return an empty array.
    11. **Covenantal Analysis**: If the book is part of the Pentateuch/Law (Genesis-Deuteronomy), analyze covenant connections. If not relevant, set hasCovenantLink to false.
    12. **Historical Character Analysis**: If the book is a Historical Narrative (Joshua-Esther, Acts), analyze key figures. If not relevant, set hasCharacters to false.
    13. **Epistolary Analysis**: If the book is an Epistle (Romans-Jude), analyze its structure and doctrine. If not an Epistle, set isEpistle to false.
    14. **Symbolism Analysis**: Analyze for key symbols (e.g., objects, numbers, colors, actions) within the text. Explain their cultural, literary, and theological meaning. If not relevant, set hasSymbols to false.
    15. **Typology Analysis**: Analyze for biblical typology where an OT element prefigures an NT element. If none, set hasTypology to false.
    16. **Apocalyptic Symbolism**: CRITICAL: If the book is 'Revelation', perform a detailed analysis of key symbols in the passage. For each symbol, provide its OT background, symbolic meaning, and supporting cross-references. If not 'Revelation' or no symbols are present, set hasSymbols to false.
    17. **Story Arc Connection**: If this passage is a key part of a major biblical narrative arc (e.g., 'The Life of David', 'The Exodus'), provide the name of the arc and explain why this passage is a key moment. Otherwise, return null.
    18. **Connections (CRITICAL)**: Synthesize all findings into the 'connections' array. For every major story arc, theme, character, doctrine, or symbol identified, create a corresponding item in this array. This section serves as a high-level summary of all interconnected concepts, so each description should be concise and explain the relevance to the passage. Extract key themes from 'thematicConnections' content.
  `;

  const response = await runGenerativeModel({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        tools: [{googleSearch: {}}],
      },
    }, `Error fetching verse analysis for ${reference}:`);
    
  const parsedData = parseAiResponse<VerseAnalysis>(response);

  const yieldOrder: (keyof VerseAnalysis)[] = [
    'verseText', 'verses', 'connections', 'storyArcConnection', 'contextAnalysis',
    'wordAnalysis', 'structuralAnalysis', 'commentaryAnalysis', 'crossReferenceAnalysis',
    'propheticFulfillment', 'gospelHarmony', 'textualCriticism', 'proverbialConnections',
    'covenantalAnalysis', 'historicalCharacterAnalysis', 'epistolaryAnalysis',
    'symbolismAnalysis', 'typologyAnalysis', 'apocalypticSymbolism'
  ];

  for (const section of yieldOrder) {
    if (parsedData[section]) {
      yield { section, data: parsedData[section] };
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }

  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  if (groundingMetadata && groundingMetadata.groundingChunks?.length > 0) {
    yield { section: 'groundingMetadata', data: groundingMetadata };
  }
};

const thematicKeyWordSchema = {
    type: Type.OBJECT,
    properties: {
        word: { type: Type.STRING, description: "The English word." },
        original: { type: Type.STRING, description: "The original Hebrew or Greek word." },
        transliteration: { type: Type.STRING },
        strongs: { type: Type.STRING },
        briefMeaning: { type: Type.STRING, description: "A concise definition relevant to the theme." },
    },
    required: ["word", "original", "transliteration", "strongs", "briefMeaning"],
};

const thematicAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        topic: { type: Type.STRING },
        summary: { type: Type.STRING },
        historicalContext: { type: Type.STRING },
        otFoundation: { type: Type.STRING, description: "How the theme is introduced and developed in the Old Testament." },
        ntFulfillment: { type: Type.STRING, description: "How the theme is clarified, expanded, or fulfilled in the New Testament." },
        christologicalConnection: { type: Type.STRING, description: "How this theme points to, is fulfilled in, or finds its ultimate meaning in Jesus Christ." },
        creedalDevelopment: { type: Type.STRING, description: "A summary of how this doctrine has been articulated in major historical creeds (e.g., Nicene, Apostles') or confessions (e.g., Westminster). If not a major creedal doctrine, explain its historical theological development briefly." },
        keyWords: {
            type: Type.ARRAY,
            description: "An analysis of 2-4 of the most important original language (Hebrew/Greek) words related to this theme.",
            items: thematicKeyWordSchema,
        },
        diversePerspectives: {
            type: Type.ARRAY,
            description: "Summaries of different orthodox Christian viewpoints on the topic (e.g., Calvinist vs. Arminian).",
            items: perspectiveItemSchema
        },
        commonMisconceptions: {
            type: Type.ARRAY,
            description: "Common modern or historical misunderstandings related to the topic and their corrections.",
            items: {
                type: Type.OBJECT,
                properties: {
                    misconception: { type: Type.STRING },
                    correction: { type: Type.STRING }
                },
                required: ["misconception", "correction"]
            }
        },
        keyConcepts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { concept: { type: Type.STRING }, definition: { type: Type.STRING } },
                required: ["concept", "definition"]
            }
        },
        practicalApplication: { type: Type.ARRAY, items: { type: Type.STRING } },
        relatedThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyVerses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    reference: { type: Type.STRING },
                    verseText: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["reference", "verseText", "explanation"],
            },
        },
    },
    required: ["topic", "summary", "historicalContext", "otFoundation", "ntFulfillment", "christologicalConnection", "creedalDevelopment", "keyWords", "diversePerspectives", "commonMisconceptions", "keyConcepts", "practicalApplication", "relatedThemes", "keyVerses"],
};

export async function* getThematicAnalysis(topic: string, language: 'en' | 'tl'): AsyncGenerator<{ section: keyof ThematicAnalysis, data: any }> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const prompt = `
    You are an expert biblical theologian. Analyze the topic "${topic}".
    **Core Principles:**
    1.  **Sola Scriptura**: Your analysis MUST be anchored in the biblical text. Prioritize what the scripture says above any single theological system.
    2.  **Objective Presentation**: For the 'diversePerspectives' section, and throughout your analysis, present the main orthodox viewpoints fairly, explaining the scriptural support for each. Do not advocate for one view over another.

    IMPORTANT: Your entire response must be in ${languageName}. All fields, explanations, and text must be in ${languageName}.
    Provide a detailed study in JSON format. The response must include:
    1.  **topic**: The original topic.
    2.  **summary**: Define the topic biblically and explain its significance.
    3.  **keyWords**: Analyze 2-4 of the most important original language (Hebrew/Greek) words related to this theme.
    4.  **historicalContext**: The historical/cultural context.
    5.  **otFoundation**: How the theme is introduced and developed in the Old Testament.
    6.  **ntFulfillment**: How the theme is clarified, expanded, or fulfilled in the New Testament.
    7.  **christologicalConnection**: Crucially, explain how this theme finds its ultimate meaning or fulfillment in the person and work of Jesus Christ.
    8.  **creedalDevelopment**: Summarize how this doctrine has been articulated in major historical creeds (e.g., Nicene Creed) or confessions. If it's not a major creedal doctrine, briefly explain its historical theological development.
    9.  **diversePerspectives**: Summarize 1-2 different orthodox Christian viewpoints (e.g., Calvinist vs. Arminian). If not applicable, provide an empty array.
    10. **commonMisconceptions**: Address and correct 1-2 common modern or historical misunderstandings. If not applicable, provide an empty array.
    11. **keyConcepts**: Define 2-3 essential related theological concepts.
    12. **practicalApplication**: 2-3 points for modern application.
    13. **relatedThemes**: 3-5 closely related biblical themes.
    14. **keyVerses**: 5-7 foundational Bible verses (KJV), including reference, text, and explanation.
    Return a single JSON object matching the schema. Do not include markdown tags.
    `;

    const response = await runGenerativeModel({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: thematicAnalysisSchema,
        },
    }, `Error fetching thematic analysis for "${topic}":`);
    
    const parsedData = parseAiResponse<ThematicAnalysis>(response);
    const yieldOrder: (keyof ThematicAnalysis)[] = [ 'topic', 'summary', 'keyWords', 'historicalContext', 'otFoundation', 'ntFulfillment', 'christologicalConnection', 'creedalDevelopment', 'keyConcepts', 'keyVerses', 'diversePerspectives', 'commonMisconceptions', 'practicalApplication', 'relatedThemes' ];

    for (const section of yieldOrder) {
        if (parsedData[section]) {
            yield { section, data: parsedData[section] };
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
};

const qaAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    question: { type: Type.STRING },
    foundationalPrinciples: {
        type: Type.ARRAY,
        description: "Core, undisputed biblical truths that inform the answer.",
        items: {
            type: Type.OBJECT,
            properties: {
                principle: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["principle", "explanation"]
        }
    },
    answer: { type: Type.STRING },
    addressingContradictions: {
        type: Type.ARRAY,
        description: "Proactively identifies and explains passages that seem to conflict with the answer.",
        items: {
            type: Type.OBJECT,
            properties: {
                apparentContradiction: { type: Type.STRING, description: "e.g., 'James 2:24 seems to say...'" },
                resolution: { type: Type.STRING, description: "How the passage harmonizes with the broader context." }
            },
            required: ["apparentContradiction", "resolution"]
        }
    },
    historicalContext: { type: Type.STRING },
    theologicalPerspectives: { type: Type.STRING },
    keyConcepts: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: { concept: { type: Type.STRING }, definition: { type: Type.STRING } },
            required: ["concept", "definition"]
        }
    },
    reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
    supportingVerses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          reference: { type: Type.STRING },
          verseText: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["reference", "verseText", "explanation"],
      },
    },
  },
  required: ["question", "foundationalPrinciples", "answer", "addressingContradictions", "historicalContext", "theologicalPerspectives", "keyConcepts", "reflectionPoints", "supportingVerses"],
};

export async function* getQaAnalysis(question: string, language: 'en' | 'tl'): AsyncGenerator<{ section: keyof QaAnalysis, data: any }> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const prompt = `
    You are an expert biblical theologian. Answer the question: "${question}".
    **Core Principles:**
    1.  **Sola Scriptura**: Your answer MUST be anchored in the biblical text. Prioritize what the scripture says above any single theological system.
    2.  **Objective Presentation**: When theological differences exist regarding the question, present the main orthodox viewpoints fairly in the 'theologicalPerspectives' section, explaining the scriptural support for each. Do not advocate for one view over another.

    IMPORTANT: Your entire response must be in ${languageName}. All fields, explanations, and text must be in ${languageName}.
    Provide a comprehensive response in JSON format. The response must include:
    1.  **question**: The original question.
    2.  **foundationalPrinciples**: Outline 2-3 core, undisputed biblical truths that inform the answer's conclusion.
    3.  **answer**: A thoughtful, well-structured answer.
    4.  **addressingContradictions**: Proactively identify 1-2 well-known passages that *seem* to conflict with the answer and provide a concise explanation of how they harmonize. If not applicable, provide an empty array.
    5.  **historicalContext**: The historical/cultural context.
    6.  **theologicalPerspectives**: A summary of different major theological perspectives.
    7.  **keyConcepts**: Definitions for 2-3 key theological concepts.
    8.  **reflectionPoints**: 2-3 thought-provoking questions.
    9.  **supportingVerses**: 3-5 key supporting Bible verses (KJV), with reference, text, and explanation.
    Return a single JSON object matching the schema. Do not include markdown tags.
    `;

    const response = await runGenerativeModel({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: qaAnalysisSchema,
        },
    }, `Error fetching Q&A analysis for "${question}":`);
    
    const parsedData = parseAiResponse<QaAnalysis>(response);
    const yieldOrder: (keyof QaAnalysis)[] = [ 'question', 'foundationalPrinciples', 'answer', 'supportingVerses', 'addressingContradictions', 'historicalContext', 'theologicalPerspectives', 'keyConcepts', 'reflectionPoints' ];

    for (const section of yieldOrder) {
        if (parsedData[section]) {
            yield { section, data: parsedData[section] };
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
};

const eventAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        passageReference: { type: Type.STRING },
        passageText: { type: Type.STRING },
        summary: { type: Type.STRING },
        charactersAndSymbolism: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: { name: { type: Type.STRING }, description: { type: Type.STRING } },
                required: ["name", "description"]
            }
        },
        historicalContext: { type: Type.STRING },
        originalAudienceInterpretation: { type: Type.STRING, description: "How the story would have been heard and understood by its first listeners." },
        primaryMessage: { type: Type.STRING, description: "The single, central theological point the story is making." },
        secondaryThemes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Other related biblical themes the story touches upon." },
        reflectionPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        keyWordAnalysis: {
            type: Type.ARRAY,
            items: wordAnalysisItemSchema,
        },
        relatedVerses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    reference: { type: Type.STRING },
                    verseText: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["reference", "verseText", "explanation"],
            },
        },
    },
    required: ["title", "passageReference", "passageText", "summary", "charactersAndSymbolism", "historicalContext", "originalAudienceInterpretation", "primaryMessage", "secondaryThemes", "reflectionPoints", "keyWordAnalysis", "relatedVerses"],
};

export async function* getEventAnalysis(title: string, language: 'en' | 'tl'): AsyncGenerator<{ section: keyof EventAnalysis, data: any }> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const prompt = `
    You are an expert biblical scholar specializing in narrative analysis. Analyze the story "${title}".
    **Core Principles:**
    1.  **Sola Scriptura**: Your analysis MUST be anchored in the biblical text. When identifying the 'primaryMessage' or 'secondaryThemes', ensure they are derived directly from the narrative and its context, not imposed by an external theological system.
    2.  **Objective Presentation**: If the interpretation of the event has been a subject of historical theological debate, briefly and neutrally mention the main viewpoints.

    IMPORTANT: Your entire response must be in ${languageName}. All fields, explanations, and text must be in ${languageName}.
    Provide a comprehensive analysis in JSON format. The response must include:
    1.  **title**: The canonical title.
    2.  **passageReference**: The primary biblical reference.
    3.  **passageText**: The full passage text (KJV).
    4.  **summary**: A concise narrative summary.
    5.  **charactersAndSymbolism**: Analysis of key characters and symbols.
    6.  **historicalContext**: Essential cultural and historical background.
    7.  **originalAudienceInterpretation**: Crucially, explain how the story would have been heard and understood by its *first listeners* to anchor its intended meaning.
    8.  **primaryMessage**: The single, central theological point of the story.
    9.  **secondaryThemes**: Other related biblical themes the story touches upon.
    10. **reflectionPoints**: 2-3 thought-provoking questions.
    11. **keyWordAnalysis**: Original language analysis for 3-5 significant words. For each, include 'translationJourney' which explains how the original word is translated into modern English, noting etymology and any nuances lost or gained in translation.
    12. **relatedVerses**: 3-5 thematically related verses with explanations.
    Return a single JSON object matching the schema. Do not include markdown tags.
    `;

    const response = await runGenerativeModel({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: eventAnalysisSchema,
        },
    }, `Error fetching event analysis for "${title}":`);
    
    const parsedData = parseAiResponse<EventAnalysis>(response);
    const yieldOrder: (keyof EventAnalysis)[] = [ 'title', 'passageReference', 'passageText', 'summary', 'primaryMessage', 'charactersAndSymbolism', 'historicalContext', 'originalAudienceInterpretation', 'secondaryThemes', 'keyWordAnalysis', 'relatedVerses', 'reflectionPoints' ];

    for (const section of yieldOrder) {
        if (parsedData[section]) {
            yield { section, data: parsedData[section] };
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
};

const storyArcAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
      arcName: { type: Type.STRING },
      summary: { type: Type.STRING },
      timeline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            reference: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["title", "reference", "summary"]
        }
      },
      characterDevelopment: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            development: { type: Type.STRING }
          },
          required: ["name", "development"]
        }
      },
      thematicSignificance: { type: Type.STRING },
      christologicalConnection: { type: Type.STRING, description: "How this story arc points forward to or is fulfilled in Jesus Christ." },
      redemptiveHistoricalSignificance: { type: Type.STRING, description: "How this arc fits into the Bible's overarching story of Creation, Fall, Redemption, and Consummation." },
      principlesForToday: {
        type: Type.ARRAY,
        description: "Timeless, actionable principles for a believer's life today, derived from the story arc.",
        items: {
            type: Type.OBJECT,
            properties: {
                principle: { type: Type.STRING },
                explanation: { type: Type.STRING }
            },
            required: ["principle", "explanation"]
        }
      }
    },
    required: ["arcName", "summary", "timeline", "characterDevelopment", "thematicSignificance", "christologicalConnection", "redemptiveHistoricalSignificance", "principlesForToday"]
  };
  
  export async function* getStoryArcAnalysis(storyArc: string, language: 'en' | 'tl'): AsyncGenerator<{ section: keyof StoryArcAnalysis, data: any }> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const prompt = `
      You are an expert in biblical narrative theology. Analyze the story arc of "${storyArc}".
      **Core Principles:**
      1.  **Sola Scriptura**: Your analysis MUST be anchored in the biblical text. When identifying 'thematicSignificance' or 'christologicalConnection', ensure they are derived directly from the narrative and its canonical context, not imposed by a specific, narrow theological system.
      2.  **Objective Presentation**: If the interpretation of the arc's significance has been a subject of historical theological debate, briefly and neutrally mention the main viewpoints.

      IMPORTANT: Your entire response must be in ${languageName}. All fields, explanations, and text must be in ${languageName}.
      Provide a comprehensive analysis in JSON format. The response must include:
      1.  **arcName**: The name of the story arc.
      2.  **summary**: A concise, high-level overview of the entire story arc and its significance in the biblical narrative.
      3.  **timeline**: An array of key events in chronological order. Include a title, primary scripture reference, and a brief summary for each event.
      4.  **characterDevelopment**: An array analyzing the journey of the main character(s), highlighting their strengths, weaknesses, key decisions, and growth.
      5.  **thematicSignificance**: An analysis of how this story develops major biblical themes (e.g., Covenant, Kingship, Redemption, Faith).
      6.  **christologicalConnection**: Crucially, explain how this story arc (especially in the OT) points forward to, prefigures, or is fulfilled in the person and work of Jesus Christ.
      7.  **redemptiveHistoricalSignificance**: Explain how this arc fits into the broader redemptive history of the Bible (Creation, Fall, Redemption, Consummation). Show how God is advancing His plan through these events.
      8.  **principlesForToday**: Extract 3-4 timeless principles from this story arc that are applicable to a believer's life today. For each, provide the principle and a brief explanation.
      Return a single JSON object matching the schema. Do not include markdown tags.
    `;
  
    const response = await runGenerativeModel({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: storyArcAnalysisSchema,
      },
    }, `Error fetching story arc analysis for "${storyArc}":`);
    
    const parsedData = parseAiResponse<StoryArcAnalysis>(response);
    const yieldOrder: (keyof StoryArcAnalysis)[] = [ 'arcName', 'summary', 'timeline', 'characterDevelopment', 'thematicSignificance', 'redemptiveHistoricalSignificance', 'christologicalConnection', 'principlesForToday' ];
    
    for (const section of yieldOrder) {
        if (parsedData[section]) {
            yield { section, data: parsedData[section] };
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }
  };

const passageReferenceSchema = {
    type: Type.OBJECT,
    properties: {
        book: { type: Type.STRING },
        chapter: { type: Type.INTEGER },
        startVerse: { type: Type.INTEGER },
        endVerse: { type: Type.INTEGER },
    },
    required: ["book", "chapter", "startVerse", "endVerse"],
};

export const getPassageReference = async (book: string, chapter: number, verse: number): Promise<PassageReference> => {
    const prompt = `
        You are a biblical structural analyst. For the verse ${book} ${chapter}:${verse}, identify the full, self-contained literary unit or paragraph (pericope) it belongs to.
        Return the book, chapter, start verse, and end verse for this passage. If the verse is a standalone paragraph, the start and end verse will be the same.
        Respond in JSON format { "book": "${book}", "chapter": ${chapter}, "startVerse": number, "endVerse": number }.
        Do not include any text outside of the JSON object, including markdown tags.
    `;
    
    const response = await runGenerativeModel({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: passageReferenceSchema,
        },
    }, "Error fetching passage reference:");

    try {
        return parseAiResponse<PassageReference>(response);
    } catch(error) {
         // Fallback to single verse if AI fails parsing
        console.error("Error parsing passage reference, falling back to single verse.", error);
        return { book, chapter, startVerse: verse, endVerse: verse };
    }
}

const systematicStudyStepSchema = {
    type: Type.OBJECT,
    properties: {
        step: { type: Type.INTEGER },
        topic: { type: Type.STRING },
        explanation: { type: Type.STRING },
        keyConcepts: {
            type: Type.ARRAY,
            description: "Define 2-3 essential theological concepts related to the topic.",
            items: {
                type: Type.OBJECT,
                properties: {
                    concept: { type: Type.STRING },
                    definition: { type: Type.STRING }
                },
                required: ["concept", "definition"]
            }
        },
        commonMisconceptions: {
            type: Type.ARRAY,
            description: "Address 1-2 common misunderstandings about this topic and provide corrections.",
            items: {
                type: Type.OBJECT,
                properties: {
                    misconception: { type: Type.STRING },
                    correction: { type: Type.STRING }
                },
                required: ["misconception", "correction"]
            }
        },
        historicalDevelopment: {
            type: Type.STRING,
            description: "A brief summary of how this doctrine has been understood throughout church history."
        },
        keyVerses: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    reference: { type: Type.STRING },
                    verseText: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                },
                required: ["reference", "verseText", "explanation"]
            }
        },
        reflectionQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
        nextStepSuggestion: { type: Type.STRING }
    },
    required: ["step", "topic", "explanation", "keyConcepts", "commonMisconceptions", "historicalDevelopment", "keyVerses", "reflectionQuestions", "nextStepSuggestion"]
};

const studySessionSchema = {
    type: Type.OBJECT,
    properties: {
        session: { type: Type.INTEGER },
        title: { type: Type.STRING },
        introduction: { type: Type.STRING },
        steps: {
            type: Type.ARRAY,
            items: systematicStudyStepSchema
        }
    },
    required: ["session", "title", "introduction", "steps"]
};

export async function generateSystematicSession(
  level: KnowledgeLevel, 
  sessionNumber: number, 
  language: 'en' | 'tl', 
  previousSessionTopics: string[]
): Promise<StudySession> {
  const languageName = language === 'tl' ? 'Tagalog' : 'English';
  
  const planConfig = SYSTEMATIC_STUDY_TOPICS.find(p => p.level === level);
  if (!planConfig || sessionNumber > planConfig.sessions.length) {
    throw new Error(`Invalid session number ${sessionNumber} for ${level} plan.`);
  }

  const sessionConfig = planConfig.sessions[sessionNumber - 1];

  const prompt = `
    You are an expert professor of systematic theology.
    **Core Principles:**
    1.  **Sola Scriptura**: Your explanations MUST be anchored in the biblical text. For every doctrine, prioritize explaining its scriptural basis.
    2.  **Objective Presentation**: When a topic has multiple orthodox interpretations (e.g., eschatology, modes of baptism), present these different views fairly, explaining the scriptural support cited for each perspective. Do not advocate for one view over another.

    Create a single, detailed study session for a user at the "${level}" knowledge level.
    This is **Session ${sessionNumber}** of their study plan.

    **Session Details:**
    - **Title**: "${sessionConfig.title}"
    - **Topics to Cover**: ${sessionConfig.topics.join('; ')}

    ${previousSessionTopics.length > 0 ? `**Context**: The user has already completed sessions on these topics: ${previousSessionTopics.join(', ')}. Ensure this new session builds upon them logically and does not repeat content.` : ''}

    **Instructions:**
    - Your entire response must be in ${languageName}.
    - The response must be a single JSON object matching the schema.
    - Provide a brief, engaging introduction for this specific session.
    - For each of the required topics, create a detailed study step.
    - **explanation**: Make this very rich and informative, consisting of at least 3-4 detailed paragraphs.
    - **keyConcepts**: Define 2-3 essential theological concepts related to the topic.
    - **commonMisconceptions**: Address 1-2 common misunderstandings about this topic and provide clear, scripturally-grounded corrections.
    - **historicalDevelopment**: Provide a brief summary (1-2 paragraphs) of how this doctrine has been understood throughout church history (e.g., early church, Reformation, modern era).
    - For each step, provide 3-4 foundational Bible verses (KJV), reflection questions, and a transition sentence for the next step.

    Return a single JSON object for this session. Do not include markdown tags.
  `;

  const response = await runGenerativeModel({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: studySessionSchema,
      },
    }, `Error fetching systematic session ${sessionNumber} for "${level}":`);
    
  return parseAiResponse<StudySession>(response);
}

async function getSystematicIntro(level: KnowledgeLevel, language: 'en' | 'tl'): Promise<string> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    const planConfig = SYSTEMATIC_STUDY_TOPICS.find(p => p.level === level);
    if (!planConfig) throw new Error("Invalid level");

    const prompt = `You are an expert professor of systematic theology. Write a brief, encouraging introduction (2-3 paragraphs) for a guided study plan for a user at the "${level}" knowledge level. Explain the focus of this study plan. The focus is: "${planConfig.introduction}". Respond in ${languageName}. Do not use JSON or markdown.`;

    const response = await runGenerativeModel({
        model: 'gemini-3-flash-preview',
        contents: prompt,
    }, `Error fetching intro for ${level}`);

    return response.text.trim();
}

export async function startSystematicStudy(level: KnowledgeLevel, language: 'en' | 'tl'): Promise<SystematicAnalysis> {
    const [introduction, firstSession] = await Promise.all([
        getSystematicIntro(level, language),
        generateSystematicSession(level, 1, language, [])
    ]);

    return {
        level,
        introduction,
        sessions: [firstSession],
    };
}


// --- Chat Service ---
interface GeminiHistoryPart {
    role: 'user' | 'model';
    parts: { text: string }[];
}

export async function* continueChatStream(history: ChatMessage[], subject: string, language: 'en' | 'tl'): AsyncGenerator<GenerateContentResponse> {
    const languageName = language === 'tl' ? 'Tagalog' : 'English';
    let userMessage: string;
    let conversationHistory: GeminiHistoryPart[];

    if (history.length === 0) {
        // New chat. The "user message" is a system-generated prompt to get an intro.
        userMessage = `Please provide a brief and engaging introduction to the topic of: "${subject}". End your introduction with an open-ended question to start our conversation.`;
        conversationHistory = [];
    } else {
        // Ongoing chat. The last message is the new one. The rest is history.
        userMessage = history[history.length - 1].text;
        conversationHistory = history.slice(0, -1)
          .filter(msg => msg.role !== 'system')
          .map(msg => ({
            role: msg.role as 'user' | 'model',
            parts: [{ text: msg.text }]
        }));
    }
    
    const systemInstruction = `You are an expert biblical scholar and theologian acting as a friendly, engaging guide for a conversational Bible study.
The user's study session is focused on the subject of: **${subject}**.
IMPORTANT: Your entire response must be in ${languageName}. All your explanations and questions to the user must be in ${languageName}.

**Your Core Principles:**
1.  **Sola Scriptura (Bible as Final Authority)**: Ground all your explanations directly in Scripture, formatted like **John 3:16**. Your primary goal is to let the Bible speak for itself.
2.  **Objective Presentation of Views**: To avoid doctrinal bias, do not favor any single denominational or theological system. If a topic has multiple orthodox interpretations, present the main views fairly and explain their scriptural support.

**Response Guidelines:**
1.  **Depth and Clarity**: Provide thorough answers but explain complex ideas in an accessible way, always adhering to your core principles.
2.  **Proactive Connections**: Proactively connect the topic to other relevant scriptures, biblical themes, or theological concepts.
3.  **Engage the User**: Conclude your responses with an open-ended question to encourage further thought and continue the conversation.
4.  **Formatting for Clarity**: Use **bold**, bulleted/numbered lists, and paragraphs. Do NOT use JSON or code blocks.
5.  **Maintain Focus**: Always relate your answers back to the main subject of the study: **${subject}**.`;

    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: conversationHistory,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    try {
        const response = await chat.sendMessageStream({ 
            message: userMessage
        });
        for await (const chunk of response) {
            yield chunk as GenerateContentResponse;
        }
    } catch (error: any) {
        console.error(`Error continuing chat for ${subject}:`, error);
        throw new Error(`An error occurred with the AI service. Details: ${error.message || 'Unknown error'}`);
    }
};
