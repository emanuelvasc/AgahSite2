import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Factory,
  TrendingUp,
  ArrowUpRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  StatCard,
  Card,
  StatusBadge,
  Table,
  TableRow,
  TableCell,
} from "../../components/ui";
import {
  dashboardStats,
  revenueChartData,
  orders,
  productionData,
} from "../../data/mockData";

function RevenueChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="w-full mt-6">
      {/* Gráfico - BARRAS MAIS ALTAS */}
      <div className="flex items-end gap-5 h-72">
        {data.map((d, i) => {
          const percentage = (d.revenue / max) * 100;
          const isLast = i === data.length - 1;
          return (
            <div
              key={d.month}
              className="flex-1 flex flex-col items-center gap-3 group"
            >
              {/* Barra */}
              <div
                className="w-full rounded-xl transition-all relative cursor-pointer"
                style={{
                  height: `${Math.max(percentage, 4)}%`,
                  background: isLast
                    ? "linear-gradient(180deg, #D4AF37, #b08526)"
                    : "linear-gradient(180deg, #D4AF37, rgba(212,175,55,0.12))",
                  opacity: isLast ? 1 : 0.7,
                  minHeight: "8px",
                  boxShadow: isLast
                    ? "0 0 40px rgba(212,175,55,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                    : "inset 0 1px 0 rgba(255,255,255,0.05)",
                  border: isLast
                    ? "1px solid rgba(212,175,55,0.3)"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Tooltip com valor */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-[#1a1a1a] rounded-xl text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-10 shadow-2xl">
                  <div className="font-bold text-[#D4AF37] text-sm">
                    R$ {(d.revenue / 1000).toFixed(1)}k
                  </div>
                  <div className="text-[10px] text-slate-400">{d.month}</div>
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1a1a1a] rotate-45 border-r border-b border-white/10" />
                </div>

                {/* Valor na barra (apenas para a última) */}
                {isLast && (
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 text-sm font-bold text-[#D4AF37] whitespace-nowrap">
                    R$ {(d.revenue / 1000).toFixed(1)}k
                  </div>
                )}
              </div>

              {/* Mês */}
              <span className="text-sm font-medium text-slate-400">
                {d.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
          <span className="text-xs text-slate-500">Receita</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#D4AF37] opacity-40" />
          <span className="text-xs text-slate-500">Média</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-500">Meta</span>
        </div>
      </div>
    </div>
  );
}

function ProductionBar({ data }) {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="space-y-3.5 mt-4">
      {data.map((d) => (
        <div key={d.stage}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-400">{d.stage}</span>
            <span className="text-white font-semibold">{d.count}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.count / max) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg,#D4AF37,#e8c970)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const recentOrders = orders.slice(0, 5);

export default function AdminDashboard() {
  const { revenue, orders: ordersStats, clients, production } = dashboardStats;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Visão geral do sistema — Janeiro 2025
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Receita do Mês"
          value={`R$ ${revenue.current.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          trendValue={revenue.growth}
          accent
        />
        <StatCard
          title="Pedidos"
          value={ordersStats.current}
          subtitle={`+${ordersStats.current - ordersStats.prev} vs mês anterior`}
          icon={ShoppingBag}
          trendValue={ordersStats.growth}
        />
        <StatCard
          title="Clientes Ativos"
          value={clients.current}
          subtitle={`${clients.current - clients.prev} novos este mês`}
          icon={Users}
          trendValue={clients.growth}
        />
        <StatCard
          title="Em Produção"
          value={production.current}
          subtitle="Peças em andamento"
          icon={Factory}
          trendValue={production.growth}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart - BARRAS MAIS ALTAS */}
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Receita Mensal
              </h2>
              <p className="text-sm text-slate-500 mt-1">Últimos 7 meses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-emerald-400 font-semibold bg-emerald-500/10 px-4 py-2 rounded-full">
                <TrendingUp size={16} />
                +15.2%
              </div>
              <div className="text-xs text-slate-500">📈 Meta: R$ 52k</div>
            </div>
          </div>
          <RevenueChart data={revenueChartData} />
        </Card>

        {/* Production */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-white">
              Produção
            </h2>
            <span className="text-sm text-slate-500">Por etapa</span>
          </div>
          <ProductionBar data={productionData} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold font-display text-white">
              Pedidos Recentes
            </h2>
            <a
              href="/admin/pedidos"
              className="text-sm text-[#D4AF37] hover:text-[#e8c970] transition-colors flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={16} />
            </a>
          </div>
          <Table headers={["Pedido", "Cliente", "Total", "Status", "Data"]}>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <span className="font-mono text-xs text-[#D4AF37]">
                    {order.id}
                  </span>
                </TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>
                  <span className="font-semibold text-white">
                    R${" "}
                    {order.total.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-slate-500">
                  {new Date(order.date).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-xl font-bold font-display text-white mb-4">
              Alertas
            </h2>
            <div className="space-y-3">
              {[
                {
                  type: "warn",
                  text: "Estoque baixo: Jaqueta Corta Vento (43 un.)",
                  time: "3h",
                },
                {
                  type: "info",
                  text: "Encomenda ENC-2025-003 aguarda aprovação",
                  time: "1h",
                },
                {
                  type: "warn",
                  text: "Pedido PED-2025-003 aguarda pagamento",
                  time: "5h",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-xl text-sm ${alert.type === "warn" ? "bg-amber-500/8 border border-amber-500/15" : "bg-blue-500/8 border border-blue-500/15"}`}
                >
                  <AlertCircle
                    size={18}
                    className={
                      alert.type === "warn"
                        ? "text-amber-400 flex-shrink-0 mt-0.5"
                        : "text-blue-400 flex-shrink-0 mt-0.5"
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${alert.type === "warn" ? "text-amber-300" : "text-blue-300"}`}
                    >
                      {alert.text}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {alert.time} atrás
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick stats */}
          <Card className="p-6">
            <h2 className="text-xl font-bold font-display text-white mb-4">
              Hoje
            </h2>
            <div className="space-y-3">
              {[
                { label: "Novos pedidos", value: "4" },
                { label: "Clientes novos", value: "2" },
                { label: "Receita hoje", value: "R$ 1.240" },
                { label: "Msgs não lidas", value: "3" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-semibold text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
