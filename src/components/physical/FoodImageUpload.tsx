
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FoodItem } from './AddFoodItemModal';
import { useToast } from '@/components/ui/use-toast';

interface FoodImageUploadProps {
  onFoodRecognized: (food: Omit<FoodItem, 'id'>) => void;
}

const FoodImageUpload = ({ onFoodRecognized }: FoodImageUploadProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, or WebP image.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a preview URL
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    
    // Analyze the image
    await analyzeImage(file);
  }, [toast]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1
  });
  
  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Convert the file to base64
      const base64Image = await convertFileToBase64(file);
      
      // Call the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=AIzaSyBVSx-504KyBKJPR1NeXFotq_njeiTSQbc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this food image. Identify the food items, estimate portion size, and provide nutritional information including calories, protein, carbs, fat, and fiber in grams. Format your response as a JSON object with these fields: name (string), calories (number), protein (number), carbs (number), fat (number), fiber (number), category (string - one of: Breakfast, Lunch, Dinner, Snack). Do not include any other text in your response."
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Image.split(',')[1]
                  }
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      // Parse the response
      try {
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Extract the JSON part from the response
        let jsonStr = responseText;
        if (responseText.includes('{') && responseText.includes('}')) {
          jsonStr = responseText.substring(
            responseText.indexOf('{'),
            responseText.lastIndexOf('}') + 1
          );
        }
        
        const foodData = JSON.parse(jsonStr);
        
        // Validate the food data
        const validatedFood = {
          name: foodData.name || 'Unknown Food',
          calories: typeof foodData.calories === 'number' ? foodData.calories : 0,
          protein: typeof foodData.protein === 'number' ? foodData.protein : 0,
          carbs: typeof foodData.carbs === 'number' ? foodData.carbs : 0,
          fat: typeof foodData.fat === 'number' ? foodData.fat : 0,
          fiber: typeof foodData.fiber === 'number' ? foodData.fiber : 0,
          quantity: 1,
          category: ['Breakfast', 'Lunch', 'Dinner', 'Snack'].includes(foodData.category) 
            ? foodData.category 
            : 'Snack'
        };
        
        // Pass the food data to the parent component
        onFoodRecognized(validatedFood);
        
        toast({
          title: "Food analyzed successfully",
          description: `Identified as ${validatedFood.name}`,
        });
      } catch (error) {
        console.error('Error parsing Gemini response:', error);
        toast({
          title: "Analysis error",
          description: "Couldn't extract food data from the response",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis failed",
        description: "We couldn't analyze your food image. Please try again or add the food manually.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };
  
  const resetUpload = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
  };
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/30'}
          ${uploadedImage ? 'border-physical' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploadedImage ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full max-w-xs h-48 mx-auto">
              <img 
                src={uploadedImage} 
                alt="Food preview" 
                className="h-full w-full object-cover rounded-md"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
              disabled={isAnalyzing}
            >
              Change Image
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="p-3 bg-muted rounded-full">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-base">Upload Food Image</h3>
            <p className="text-sm text-muted-foreground">
              Drag & drop or click to upload a food image
            </p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG, WebP (Max 5MB)
            </p>
          </div>
        )}
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-physical" />
              <p className="text-sm font-medium">Analyzing your food...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodImageUpload;
