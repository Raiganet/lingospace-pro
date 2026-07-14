import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
    try {

        const body = await req.json();

        const text =
            body.text ||
            body.message ||
            body.input ||
            "";

        const targetLanguage =
            body.targetLang ||
            body.target ||
            "English";

        if (!text.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Text is empty."
                },
                {
                    status: 400
                }
            );
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    error: "GEMINI_API_KEY not found."
                },
                {
                    status: 500
                }
            );
        }

        const genAI = new GoogleGenerativeAI(
            process.env.GEMINI_API_KEY
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-3.5-flash",

            generationConfig: {

                temperature: 0,

                topP: 0.8,

                topK: 20,

                maxOutputTokens: 300

            }
        });

        const prompt = `
You are the best professional translator.

Rules:

- Detect the input language automatically.

- Translate naturally.

- Translate like a native speaker.

- Keep punctuation.

- Keep emojis.

- Keep names.

- Keep numbers.

- Never explain.

- Never answer questions.

- Never add notes.

- Never add quotation marks.

- Output ONLY the translated text.

Target Language:

${targetLanguage}

Text:

${text}
`;

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("TIMEOUT")), 25000)
        );

        const translatePromise = model.generateContent(prompt);

        const result = await Promise.race([
            translatePromise,
            timeoutPromise
        ]);

        const response = await result.response;

        const translated = response.text().trim();

        return NextResponse.json({
            success: true,

            translation: translated,

            reply: translated,

            text: translated
        });

    } catch (error) {

        console.error("Gemini Error:", error);

        if (error.message === "TIMEOUT") {

            return NextResponse.json(
                {
                    success: false,
                    error: "AI response timeout."
                },
                {
                    status: 504
                }
            );

        }

        if (
            error.message?.includes("API key")
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid Gemini API Key."
                },
                {
                    status: 401
                }
            );

        }

        if (
            error.message?.includes("quota")
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Gemini quota exceeded."
                },
                {
                    status: 429
                }
            );

        }

        return NextResponse.json(
            {
                success: false,
                error: error.message || "Unknown server error."
            },
            {
                status: 500
            }
        );

    }
}
