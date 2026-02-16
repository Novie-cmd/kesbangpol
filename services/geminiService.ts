import { GoogleGenAI } from "@google/genai";
import { ResearchPermit } from "../types";

// Fix: Direct initialization using process.env.API_KEY as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getResearchInsights = async (permits: ResearchPermit[]) => {
  // Fix: Assuming process.env.API_KEY is available and valid in this context per guidelines
  const summary = permits.slice(0, 20).map(p => ({
    title: p.researchTitle,
    category: p.category,
    year: p.year
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berdasarkan data sampel berikut dari Sistem Izin Penelitian Kesbangpol NTB (2023-2026), berikan ringkasan tren penelitian dalam 3 poin singkat menggunakan Bahasa Indonesia: ${JSON.stringify(summary)}`,
    });
    // Fix: Accessing .text directly as a property, ensuring robust text extraction
    return response.text || "Gagal mendapatkan insight.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error saat menganalisis data.";
  }
};