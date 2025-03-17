import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1',
  dangerouslyAllowBrowser: true
});

export interface MacroNutrients {
  calories: number;
  carbohydrates: number;
  proteins: number;
  fats: number;
  fibers: number;
}

export interface FoodAnalysis {
  foodItems: string[];
  macros: MacroNutrients;
}

export async function analyzeFoodImage(imageUrl: string): Promise<FoodAnalysis> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a precise food analysis assistant. When analyzing food images, provide accurate identification and nutritional estimates in JSON format."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image and provide detailed nutritional information. Include:\n1. All visible food items\n2. Estimated macronutrients per standard serving\n\nRespond ONLY with JSON matching this structure:\n{ \"foodItems\": string[], \"macros\": { \"calories\": number, \"carbohydrates\": number, \"proteins\": number, \"fats\": number, \"fibers\": number } }"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.1
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from API');
    }

    // Parse the JSON response
    const analysis: FoodAnalysis = JSON.parse(content);

    // Validate the response structure
    if (!analysis.foodItems || !analysis.macros) {
      throw new Error('Invalid response format from API');
    }

    // Validate and round all numeric values
    const roundedMacros = {
      calories: Math.round(analysis.macros.calories * 10) / 10,
      carbohydrates: Math.round(analysis.macros.carbohydrates * 10) / 10,
      proteins: Math.round(analysis.macros.proteins * 10) / 10,
      fats: Math.round(analysis.macros.fats * 10) / 10,
      fibers: Math.round(analysis.macros.fibers * 10) / 10
    };

    return {
      foodItems: analysis.foodItems,
      macros: roundedMacros
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    if (error instanceof Error) {
      throw new Error(`API error: ${error.message}`);
    }
    throw new Error('Connection error. Please check your internet connection and try again.');
  }
} 