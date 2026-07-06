import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";
import { PageHeader, Button, Card, Select } from "../../components/ui";
import { revenueChartData, products } from "../../data/mockData";

function BarChart({
  data,
  valueKey = "revenue",
  color = "#D4AF37",
  label = "",
}) {
  const max = Math.max(...data.map((d) => d[valueKey]));
  return (
    <div className="flex items-end gap-2 h-40">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5 group"
        >
          <div className="w-full flex items-end" style={{ height: "136px" }}>
            <div
              className="w-full rounded-t-lg transition-all relative cursor-pointer"
              style={{
                height: `${(d[valueKey] / max) * 100}%`,
                background:
                  i === data.length - 1
                    ? "linear-gradient(180deg,#D4AF37,#b08526)"
                    : "rgba(212,175,55,0.25)",
                minHeight: "4px",
              }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1e1e1e] rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 z-10">
                {typeof d[valueKey] === "number" && d[valueKey] > 1000
                  ? `R$ ${(d[valueKey] / 1000).toFixed(1)}k`
                  : d[valueKey]}
              </div>
            </div>
          </div>
          <span className="text-[10px] text-slate-600">{d.month}</span>
        </div>
      ))}
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, positive }) {
  const isPos = positive ?? change >= 0;
  return (
    <Card className="py-4">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-white/5 rounded-xl">
          <Icon size={18} className="text-slate-400" />
        </div>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1 ${isPos ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
        >
          {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{" "}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="text-2xl font-bold font-display text-white mb-1">
        {value}
      </div>
      <div className="text-xs text-slate-500">{title}</div>
    </Card>
  );
}

// ✅ DADOS POR PERÍODO
const periodData = {
  week: {
    revenue: "R$ 12,4k",
    orders: "32",
    clients: "8",
    ticket: "R$ 387",
    chartData: revenueChartData.slice(-2),
    topProducts: products.slice(0, 4).map((p, i) => ({
      ...p,
      sold: [32, 28, 22, 18][i],
      revenue: p.price * [32, 28, 22, 18][i],
    })),
    totalSold: "156",
    change: 5.2,
  },
  month: {
    revenue: "R$ 48,7k",
    orders: "127",
    clients: "27",
    ticket: "R$ 383",
    chartData: revenueChartData,
    topProducts: products.slice(0, 5).map((p, i) => ({
      ...p,
      sold: [145, 112, 98, 87, 76][i],
      revenue: p.price * [145, 112, 98, 87, 76][i],
    })),
    totalSold: "618",
    change: 15.2,
  },
  quarter: {
    revenue: "R$ 142,3k",
    orders: "389",
    clients: "72",
    ticket: "R$ 366",
    chartData: revenueChartData.map((d, i) => ({
      ...d,
      revenue: d.revenue * 3.2,
      orders: d.orders * 3.5,
    })),
    topProducts: products.slice(0, 5).map((p, i) => ({
      ...p,
      sold: [420, 340, 280, 210, 180][i],
      revenue: p.price * [420, 340, 280, 210, 180][i],
    })),
    totalSold: "1.850",
    change: 28.4,
  },
  year: {
    revenue: "R$ 587,6k",
    orders: "1.542",
    clients: "286",
    ticket: "R$ 381",
    chartData: revenueChartData.map((d, i) => ({
      ...d,
      revenue: d.revenue * 12.5,
      orders: d.orders * 14,
    })),
    topProducts: products.slice(0, 5).map((p, i) => ({
      ...p,
      sold: [1580, 1320, 1150, 980, 850][i],
      revenue: p.price * [1580, 1320, 1150, 980, 850][i],
    })),
    totalSold: "7.240",
    change: 42.8,
  },
};

const categoryData = [
  { name: "Camisas", value: 35, color: "#D4AF37" },
  { name: "Uniformes", value: 25, color: "#8b5cf6" },
  { name: "Shorts/Bermudas", value: 18, color: "#06b6d4" },
  { name: "Leggings/Calças", value: 12, color: "#10b981" },
  { name: "Outros", value: 10, color: "#6366f1" },
];

export default function AdminReports() {
  const [period, setPeriod] = useState("month");

  const currentData = periodData[period];
  const periodLabels = {
    week: "Esta semana",
    month: "Este mês",
    quarter: "Trimestre",
    year: "Este ano",
  };

  // ✅ Dados dos produtos mais vendidos
  const topProducts = currentData.topProducts;
  const maxSold = topProducts.length > 0 ? topProducts[0].sold : 1;

  return (
    <div>
      <PageHeader
        title="Relatórios"
        subtitle={`Análise de desempenho - ${periodLabels[period]}`}
        actions={
          <div className="flex gap-2">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              options={[
                { value: "week", label: "Esta semana" },
                { value: "month", label: "Este mês" },
                { value: "quarter", label: "Trimestre" },
                { value: "year", label: "Este ano" },
              ]}
              className="w-36"
            />
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Receita Total"
          value={currentData.revenue}
          change={currentData.change}
          icon={DollarSign}
        />
        <MetricCard
          title="Pedidos"
          value={currentData.orders}
          change={currentData.change * 1.1}
          icon={ShoppingBag}
        />
        <MetricCard
          title="Novos Clientes"
          value={currentData.clients}
          change={currentData.change * 0.6}
          icon={Users}
        />
        <MetricCard
          title="Ticket Médio"
          value={currentData.ticket}
          change={currentData.change * 0.2}
          icon={Package}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Revenue */}
        <div className="xl:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold font-display text-white">
                Receita Mensal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {periodLabels[period]} - {currentData.chartData.length} meses
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] inline-block" />
                Receita
              </span>
            </div>
          </div>
          <BarChart data={currentData.chartData} valueKey="revenue" />
        </div>

        {/* Category breakdown */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold font-display text-white mb-6">
            Vendas por Categoria
          </h2>
          <div className="space-y-4">
            {categoryData.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{cat.name}</span>
                  <span className="text-white font-semibold">{cat.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    key={period}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.value}%` }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/6">
            <div className="text-xs text-slate-500 mb-2">
              Total vendido no período
            </div>
            <div className="text-xl font-bold font-display gradient-text">
              {currentData.totalSold} peças
            </div>
          </div>
        </div>
      </div>

      {/* Orders chart */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold font-display text-white">
              Pedidos por Mês
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {periodLabels[period]} - {currentData.chartData.length} meses
            </p>
          </div>
        </div>
        <BarChart
          data={currentData.chartData}
          valueKey="orders"
          color="#8b5cf6"
        />
      </div>

      {/* Top Products */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold font-display text-white">
            Produtos Mais Vendidos
          </h2>
          <span className="text-xs text-slate-500">Top 5 do período</span>
        </div>
        <div className="space-y-4">
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-4">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background:
                    i === 0
                      ? "linear-gradient(135deg,#D4AF37,#b08526)"
                      : "rgba(255,255,255,0.05)",
                  color: i === 0 ? "#fff" : "#94a3b8",
                }}
              >
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white font-medium truncate">
                    {p.name}
                  </span>
                  <span className="text-slate-400 ml-4 flex-shrink-0">
                    {p.sold} un.
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    key={period + i}
                    initial={{ width: 0 }}
                    animate={{ width: `${(p.sold / maxSold) * 100}%` }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(90deg,#D4AF37,#e8c970)"
                          : "rgba(212,175,55,0.4)",
                    }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0 w-24">
                <div className="text-xs font-semibold text-emerald-400">
                  R$ {(p.revenue / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] text-slate-600">receita</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
