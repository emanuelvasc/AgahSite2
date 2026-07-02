// src/services/authService.js
import { supabase } from "../lib/supabase";

// ID fixo do admin (definido no banco)
const ADMIN_ID = "00000000-0000-0000-0000-000000000001";

export const authService = {
  // 🔑 LOGIN (Admin ou Cliente)
  async login(email, password) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error) throw new Error("Email ou senha inválidos");
      if (!user) throw new Error("Usuário não encontrado");

      // Se for admin, retornar direto
      if (user.role === "admin") {
        return { user, client: null };
      }

      // Se for cliente, buscar o cliente associado
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (clientError && clientError.code !== "PGRST116") {
        console.error("Erro ao buscar cliente:", clientError);
      }

      return { user, client: client || null };
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  },

  // 📝 REGISTRAR NOVO CLIENTE
  async register(email, password, name) {
    try {
      // Verificar se o email já existe
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado.");
      }

      // 1. Criar usuário (role = 'client')
      const { data: user, error: userError } = await supabase
        .from("users")
        .insert([{ email, password, name, role: "client" }])
        .select()
        .single();

      if (userError) throw userError;

      // 2. Criar cliente associado
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert([{ name, email, user_id: user.id, status: "Ativo" }])
        .select()
        .single();

      if (clientError) throw clientError;

      return { user, client };
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  },

  // 👤 BUSCAR USUÁRIO POR ID
  async getUserById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  // 🔄 ATUALIZAR USUÁRIO
  async updateUser(id, updates) {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 🚪 LOGOUT
  logout() {
    localStorage.removeItem("agah_user");
    localStorage.removeItem("agah_client");
    sessionStorage.clear();
  },
};
