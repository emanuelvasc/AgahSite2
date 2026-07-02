import { useState } from "react";
import { motion } from "framer-motion";
import {
  Truck,
  Plus,
  Mail,
  Phone,
  MapPin,
  Building2,
  X,
  Check,
  Eye,
  Edit2,
  Package,
} from "lucide-react";
import {
  PageHeader,
  Button,
  SearchInput,
  StatusBadge,
  Modal,
  Input,
  Card,
  Avatar,
  Table,
  TableCell,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function AdminSuppliers() {
  const { suppliers, addSupplier, updateSupplier, orders } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Estado para novo fornecedor
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    category: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    status: "Ativo",
  });

  // Estado para edição de fornecedor
  const [editingSupplier, setEditingSupplier] = useState({
    id: null,
    name: "",
    category: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    status: "Ativo",
  });

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ Função para lidar com mudanças no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ✅ Função para lidar com mudanças no formulário de edição
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingSupplier((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ✅ Função para salvar fornecedor
  const handleSaveSupplier = () => {
    if (!newSupplier.name.trim()) {
      setValidationError("⚠️ O campo Razão Social é obrigatório.");
      return;
    }
    if (!newSupplier.category.trim()) {
      setValidationError("⚠️ O campo Categoria é obrigatório.");
      return;
    }
    if (!newSupplier.email.trim()) {
      setValidationError("⚠️ O campo E-mail é obrigatório.");
      return;
    }

    setIsSaving(true);

    const maxId = suppliers.reduce((max, s) => Math.max(max, s.id), 0);
    const supplierToAdd = {
      id: maxId + 1,
      name: newSupplier.name.trim(),
      category: newSupplier.category.trim(),
      contact: newSupplier.contact || "Não informado",
      email: newSupplier.email.trim(),
      phone: newSupplier.phone || "(00) 00000-0000",
      city: newSupplier.city || "Não informado",
      state: newSupplier.state || "UF",
      status: "Ativo",
    };

    addSupplier(supplierToAdd);

    setNewSupplier({
      name: "",
      category: "",
      contact: "",
      email: "",
      phone: "",
      city: "",
      state: "",
      status: "Ativo",
    });
    setValidationError("");
    setSuccessMessage("✅ Fornecedor adicionado com sucesso!");
    setIsSaving(false);

    setTimeout(() => {
      setShowModal(false);
      setSuccessMessage("");
    }, 1000);
  };

  // ✅ Função para abrir edição
  const handleEditSupplier = (supplier) => {
    setEditingSupplier({
      id: supplier.id,
      name: supplier.name,
      category: supplier.category,
      contact: supplier.contact || "",
      email: supplier.email,
      phone: supplier.phone || "",
      city: supplier.city || "",
      state: supplier.state || "",
      status: supplier.status || "Ativo",
    });
    setShowEditModal(true);
    setValidationError("");
    setSuccessMessage("");
  };

  // ✅ Função para salvar edição
  const handleSaveEdit = () => {
    if (!editingSupplier.name.trim()) {
      setValidationError("⚠️ O campo Razão Social é obrigatório.");
      return;
    }
    if (!editingSupplier.category.trim()) {
      setValidationError("⚠️ O campo Categoria é obrigatório.");
      return;
    }
    if (!editingSupplier.email.trim()) {
      setValidationError("⚠️ O campo E-mail é obrigatório.");
      return;
    }

    setIsSaving(true);

    const updatedSupplier = {
      name: editingSupplier.name.trim(),
      category: editingSupplier.category.trim(),
      contact: editingSupplier.contact || "Não informado",
      email: editingSupplier.email.trim(),
      phone: editingSupplier.phone || "(00) 00000-0000",
      city: editingSupplier.city || "Não informado",
      state: editingSupplier.state || "UF",
      status: editingSupplier.status,
    };

    updateSupplier(editingSupplier.id, updatedSupplier);

    if (selected && selected.id === editingSupplier.id) {
      setSelected({ ...selected, ...updatedSupplier });
    }

    setValidationError("");
    setSuccessMessage("✅ Fornecedor atualizado com sucesso!");
    setIsSaving(false);

    setTimeout(() => {
      setShowEditModal(false);
      setSuccessMessage("");
      setEditingSupplier({
        id: null,
        name: "",
        category: "",
        contact: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        status: "Ativo",
      });
    }, 1000);
  };

  // ✅ Função para ver pedidos do fornecedor
  const handleViewOrders = (supplier) => {
    setSelected(supplier);
    setShowOrdersModal(true);
  };

  // ✅ Filtra pedidos do fornecedor (simulado)
  const getSupplierOrders = (supplierName) => {
    // Simula pedidos relacionados ao fornecedor
    const mockOrders = [
      {
        id: "PED-2025-001",
        items: 3,
        total: 289.7,
        status: "Entregue",
        date: "09/01/2025",
      },
      {
        id: "PED-2025-003",
        items: 8,
        total: 890.2,
        status: "Em Produção",
        date: "13/01/2025",
      },
      {
        id: "PED-2025-005",
        items: 2,
        total: 145.0,
        status: "Enviado",
        date: "15/01/2025",
      },
    ];
    return mockOrders;
  };

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        subtitle={`${suppliers.length} fornecedores cadastrados`}
        actions={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            Novo Fornecedor
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar fornecedor..."
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((supplier, i) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-6 card-hover cursor-pointer"
            onClick={() => setSelected(supplier)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white font-display">
                    {supplier.name}
                  </h3>
                  <StatusBadge status={supplier.status} />
                </div>
                <div className="text-xs text-[#D4AF37] mt-0.5">
                  {supplier.category}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail size={12} className="text-slate-600 flex-shrink-0" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone size={12} className="text-slate-600 flex-shrink-0" />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                <MapPin size={12} className="text-slate-600 flex-shrink-0" />
                {supplier.city}, {supplier.state}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                <span className="text-slate-600">Contato:</span>
                {supplier.contact}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/6 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                icon={Eye}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewOrders(supplier);
                }}
              >
                Ver Pedidos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={Edit2}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSupplier(supplier);
                }}
              >
                Editar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── MODAL DE NOVO FORNECEDOR ─────────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewSupplier({
            name: "",
            category: "",
            contact: "",
            email: "",
            phone: "",
            city: "",
            state: "",
            status: "Ativo",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Novo Fornecedor"
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
              Razão Social *
            </label>
            <input
              type="text"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              placeholder="Nome da empresa"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Categoria *
            </label>
            <input
              type="text"
              name="category"
              value={newSupplier.category}
              onChange={handleInputChange}
              placeholder="Tecidos, Aviamentos..."
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Nome do Contato
            </label>
            <input
              type="text"
              name="contact"
              value={newSupplier.contact}
              onChange={handleInputChange}
              placeholder="Nome do responsável"
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
              value={newSupplier.email}
              onChange={handleInputChange}
              placeholder="contato@empresa.com"
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
              value={newSupplier.phone}
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
                value={newSupplier.city}
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
                value={newSupplier.state}
                onChange={handleInputChange}
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
              value={newSupplier.status}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Ativo" className="bg-[#0a0a0a]">
                Ativo
              </option>
              <option value="Inativo" className="bg-[#0a0a0a]">
                Inativo
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setNewSupplier({
                  name: "",
                  category: "",
                  contact: "",
                  email: "",
                  phone: "",
                  city: "",
                  state: "",
                  status: "Ativo",
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
              onClick={handleSaveSupplier}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Fornecedor"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE EDIÇÃO ───────────────────────────────── */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSupplier({
            id: null,
            name: "",
            category: "",
            contact: "",
            email: "",
            phone: "",
            city: "",
            state: "",
            status: "Ativo",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Editar Fornecedor"
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
              Razão Social *
            </label>
            <input
              type="text"
              name="name"
              value={editingSupplier.name}
              onChange={handleEditInputChange}
              placeholder="Nome da empresa"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Categoria *
            </label>
            <input
              type="text"
              name="category"
              value={editingSupplier.category}
              onChange={handleEditInputChange}
              placeholder="Tecidos, Aviamentos..."
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Nome do Contato
            </label>
            <input
              type="text"
              name="contact"
              value={editingSupplier.contact}
              onChange={handleEditInputChange}
              placeholder="Nome do responsável"
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
              value={editingSupplier.email}
              onChange={handleEditInputChange}
              placeholder="contato@empresa.com"
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
              value={editingSupplier.phone}
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
                value={editingSupplier.city}
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
                value={editingSupplier.state}
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
              value={editingSupplier.status}
              onChange={handleEditInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="Ativo" className="bg-[#0a0a0a]">
                Ativo
              </option>
              <option value="Inativo" className="bg-[#0a0a0a]">
                Inativo
              </option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingSupplier({
                  id: null,
                  name: "",
                  category: "",
                  contact: "",
                  email: "",
                  phone: "",
                  city: "",
                  state: "",
                  status: "Ativo",
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
                "Atualizar Fornecedor"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE PEDIDOS DO FORNECEDOR ───────────────── */}
      <Modal
        isOpen={showOrdersModal}
        onClose={() => {
          setShowOrdersModal(false);
          setSelected(null);
        }}
        title={`Pedidos - ${selected?.name || "Fornecedor"}`}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="glass-light rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-semibold">
                    {selected.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {selected.category} • {selected.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <Table headers={["Pedido", "Itens", "Total", "Status", "Data"]}>
                {getSupplierOrders(selected.name).map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/3 transition-colors"
                  >
                    <TableCell>
                      <span className="font-mono text-xs text-[#D4AF37] font-semibold">
                        {order.id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-white">{order.items} un.</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-white">
                        R$ {order.total.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                      {order.date}
                    </TableCell>
                  </motion.tr>
                ))}
              </Table>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowOrdersModal(false)}
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
