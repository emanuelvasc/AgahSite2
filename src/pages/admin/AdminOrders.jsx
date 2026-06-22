import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ShoppingBag, Eye, Filter } from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  StatusBadge,
  Table,
  TableRow,
  TableCell,
  Modal,
  Card,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const ALL_STATUS = [
  "Todos",
  "Pendente",
  "Aguardando Pagamento",
  "Em Produção",
  "Enviado",
  "Entregue",
  "Cancelado",
];

export default function AdminOrders() {
  const { orders } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((a, o) => a + o.total, 0);

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos no total`}
        actions={<Button icon={Plus}>Novo Pedido</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total de Pedidos",
            value: orders.length,
            color: "text-white",
          },
          {
            label: "Em Produção",
            value: orders.filter((o) => o.status === "Em Produção").length,
            color: "text-blue-400",
          },
          {
            label: "Enviados",
            value: orders.filter((o) => o.status === "Enviado").length,
            color: "text-violet-400",
          },
          {
            label: "Receita Total",
            value: `R$ ${orders.reduce((a, o) => a + o.total, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            color: "text-[#D4AF37]",
          },
        ].map((s) => (
          <Card key={s.label} className="py-4">
            <div className={`text-xl font-bold font-display mb-1 ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {ALL_STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === s ? "gradient-brand text-white" : "glass-light text-slate-400 hover:text-white border border-white/8"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pedido ou cliente..."
            className="flex-1 max-w-sm"
          />
          <span className="text-xs text-slate-500">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <Table
          headers={[
            "Pedido",
            "Cliente",
            "Itens",
            "Total",
            "Pagamento",
            "Status",
            "Data",
            "",
          ]}
        >
          {filtered.map((order, i) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
              onClick={() => setSelected(order)}
            >
              <TableCell>
                <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                  {order.id}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-white font-medium">{order.client}</span>
              </TableCell>
              <TableCell>
                <span className="text-slate-400">
                  {order.items} item{order.items > 1 ? "s" : ""}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-bold text-white">
                  R${" "}
                  {order.total.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs bg-white/5 px-2 py-1 rounded-lg text-slate-300">
                  {order.payment}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-slate-500 text-xs">
                {new Date(order.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" icon={Eye} />
              </TableCell>
            </motion.tr>
          ))}
        </Table>
      </div>

      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Pedido"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-[#D4AF37] font-bold">
                {selected.id}
              </span>
              <StatusBadge status={selected.status} />
            </div>
            <div className="glass-light rounded-xl p-4 space-y-3">
              {[
                { label: "Cliente", value: selected.client },
                { label: "Itens", value: `${selected.items} produto(s)` },
                {
                  label: "Total",
                  value: `R$ ${selected.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
                },
                { label: "Pagamento", value: selected.payment },
                {
                  label: "Data",
                  value: new Date(selected.date).toLocaleDateString("pt-BR"),
                },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm text-white font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Alterar Status
              </div>
              <div className="flex flex-wrap gap-2">
                {["Em Produção", "Enviado", "Entregue", "Cancelado"].map(
                  (s) => (
                    <button
                      key={s}
                      className="text-xs px-3 py-1.5 rounded-lg glass-light border border-white/8 hover:border-[#D4AF37]/30 text-slate-400 hover:text-white transition-all"
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setSelected(null)}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button className="flex-1">Gerar PDF</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
