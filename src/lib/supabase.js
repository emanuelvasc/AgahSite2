// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// ✅ Substitua com suas credenciais do Supabase
const supabaseUrl = "https://SEU_PROJETO.supabase.co";
const supabaseAnonKey = "SUA_CHAVE_ANON";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
