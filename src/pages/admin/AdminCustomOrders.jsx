import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Eye,
  DollarSign,
  Send,
  CheckCircle,
} from "lucide-react";
import {
  PageHeader,
  Button,
  StatusBadge,
  Table,
  TableCell,
  Modal,
  Card,
  SearchInput,
  Avatar,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const ALL_STATUS = [
  "Todos",
  "Em análise",
  "Orçamento enviado",
  "Aguardando aprovação",
  "Aprovado",
  "Em produção",
  "Finalizado",
  "Cancelado",
];

export default function AdminCustomOrders() {
  const { customOrders } = useApp();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const filtered = customOrders.filter((o) => {
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    const matchSearch =
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.protocol.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <PageHeader
        title="Encomendas"
        subtitle="Pedidos personalizados e produção sob demanda"
        actions={<Button icon={Plus}>Nova Encomenda</Button>}
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: customOrders.length, color: "text-white" },
          {
            label: "Em Análise",
            value: customOrders.filter((o) => o.status === "Em análise").length,
            color: "text-amber-400",
          },
          {
            label: "Em Produção",
            value: customOrders.filter((o) => o.status === "Em produção")
              .length,
            color: "text-blue-400",
          },
          {
            label: "Aguard. Aprovação",
            value: customOrders.filter(
              (o) => o.status === "Aguardando aprovação",
            ).length,
            color: "text-violet-400",
          },
        ].map((s) => (
          <Card key={s.label} className="py-4">
            <div className={`text-2xl font-bold font-display mb-1 ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ALL_STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${statusFilter === s ? "gradient-brand text-white" : "glass-light text-slate-400 border border-white/8"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="mb-5">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente ou protocolo..."
            className="max-w-sm"
          />
        </div>

        <Table
          headers={[
            "Protocolo",
            "Cliente",
            "Tipo",
            "Qtd.",
            "Orçamento",
            "Status",
            "Data",
            "",
          ]}
        >
          {filtered.map((enc, i) => (
            <motion.tr
              key={enc.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
              onClick={() => setSelected(enc)}
            >
              <TableCell>
                <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                  {enc.protocol}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar name={enc.client} size="sm" />
                  <span className="text-white font-medium text-sm">
                    {enc.client}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-slate-300">{enc.type}</span>
              </TableCell>
              <TableCell>
                <span className="text-white font-semibold">
                  {enc.quantity} un.
                </span>
              </TableCell>
              <TableCell>
                {enc.budget ? (
                  <span className="text-emerald-400 font-semibold">
                    R${" "}
                    {enc.budget.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">Pendente</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={enc.status} />
              </TableCell>
              <TableCell className="text-slate-500 text-xs">
                {new Date(enc.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" icon={Eye} />
              </TableCell>
            </motion.tr>
          ))}
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ClipboardList size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Nenhuma encomenda encontrada
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes da Encomenda"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-[#D4AF37] text-sm font-semibold mb-1">
                  {selected.protocol}
                </div>
                <div className="font-bold text-white text-lg">
                  {selected.type}
                </div>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="glass-light rounded-xl p-4 space-y-3">
              {[
                { label: "Cliente", value: selected.client },
                { label: "Quantidade", value: `${selected.quantity} unidades` },
                {
                  label: "Data da Solicitação",
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

            <div className="glass-light rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Descrição
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.description}
              </p>
            </div>

            {selected.budget && (
              <div className="glass-light rounded-xl p-4 border border-emerald-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign size={14} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                    Orçamento
                  </span>
                </div>
                <div className="text-2xl font-bold font-display text-emerald-400">
                  R${" "}
                  {selected.budget.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Ações Rápidas
              </div>
              <div className="flex gap-2 flex-wrap">
                {!selected.budget && (
                  <Button icon={DollarSign} size="sm">
                    Enviar Orçamento
                  </Button>
                )}
                <Button variant="secondary" icon={Send} size="sm">
                  Responder Cliente
                </Button>
                <Button variant="secondary" icon={CheckCircle} size="sm">
                  Aprovar
                </Button>
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
              <Button className="flex-1">Encaminhar para Produção</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
