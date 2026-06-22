import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ClipboardList,
  Trophy,
  ArrowRight,
  Package,
  Star,
  Zap,
  Clock,
} from "lucide-react";
import { StatusBadge, Card } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { events } from "../../data/mockData";

const quickActions = [
  {
    to: "/cliente/produtos",
    icon: Package,
    label: "Ver Produtos",
    color: "from-[#D4AF37]/20 to-[#b08526]/10",
    border: "border-[#D4AF37]/20",
  },
  {
    to: "/cliente/encomendas",
    icon: ClipboardList,
    label: "Nova Encomenda",
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/20",
  },
  {
    to: "/cliente/eventos",
    icon: Trophy,
    label: "Corridas & Eventos",
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
  },
  {
    to: "/cliente/atendimento",
    icon: Zap,
    label: "Atendimento",
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
  },
];

const clientOrders = [
  {
    id: "PED-2025-001",
    items: 3,
    total: 289.7,
    status: "Entregue",
    date: "10/01/2025",
  },
  {
    id: "PED-2025-005",
    items: 2,
    total: 199.8,
    status: "Enviado",
    date: "16/01/2025",
  },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const { cartCount } = useApp();
  const firstName = user?.name?.split(" ")[0] || "Cliente";

  return (
    <div>
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-8 min-h-[200px] flex items-end"
        style={{
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a0f40 50%, #0a0a0a 100%)",
        }}
      >
        {/* Decorative elements - usando dourado */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-30"
            style={{
              background:
                "radial-gradient(circle, #D4AF37 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute top-1/2 right-32 w-48 h-48 rounded-full opacity-15"
            style={{
              background:
                "radial-gradient(circle, #8b5cf6 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32 opacity-20"
            style={{
              background: "linear-gradient(180deg, transparent, #D4AF37)",
            }}
          />
          {/* geometric lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-5"
            viewBox="0 0 800 200"
          >
            <line
              x1="0"
              y1="100"
              x2="800"
              y2="100"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
            <line
              x1="400"
              y1="0"
              x2="400"
              y2="200"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="100"
              r="80"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
            <circle
              cx="400"
              cy="100"
              r="40"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
            />
          </svg>
        </div>

        <div className="relative p-8 z-10 flex items-end justify-between w-full">
          <div>
            <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-2">
              Olá, {firstName} 👋
            </div>
            <h1 className="text-3xl font-bold font-display text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Confira seus pedidos, faça novas encomendas e fique por dentro dos
              eventos esportivos.
            </p>
            <div className="flex gap-3 mt-5">
              <Link
                to="/cliente/produtos"
                className="inline-flex items-center gap-2 gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-brand-sm hover:opacity-90 transition-all"
              >
                Explorar Produtos <ArrowRight size={15} />
              </Link>
              <Link
                to="/cliente/encomendas"
                className="inline-flex items-center gap-2 glass-light text-white text-sm font-medium px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/25 transition-all"
              >
                Nova Encomenda
              </Link>
            </div>
          </div>

          {/* Stats right side */}
          <div className="hidden xl:flex gap-4">
            {[
              { label: "Pedidos", value: "8", icon: ShoppingBag },
              { label: "Encomendas", value: "2", icon: ClipboardList },
            ].map((s) => (
              <div
                key={s.label}
                className="glass rounded-2xl px-5 py-4 text-center border border-white/8"
              >
                <s.icon size={20} className="text-[#D4AF37] mx-auto mb-2" />
                <div className="text-2xl font-bold text-white font-display">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-8">
        {quickActions.map(({ to, icon: Icon, label, color, border }, i) => (
          <motion.div
            key={to}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              to={to}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${color} border ${border} card-hover text-center transition-all group`}
            >
              <Icon
                size={24}
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span className="text-sm font-medium text-white">{label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold font-display text-white">
              Meus Pedidos Recentes
            </h2>
            <Link
              to="/cliente/pedidos"
              className="text-xs text-[#D4AF37] hover:text-[#e8c970] transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {clientOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-4 p-4 glass-light rounded-xl border border-white/6 hover:border-white/12 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag size={18} className="text-[#D4AF37]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                      {order.id}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="text-xs text-slate-500">
                    {order.items} item{order.items > 1 ? "s" : ""} •{" "}
                    {order.date}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">
                    R${" "}
                    {order.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <Link
                    to="/cliente/pedidos"
                    className="text-[10px] text-[#D4AF37] hover:text-[#e8c970]"
                  >
                    Detalhes →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming event */}
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold font-display text-white">
                Próximo Evento
              </h2>
              <Trophy size={16} className="text-[#D4AF37]" />
            </div>
            <div className="p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
              <div className="text-xs text-[#D4AF37] font-semibold mb-2 uppercase tracking-wider">
                22 FEV
              </div>
              <div className="font-semibold text-white mb-1">
                {events[1].name}
              </div>
              <div className="text-xs text-slate-500 mb-3">
                {events[1].location}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {events[1].distance}
                </span>
                <Link
                  to="/cliente/eventos"
                  className="text-xs text-[#D4AF37] font-semibold hover:text-[#e8c970] flex items-center gap-1"
                >
                  Inscrever-se <ArrowRight size={10} />
                </Link>
              </div>
            </div>
            <Link
              to="/cliente/eventos"
              className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-white transition-colors py-2"
            >
              Ver todos os eventos <ArrowRight size={11} />
            </Link>
          </Card>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-[#D4AF37]" />
              <h2 className="font-semibold font-display text-white">
                Produtos em Destaque
              </h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "Camisa Manga Curta", price: 89.9 },
                { name: "Regata Esportiva Elite", price: 69.9 },
                { name: "Shorts Esportivo Pro", price: 79.9 },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">{p.name}</span>
                  <span className="text-sm font-semibold text-[#D4AF37]">
                    R$ {p.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              ))}
            </div>
            <Link
              to="/cliente/produtos"
              className="mt-4 flex items-center justify-center gap-2 text-xs gradient-brand text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Ver Catálogo <ArrowRight size={12} />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
