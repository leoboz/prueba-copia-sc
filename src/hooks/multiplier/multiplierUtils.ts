
import { supabase } from "@/integrations/supabase/client";
import { Sample } from "@/types";

/**
 * Fetches the multiplier's name from the users table based on sample.userId
 */
export const getMultiplierName = async (sample: Sample): Promise<string> => {
  if (!sample?.userId) {
    console.warn("No userId provided for sample:", sample?.id);
    return "Desconocido";
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("name")
      .eq("id", sample.userId)
      .single();
    
    if (error) {
      console.error(`Error fetching multiplier name for user ${sample.userId}:`, error);
      return "Desconocido";
    }
    
    return data?.name || "Desconocido";
  } catch (error) {
    console.error(`Error in getMultiplierName for user ${sample.userId}:`, error);
    return "Desconocido";
  }
};
