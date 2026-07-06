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
import { useAuth } from "../../context/AuthContext";

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

function OrderCard({ order, onApprove, onReject, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const canCancel =
    order.status !== "Finalizado" &&
    order.status !== "Entregue" &&
    order.status !== "Cancelado";

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
            {order.date
              ? new Date(order.date).toLocaleDateString("pt-BR")
              : "Hoje"}
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
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-3">
              Progresso
            </div>
            <StatusTimeline current={order.status} />
            <div className="mt-2 text-xs text-[#D4AF37] font-medium">
              Etapa atual: {order.status}
            </div>
          </div>

          <div className="glass-light rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
              Descrição da Solicitação
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {order.description}
            </p>
          </div>

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
              {order.status === "Aguardando aprovação" && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => onApprove(order.id)}
                    className="flex-1 text-sm"
                  >
                    ✓ Aprovar Orçamento
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onReject(order.id)}
                    className="flex-1 text-sm"
                  >
                    ✕ Recusar
                  </Button>
                </div>
              )}
            </div>
          )}

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
        </div>
      </motion.div>

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
  const { customOrders, addCustomOrder } = useApp();
  const { user } = useAuth();
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

  const handleSubmit = async () => {
    if (!form.type || !form.qty || !form.description) {
      alert("Preencha os campos obrigatórios: Tipo, Quantidade e Descrição.");
      return;
    }

    const protocol = `PROT-${Math.floor(8000 + Math.random() * 1000)}`;
    const newOrder = {
      id: Date.now(),
      protocol,
      client: user?.name || "Cliente",
      clientId: user?.id || 1,
      type: form.type,
      quantity: parseInt(form.qty) || 0,
      status: "Em análise",
      date: new Date().toISOString().split("T")[0],
      budget: null,
      description: form.description,
      sizes: form.sizes,
      colors: form.colors,
      fabric: form.fabric,
      customType: form.customType,
      deadline: form.deadline,
      notes: form.notes,
    };

    // ✅ SALVA A ENCOMENDA NO ESTADO/LOCALSTORAGE
    await addCustomOrder(newOrder);

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

  const handleApprove = (id) => {
    // Atualiza no estado
    const updated = customOrders.find((o) => o.id === id);
    if (updated) {
      updated.status = "Aprovado";
      // O AppContext já deve ter a função updateCustomOrder
    }
  };

  const handleReject = (id) => {
    const updated = customOrders.find((o) => o.id === id);
    if (updated) {
      updated.status = "Cancelado";
    }
  };

  const handleCancel = (id) => {
    const updated = customOrders.find((o) => o.id === id);
    if (updated) {
      updated.status = "Cancelado";
    }
  };

  const ordersToShow = customOrders.length > 0 ? customOrders : [];

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

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: ordersToShow.length, color: "text-white" },
          {
            label: "Em Análise",
            value: ordersToShow.filter((o) => o.status === "Em análise").length,
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
              onApprove={handleApprove}
              onReject={handleReject}
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
