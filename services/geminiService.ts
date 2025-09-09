
import { GoogleGenAI } from "@google/genai";
import { DiagramType } from '../types';

const getDiagramTypeName = (type: DiagramType): string => {
    switch (type) {
        case DiagramType.Flowchart: return "フローチャート (flowchart TD)";
        case DiagramType.Sequence: return "シーケンス図 (sequenceDiagram)";
        case DiagramType.Gantt: return "ガントチャート (gantt)";
        case DiagramType.Class: return "クラス図 (classDiagram)";
        case DiagramType.State: return "状態遷移図 (stateDiagram-v2)";
        default: return "図";
    }
};

export const generateMermaidCode = async (naturalText: string, diagramType: DiagramType): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const diagramTypeName = getDiagramTypeName(diagramType);
  const prompt = `
あなたはMermaid.jsの専門家です。以下の日本語のテキストを、有効なMermaid.jsの**${diagramTypeName}**のコードに変換してください。

制約事項:
- **Mermaidコードブロックのみ**を出力してください。
- コードの前に\`\`\`mermaidや説明文などを**含めないでください**。
- コードの後に説明や解説を**含めないでください**。
- 必ず指定された図の種類（${diagramType}）で出力してください。

入力テキスト:
---
${naturalText}
---
`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    // Clean up potential markdown fences that might slip through
    let code = response.text.trim();
    if (code.startsWith('```mermaid')) {
        code = code.substring(9).trim();
    } else if (code.startsWith('```')) {
        code = code.substring(3).trim();
    }
    if (code.endsWith('```')) {
        code = code.slice(0, -3).trim();
    }
    
    // Ensure the diagram type declaration is present
    if (!code.toLowerCase().startsWith(diagramType.toLowerCase())) {
        return `${diagramType}\n${code}`;
    }

    return code;

  } catch (error) {
    console.error("Error generating content from Gemini API:", error);
    throw new Error("Failed to generate Mermaid code from the API.");
  }
};
