import { createContext, useContext, useState, useEffect } from "react";
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
  // ✅ Estado com persistência no localStorage
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

  // ✅ Salvar no localStorage sempre que os dados mudarem
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
  // ✅ Função para adicionar cliente
  const addClient = (client) => {
    setClients((prev) => [...prev, client]);
  };

  // ✅ Função para excluir cliente
  const deleteClient = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // ✅ Função para editar cliente
  const updateClient = (id, updatedData) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
    );
  };

  // ─── PRODUTOS ──────────────────────────────────────────────
  // ✅ Função para adicionar produto
  const addProduct = (product) => {
    setProducts((prev) => [...prev, product]);
  };

  // ✅ Função para excluir produto
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Função para editar produto
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
  // ✅ Função para adicionar pedido
  const addOrder = (order) => {
    setOrders((prev) => [...prev, order]);
  };

  // ✅ Função para atualizar status do pedido
  const updateOrderStatus = (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // ─── EVENTOS ──────────────────────────────────────────────
  // ✅ Função para adicionar inscrição em evento
  const addEventRegistration = (registration) => {
    setEventRegistrations((prev) => [...prev, registration]);
    // Atualiza o número de participantes no evento
    setEvents((prev) =>
      prev.map((e) =>
        e.id === registration.eventId
          ? { ...e, participants: e.participants + 1 }
          : e,
      ),
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
