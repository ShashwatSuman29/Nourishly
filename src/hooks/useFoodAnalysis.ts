import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { FoodAnalysis } from '@/lib/gemini';

export interface StoredFoodAnalysis extends FoodAnalysis {
  id: string;
  createdAt: string;
  userId: string | null;
}

export function useFoodAnalysis() {
  const [foodAnalyses, setFoodAnalyses] = useState<StoredFoodAnalysis[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load data from local storage on mount
  useEffect(() => {
    const loadFromLocalStorage = () => {
      const stored = localStorage.getItem('foodAnalyses');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setFoodAnalyses(data);
        } catch (error) {
          console.error('Error loading from local storage:', error);
        }
      }
      setIsLoading(false);
    };

    // If user is logged in, fetch from Supabase
    const loadFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('food_analyses')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedData: StoredFoodAnalysis[] = data.map(item => ({
            id: item.id,
            foodItems: item.food_items,
            macros: item.macros,
            createdAt: item.created_at,
            userId: item.user_id
          }));
          setFoodAnalyses(formattedData);
          // Update local storage with Supabase data
          localStorage.setItem('foodAnalyses', JSON.stringify(formattedData));
        }
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        // Fallback to local storage if Supabase fails
        loadFromLocalStorage();
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFromSupabase();
    } else {
      loadFromLocalStorage();
    }
  }, [user]);

  const addFoodAnalysis = async (analysis: FoodAnalysis) => {
    const newAnalysis: StoredFoodAnalysis = {
      ...analysis,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId: user?.id || null
    };

    // Update local state and storage
    const updatedAnalyses = [newAnalysis, ...foodAnalyses];
    setFoodAnalyses(updatedAnalyses);
    localStorage.setItem('foodAnalyses', JSON.stringify(updatedAnalyses));

    // If user is logged in, store in Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('food_analyses')
          .insert({
            id: newAnalysis.id,
            food_items: newAnalysis.foodItems,
            macros: newAnalysis.macros,
            user_id: user.id,
            created_at: newAnalysis.createdAt
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        // Data is still saved locally even if Supabase fails
      }
    }
  };

  const deleteFoodAnalysis = async (id: string) => {
    // Update local state and storage
    const updatedAnalyses = foodAnalyses.filter(a => a.id !== id);
    setFoodAnalyses(updatedAnalyses);
    localStorage.setItem('foodAnalyses', JSON.stringify(updatedAnalyses));

    // If user is logged in, delete from Supabase
    if (user) {
      try {
        const { error } = await supabase
          .from('food_analyses')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting from Supabase:', error);
      }
    }
  };

  return {
    foodAnalyses,
    isLoading,
    addFoodAnalysis,
    deleteFoodAnalysis
  };
} 