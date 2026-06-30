import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  ShoppingBag,
  Eye,
  Filter,
  Save,
  X,
  Check,
  Trash2,
  Edit2,
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
  Card,
  Input,
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

const STATUS_OPTIONS = ["Em Produção", "Enviado", "Entregue", "Cancelado"];

export default function AdminOrders() {
  const { orders, addOrder, updateOrderStatus, updateOrder } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Estado para novo pedido
  const [newOrder, setNewOrder] = useState({
    client: "",
    items: 1,
    total: 0,
    payment: "Pix",
    status: "Pendente",
  });

  // Estado para edição de pedido
  const [editingOrder, setEditingOrder] = useState({
    id: "",
    client: "",
    items: 1,
    total: 0,
    payment: "",
    status: "",
  });

  // Estado para status selecionado no modal de detalhes
  const [selectedStatus, setSelectedStatus] = useState("");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.client.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((a, o) => a + o.total, 0);

  // ─── FUNÇÃO PARA ABRIR MODAL DE DETALHES ──────────────────
  const handleOpenDetails = (order) => {
    setSelected(order);
    setSelectedStatus(order.status);
    setSuccessMessage("");
  };

  // ─── FUNÇÃO PARA ABRIR MODAL DE EDIÇÃO ────────────────────
  const handleOpenEdit = (order) => {
    setEditingOrder({
      id: order.id,
      client: order.client,
      items: order.items,
      total: order.total,
      payment: order.payment,
      status: order.status,
    });
    setShowEditModal(true);
    setValidationError("");
    setSuccessMessage("");
  };

  // ─── FUNÇÃO PARA SALVAR EDIÇÃO ────────────────────────────
  const handleSaveEdit = () => {
    if (!editingOrder.client.trim()) {
      setValidationError("⚠️ O campo Cliente é obrigatório.");
      return;
    }
    if (editingOrder.total <= 0) {
      setValidationError("⚠️ O campo Total deve ser maior que 0.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const updatedOrder = {
        client: editingOrder.client.trim(),
        items: parseInt(editingOrder.items) || 1,
        total: parseFloat(editingOrder.total),
        payment: editingOrder.payment,
        status: editingOrder.status,
        date: selected?.date || new Date().toISOString(),
      };

      updateOrder(editingOrder.id, updatedOrder);

      // Atualiza o pedido selecionado se estiver aberto
      if (selected && selected.id === editingOrder.id) {
        setSelected({ ...selected, ...updatedOrder });
        setSelectedStatus(editingOrder.status);
      }

      setValidationError("");
      setSuccessMessage("✅ Pedido atualizado com sucesso!");
      setIsSaving(false);

      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage("");
        setEditingOrder({
          id: "",
          client: "",
          items: 1,
          total: 0,
          payment: "",
          status: "",
        });
      }, 1000);
    }, 500);
  };

  // ─── FUNÇÃO PARA CRIAR NOVO PEDIDO ──────────────────────
  const handleCreateOrder = () => {
    if (!newOrder.client.trim()) {
      setValidationError("⚠️ O campo Cliente é obrigatório.");
      return;
    }
    if (newOrder.total <= 0) {
      setValidationError("⚠️ O campo Total deve ser maior que 0.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const maxId = orders.reduce((max, o) => {
        const num = parseInt(o.id.replace("PED-2025-", ""));
        return Math.max(max, num);
      }, 0);

      const orderToAdd = {
        id: `PED-2025-${String(maxId + 1).padStart(3, "0")}`,
        client: newOrder.client.trim(),
        items: newOrder.items || 1,
        total: parseFloat(newOrder.total),
        payment: newOrder.payment,
        status: newOrder.status,
        date: new Date().toISOString(),
      };

      addOrder(orderToAdd);

      setNewOrder({
        client: "",
        items: 1,
        total: 0,
        payment: "Pix",
        status: "Pendente",
      });
      setValidationError("");
      setSuccessMessage("✅ Pedido criado com sucesso!");
      setIsSaving(false);

      setTimeout(() => {
        setShowNewOrderModal(false);
        setSuccessMessage("");
      }, 1000);
    }, 500);
  };

  // ─── FUNÇÃO PARA ALTERAR STATUS ──────────────────────────
  const handleStatusChange = (newStatus) => {
    setSelectedStatus(newStatus);
  };

  // ─── FUNÇÃO PARA SALVAR ALTERAÇÕES DE STATUS ────────────
  const handleSaveChanges = () => {
    if (selected && selectedStatus !== selected.status) {
      setIsSaving(true);
      setTimeout(() => {
        updateOrderStatus(selected.id, selectedStatus);
        setSuccessMessage("✅ Status atualizado com sucesso!");
        setIsSaving(false);

        setSelected({ ...selected, status: selectedStatus });

        setTimeout(() => setSuccessMessage(""), 3000);
      }, 500);
    } else {
      setSuccessMessage("ℹ️ Nenhuma alteração para salvar.");
      setTimeout(() => setSuccessMessage(""), 2000);
    }
  };

  // ─── FUNÇÃO PARA FECHAR MODAL ────────────────────────────
  const handleCloseModal = () => {
    setSelected(null);
    setSelectedStatus("");
    setSuccessMessage("");
  };

  // ─── FUNÇÃO PARA O INPUT DO NOVO PEDIDO ──────────────────
  const handleNewOrderInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ─── FUNÇÃO PARA O INPUT DA EDIÇÃO ──────────────────────
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingOrder((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  return (
    <div>
      <PageHeader
        title="Pedidos"
        subtitle={`${orders.length} pedidos no total`}
        actions={
          <Button icon={Plus} onClick={() => setShowNewOrderModal(true)}>
            Novo Pedido
          </Button>
        }
      />

      {/* Summary Cards */}
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === s
                ? "gradient-brand text-white"
                : "glass-light text-slate-400 hover:text-white border border-white/8"
            }`}
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
              onClick={() => handleOpenDetails(order)}
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
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(order);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Edit2}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEdit(order);
                    }}
                  />
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </Table>
      </div>

      {/* ─── MODAL DE DETALHES DO PEDIDO ──────────────────── */}
      <Modal
        isOpen={!!selected}
        onClose={handleCloseModal}
        title="Detalhes do Pedido"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            {/* Mensagem de sucesso */}
            {successMessage && (
              <div
                className={`p-3 rounded-xl flex items-center gap-2 ${
                  successMessage.includes("✅")
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                    : "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                }`}
              >
                {successMessage.includes("✅") ? (
                  <Check size={16} className="flex-shrink-0" />
                ) : (
                  <span className="text-lg">ℹ️</span>
                )}
                <span className="text-sm">{successMessage}</span>
              </div>
            )}

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

            {/* ALTERAR STATUS */}
            <div>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Alterar Status
              </div>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
                      selectedStatus === s
                        ? "gradient-brand text-white"
                        : "glass-light border border-white/8 text-slate-400 hover:text-white hover:border-[#D4AF37]/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="flex-1"
              >
                Fechar
              </Button>
              {/* ✅ Botão Editar - Substituindo Salvar */}
              <Button
                onClick={() => {
                  const orderToEdit = selected;
                  handleCloseModal();
                  setTimeout(() => handleOpenEdit(orderToEdit), 300);
                }}
                className="flex-1"
                icon={Edit2}
              >
                Editar Pedido
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL DE EDIÇÃO DE PEDIDO ────────────────────── */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingOrder({
            id: "",
            client: "",
            items: 1,
            total: 0,
            payment: "",
            status: "",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Editar Pedido"
        size="md"
      >
        <div className="space-y-4">
          {/* Mensagem de sucesso */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          {/* Mensagem de erro */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Cliente *
            </label>
            <input
              type="text"
              name="client"
              value={editingOrder.client}
              onChange={handleEditInputChange}
              placeholder="Nome do cliente"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Quantidade de Itens
            </label>
            <input
              type="number"
              name="items"
              value={editingOrder.items}
              onChange={handleEditInputChange}
              placeholder="1"
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Total *
            </label>
            <input
              type="number"
              name="total"
              value={editingOrder.total}
              onChange={handleEditInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Forma de Pagamento
            </label>
            <select
              name="payment"
              value={editingOrder.payment}
              onChange={handleEditInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Pix" className="bg-[#0a0a0a]">
                Pix
              </option>
              <option value="Cartão de Crédito" className="bg-[#0a0a0a]">
                Cartão de Crédito
              </option>
              <option value="Boleto" className="bg-[#0a0a0a]">
                Boleto
              </option>
              <option value="Dinheiro" className="bg-[#0a0a0a]">
                Dinheiro
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={editingOrder.status}
              onChange={handleEditInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Pendente" className="bg-[#0a0a0a]">
                Pendente
              </option>
              <option value="Aguardando Pagamento" className="bg-[#0a0a0a]">
                Aguardando Pagamento
              </option>
              <option value="Em Produção" className="bg-[#0a0a0a]">
                Em Produção
              </option>
              <option value="Enviado" className="bg-[#0a0a0a]">
                Enviado
              </option>
              <option value="Entregue" className="bg-[#0a0a0a]">
                Entregue
              </option>
              <option value="Cancelado" className="bg-[#0a0a0a]">
                Cancelado
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingOrder({
                  id: "",
                  client: "",
                  items: 1,
                  total: 0,
                  payment: "",
                  status: "",
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
                "Atualizar Pedido"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE NOVO PEDIDO ──────────────────────────── */}
      <Modal
        isOpen={showNewOrderModal}
        onClose={() => {
          setShowNewOrderModal(false);
          setNewOrder({
            client: "",
            items: 1,
            total: 0,
            payment: "Pix",
            status: "Pendente",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Novo Pedido"
        size="md"
      >
        <div className="space-y-4">
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Cliente *
            </label>
            <input
              type="text"
              name="client"
              value={newOrder.client}
              onChange={handleNewOrderInputChange}
              placeholder="Nome do cliente"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Quantidade de Itens
            </label>
            <input
              type="number"
              name="items"
              value={newOrder.items}
              onChange={handleNewOrderInputChange}
              placeholder="1"
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Total *
            </label>
            <input
              type="number"
              name="total"
              value={newOrder.total}
              onChange={handleNewOrderInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Forma de Pagamento
            </label>
            <select
              name="payment"
              value={newOrder.payment}
              onChange={handleNewOrderInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Pix" className="bg-[#0a0a0a]">
                Pix
              </option>
              <option value="Cartão de Crédito" className="bg-[#0a0a0a]">
                Cartão de Crédito
              </option>
              <option value="Boleto" className="bg-[#0a0a0a]">
                Boleto
              </option>
              <option value="Dinheiro" className="bg-[#0a0a0a]">
                Dinheiro
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Status Inicial
            </label>
            <select
              name="status"
              value={newOrder.status}
              onChange={handleNewOrderInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Pendente" className="bg-[#0a0a0a]">
                Pendente
              </option>
              <option value="Aguardando Pagamento" className="bg-[#0a0a0a]">
                Aguardando Pagamento
              </option>
              <option value="Em Produção" className="bg-[#0a0a0a]">
                Em Produção
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewOrderModal(false);
                setNewOrder({
                  client: "",
                  items: 1,
                  total: 0,
                  payment: "Pix",
                  status: "Pendente",
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
              onClick={handleCreateOrder}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Criar Pedido"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
