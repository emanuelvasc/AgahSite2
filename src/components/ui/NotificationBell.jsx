// src/components/ui/NotificationBell.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  X,
  AlertCircle,
  Package,
  Truck,
  Clock,
  ShoppingBag,
  Users,
  Trophy,
} from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Novo pedido recebido",
    message: "Pedido PED-2025-006 foi criado por Rafael Mendonça",
    time: "Agora",
    read: false,
    icon: Package,
    color: "text-[#D4AF37]",
  },
  {
    id: 2,
    title: "Pedido em produção",
    message: "Pedido PED-2025-005 está em produção",
    time: "5 min",
    read: false,
    icon: Clock,
    color: "text-blue-400",
  },
  {
    id: 3,
    title: "Pedido enviado",
    message: "Pedido PED-2025-004 foi enviado para entrega",
    time: "1h",
    read: false,
    icon: Truck,
    color: "text-emerald-400",
  },
  {
    id: 4,
    title: "Estoque baixo",
    message: "Camisa Estampada Running está com estoque crítico (12 un.)",
    time: "3h",
    read: true,
    icon: AlertCircle,
    color: "text-red-400",
  },
  {
    id: 5,
    title: "Nova encomenda",
    message: "Encomenda PROT-8825 aguarda aprovação",
    time: "2h",
    read: false,
    icon: ShoppingBag,
    color: "text-violet-400",
  },
  {
    id: 6,
    title: "Evento próximo",
    message: "Agah Night Run 2026 acontece em 3 dias",
    time: "1 dia",
    read: true,
    icon: Trophy,
    color: "text-amber-400",
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      {/* Botão do Sino */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Modal de Notificações - igual ao modal de eventos */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay escuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              className="relative w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh]"
            >
              {/* Botão fechar */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Cabeçalho */}
              <div className="p-6 pb-3 border-b border-white/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-[#D4AF37]" />
                    <h2 className="text-xl font-bold font-display text-white">
                      Notificações
                    </h2>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-[#D4AF37] hover:text-[#e8c970] transition-colors"
                    >
                      Marcar todas como lidas
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {unreadCount} notificação{unreadCount !== 1 ? "ões" : ""} não
                  lida{unreadCount !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Lista de notificações */}
              <div className="overflow-y-auto max-h-[500px] p-4 space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={40} className="text-slate-700 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">
                      Nenhuma notificação
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const Icon = notification.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass-light rounded-xl p-4 border transition-all ${
                          !notification.read
                            ? "border-[#D4AF37]/20 bg-[#D4AF37]/5"
                            : "border-white/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 ${notification.color}`}>
                            <Icon size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-white">
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[10px] text-slate-600">
                                {notification.time}
                              </span>
                              {!notification.read ? (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-[10px] text-[#D4AF37] hover:text-[#e8c970] transition-colors"
                                >
                                  Marcar como lida
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-600">
                                  Lida
                                </span>
                              )}
                              <button
                                onClick={() =>
                                  removeNotification(notification.id)
                                }
                                className="text-[10px] text-slate-600 hover:text-red-400 transition-colors"
                              >
                                Remover
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Rodapé */}
              <div className="p-4 border-t border-white/8">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm glass-light text-white hover:bg-white/10 transition-all"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
