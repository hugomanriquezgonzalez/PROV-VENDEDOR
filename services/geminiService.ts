
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

// Always use named parameter and direct environment variable access
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  async optimizeProductDescription(product: Product): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Actúa como un experto en copywriting para e-commerce mayorista. 
      Optimiza la descripción del siguiente producto para atraer más compradores B2B. 
      Destaca beneficios por volumen y calidad:
      Producto: ${product.name}
      Categoría: ${product.category}
      Descripción actual: ${product.description}`,
    });
    return response.text || "No se pudo generar una descripción.";
  },

  async analyzeSalesTrends(data: any[]): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza los siguientes datos de ventas mensuales y proporciona un resumen ejecutivo breve con 3 puntos clave para el vendedor mayorista:
      ${JSON.stringify(data)}`,
    });
    return response.text || "Análisis no disponible en este momento.";
  },

  async suggestPricingStrategy(product: Product): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sugiere una estrategia de precios por volumen para el producto "${product.name}" que cuesta actualmente $${product.price} por unidad. Dame una tabla JSON con rangos sugeridos.`,
    });
    return response.text || "Sugerencia no disponible.";
  }
};
