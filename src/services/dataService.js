// src/services/dataService.js
import { supabase } from "../lib/supabase";

export const dataService = {
  // ─── CLIENTES ──────────────────────────────────────────────
  async getClients(userId) {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createClient(client) {
    const { data, error } = await supabase
      .from("clients")
      .insert([client])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateClient(id, updates) {
    const { data, error } = await supabase
      .from("clients")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteClient(id) {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // ─── PRODUTOS ──────────────────────────────────────────────
  async getProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createProduct(product) {
    const { data, error } = await supabase
      .from("products")
      .insert([product])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProduct(id, updates) {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async deleteProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  // ─── PEDIDOS ──────────────────────────────────────────────
  async getOrders(userId) {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createOrder(order) {
    const { data, error } = await supabase
      .from("orders")
      .insert([order])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateOrder(id, updates) {
    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── ENCOMENDAS ────────────────────────────────────────────
  async getCustomOrders(userId) {
    const { data, error } = await supabase
      .from("custom_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createCustomOrder(order) {
    const { data, error } = await supabase
      .from("custom_orders")
      .insert([order])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCustomOrder(id, updates) {
    const { data, error } = await supabase
      .from("custom_orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── FORNECEDORES ──────────────────────────────────────────
  async getSuppliers(userId) {
    const { data, error } = await supabase
      .from("suppliers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createSupplier(supplier) {
    const { data, error } = await supabase
      .from("suppliers")
      .insert([supplier])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateSupplier(id, updates) {
    const { data, error } = await supabase
      .from("suppliers")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // ─── NOTIFICAÇÕES ──────────────────────────────────────────
  async getNotifications(userId) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async createNotification(notification) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([notification])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async markNotificationRead(id) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
