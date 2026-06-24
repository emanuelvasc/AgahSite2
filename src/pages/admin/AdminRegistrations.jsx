import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  Trophy,
  Calendar,
  Shirt,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  StatusBadge,
  Table,
  TableCell,
  Modal,
  Card,
  Avatar,
  Select,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const STATUS_FILTERS = ["Todos", "Confirmada", "Pendente", "Cancelada"];

export default function AdminEventRegistrations() {
  const { eventRegistrations, setEventRegistrations, events } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [eventFilter, setEventFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);

  const filtered = eventRegistrations.filter((r) => {
    const matchSearch =
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || r.status === statusFilter;
    const matchEvent = eventFilter === "Todos" || r.eventName === eventFilter;
    return matchSearch && matchStatus && matchEvent;
  });

  const totalRevenue = eventRegistrations
    .filter((r) => r.status === "Confirmada")
    .reduce((a, r) => a + r.price, 0);

  const updateStatus = (id, status) => {
    setEventRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
    setSelected((prev) =>
      prev && prev.id === id ? { ...prev, status } : prev,
    );
  };

  return (
    <div>
      <PageHeader
        title="Inscrições em Eventos"
        subtitle={`${eventRegistrations.length} inscrições recebidas`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total de Inscrições",
            value: eventRegistrations.length,
            color: "text-white",
          },
          {
            label: "Confirmadas",
            value: eventRegistrations.filter((r) => r.status === "Confirmada")
              .length,
            color: "text-emerald-400",
          },
          {
            label: "Pendentes",
            value: eventRegistrations.filter((r) => r.status === "Pendente")
              .length,
            color: "text-amber-400",
          },
          {
            label: "Receita de Inscrições",
            value: `R$ ${totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
            color: "text-[#D4AF37]",
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

      {/* Status filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
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
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente ou protocolo..."
            className="flex-1 max-w-sm"
          />
          <Select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            options={[
              { value: "Todos", label: "Todos os eventos" },
              ...events.map((ev) => ({ value: ev.name, label: ev.name })),
            ]}
            className="w-56"
          />
        </div>

        <Table
          headers={[
            "Protocolo",
            "Cliente",
            "Evento",
            "Categoria",
            "Camiseta",
            "Valor",
            "Status",
            "Data",
            "",
          ]}
        >
          {filtered.map((reg, i) => (
            <motion.tr
              key={reg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
              onClick={() => setSelected(reg)}
            >
              <TableCell>
                <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                  {reg.id}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar name={reg.clientName} size="sm" />
                  <span className="text-white font-medium text-sm">
                    {reg.clientName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Trophy size={11} className="text-slate-500" />
                  {reg.eventName}
                </div>
              </TableCell>
              <TableCell>
                <span className="text-xs bg-white/5 px-2 py-1 rounded-lg text-slate-300">
                  {reg.distance}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Shirt size={11} />
                  {reg.shirtSize}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-white">
                  R$ {reg.price.toFixed(2).replace(".", ",")}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={reg.status} />
              </TableCell>
              <TableCell className="text-slate-500 text-xs">
                {new Date(reg.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" icon={Eye} />
              </TableCell>
            </motion.tr>
          ))}
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <ClipboardCheck size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Nenhuma inscrição encontrada
            </p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes da Inscrição"
        size="md"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg text-[#D4AF37] font-bold">
                {selected.id}
              </span>
              <StatusBadge status={selected.status} />
            </div>

            <div className="flex items-center gap-3 glass-light rounded-xl p-4">
              <Avatar name={selected.clientName} size="md" />
              <div>
                <div className="font-semibold text-white">
                  {selected.clientName}
                </div>
                <div className="text-xs text-slate-500">Cliente inscrito</div>
              </div>
            </div>

            <div className="glass-light rounded-xl p-4 space-y-3">
              {[
                { label: "Evento", value: selected.eventName, icon: Trophy },
                {
                  label: "Categoria/Distância",
                  value: selected.distance,
                  icon: Calendar,
                },
                {
                  label: "Tamanho da Camiseta",
                  value: selected.shirtSize,
                  icon: Shirt,
                },
                {
                  label: "Data da Inscrição",
                  value: new Date(selected.date).toLocaleDateString("pt-BR"),
                  icon: Calendar,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm text-slate-500 flex items-center gap-2">
                    <item.icon size={13} className="text-slate-600" />
                    {item.label}
                  </span>
                  <span className="text-sm text-white font-medium">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            <div className="glass-light rounded-xl p-4 border border-emerald-500/20">
              <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                Valor da Inscrição
              </div>
              <div className="text-2xl font-bold font-display gradient-text">
                R$ {selected.price.toFixed(2).replace(".", ",")}
              </div>
            </div>

            {selected.status === "Pendente" && (
              <div className="flex gap-2">
                <Button
                  icon={Check}
                  onClick={() => updateStatus(selected.id, "Confirmada")}
                  className="flex-1"
                >
                  Confirmar Inscrição
                </Button>
                <Button
                  variant="danger"
                  icon={X}
                  onClick={() => updateStatus(selected.id, "Cancelada")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            )}

            <Button
              variant="secondary"
              onClick={() => setSelected(null)}
              className="w-full"
            >
              Fechar
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
