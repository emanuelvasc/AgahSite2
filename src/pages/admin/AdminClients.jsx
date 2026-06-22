import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Mail, Phone, MapPin, ShoppingBag, Star } from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  StatusBadge,
  Table,
  TableRow,
  TableCell,
  Modal,
  Input,
  Card,
  Avatar,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function AdminClients() {
  const { clients } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${clients.length} clientes cadastrados`}
        actions={
          <Button icon={UserPlus} onClick={() => setShowModal(true)}>
            Novo Cliente
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: clients.length, color: "text-white" },
          {
            label: "Ativos",
            value: clients.filter((c) => c.status === "Ativo").length,
            color: "text-emerald-400",
          },
          {
            label: "VIP",
            value: clients.filter((c) => c.status === "VIP").length,
            color: "text-amber-400",
          },
          { label: "Novos (mês)", value: 3, color: "text-blue-400" },
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
            placeholder="Buscar por nome ou e-mail..."
            className="flex-1 max-w-sm"
          />
        </div>

        <Table
          headers={[
            "Cliente",
            "Contato",
            "Localização",
            "Pedidos",
            "Total Gasto",
            "Status",
            "",
          ]}
        >
          {filtered.map((client, i) => (
            <motion.tr
              key={client.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer"
              onClick={() => setSelected(client)}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={client.name} size="sm" />
                  <div>
                    <div className="text-white font-medium text-sm">
                      {client.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Desde {new Date(client.since).getFullYear()}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-0.5">
                  <div className="text-xs flex items-center gap-1.5 text-slate-400">
                    <Mail size={11} />
                    {client.email}
                  </div>
                  <div className="text-xs flex items-center gap-1.5 text-slate-400">
                    <Phone size={11} />
                    {client.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <MapPin size={12} />
                  {client.city}, {client.state}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5 text-sm">
                  <ShoppingBag size={13} className="text-slate-500" />
                  <span className="text-white font-semibold">
                    {client.orders}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-white font-semibold">
                  R${" "}
                  {client.totalSpent.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={client.status} />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(client);
                  }}
                >
                  Ver
                </Button>
              </TableCell>
            </motion.tr>
          ))}
        </Table>
      </div>

      {/* Client Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Cliente"
        size="lg"
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  {selected.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selected.status} />
                  <span className="text-xs text-slate-500">
                    Cliente desde{" "}
                    {new Date(selected.since).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "E-mail", value: selected.email, icon: Mail },
                { label: "Telefone", value: selected.phone, icon: Phone },
                {
                  label: "Cidade",
                  value: `${selected.city}, ${selected.state}`,
                  icon: MapPin,
                },
                {
                  label: "Total de Pedidos",
                  value: selected.orders,
                  icon: ShoppingBag,
                },
              ].map((item) => (
                <div key={item.label} className="glass-light rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon size={14} className="text-slate-500" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-white font-medium">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="glass-light rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Star size={14} className="text-[#D4AF37]" />
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  Total Gasto
                </span>
              </div>
              <div className="text-2xl font-bold font-display gradient-text">
                R${" "}
                {selected.totalSpent.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Client Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Cliente"
      >
        <div className="space-y-4">
          <Input label="Nome completo" placeholder="Nome do cliente" required />
          <Input
            label="E-mail"
            type="email"
            placeholder="email@exemplo.com"
            required
          />
          <Input label="Telefone" placeholder="(00) 00000-0000" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cidade" placeholder="Cidade" />
            <Input label="Estado" placeholder="UF" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button className="flex-1">Salvar Cliente</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
