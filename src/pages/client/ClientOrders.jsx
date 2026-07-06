import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Package,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { StatusBadge, SearchInput, Card } from "../../components/ui";
import { useApp } from "../../context/AppContext";

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const statusProgress = {
    Pendente: 10,
    "Aguardando Pagamento": 20,
    "Em Produção": 50,
    Enviado: 75,
    Entregue: 100,
  };

  const progress = statusProgress[order.status] || 0;

  // Se tiver itens do pedido, usa eles, senão usa dados mockados
  const orderItems = order.orderItems || [
    {
      name: order.client || "Produto",
      qty: order.items || 1,
      size: "G",
      color: "Preto",
      price: order.total / (order.items || 1),
    },
  ];

  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden border border-white/6"
    >
      <button
        className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
          <ShoppingBag size={18} className="text-[#D4AF37]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-[#D4AF37]">
              {order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {order.date
                ? new Date(order.date).toLocaleDateString("pt-BR")
                : "Hoje"}
            </span>
            <span>
              {order.items || order.orderItems?.length || 0} item
              {(order.items || order.orderItems?.length || 0) > 1 ? "s" : ""}
            </span>
            <span className="capitalize">{order.payment || "Pix"}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-bold text-white">
            R${" "}
            {(order.total || 0).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="mt-1 text-slate-600">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      <div className="px-5 pb-1">
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${progress}%`,
              background:
                progress === 100
                  ? "#10b981"
                  : "linear-gradient(90deg,#D4AF37,#e8c970)",
            }}
          />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        style={{ overflow: "hidden" }}
      >
        <div className="px-5 pb-5 pt-3 space-y-4 border-t border-white/6 mt-3">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <MapPin
              size={14}
              className="text-emerald-400 flex-shrink-0 mt-0.5"
            />
            <span className="text-xs text-emerald-300">
              {order.tracking || "Pedido em processamento"}
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
              Itens do Pedido
            </div>
            <div className="space-y-2">
              {orderItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 glass-light rounded-xl"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
                    }}
                  >
                    <Package size={14} className="text-white/20" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Tam: {item.size || "G"} • Cor: {item.color || "Preto"} •
                      Qtd: {item.qty || 1}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-white flex-shrink-0">
                    R${" "}
                    {((item.price || 0) * (item.qty || 1))
                      .toFixed(2)
                      .replace(".", ",")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-sm pt-2 border-t border-white/6">
            <span className="text-slate-400">Total do Pedido</span>
            <span className="font-bold text-white text-base">
              R${" "}
              {(order.total || 0).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ClientOrders() {
  const { orders } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Todos" || o.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Meus Pedidos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {orders.length} pedidos realizados
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total de Pedidos",
            value: orders.length,
            color: "text-white",
          },
          {
            label: "Em Andamento",
            value: orders.filter(
              (o) => o.status === "Enviado" || o.status === "Em Produção",
            ).length,
            color: "text-blue-400",
          },
          {
            label: "Entregues",
            value: orders.filter((o) => o.status === "Entregue").length,
            color: "text-emerald-400",
          },
        ].map((s) => (
          <Card key={s.label} className="py-4 text-center">
            <div className={`text-2xl font-bold font-display mb-1 ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pedido..."
          className="flex-1 max-w-xs"
        />
        {["Todos", "Enviado", "Em Produção", "Entregue", "Pendente"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? "gradient-brand text-white" : "glass-light text-slate-400 border border-white/8"}`}
            >
              {f}
            </button>
          ),
        )}
      </div>

      <div className="space-y-3">
        {filtered.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <OrderCard order={order} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag size={40} className="text-slate-700 mx-auto mb-4" />
          <div className="text-white font-semibold mb-2">
            Nenhum pedido encontrado
          </div>
          <div className="text-sm text-slate-500">
            Ajuste o filtro ou faça seu primeiro pedido
          </div>
        </div>
      )}
    </div>
  );
}
