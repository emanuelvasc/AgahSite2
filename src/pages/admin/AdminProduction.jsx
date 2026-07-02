import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Plus,
  X,
  Upload,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  ChevronRight,
} from "lucide-react";
import {
  StatusBadge,
  Button,
  Input,
  Select,
  Modal,
  Card,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const STATUS_STEPS = [
  "Solicitação enviada",
  "Em análise",
  "Orçamento enviado",
  "Aguardando aprovação",
  "Aprovado",
  "Em produção",
  "Finalizado",
  "Entregue",
];

function StatusTimeline({ current }) {
  const idx = STATUS_STEPS.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div
            className={`flex items-center justify-center rounded-full flex-shrink-0 transition-all
            ${
              i < idx
                ? "w-5 h-5 bg-emerald-500/20 border border-emerald-500/40"
                : i === idx
                  ? "w-6 h-6 bg-[#D4AF37]/20 border border-[#D4AF37]/50"
                  : "w-4 h-4 bg-white/5 border border-white/10"
            }`}
          >
            {i < idx ? (
              <Check size={10} className="text-emerald-400" />
            ) : i === idx ? (
              <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            ) : null}
          </div>
          {i < STATUS_STEPS.length - 1 && (
            <div
              className={`h-px w-4 transition-all ${i < idx ? "bg-emerald-500/40" : "bg-white/8"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order, onAdvance, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Verifica se o pedido pode ser cancelado
  const canCancel =
    order.status !== "Finalizado" &&
    order.status !== "Entregue" &&
    order.status !== "Cancelado";

  // Verifica se o pedido pode avançar (não está no último estágio)
  const canAdvance =
    order.status !== "Entregue" && order.status !== "Cancelado";

  const handleCancel = () => {
    if (canCancel) {
      setShowCancelConfirm(true);
    }
  };

  const confirmCancel = () => {
    onCancel(order.id);
    setShowCancelConfirm(false);
    setExpanded(false);
  };

  const handleAdvance = () => {
    if (canAdvance) {
      onAdvance(order.id);
    }
  };

  // Pega o próximo status
  const getNextStatus = () => {
    const currentIndex = STATUS_STEPS.indexOf(order.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      return STATUS_STEPS[currentIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden border border-white/6"
    >
      <button
        className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
          <ClipboardList size={18} className="text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-[#D4AF37]">
              {order.protocol}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <div className="text-xs text-slate-500">
            {order.type} • {order.quantity} un. •{" "}
            {new Date(order.date).toLocaleDateString("pt-BR")}
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          {order.budget ? (
            <div className="font-bold text-emerald-400">
              R${" "}
              {order.budget.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-600">Orçamento pendente</div>
          )}
          <div className="mt-1 text-slate-600 flex justify-end">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        style={{ overflow: "hidden" }}
      >
        <div className="px-5 pb-5 pt-1 border-t border-white/6 space-y-4">
          {/* Timeline */}
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
              Progresso
            </div>
            <StatusTimeline current={order.status} />
            <div className="mt-2 text-xs text-[#D4AF37] font-medium">
              Etapa atual: {order.status}
              {nextStatus && (
                <span className="text-slate-500 font-normal ml-2">
                  → Próximo: {nextStatus}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="glass-light rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
              Descrição da Solicitação
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {order.description}
            </p>
          </div>

          {/* Budget */}
          {order.budget && (
            <div className="glass-light rounded-xl p-4 border border-emerald-500/20">
              <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                Orçamento Recebido
              </div>
              <div className="text-2xl font-bold font-display gradient-text mb-3">
                R${" "}
                {order.budget.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          )}

          {/* ✅ Botão Avançar para próxima etapa */}
          {canAdvance && nextStatus && (
            <div className="flex justify-end">
              <Button
                onClick={handleAdvance}
                className="flex items-center gap-2"
                icon={ChevronRight}
              >
                Avançar para {nextStatus}
              </Button>
            </div>
          )}

          {/* Botão Cancelar Encomenda */}
          {canCancel && (
            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleCancel}
              >
                Cancelar Encomenda
              </Button>
            </div>
          )}

          {order.status === "Cancelado" && (
            <div className="text-center text-sm text-red-400 bg-red-500/10 rounded-xl p-3 border border-red-500/20">
              ⚠️ Esta encomenda foi cancelada
            </div>
          )}

          {order.status === "Entregue" && (
            <div className="text-center text-sm text-emerald-400 bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
              ✅ Encomenda entregue com sucesso!
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal de Confirmação de Cancelamento */}
      <Modal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        title="Confirmar Cancelamento"
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
              Você está prestes a cancelar a encomenda <br />
              <span className="text-white font-semibold">
                "{order?.protocol}"
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              onClick={confirmCancel}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Confirmar Cancelamento
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

const PRODUCT_TYPES = [
  "Camisa Manga Curta",
  "Camisa Manga Longa",
  "Regata Esportiva",
  "Uniforme Esportivo",
  "Kit Completo",
  "Shorts",
  "Legging",
  "Jaqueta",
  "Moletom",
  "Outro",
];
const FABRIC_TYPES = [
  "Dry Fit 100% Poliéster",
  "Poliamida UV50+",
  "Suplex 4D Stretch",
  "Fleece",
  "Microfibra",
  "Outro",
];
const CUSTOM_TYPES = [
  "Sublimação Total",
  "Bordado",
  "Silk Screen",
  "Termocolante",
  "Sem personalização",
];

export default function ClientCustomOrders() {
  const { customOrders, setCustomOrders } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    type: "",
    qty: "",
    sizes: "",
    colors: "",
    fabric: "",
    customType: "",
    deadline: "",
    description: "",
    notes: "",
  });

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = () => {
    const protocol = `PROT-${Math.floor(8000 + Math.random() * 1000)}`;
    const newOrder = {
      id: `ENC-2025-${String(customOrders.length + 10).padStart(3, "0")}`,
      protocol,
      clientId: 1,
      client: "Rafael Mendonça",
      type: form.type,
      quantity: parseInt(form.qty) || 0,
      status: "Solicitação enviada",
      date: new Date().toISOString().split("T")[0],
      budget: null,
      description: form.description,
    };
    setCustomOrders((prev) => [...prev, newOrder]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setForm({
        type: "",
        qty: "",
        sizes: "",
        colors: "",
        fabric: "",
        customType: "",
        deadline: "",
        description: "",
        notes: "",
      });
    }, 2500);
  };

  // ✅ Função para avançar a encomenda para a próxima etapa
  const handleAdvance = (id) => {
    setCustomOrders((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          const currentIndex = STATUS_STEPS.indexOf(o.status);
          if (currentIndex < STATUS_STEPS.length - 1) {
            return { ...o, status: STATUS_STEPS[currentIndex + 1] };
          }
        }
        return o;
      }),
    );
  };

  // Função para cancelar encomenda
  const handleCancel = (id) => {
    setCustomOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Cancelado" } : o)),
    );
  };

  // ✅ ENCOMENDAS SIMULADAS COM STATUS VARIADOS
  const simulatedOrders = [
    {
      id: "ENC-2025-001",
      protocol: "PROT-8821",
      clientId: 1,
      client: "Rafael Mendonça",
      type: "Uniforme Esportivo Completo",
      quantity: 15,
      status: "Solicitação enviada",
      date: "2025-07-01",
      budget: null,
      description:
        "Uniforme completo para equipe de corrida, camisa + short, logo da equipe no peito e costas. Tamanhos P ao GG.",
    },
    {
      id: "ENC-2025-002",
      protocol: "PROT-8822",
      clientId: 2,
      client: "Clube Atlético BH",
      type: "Kit Completo",
      quantity: 80,
      status: "Em produção",
      date: "2025-06-28",
      budget: 12800.0,
      description:
        "Kit completo para time de futebol amador. 80 uniformes com números personalizados.",
    },
    {
      id: "ENC-2025-003",
      protocol: "PROT-8823",
      clientId: 3,
      client: "Academia FitPower",
      type: "Camisa Manga Curta",
      quantity: 50,
      status: "Aguardando aprovação",
      date: "2025-06-25",
      budget: 3200.0,
      description:
        "Camisas dry fit com estampa da academia para instrutores. Cores: preta com detalhes laranja.",
    },
    {
      id: "ENC-2025-004",
      protocol: "PROT-8824",
      clientId: 1,
      client: "Rafael Mendonça",
      type: "Shorts Esportivo",
      quantity: 10,
      status: "Em análise",
      date: "2025-07-02",
      budget: null,
      description:
        "Shorts esportivos para treinos de corrida. Tecido leve e respirável.",
    },
    {
      id: "ENC-2025-005",
      protocol: "PROT-8825",
      clientId: 2,
      client: "Clube Atlético BH",
      type: "Jaqueta Corta Vento",
      quantity: 30,
      status: "Orçamento enviado",
      date: "2025-06-20",
      budget: 4500.0,
      description: "Jaquetas corta vento para equipe, com logo bordado.",
    },
    {
      id: "ENC-2025-006",
      protocol: "PROT-8826",
      clientId: 3,
      client: "Academia FitPower",
      type: "Legging Esportiva",
      quantity: 25,
      status: "Finalizado",
      date: "2025-06-15",
      budget: 1875.0,
      description:
        "Leggings femininas com compressão para treinos de alta intensidade.",
    },
    {
      id: "ENC-2025-007",
      protocol: "PROT-8827",
      clientId: 1,
      client: "Rafael Mendonça",
      type: "Camisa Manga Longa",
      quantity: 5,
      status: "Em análise",
      date: "2025-07-03",
      budget: null,
      description: "Camisas manga longa para corridas noturnas com refletivos.",
    },
  ];

  // Usa as encomendas simuladas se não houver dados reais
  const ordersToShow = customOrders.length > 0 ? customOrders : simulatedOrders;

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Minhas Encomendas
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Uniformes e roupas personalizadas
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Nova Encomenda
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: ordersToShow.length, color: "text-white" },
          {
            label: "Em Análise",
            value: ordersToShow.filter(
              (o) =>
                o.status === "Em análise" || o.status === "Solicitação enviada",
            ).length,
            color: "text-amber-400",
          },
          {
            label: "Em Produção",
            value: ordersToShow.filter((o) => o.status === "Em produção")
              .length,
            color: "text-blue-400",
          },
          {
            label: "Aguard. Aprovação",
            value: ordersToShow.filter(
              (o) => o.status === "Aguardando aprovação",
            ).length,
            color: "text-violet-400",
          },
        ].map((s) => (
          <Card key={s.label} className="py-4 text-center">
            <div className={`text-2xl font-bold font-display mb-1 ${s.color}`}>
              {s.value}
            </div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        {ordersToShow.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <OrderCard
              order={order}
              onAdvance={handleAdvance}
              onCancel={handleCancel}
            />
          </motion.div>
        ))}
      </div>

      {ordersToShow.length === 0 && !showForm && (
        <div className="text-center py-16">
          <ClipboardList size={40} className="text-slate-700 mx-auto mb-4" />
          <div className="text-white font-semibold mb-2">
            Nenhuma encomenda ainda
          </div>
          <div className="text-sm text-slate-500 mb-6">
            Solicite uniformes e roupas personalizadas
          </div>
          <Button icon={Plus} onClick={() => setShowForm(true)}>
            Criar Primeira Encomenda
          </Button>
        </div>
      )}

      {/* New Order Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Nova Encomenda Personalizada"
        size="xl"
      >
        {submitted ? (
          <div className="flex flex-col items-center py-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-4"
            >
              <Check size={28} className="text-emerald-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-white mb-2">
              Encomenda Enviada!
            </h3>
            <p className="text-slate-400 text-sm">
              Nossa equipe analisará sua solicitação em até 24h.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Tipo de Produto"
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
                options={[
                  { value: "", label: "Selecione..." },
                  ...PRODUCT_TYPES.map((t) => ({ value: t, label: t })),
                ]}
              />
              <Input
                label="Quantidade"
                type="number"
                value={form.qty}
                onChange={(e) => update("qty", e.target.value)}
                placeholder="Ex: 50"
                required
              />
              <Input
                label="Tamanhos Necessários"
                value={form.sizes}
                onChange={(e) => update("sizes", e.target.value)}
                placeholder="Ex: P(10), M(20), G(15), GG(5)"
              />
              <Input
                label="Cores Desejadas"
                value={form.colors}
                onChange={(e) => update("colors", e.target.value)}
                placeholder="Ex: Preto com detalhes laranja"
              />
              <Select
                label="Tipo de Tecido"
                value={form.fabric}
                onChange={(e) => update("fabric", e.target.value)}
                options={[
                  { value: "", label: "Selecione..." },
                  ...FABRIC_TYPES.map((t) => ({ value: t, label: t })),
                ]}
              />
              <Select
                label="Personalização"
                value={form.customType}
                onChange={(e) => update("customType", e.target.value)}
                options={[
                  { value: "", label: "Selecione..." },
                  ...CUSTOM_TYPES.map((t) => ({ value: t, label: t })),
                ]}
              />
              <Input
                label="Prazo Desejado"
                type="date"
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                className="col-span-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Descrição Detalhada <span className="text-[#D4AF37]">*</span>
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Descreva detalhadamente o que você precisa: modelo, medidas, logo, posicionamento de estampas, referências..."
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Observações Adicionais
              </label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Outras informações relevantes..."
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600"
              />
            </div>

            {/* Upload area */}
            <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-[#D4AF37]/30 transition-colors cursor-pointer">
              <Upload size={24} className="text-slate-600 mx-auto mb-2" />
              <div className="text-sm text-slate-400 mb-1">
                Arraste imagens de referência
              </div>
              <div className="text-xs text-slate-600">
                PNG, JPG, PDF até 10MB cada
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!form.type || !form.qty || !form.description}
                className="flex-1"
              >
                Enviar Solicitação
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
