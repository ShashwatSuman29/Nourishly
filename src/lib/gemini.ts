import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBVSx-504KyBKJPR1NeXFotq_njeiTSQbc');

export interface MacroNutrients {
  carbs: number;
  proteins: number;
  fats: number;
  fibers: number;
  calories: number;
}

export interface FoodAnalysis {
  foodItems: string[];
  macros: MacroNutrients;
}

export async function analyzeFoodImage(base64Image: string): Promise<FoodAnalysis> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const prompt = `Analyze this food image and provide the following information in a structured format:
1. List all food items you can identify
2. For each food item, estimate its:
   - Carbohydrates (g)
   - Proteins (g)
   - Fats (g)
   - Dietary Fiber (g)
   - Calories

Please format your response as a JSON object with this structure:
{
  "foodItems": ["item1", "item2", ...],
  "macros": {
    "carbs": total_carbs,
    "proteins": total_proteins,
    "fats": total_fats,
    "fibers": total_fibers,
    "calories": total_calories
  }
}`;

    const result = await model.generateContent([prompt, {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Image
      }
    }]);

    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse food analysis results');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate and normalize the response
    return {
      foodItems: Array.isArray(analysis.foodItems) ? analysis.foodItems : [],
      macros: {
        carbs: Number(analysis.macros?.carbs) || 0,
        proteins: Number(analysis.macros?.proteins) || 0,
        fats: Number(analysis.macros?.fats) || 0,
        fibers: Number(analysis.macros?.fibers) || 0,
        calories: Number(analysis.macros?.calories) || 0
      }
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    throw new Error('Failed to analyze food image');
  }
} 