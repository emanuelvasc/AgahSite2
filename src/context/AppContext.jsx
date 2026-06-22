import { createContext, useContext, useState } from "react";
import {
  products as initialProducts,
  clients as initialClients,
  orders as initialOrders,
  customOrders as initialCustomOrders,
  messages as initialMessages,
  suppliers as initialSuppliers,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [clients, setClients] = useState(initialClients);
  const [orders, setOrders] = useState(initialOrders);
  const [customOrders, setCustomOrders] = useState(initialCustomOrders);
  const [messages, setMessages] = useState(initialMessages);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
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

  const markNotificationRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
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
        cart,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        cartTotal,
        cartCount,
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
