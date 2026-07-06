import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Star,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";
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

// ✅ DADOS SIMULADOS DE CLIENTES (BASE)
const MOCK_CLIENTS = [
  {
    id: 1,
    name: "Rafael Mendonça",
    email: "rafael@email.com",
    phone: "(31) 99999-0000",
    city: "Contagem",
    state: "MG",
    status: "VIP",
    orders: 12,
    totalSpent: 547.8,
    since: "2023-01-15T00:00:00.000Z",
  },
  {
    id: 2,
    name: "Ana Paula Silva",
    email: "ana@email.com",
    phone: "(31) 98888-1111",
    city: "Belo Horizonte",
    state: "MG",
    status: "Ativo",
    orders: 8,
    totalSpent: 289.5,
    since: "2024-03-10T00:00:00.000Z",
  },
  {
    id: 3,
    name: "Carlos Eduardo",
    email: "carlos@email.com",
    phone: "(31) 97777-2222",
    city: "Nova Lima",
    state: "MG",
    status: "Ativo",
    orders: 5,
    totalSpent: 320.0,
    since: "2024-06-20T00:00:00.000Z",
  },
  {
    id: 4,
    name: "Equipe Vortex Running",
    email: "vortex@email.com",
    phone: "(31) 96666-3333",
    city: "Muriaé",
    state: "MG",
    status: "VIP",
    orders: 18,
    totalSpent: 1245.3,
    since: "2023-08-05T00:00:00.000Z",
  },
  {
    id: 5,
    name: "Academia FitPower",
    email: "fitpower@email.com",
    phone: "(31) 95555-4444",
    city: "Muriaé",
    state: "MG",
    status: "Ativo",
    orders: 22,
    totalSpent: 890.2,
    since: "2024-01-12T00:00:00.000Z",
  },
  {
    id: 6,
    name: "Clube Atlético BH",
    email: "atleticobh@email.com",
    phone: "(31) 94444-5555",
    city: "Belo Horizonte",
    state: "MG",
    status: "VIP",
    orders: 15,
    totalSpent: 2150.0,
    since: "2022-11-25T00:00:00.000Z",
  },
  {
    id: 7,
    name: "Carla Souza",
    email: "carla@email.com",
    phone: "(31) 93333-6666",
    city: "Contagem",
    state: "MG",
    status: "Ativo",
    orders: 4,
    totalSpent: 175.5,
    since: "2025-02-14T00:00:00.000Z",
  },
  {
    id: 8,
    name: "Pedro Henrique",
    email: "pedro@email.com",
    phone: "(31) 92222-7777",
    city: "Muriaé",
    state: "MG",
    status: "Inativo",
    orders: 2,
    totalSpent: 45.9,
    since: "2024-09-08T00:00:00.000Z",
  },
  {
    id: 9,
    name: "Run Brasil Eventos",
    email: "runbrasil@email.com",
    phone: "(31) 91111-8888",
    city: "Nova Lima",
    state: "MG",
    status: "Ativo",
    orders: 10,
    totalSpent: 670.0,
    since: "2024-04-22T00:00:00.000Z",
  },
  {
    id: 10,
    name: "Mariana Oliveira",
    email: "mariana@email.com",
    phone: "(31) 90000-9999",
    city: "Belo Horizonte",
    state: "MG",
    status: "VIP",
    orders: 6,
    totalSpent: 480.0,
    since: "2023-10-30T00:00:00.000Z",
  },
];

export default function AdminClients() {
  const { clients, addClient, deleteClient, updateClient } = useApp();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Função para garantir que os dados simulados sempre existam
  const getDisplayClients = () => {
    if (!clients || clients.length === 0) {
      return MOCK_CLIENTS;
    }

    if (clients.length < 10) {
      const existingIds = new Set(clients.map((c) => c.id));
      const merged = [
        ...clients,
        ...MOCK_CLIENTS.filter((mock) => !existingIds.has(mock.id)),
      ];
      return merged;
    }

    return clients;
  };

  const displayClients = getDisplayClients();

  // ✅ Estado para o formulário de novo cliente com Total Gasto
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    totalSpent: "", // ✅ NOVO CAMPO
  });

  // ✅ Estado para edição de cliente
  const [editingClient, setEditingClient] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    status: "",
  });

  // Estado para erro de validação
  const [validationError, setValidationError] = useState("");
  // Estado para sucesso
  const [successMessage, setSuccessMessage] = useState("");

  const filtered = displayClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Função para lidar com as mudanças no formulário de novo cliente
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ✅ Função para lidar com as mudanças no formulário de edição
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingClient((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ✅ Função para salvar o novo cliente (com Total Gasto)
  const handleSaveClient = () => {
    if (!newClient.name.trim()) {
      setValidationError("⚠️ O campo Nome é obrigatório.");
      return;
    }
    if (!newClient.email.trim()) {
      setValidationError("⚠️ O campo E-mail é obrigatório.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const maxId = displayClients.reduce((max, c) => Math.max(max, c.id), 0);
      const clientToAdd = {
        id: maxId + 1,
        name: newClient.name.trim(),
        email: newClient.email.trim(),
        phone: newClient.phone || "(00) 00000-0000",
        city: newClient.city || "Não informado",
        state: newClient.state || "UF",
        status: "Ativo",
        orders: 0,
        totalSpent: parseFloat(newClient.totalSpent) || 0,
        since: new Date().toISOString(),
      };

      addClient(clientToAdd);

      setNewClient({
        name: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        totalSpent: "",
      });
      setValidationError("");
      setSuccessMessage("✅ Cliente adicionado com sucesso!");
      setIsSaving(false);

      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage("");
      }, 1000);
    }, 500);
  };

  // ✅ Função para abrir o modal de edição
  const handleEditClient = (client) => {
    setEditingClient({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone || "",
      city: client.city || "",
      state: client.state || "",
      status: client.status || "Ativo",
    });
    setIsEditing(true);
    setValidationError("");
    setSuccessMessage("");
  };

  // ✅ Função para salvar a edição do cliente
  const handleSaveEdit = () => {
    if (!editingClient.name.trim()) {
      setValidationError("⚠️ O campo Nome é obrigatório.");
      return;
    }
    if (!editingClient.email.trim()) {
      setValidationError("⚠️ O campo E-mail é obrigatório.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      updateClient(editingClient.id, {
        name: editingClient.name.trim(),
        email: editingClient.email.trim(),
        phone: editingClient.phone || "(00) 00000-0000",
        city: editingClient.city || "Não informado",
        state: editingClient.state || "UF",
        status: editingClient.status || "Ativo",
      });

      setValidationError("");
      setSuccessMessage("✅ Cliente atualizado com sucesso!");
      setIsSaving(false);

      if (selected && selected.id === editingClient.id) {
        setSelected({
          ...selected,
          name: editingClient.name.trim(),
          email: editingClient.email.trim(),
          phone: editingClient.phone || "(00) 00000-0000",
          city: editingClient.city || "Não informado",
          state: editingClient.state || "UF",
          status: editingClient.status || "Ativo",
        });
      }

      setTimeout(() => {
        setIsEditing(false);
        setSuccessMessage("");
        setEditingClient({
          id: null,
          name: "",
          email: "",
          phone: "",
          city: "",
          state: "",
          status: "",
        });
      }, 1000);
    }, 500);
  };

  // Função para excluir cliente
  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setShowDeleteConfirm(true);
  };

  // Função para confirmar exclusão
  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      setShowDeleteConfirm(false);
      if (selected && selected.id === clientToDelete.id) {
        setSelected(null);
      }
      setClientToDelete(null);
    }
  };

  // Função para cancelar exclusão
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setClientToDelete(null);
  };

  // Função para fechar o modal de edição
  const closeEditModal = () => {
    setIsEditing(false);
    setValidationError("");
    setSuccessMessage("");
    setEditingClient({
      id: null,
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      status: "",
    });
  };

  return (
    <div>
      <PageHeader
        title="Clientes"
        subtitle={`${displayClients.length} clientes cadastrados`}
        actions={
          <Button icon={UserPlus} onClick={() => setShowModal(true)}>
            Novo Cliente
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: displayClients.length, color: "text-white" },
          {
            label: "Ativos",
            value: displayClients.filter((c) => c.status === "Ativo").length,
            color: "text-emerald-400",
          },
          {
            label: "VIP",
            value: displayClients.filter((c) => c.status === "VIP").length,
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
          <span className="text-xs text-slate-600">
            {filtered.length} cliente{filtered.length !== 1 ? "s" : ""}
          </span>
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
                <div className="flex items-center gap-1">
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClient(client);
                    }}
                    className="p-1.5 rounded-lg text-[#D4AF37] hover:text-[#e8c970] hover:bg-[#D4AF37]/10 transition-colors"
                    title="Editar cliente"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClient(client);
                    }}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    title="Excluir cliente"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
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
            <div className="flex items-center justify-between">
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
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelected(null);
                    handleEditClient(selected);
                  }}
                  className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
                  title="Editar cliente"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelected(null);
                    handleDeleteClient(selected);
                  }}
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                  title="Excluir cliente"
                >
                  <Trash2 size={18} />
                </button>
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

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tem certeza?
            </h3>
            <p className="text-sm text-slate-400">
              Você está prestes a excluir o cliente <br />
              <span className="text-white font-semibold">
                "{clientToDelete?.name}"
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={cancelDelete}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Edição de Cliente */}
      <Modal isOpen={isEditing} onClose={closeEditModal} title="Editar Cliente">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Nome completo *
            </label>
            <input
              type="text"
              name="name"
              value={editingClient.name}
              onChange={handleEditInputChange}
              placeholder="Nome do cliente"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={editingClient.email}
              onChange={handleEditInputChange}
              placeholder="email@exemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={editingClient.phone}
              onChange={handleEditInputChange}
              placeholder="(00) 00000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={editingClient.city}
                onChange={handleEditInputChange}
                placeholder="Cidade"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Estado
              </label>
              <input
                type="text"
                name="state"
                value={editingClient.state}
                onChange={handleEditInputChange}
                placeholder="UF"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={editingClient.status}
              onChange={handleEditInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Ativo" className="bg-[#0a0a0a]">
                Ativo
              </option>
              <option value="VIP" className="bg-[#0a0a0a]">
                VIP
              </option>
              <option value="Inativo" className="bg-[#0a0a0a]">
                Inativo
              </option>
            </select>
          </div>

          {validationError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={closeEditModal}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Atualizar Cliente"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ✅ Modal de Novo Cliente - COM TOTAL GASTO */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewClient({
            name: "",
            email: "",
            phone: "",
            city: "",
            state: "",
            totalSpent: "",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Novo Cliente"
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Nome completo *
            </label>
            <input
              type="text"
              name="name"
              value={newClient.name}
              onChange={handleInputChange}
              placeholder="Nome do cliente"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={newClient.email}
              onChange={handleInputChange}
              placeholder="email@exemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Telefone
            </label>
            <input
              type="text"
              name="phone"
              value={newClient.phone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                value={newClient.city}
                onChange={handleInputChange}
                placeholder="Cidade"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Estado
              </label>
              <input
                type="text"
                name="state"
                value={newClient.state}
                onChange={handleInputChange}
                placeholder="UF"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
          </div>

          {/* ✅ NOVO CAMPO: Total Gasto */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Total Gasto
            </label>
            <input
              type="number"
              name="totalSpent"
              value={newClient.totalSpent}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              Valor total gasto pelo cliente (opcional)
            </p>
          </div>

          {validationError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setNewClient({
                  name: "",
                  email: "",
                  phone: "",
                  city: "",
                  state: "",
                  totalSpent: "",
                });
                setValidationError("");
                setSuccessMessage("");
              }}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveClient}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Cliente"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
