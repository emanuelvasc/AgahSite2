import { useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Plus,
  Eye,
  DollarSign,
  Send,
  CheckCircle,
  X,
  Check,
  FileText,
  MessageCircle,
  User,
  Settings,
  Layers,
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

// ✅ LINHAS DE PRODUÇÃO
const PRODUCTION_LINES = [
  { id: "corte", name: "Corte", color: "#6366f1" },
  { id: "costura", name: "Costura", color: "#8b5cf6" },
  { id: "estamparia", name: "Estamparia", color: "#D4AF37" },
  { id: "acabamento", name: "Acabamento", color: "#10b981" },
  { id: "expedicao", name: "Expedição", color: "#84cc16" },
];

// ✅ DADOS SIMULADOS DE ENCOMENDAS
const MOCK_CUSTOM_ORDERS = [
  {
    id: 1,
    protocol: "PROT-8821",
    client: "Clube Atlético BH",
    type: "Uniforme Esportivo Completo",
    quantity: 38,
    description:
      "Uniforme para equipe de corrida, camisa + short, logo da equipe no peito e costas.",
    budget: 2850.0,
    status: "Em produção",
    date: "2025-01-02T00:00:00.000Z",
    productionLine: "costura",
  },
  {
    id: 2,
    protocol: "PROT-8822",
    client: "Equipe Vortex Running",
    type: "Kit Completo",
    quantity: 80,
    description:
      "Kit completo para equipe de corrida, incluindo camisa, short e meias.",
    budget: 4200.0,
    status: "Em produção",
    date: "2025-01-04T00:00:00.000Z",
    productionLine: "corte",
  },
  {
    id: 3,
    protocol: "PROT-8823",
    client: "Academia FitPower",
    type: "Camisas Personalizadas",
    quantity: 50,
    description: "Camisas dry fit com estampa da academia para instrutores.",
    budget: 3200.0,
    status: "Aguardando aprovação",
    date: "2025-01-10T00:00:00.000Z",
    productionLine: "costura",
  },
  {
    id: 4,
    protocol: "PROT-8824",
    client: "Rafael Mendonça",
    type: "Shorts Esportivos",
    quantity: 10,
    description:
      "Shorts esportivos para treinos de corrida. Tecido leve e respirável.",
    budget: null,
    status: "Em análise",
    date: "2025-01-12T00:00:00.000Z",
    productionLine: "",
  },
  {
    id: 5,
    protocol: "PROT-8825",
    client: "Run Brasil Eventos",
    type: "Jaqueta Corta Vento",
    quantity: 30,
    description: "Jaquetas corta vento para equipe, com logo bordado.",
    budget: 4500.0,
    status: "Orçamento enviado",
    date: "2025-01-15T00:00:00.000Z",
    productionLine: "",
  },
  {
    id: 6,
    protocol: "PROT-8826",
    client: "Academia FitPower",
    type: "Legging Esportiva",
    quantity: 25,
    description:
      "Leggings femininas com compressão para treinos de alta intensidade.",
    budget: 1875.0,
    status: "Finalizado",
    date: "2025-01-18T00:00:00.000Z",
    productionLine: "expedicao",
  },
  {
    id: 7,
    protocol: "PROT-8827",
    client: "Rafael Mendonça",
    type: "Camisa Manga Longa",
    quantity: 5,
    description: "Camisas manga longa para corridas noturnas com refletivos.",
    budget: null,
    status: "Em análise",
    date: "2025-01-20T00:00:00.000Z",
    productionLine: "",
  },
  {
    id: 8,
    protocol: "PROT-8828",
    client: "Equipe Vortex Running",
    type: "Boné Performance Sport",
    quantity: 30,
    description: "Boné de corrida com proteção UV e logo bordado.",
    budget: 1200.0,
    status: "Aprovado",
    date: "2025-01-22T00:00:00.000Z",
    productionLine: "",
  },
  {
    id: 9,
    protocol: "PROT-8829",
    client: "Clube Atlético BH",
    type: "Moletom Fleece Premium",
    quantity: 6,
    description: "Moletom com capuz e bolso canguru, bordado com logo.",
    budget: 890.0,
    status: "Em produção",
    date: "2025-01-24T00:00:00.000Z",
    productionLine: "acabamento",
  },
  {
    id: 10,
    protocol: "PROT-8830",
    client: "Carlos Eduardo",
    type: "Camisa Manga Curta",
    quantity: 15,
    description:
      "Camisas para equipe de futebol society, com numeração personalizada.",
    budget: 1100.0,
    status: "Cancelado",
    date: "2025-01-26T00:00:00.000Z",
    productionLine: "",
  },
];

export default function AdminCustomOrders() {
  const { customOrders, addCustomOrder, updateCustomOrder, addOrder, orders } =
    useApp();
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // ✅ Estados para linha de produção
  const [showProductionLineModal, setShowProductionLineModal] = useState(false);
  const [selectedLine, setSelectedLine] = useState("");

  // ✅ Função para garantir que os dados simulados sempre existam
  const getDisplayCustomOrders = () => {
    if (!customOrders || customOrders.length === 0) {
      return MOCK_CUSTOM_ORDERS;
    }

    if (customOrders.length < 10) {
      const existingIds = new Set(customOrders.map((o) => o.id));
      const merged = [
        ...customOrders,
        ...MOCK_CUSTOM_ORDERS.filter((mock) => !existingIds.has(mock.id)),
      ];
      return merged;
    }

    return customOrders;
  };

  const displayCustomOrders = getDisplayCustomOrders();

  // Estado para nova encomenda
  const [newOrder, setNewOrder] = useState({
    client: "",
    type: "",
    quantity: 1,
    description: "",
    budget: "",
    status: "Em análise",
    productionLine: "",
  });

  // Estados para modais de ações
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetValue, setBudgetValue] = useState("");

  const filtered = displayCustomOrders.filter((o) => {
    const matchStatus = statusFilter === "Todos" || o.status === statusFilter;
    const matchSearch =
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.protocol.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  // ─── FUNÇÃO PARA CRIAR NOVA ENCOMENDA ──────────────────
  const handleCreateOrder = () => {
    if (!newOrder.client.trim()) {
      setValidationError("⚠️ O campo Cliente é obrigatório.");
      return;
    }
    if (!newOrder.type.trim()) {
      setValidationError("⚠️ O campo Tipo é obrigatório.");
      return;
    }
    if (!newOrder.description.trim()) {
      setValidationError("⚠️ O campo Descrição é obrigatório.");
      return;
    }

    setIsSaving(true);

    const maxId = displayCustomOrders.reduce((max, o) => {
      const num = parseInt(o.protocol.replace("PROT-", ""));
      return Math.max(max, num);
    }, 0);

    const orderToAdd = {
      id: displayCustomOrders.length + 1,
      protocol: `PROT-${String(maxId + 1).padStart(4, "0")}`,
      client: newOrder.client.trim(),
      type: newOrder.type.trim(),
      quantity: parseInt(newOrder.quantity) || 1,
      description: newOrder.description.trim(),
      budget: newOrder.budget ? parseFloat(newOrder.budget) : null,
      status: newOrder.status,
      date: new Date().toISOString(),
      productionLine: newOrder.productionLine || "",
    };

    addCustomOrder(orderToAdd);

    setNewOrder({
      client: "",
      type: "",
      quantity: 1,
      description: "",
      budget: "",
      status: "Em análise",
      productionLine: "",
    });
    setValidationError("");
    setSuccessMessage("✅ Encomenda criada com sucesso!");
    setIsSaving(false);

    setTimeout(() => {
      setShowNewOrderModal(false);
      setSuccessMessage("");
    }, 1000);
  };

  // ─── FUNÇÃO PARA APROVAR ENCOMENDA ──────────────────────
  const handleApproveOrder = () => {
    setIsSaving(true);

    const updatedOrder = {
      ...selected,
      status: "Aprovado",
    };

    updateCustomOrder(selected.id, updatedOrder);
    setSelected(updatedOrder);
    setShowApproveModal(false);
    setSuccessMessage("✅ Encomenda aprovada com sucesso!");
    setIsSaving(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ─── FUNÇÃO PARA SALVAR ORÇAMENTO ──────────────────────
  const handleSaveBudget = () => {
    if (!budgetValue || parseFloat(budgetValue) <= 0) {
      setValidationError("⚠️ Por favor, insira um valor válido.");
      return;
    }

    setIsSaving(true);

    const updatedOrder = {
      ...selected,
      budget: parseFloat(budgetValue),
    };

    updateCustomOrder(selected.id, updatedOrder);
    setSelected(updatedOrder);
    setBudgetValue("");
    setShowBudgetModal(false);
    setSuccessMessage("✅ Orçamento salvo com sucesso!");
    setIsSaving(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ─── FUNÇÃO PARA ESCOLHER LINHA DE PRODUÇÃO ──────────────
  const handleChooseProductionLine = () => {
    if (!selectedLine) {
      setValidationError("⚠️ Selecione uma linha de produção.");
      return;
    }

    setIsSaving(true);

    const lineName =
      PRODUCTION_LINES.find((l) => l.id === selectedLine)?.name || selectedLine;

    const updatedOrder = {
      ...selected,
      productionLine: selectedLine,
      status: "Em produção",
    };

    updateCustomOrder(selected.id, updatedOrder);
    setSelected(updatedOrder);
    setShowProductionLineModal(false);
    setSelectedLine("");
    setSuccessMessage(`✅ Encomenda enviada para a linha: ${lineName}!`);
    setIsSaving(false);

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // ─── FUNÇÃO PARA ENCAMINHAR PARA PRODUÇÃO ──────────────
  const handleSendToProduction = () => {
    if (!selected) {
      setValidationError("⚠️ Nenhuma encomenda selecionada.");
      return;
    }

    if (!selected.budget) {
      setShowBudgetModal(true);
      return;
    }

    setShowProductionLineModal(true);
  };

  // ─── FUNÇÃO PARA ENVIAR MENSAGEM (CHAT) ──────────────
  const handleSendChatMessage = () => {
    if (!chatMessage.trim()) {
      setValidationError("⚠️ Digite uma mensagem para enviar ao cliente.");
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setSuccessMessage(
        `✅ Mensagem enviada para ${selected.client}: "${chatMessage}"`,
      );
      setChatMessage("");
      setShowChatModal(false);
      setIsSaving(false);

      setTimeout(() => setSuccessMessage(""), 4000);
    }, 500);
  };

  // ─── FUNÇÃO PARA O INPUT DA NOVA ENCOMENDA ──────────────
  const handleNewOrderInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ─── FUNÇÃO PARA ABRIR MODAL DE ORÇAMENTO ──────────────
  const handleOpenBudgetModal = () => {
    setBudgetValue(selected?.budget ? selected.budget.toString() : "");
    setShowBudgetModal(true);
  };

  // ─── FUNÇÃO PARA ABRIR MODAL DE LINHA DE PRODUÇÃO ──────
  const handleOpenProductionLineModal = () => {
    setSelectedLine(selected?.productionLine || "");
    setShowProductionLineModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Encomendas"
        subtitle={`${displayCustomOrders.length} encomendas cadastradas`}
        actions={
          <Button icon={Plus} onClick={() => setShowNewOrderModal(true)}>
            Nova Encomenda
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: displayCustomOrders.length,
            color: "text-white",
          },
          {
            label: "Em Análise",
            value: displayCustomOrders.filter((o) => o.status === "Em análise")
              .length,
            color: "text-amber-400",
          },
          {
            label: "Em Produção",
            value: displayCustomOrders.filter((o) => o.status === "Em produção")
              .length,
            color: "text-blue-400",
          },
          {
            label: "Aguard. Aprovação",
            value: displayCustomOrders.filter(
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

      {/* Status filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ALL_STATUS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              statusFilter === s
                ? "gradient-brand text-white"
                : "glass-light text-slate-400 border border-white/8"
            }`}
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
            "Linha",
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
              <TableCell>
                {enc.productionLine ? (
                  <span className="text-xs px-2 py-1 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                    {PRODUCTION_LINES.find((l) => l.id === enc.productionLine)
                      ?.name || enc.productionLine}
                  </span>
                ) : (
                  <span className="text-xs text-slate-600">-</span>
                )}
              </TableCell>
              <TableCell className="text-slate-500 text-xs">
                {new Date(enc.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Eye}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(enc);
                  }}
                />
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

      {/* ─── MODAL DE DETALHES DA ENCOMENDA ────────────────── */}
      <Modal
        isOpen={!!selected}
        onClose={() => {
          setSelected(null);
          setSuccessMessage("");
          setValidationError("");
        }}
        title="Detalhes da Encomenda"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                <Check size={16} className="text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-emerald-400">
                  {successMessage}
                </span>
              </div>
            )}

            {validationError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                <X size={16} className="text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{validationError}</span>
              </div>
            )}

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
                {
                  label: "Linha de Produção",
                  value: selected.productionLine
                    ? PRODUCTION_LINES.find(
                        (l) => l.id === selected.productionLine,
                      )?.name || selected.productionLine
                    : "Não definida",
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

            <div className="glass-light rounded-xl p-4 border border-[#D4AF37]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={14} className="text-[#D4AF37]" />
                  <span className="text-xs text-[#D4AF37] uppercase tracking-wider font-semibold">
                    Orçamento
                  </span>
                </div>
                <button
                  onClick={handleOpenBudgetModal}
                  className="text-xs text-[#D4AF37] hover:text-[#e8c970] transition-colors flex items-center gap-1"
                >
                  <FileText size={12} />
                  {selected.budget ? "Editar" : "Adicionar"}
                </button>
              </div>
              <div className="text-2xl font-bold font-display text-[#D4AF37] mt-1">
                {selected.budget ? (
                  `R$ ${selected.budget.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}`
                ) : (
                  <span className="text-sm text-slate-500 font-normal">
                    Nenhum orçamento definido
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
                Ações Rápidas
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="secondary"
                  icon={MessageCircle}
                  size="sm"
                  onClick={() => setShowChatModal(true)}
                >
                  Enviar Mensagem
                </Button>

                {selected.status !== "Aprovado" &&
                  selected.status !== "Em produção" &&
                  selected.status !== "Finalizado" && (
                    <Button
                      variant="secondary"
                      icon={CheckCircle}
                      size="sm"
                      onClick={() => setShowApproveModal(true)}
                    >
                      Aprovar
                    </Button>
                  )}

                {selected.status !== "Em produção" &&
                  selected.status !== "Finalizado" && (
                    <Button
                      variant="secondary"
                      icon={Layers}
                      size="sm"
                      onClick={handleOpenProductionLineModal}
                    >
                      Linha de Produção
                    </Button>
                  )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelected(null);
                  setSuccessMessage("");
                  setValidationError("");
                }}
                className="flex-1"
              >
                Fechar
              </Button>
              {selected.status !== "Em produção" &&
                selected.status !== "Finalizado" && (
                  <Button
                    className="flex-1"
                    icon={FileText}
                    onClick={handleSendToProduction}
                  >
                    Encaminhar para Produção
                  </Button>
                )}
              {selected.status === "Em produção" && (
                <Button className="flex-1" disabled>
                  Em produção
                </Button>
              )}
              {selected.status === "Finalizado" && (
                <Button className="flex-1" disabled>
                  Finalizado
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL DE ORÇAMENTO ───────────────────────────── */}
      <Modal
        isOpen={showBudgetModal}
        onClose={() => {
          setShowBudgetModal(false);
          setBudgetValue("");
          setValidationError("");
        }}
        title={selected?.budget ? "Editar Orçamento" : "Adicionar Orçamento"}
        size="sm"
      >
        <div className="space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Valor do Orçamento
            </label>
            <input
              type="number"
              value={budgetValue}
              onChange={(e) => setBudgetValue(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Defina o valor do orçamento para esta encomenda.
            </p>
          </div>

          {selected && (
            <div className="glass-light rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={12} className="text-[#D4AF37]" />
                <span>Protocolo: {selected.protocol}</span>
                <span className="text-slate-600">•</span>
                <span>{selected.client}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowBudgetModal(false);
                setBudgetValue("");
                setValidationError("");
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveBudget}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Orçamento"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE LINHA DE PRODUÇÃO ───────────────────── */}
      <Modal
        isOpen={showProductionLineModal}
        onClose={() => {
          setShowProductionLineModal(false);
          setSelectedLine("");
          setValidationError("");
        }}
        title="Escolher Linha de Produção"
        size="sm"
      >
        <div className="space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Selecione a Linha de Produção
            </label>
            <div className="space-y-2">
              {PRODUCTION_LINES.map((line) => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all border-2 flex items-center gap-3 ${
                    selectedLine === line.id
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-white/10 hover:border-white/20 glass-light"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: line.color }}
                  />
                  <span className="text-sm text-white font-medium">
                    {line.name}
                  </span>
                  {selectedLine === line.id && (
                    <Check size={16} className="ml-auto text-[#D4AF37]" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              A linha selecionada será exibida na página de produção.
            </p>
          </div>

          {selected && (
            <div className="glass-light rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={12} className="text-[#D4AF37]" />
                <span>Protocolo: {selected.protocol}</span>
                <span className="text-slate-600">•</span>
                <span>{selected.client}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowProductionLineModal(false);
                setSelectedLine("");
                setValidationError("");
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChooseProductionLine}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Confirmar Linha"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE APROVAÇÃO ───────────────────────────── */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Aprovar Encomenda"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Confirmar Aprovação
            </h3>
            <p className="text-sm text-slate-400">
              Você está prestes a aprovar a encomenda <br />
              <span className="text-white font-semibold">
                "{selected?.protocol}"
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              O cliente será notificado sobre a aprovação.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowApproveModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button onClick={handleApproveOrder} className="flex-1">
              Confirmar Aprovação
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE CHAT (ENVIAR MENSAGEM) ────────────── */}
      <Modal
        isOpen={showChatModal}
        onClose={() => {
          setShowChatModal(false);
          setChatMessage("");
          setValidationError("");
        }}
        title={`Enviar Mensagem para ${selected?.client || "Cliente"}`}
        size="md"
      >
        <div className="space-y-4">
          {validationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Mensagem para o cliente
            </label>
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={`Digite sua mensagem para ${selected?.client}...`}
              rows="5"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none resize-none"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              A mensagem será enviada diretamente ao cliente.
            </p>
          </div>

          {selected && (
            <div className="glass-light rounded-xl p-3 border border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={12} className="text-[#D4AF37]" />
                <span>Protocolo: {selected.protocol}</span>
                <span className="text-slate-600">•</span>
                <span>{selected.type}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowChatModal(false);
                setChatMessage("");
                setValidationError("");
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendChatMessage}
              className="flex-1"
              icon={Send}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Mensagem"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE NOVA ENCOMENDA ───────────────────────── */}
      <Modal
        isOpen={showNewOrderModal}
        onClose={() => {
          setShowNewOrderModal(false);
          setNewOrder({
            client: "",
            type: "",
            quantity: 1,
            description: "",
            budget: "",
            status: "Em análise",
            productionLine: "",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Nova Encomenda"
        size="lg"
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
              Tipo do Produto *
            </label>
            <input
              type="text"
              name="type"
              value={newOrder.type}
              onChange={handleNewOrderInputChange}
              placeholder="Ex: Uniforme Esportivo, Camisa Personalizada"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Quantidade
            </label>
            <input
              type="number"
              name="quantity"
              value={newOrder.quantity}
              onChange={handleNewOrderInputChange}
              placeholder="1"
              min="1"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Descrição *
            </label>
            <textarea
              name="description"
              value={newOrder.description}
              onChange={handleNewOrderInputChange}
              placeholder="Descreva os detalhes do produto personalizado..."
              rows="4"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Orçamento Sugerido (opcional)
            </label>
            <input
              type="number"
              name="budget"
              value={newOrder.budget}
              onChange={handleNewOrderInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
            />
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
              <option value="Em análise" className="bg-[#0a0a0a]">
                Em análise
              </option>
              <option value="Orçamento enviado" className="bg-[#0a0a0a]">
                Orçamento enviado
              </option>
              <option value="Aguardando aprovação" className="bg-[#0a0a0a]">
                Aguardando aprovação
              </option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
              Linha de Produção (opcional)
            </label>
            <select
              name="productionLine"
              value={newOrder.productionLine}
              onChange={handleNewOrderInputChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
            >
              <option value="" className="bg-[#0a0a0a]">
                Não definida
              </option>
              {PRODUCTION_LINES.map((line) => (
                <option key={line.id} value={line.id} className="bg-[#0a0a0a]">
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowNewOrderModal(false);
                setNewOrder({
                  client: "",
                  type: "",
                  quantity: 1,
                  description: "",
                  budget: "",
                  status: "Em análise",
                  productionLine: "",
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
                "Criar Encomenda"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
