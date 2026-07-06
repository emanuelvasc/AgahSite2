import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

// Dados iniciais simulados
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

  // ─── ESTADOS COM LOCALSTORAGE ────────────────────────────
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("agah_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("agah_clients");
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("agah_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [customOrders, setCustomOrders] = useState(() => {
    const saved = localStorage.getItem("agah_custom_orders");
    return saved ? JSON.parse(saved) : initialCustomOrders;
  });

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("agah_messages");
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem("agah_suppliers");
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("agah_events");
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [eventRegistrations, setEventRegistrations] = useState(() => {
    const saved = localStorage.getItem("agah_event_registrations");
    return saved ? JSON.parse(saved) : initialEventRegistrations;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("agah_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("agah_notifications");
    return saved
      ? JSON.parse(saved)
      : [
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
        ];
  });

  // ─── SALVAR NO LOCALSTORAGE SEMPRE QUE MUDAR ──────────────
  useEffect(() => {
    localStorage.setItem("agah_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("agah_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("agah_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("agah_custom_orders", JSON.stringify(customOrders));
  }, [customOrders]);

  useEffect(() => {
    localStorage.setItem("agah_suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem("agah_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("agah_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("agah_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("agah_events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(
      "agah_event_registrations",
      JSON.stringify(eventRegistrations),
    );
  }, [eventRegistrations]);

  // ─── CARREGAR DADOS AO FAZER LOGIN ────────────────────────
  useEffect(() => {
    if (user) {
      // Recarrega todos os dados do localStorage
      const savedProducts = localStorage.getItem("agah_products");
      const savedClients = localStorage.getItem("agah_clients");
      const savedOrders = localStorage.getItem("agah_orders");
      const savedCustomOrders = localStorage.getItem("agah_custom_orders");
      const savedSuppliers = localStorage.getItem("agah_suppliers");
      const savedEvents = localStorage.getItem("agah_events");
      const savedRegistrations = localStorage.getItem(
        "agah_event_registrations",
      );

      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedClients) setClients(JSON.parse(savedClients));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedCustomOrders) setCustomOrders(JSON.parse(savedCustomOrders));
      if (savedSuppliers) setSuppliers(JSON.parse(savedSuppliers));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedRegistrations)
        setEventRegistrations(JSON.parse(savedRegistrations));

      setLoading(false);
    } else {
      // Quando desloga, mantém os dados no localStorage mas limpa o loading
      setLoading(false);
    }
  }, [user]);

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
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("agah_cart");
  };

  const cartTotal = cart.reduce((acc, i) => acc + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  // ─── CLIENTES ──────────────────────────────────────────────
  const addClient = (client) => {
    const newClient = { ...client, id: Date.now() };
    setClients((prev) => [...prev, newClient]);
    return newClient;
  };

  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const updateClient = (id, updatedData) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
    );
  };

  // ─── PRODUTOS ──────────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now() };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p)),
    );
  };

  // ─── NOTIFICAÇÕES ──────────────────────────────────────────
  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // ─── PEDIDOS ──────────────────────────────────────────────
  const addOrder = (order) => {
    const maxId = orders.reduce((max, o) => {
      const num = parseInt(o.id?.replace("PED-", "") || "0");
      return Math.max(max, num);
    }, 0);

    const newOrder = {
      ...order,
      id: `PED-${String(maxId + 1).padStart(4, "0")}`,
      date: new Date().toISOString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateOrder = (id, updatedData) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updatedData } : o)),
    );
  };

  // ─── ENCOMENDAS ──────────────────────────────────────────────
  const addCustomOrder = (order) => {
    const newOrder = { ...order, id: Date.now() };
    setCustomOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateCustomOrder = (id, updatedData) => {
    setCustomOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updatedData } : o)),
    );
  };

  // ─── FORNECEDORES ────────────────────────────────────────────
  const addSupplier = (supplier) => {
    const newSupplier = { ...supplier, id: Date.now() };
    setSuppliers((prev) => [...prev, newSupplier]);
    return newSupplier;
  };

  const updateSupplier = (id, updatedData) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updatedData } : s)),
    );
  };

  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // ─── EVENTOS ──────────────────────────────────────────────
  const addEventRegistration = (registration) => {
    const newRegistration = { ...registration, id: Date.now() };
    setEventRegistrations((prev) => [...prev, newRegistration]);
    // Atualiza o número de participantes no evento
    setEvents((prev) =>
      prev.map((e) =>
        e.id === registration.eventId
          ? { ...e, participants: (e.participants || 0) + 1 }
          : e,
      ),
    );
    return newRegistration;
  };

  // ─── RECARREGAR DADOS ──────────────────────────────────────
  const reloadData = () => {
    setProducts(JSON.parse(localStorage.getItem("agah_products") || "[]"));
    setClients(JSON.parse(localStorage.getItem("agah_clients") || "[]"));
    setOrders(JSON.parse(localStorage.getItem("agah_orders") || "[]"));
    setCustomOrders(
      JSON.parse(localStorage.getItem("agah_custom_orders") || "[]"),
    );
    setSuppliers(JSON.parse(localStorage.getItem("agah_suppliers") || "[]"));
    setNotifications(
      JSON.parse(localStorage.getItem("agah_notifications") || "[]"),
    );
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
