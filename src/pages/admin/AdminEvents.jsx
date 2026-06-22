import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Plus,
  MapPin,
  Calendar,
  Users,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  StatusBadge,
  Modal,
  Input,
  Select,
  Card,
  Table,
  TableCell,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const STATUS_OPTIONS = [
  "Inscrições abertas",
  "Quase lotado",
  "Lotado",
  "Encerrado",
];

const emptyForm = {
  name: "",
  date: "",
  location: "",
  distance: "",
  price: "",
  maxParticipants: "",
  status: "Inscrições abertas",
  description: "",
};

export default function AdminEvents() {
  const { events, setEvents } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const filtered = events.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase()),
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setEditing(event);
    setForm({
      name: event.name,
      date: event.date,
      location: event.location,
      distance: event.distance,
      price: event.price,
      maxParticipants: event.maxParticipants,
      status: event.status,
      description: event.description,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (editing) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? {
                ...e,
                name: form.name,
                date: form.date,
                location: form.location,
                distance: form.distance,
                price: parseFloat(form.price) || 0,
                maxParticipants: parseInt(form.maxParticipants) || 0,
                status: form.status,
                description: form.description,
              }
            : e,
        ),
      );
    } else {
      const newEvent = {
        id: Math.max(0, ...events.map((e) => e.id)) + 1,
        name: form.name,
        date: form.date,
        location: form.location,
        distance: form.distance,
        price: parseFloat(form.price) || 0,
        participants: 0,
        maxParticipants: parseInt(form.maxParticipants) || 0,
        status: form.status,
        image: null,
        description: form.description,
      };
      setEvents((prev) => [...prev, newEvent]);
    }
    setShowModal(false);
    setForm(emptyForm);
    setEditing(null);
  };

  const handleDelete = (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Corridas e Eventos"
        subtitle={`${events.length} eventos cadastrados`}
        actions={
          <Button icon={Plus} onClick={openNew}>
            Novo Evento
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total de Eventos",
            value: events.length,
            color: "text-white",
          },
          {
            label: "Inscrições Abertas",
            value: events.filter((e) => e.status === "Inscrições abertas")
              .length,
            color: "text-emerald-400",
          },
          {
            label: "Quase Lotados",
            value: events.filter((e) => e.status === "Quase lotado").length,
            color: "text-amber-400",
          },
          {
            label: "Total de Inscritos",
            value: events.reduce((a, e) => a + e.participants, 0),
            color: "text-orange-400",
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

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar evento..."
            className="flex-1 max-w-sm"
          />
        </div>

        <Table
          headers={[
            "Evento",
            "Data",
            "Local",
            "Distâncias",
            "Preço",
            "Inscritos",
            "Status",
            "",
          ]}
        >
          {filtered.map((event, i) => {
            const pct = (event.participants / event.maxParticipants) * 100;
            return (
              <motion.tr
                key={event.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
                onClick={() => setSelected(event)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0">
                      <Trophy size={15} className="text-orange-400" />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {event.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar size={11} />
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={11} />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  {event.distance}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-white">
                    R$ {event.price.toFixed(2).replace(".", ",")}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-slate-500" />
                    <span className="text-white font-medium">
                      {event.participants}/{event.maxParticipants}
                    </span>
                    <div className="hidden xl:block w-12 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(pct, 100)}%`,
                          background:
                            pct >= 85
                              ? "#f59e0b"
                              : "linear-gradient(90deg,#f97316,#fb923c)",
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(event);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(event);
                      }}
                    />
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </Table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Trophy size={32} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Nenhum evento encontrado</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Evento"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">
                  {selected.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {selected.location}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="glass-light rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Descrição
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selected.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Data",
                  value: new Date(selected.date).toLocaleDateString("pt-BR"),
                },
                { label: "Distâncias", value: selected.distance },
                {
                  label: "Preço",
                  value: `R$ ${selected.price.toFixed(2).replace(".", ",")}`,
                },
                {
                  label: "Vagas",
                  value: `${selected.participants}/${selected.maxParticipants}`,
                },
              ].map((item) => (
                <div key={item.label} className="glass-light rounded-xl p-3">
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm text-white font-medium">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setSelected(null)}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button
                icon={Edit2}
                onClick={() => {
                  setSelected(null);
                  openEdit(selected);
                }}
                className="flex-1"
              >
                Editar Evento
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? "Editar Evento" : "Novo Evento"}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nome do Evento"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ex: Corrida das Montanhas BH"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Data"
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
          </div>
          <Input
            label="Local"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            placeholder="Ex: Parque das Mangabeiras, BH"
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Distâncias"
              value={form.distance}
              onChange={(e) => update("distance", e.target.value)}
              placeholder="Ex: 10km / 21km"
              className="col-span-2"
            />
            <Input
              label="Preço (R$)"
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="120.00"
              required
            />
          </div>
          <Input
            label="Limite de Participantes"
            type="number"
            value={form.maxParticipants}
            onChange={(e) => update("maxParticipants", e.target.value)}
            placeholder="500"
            required
          />
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Descrição
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Descreva o evento: percurso, estrutura, diferenciais..."
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 resize-none focus:border-orange-500/50 transition-colors placeholder:text-slate-600"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name || !form.date || !form.location}
              className="flex-1"
            >
              {editing ? "Salvar Alterações" : "Criar Evento"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Delete */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Excluir Evento"
        size="sm"
      >
        {confirmDelete && (
          <div className="space-y-5">
            <p className="text-sm text-slate-400">
              Tem certeza que deseja excluir o evento{" "}
              <span className="text-white font-semibold">
                {confirmDelete.name}
              </span>
              ? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete.id)}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
