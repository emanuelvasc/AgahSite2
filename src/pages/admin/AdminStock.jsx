import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, Package, RefreshCw } from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  Card,
  Table,
  TableRow,
  TableCell,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function AdminStock() {
  const { products } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "baixo") return matchSearch && p.stock <= 50;
    if (filter === "critico") return matchSearch && p.stock <= 20;
    return matchSearch;
  });

  const totalItems = products.reduce((a, p) => a + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 50).length;
  const critical = products.filter((p) => p.stock <= 20).length;
  const totalValue = products.reduce((a, p) => a + p.stock * p.cost, 0);

  const stockColor = (qty) => {
    if (qty <= 20) return "text-red-400";
    if (qty <= 50) return "text-amber-400";
    return "text-emerald-400";
  };
  const stockBg = (qty) => {
    if (qty <= 20) return "bg-red-500/15";
    if (qty <= 50) return "bg-amber-500/15";
    return "bg-emerald-500/15";
  };

  return (
    <div>
      <PageHeader
        title="Estoque"
        subtitle="Controle de inventário por produto"
        actions={
          <Button icon={RefreshCw} variant="secondary">
            Atualizar
          </Button>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-white mb-1">
            {totalItems.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Total de Unidades</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-amber-400 mb-1">
            {lowStock}
          </div>
          <div className="text-xs text-slate-500">Estoque Baixo (≤50)</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-red-400 mb-1">
            {critical}
          </div>
          <div className="text-xs text-slate-500">Estoque Crítico (≤20)</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-[#D4AF37] mb-1">
            R$ {(totalValue / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-slate-500">Valor em Estoque</div>
        </Card>
      </div>

      {/* Alerts */}
      {critical > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/8 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-red-300">
              {critical} produto{critical > 1 ? "s" : ""} com estoque crítico
            </div>
            <div className="text-xs text-red-400/70 mt-0.5">
              Providencie reposição urgente dos itens abaixo
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {[
          ["todos", "Todos"],
          ["baixo", "Estoque Baixo"],
          ["critico", "Crítico"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === val ? "gradient-brand text-white" : "glass-light text-slate-400 border border-white/8"}`}
          >
            {label}
          </button>
        ))}
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="ml-auto w-64"
        />
      </div>

      <div className="glass rounded-2xl p-6">
        <Table
          headers={[
            "Produto",
            "Código",
            "Categoria",
            "Estoque",
            "Valor Unitário",
            "Valor Total",
            "Status",
          ]}
        >
          {filtered.map((p, i) => (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Package size={14} className="text-slate-500" />
                  </div>
                  <span className="text-white font-medium text-sm">
                    {p.name}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="font-mono text-xs text-[#D4AF37]">
                  {p.code}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs bg-white/5 px-2 py-1 rounded-lg text-slate-400">
                  {p.category}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${stockColor(p.stock)}`}>
                    {p.stock}
                  </span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full w-16 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((p.stock / 200) * 100, 100)}%`,
                        background:
                          p.stock <= 20
                            ? "#ef4444"
                            : p.stock <= 50
                              ? "#f59e0b"
                              : "#10b981",
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-slate-400">
                R$ {p.cost.toFixed(2)}
              </TableCell>
              <TableCell>
                <span className="font-semibold text-white">
                  R${" "}
                  {(p.stock * p.cost).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${stockBg(p.stock)} ${stockColor(p.stock)}`}
                >
                  {p.stock <= 20
                    ? "Crítico"
                    : p.stock <= 50
                      ? "Baixo"
                      : "Normal"}
                </span>
              </TableCell>
            </motion.tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
