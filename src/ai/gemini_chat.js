// src/ai/gemini_chat.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

let isAwaitingResponse = false;
let chatSession = null;

// Initialize the chat session once
export const initChat = async () => {
    if (!chatSession) {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // or gemini-2.5-pro if supported
        chatSession = await model.startChat({
            systemInstruction: {
                role: "system",
                parts: [
                    {
                        text: "You are a helpful assistant. You answer questions and provide information based on the user's queries. Always be concise and relevant.",
                    }
                ]
            },
            generationConfig: {
                maxOutputTokens: 5000,
            },
        });
    }
};

// Ask a dynamic question and stream the result
export const askGemini = async (message, onStream) => {
    if (isAwaitingResponse || !chatSession) return;

    isAwaitingResponse = true;

    try {
        const result = await chatSession.sendMessageStream(message);
        for await (const chunk of result.stream) {
            onStream(chunk.text()); // stream text chunk to the caller
        }
    } catch (err) {
        console.error("Error:", err);
        onStream("[Error receiving response]");
    } finally {
        isAwaitingResponse = false;
    }
};
