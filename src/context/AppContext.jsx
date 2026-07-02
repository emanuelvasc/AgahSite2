import { createContext, useContext, useState, useEffect } from "react";
import { dataService } from "../services/dataService";
import { useAuth } from "./AuthContext";

// Dados iniciais para fallback (caso Supabase falhe)
import {
  products as initialProducts,
  clients as initialClients,
  orders as initialOrders,
  customOrders as initialCustomOrders,
  messages as initialMessages,
  suppliers as initialSuppliers,
  events as initialEvents,
  eventRegistrations as initialEventRegistrations,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // ─── ESTADOS ──────────────────────────────────────────────
  const [products, setProducts] = useState(initialProducts);
  const [clients, setClients] = useState(initialClients);
  const [orders, setOrders] = useState(initialOrders);
  const [customOrders, setCustomOrders] = useState(initialCustomOrders);
  const [messages, setMessages] = useState(initialMessages);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [events, setEvents] = useState(initialEvents);
  const [eventRegistrations, setEventRegistrations] = useState(
    initialEventRegistrations,
  );
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Novo pedido recebido: PED-2025-006",
      time: "5 min",
      read: false,
    },
    {
      id: 2,
      text: "Encomenda ENC-2025-003 aguarda aprovação",
      time: "1h",
      read: false,
    },
    {
      id: 3,
      text: "Estoque baixo: Jaqueta Corta Vento (43 un.)",
      time: "3h",
      read: true,
    },
  ]);

  // ─── CARREGAR DADOS DO SUPABASE ───────────────────────────
  const loadAllData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [
        productsData,
        clientsData,
        ordersData,
        customOrdersData,
        suppliersData,
        notificationsData,
      ] = await Promise.all([
        dataService.getProducts(),
        dataService.getClients(user.id),
        dataService.getOrders(user.id),
        dataService.getCustomOrders(user.id),
        dataService.getSuppliers(user.id),
        dataService.getNotifications(user.id),
      ]);

      if (productsData) setProducts(productsData);
      if (clientsData) setClients(clientsData);
      if (ordersData) setOrders(ordersData);
      if (customOrdersData) setCustomOrders(customOrdersData);
      if (suppliersData) setSuppliers(suppliersData);
      if (notificationsData) setNotifications(notificationsData);
    } catch (error) {
      console.error("Erro ao carregar dados do Supabase:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando o usuário mudar
  useEffect(() => {
    loadAllData();
  }, [user]);

  // ─── PERSISTÊNCIA LOCAL ────────────────────────────────────
  useEffect(() => {
    if (!loading && user) {
      localStorage.setItem("agah_products", JSON.stringify(products));
    }
  }, [products, loading, user]);

  useEffect(() => {
    if (!loading && user) {
      localStorage.setItem("agah_clients", JSON.stringify(clients));
    }
  }, [clients, loading, user]);

  useEffect(() => {
    if (!loading && user) {
      localStorage.setItem("agah_orders", JSON.stringify(orders));
    }
  }, [orders, loading, user]);

  useEffect(() => {
    if (!loading && user) {
      localStorage.setItem("agah_custom_orders", JSON.stringify(customOrders));
    }
  }, [customOrders, loading, user]);

  // ─── CARRINHO ──────────────────────────────────────────────
  const addToCart = (product, qty = 1, size, color) => {
    setCart((prev) => {
      const key = `${product.id}-${size}-${color}`;
      const exists = prev.find((i) => i.key === key);
      if (exists)
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i,
        );
      return [...prev, { key, product, qty, size, color }];
    });
  };

  const removeFromCart = (key) =>
    setCart((prev) => prev.filter((i) => i.key !== key));
  const updateCartQty = (key, qty) =>
    setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  // ─── CLIENTES ──────────────────────────────────────────────
  const addClient = async (client) => {
    try {
      const newClient = await dataService.createClient({
        ...client,
        user_id: user.id,
      });
      setClients((prev) => [newClient, ...prev]);
      return newClient;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      const newClient = { ...client, id: Date.now() };
      setClients((prev) => [...prev, newClient]);
      return newClient;
    }
  };

  const deleteClient = async (id) => {
    try {
      await dataService.deleteClient(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateClient = async (id, updatedData) => {
    try {
      const updated = await dataService.updateClient(id, updatedData);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updated } : c)),
      );
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
      );
    }
  };

  // ─── PRODUTOS ──────────────────────────────────────────────
  const addProduct = async (product) => {
    try {
      const newProduct = await dataService.createProduct(product);
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      const newProduct = { ...product, id: Date.now() };
      setProducts((prev) => [...prev, newProduct]);
      return newProduct;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await dataService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const updated = await dataService.updateProduct(id, updatedData);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updated } : p)),
      );
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
      );
    }
  };

  // ─── NOTIFICAÇÕES ──────────────────────────────────────────
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // ─── PEDIDOS ──────────────────────────────────────────────
  const addOrder = async (order) => {
    try {
      const newOrder = await dataService.createOrder({
        ...order,
        user_id: user.id,
      });
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
      const newOrder = { ...order, id: `PED-${Date.now()}` };
      setOrders((prev) => [...prev, newOrder]);
      return newOrder;
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await dataService.updateOrder(id, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    }
  };

  const updateOrder = async (id, updatedData) => {
    try {
      const updated = await dataService.updateOrder(id, updatedData);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updated } : o)),
      );
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updatedData } : o)),
      );
    }
  };

  // ─── ENCOMENDAS ──────────────────────────────────────────────
  const addCustomOrder = async (order) => {
    try {
      const newOrder = await dataService.createCustomOrder({
        ...order,
        user_id: user.id,
      });
      setCustomOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error("Erro ao adicionar encomenda:", error);
      const newOrder = { ...order, id: `ENC-${Date.now()}` };
      setCustomOrders((prev) => [...prev, newOrder]);
      return newOrder;
    }
  };

  const updateCustomOrder = async (id, updatedData) => {
    try {
      const updated = await dataService.updateCustomOrder(id, updatedData);
      setCustomOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updated } : o)),
      );
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar encomenda:", error);
      setCustomOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updatedData } : o)),
      );
    }
  };

  // ─── FORNECEDORES ────────────────────────────────────────────
  const addSupplier = async (supplier) => {
    try {
      const newSupplier = await dataService.createSupplier({
        ...supplier,
        user_id: user.id,
      });
      setSuppliers((prev) => [newSupplier, ...prev]);
      return newSupplier;
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      const newSupplier = { ...supplier, id: Date.now() };
      setSuppliers((prev) => [...prev, newSupplier]);
      return newSupplier;
    }
  };

  const updateSupplier = async (id, updatedData) => {
    try {
      const updated = await dataService.updateSupplier(id, updatedData);
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updated } : s)),
      );
      return updated;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      setSuppliers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)),
      );
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await dataService.deleteSupplier(id);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // ─── EVENTOS ──────────────────────────────────────────────
  const addEventRegistration = (registration) => {
    setEventRegistrations((prev) => [...prev, registration]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === registration.eventId
          ? { ...e, participants: e.participants + 1 }
          : e,
      ),
    );
  };

  const reloadData = () => {
    loadAllData();
  };

  return (
    <AppContext.Provider
      value={{
        // Dados
        products,
        setProducts,
        clients,
        setClients,
        orders,
        setOrders,
        customOrders,
        setCustomOrders,
        messages,
        setMessages,
        suppliers,
        setSuppliers,
        events,
        setEvents,
        eventRegistrations,
        setEventRegistrations,
        loading,

        // Clientes
        addClient,
        deleteClient,
        updateClient,

        // Produtos
        addProduct,
        deleteProduct,
        updateProduct,

        // Pedidos
        addOrder,
        updateOrderStatus,
        updateOrder,

        // Encomendas
        addCustomOrder,
        updateCustomOrder,

        // Fornecedores
        addSupplier,
        updateSupplier,
        deleteSupplier,

        // Eventos
        addEventRegistration,

        // Carrinho
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,

        // Notificações
        notifications,
        markNotificationRead,
        unreadNotifications,

        // Utilitário
        reloadData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
