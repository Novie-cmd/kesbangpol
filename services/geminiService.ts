
import { GoogleGenAI } from "@google/genai";
import { ResearchPermit } from "../types";

export const getResearchInsights = async (permits: ResearchPermit[]) => {
  // Ensure we don't crash if process is missing in the browser environment
  if (typeof process === 'undefined' || !process.env.API_KEY) {
    console.warn("API_KEY tidak ditemukan di environment variables.");
    return "Insight tidak tersedia (API Key belum dikonfigurasi).";
  }

  const summary = permits.slice(0, 20).map(p => ({
    title: p.researchTitle,
    category: p.category,
    year: p.year
  }));

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Berdasarkan data sampel berikut dari Sistem Izin Penelitian Kesbangpol NTB (2023-2026), berikan ringkasan tren penelitian dalam 3 poin singkat menggunakan Bahasa Indonesia: ${JSON.stringify(summary)}`,
    });
    
    return response.text || "Gagal mendapatkan insight.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error saat menganalisis data.";
  }
};
