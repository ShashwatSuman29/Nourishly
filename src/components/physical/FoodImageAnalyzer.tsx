import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { analyzeFoodImage, type FoodAnalysis } from '@/lib/openai';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '10485760', 10);
const SUPPORTED_IMAGE_TYPES = import.meta.env.VITE_SUPPORTED_IMAGE_TYPES?.split(',') || ['.jpeg', '.jpg', '.png', '.webp'];

const FoodImageAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setImage(URL.createObjectURL(file));
    setError(null);
    setAnalysis(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': SUPPORTED_IMAGE_TYPES
    },
    maxFiles: 1
  });

  const analyzeImage = async () => {
    if (!image) return;
    
    try {
      setIsAnalyzing(true);
      setError(null);
      const result = await analyzeFoodImage(image);
      setAnalysis(result);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during analysis');
      toast.error(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  const renderMacronutrientChart = () => {
    if (!analysis) return null;

    const data = [
      { name: 'Carbs', value: analysis.macros.carbohydrates },
      { name: 'Proteins', value: analysis.macros.proteins },
      { name: 'Fats', value: analysis.macros.fats },
      { name: 'Fiber', value: analysis.macros.fibers }
    ];

    return (
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Macronutrient Breakdown</CardTitle>
          <CardDescription>Distribution of nutrients per serving</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}g`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
          ${error ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        {image ? (
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={image}
              alt="Food preview"
              className="rounded-lg shadow-md max-h-[200px] w-auto mx-auto"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="text-gray-500">
            <p className="text-lg font-medium">Drop your image here or click to select</p>
            <p className="text-sm">Supports {SUPPORTED_IMAGE_TYPES.join(', ')} (max {MAX_FILE_SIZE / (1024 * 1024)}MB)</p>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {image && !analysis && !isAnalyzing && (
        <Button 
          onClick={analyzeImage}
          className="w-full"
        >
          Analyze Image
        </Button>
      )}

      {isAnalyzing && (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Analyzing your food...</p>
        </div>
      )}

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>Identified foods and their nutritional content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Identified Foods:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {analysis.foodItems.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Nutritional Information (per serving):</h4>
                    <div className="grid grid-cols-2 gap-4 text-gray-600">
                      <div>Calories: {analysis.macros.calories} kcal</div>
                      <div>Carbohydrates: {analysis.macros.carbohydrates}g</div>
                      <div>Proteins: {analysis.macros.proteins}g</div>
                      <div>Fats: {analysis.macros.fats}g</div>
                      <div>Fiber: {analysis.macros.fibers}g</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {renderMacronutrientChart()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodImageAnalyzer; 