import { createClient } from "@supabase/supabase-js";

// Substitua com suas credenciais do Supabase (pegue no Settings > API)
const supabaseUrl = "https://gakjcaoqkoknpdsnstgu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdha2pjYW9xa29rbnBkc25zdGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMTI5NTcsImV4cCI6MjA5ODU4ODk1N30._Nq6n8kpnaJGdVkgJOH7AXWSdu7GW7EZlRRXygyi1lw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
