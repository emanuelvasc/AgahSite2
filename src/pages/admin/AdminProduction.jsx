import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Factory,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  Package,
  Layers,
  Check,
  X,
} from "lucide-react";
import { PageHeader, Card, Button, StatusBadge } from "../../components/ui";
import { useApp } from "../../context/AppContext";

// ✅ LINHAS DE PRODUÇÃO
const PRODUCTION_LINES = [
  { id: "corte", name: "Corte", color: "#6366f1" },
  { id: "costura", name: "Costura", color: "#8b5cf6" },
  { id: "estamparia", name: "Estamparia", color: "#D4AF37" },
  { id: "acabamento", name: "Acabamento", color: "#10b981" },
  { id: "expedicao", name: "Expedição", color: "#84cc16" },
];

// ✅ Ordem das etapas para o indicador de progresso
const STAGE_ORDER = [
  "corte",
  "costura",
  "estamparia",
  "acabamento",
  "expedicao",
];

// ✅ Nomes das etapas para exibição
const STAGE_NAMES = {
  corte: "Corte",
  costura: "Costura",
  estamparia: "Estamparia",
  acabamento: "Acabamento",
  expedicao: "Expedição",
};

// ✅ DADOS SIMULADOS INICIAIS
const INITIAL_MOCK_ORDERS = [
  {
    id: "PED-2025-001",
    client: "Equipe Vortex Running",
    items: 45,
    status: "Em Produção",
    date: "2025-06-28",
    productionLine: "corte",
    product: "Camisa Manga Curta Performance",
    protocol: null,
  },
  {
    id: "PED-2025-002",
    client: "Clube Atlético BH",
    items: 38,
    status: "Em Produção",
    date: "2025-06-27",
    productionLine: "costura",
    product: "Uniforme Esportivo Completo",
    protocol: null,
  },
  {
    id: "PED-2025-003",
    client: "Academia FitPower",
    items: 50,
    status: "Em Produção",
    date: "2025-06-26",
    productionLine: "estamparia",
    product: "Camisa Estampada Custom",
    protocol: null,
  },
  {
    id: "PED-2025-004",
    client: "Rafael Mendonça",
    items: 12,
    status: "Em Produção",
    date: "2025-06-25",
    productionLine: "acabamento",
    product: "Shorts Esportivo Pro",
    protocol: null,
  },
  {
    id: "PED-2025-005",
    client: "Equipe Vortex Running",
    items: 30,
    status: "Em Produção",
    date: "2025-06-24",
    productionLine: "expedicao",
    product: "Jaqueta Corta Vento",
    protocol: null,
  },
  {
    id: "PED-2025-006",
    client: "Clube Atlético BH",
    items: 20,
    status: "Em Produção",
    date: "2025-06-23",
    productionLine: "corte",
    product: "Regata Esportiva Elite",
    protocol: null,
  },
  {
    id: "PED-2025-007",
    client: "Academia FitPower",
    items: 8,
    status: "Em Produção",
    date: "2025-06-22",
    productionLine: "costura",
    product: "Legging Feminina Sport",
    protocol: null,
  },
];

export default function AdminProduction() {
  const { orders, updateOrderStatus } = useApp();
  const [productionOrders, setProductionOrders] = useState([]);
  const [recentCompleted, setRecentCompleted] = useState([]);
  const [isMockData, setIsMockData] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Carregar dados iniciais
  useEffect(() => {
    // Verifica se há pedidos reais em produção
    const realProduction = orders.filter((o) => o.status === "Em Produção");

    if (realProduction.length > 0) {
      setProductionOrders(realProduction);
      setIsMockData(false);
    } else {
      // Usa dados simulados
      setProductionOrders(INITIAL_MOCK_ORDERS);
      setIsMockData(true);
    }

    // Verifica se há pedidos entregues reais
    const realCompleted = orders
      .filter((o) => o.status === "Entregue")
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    if (realCompleted.length > 0) {
      setRecentCompleted(realCompleted);
    } else {
      // Dados simulados de entregues
      setRecentCompleted([
        {
          id: "PED-2025-008",
          client: "Rafael Mendonça",
          items: 6,
          status: "Entregue",
          date: "2025-07-05",
          product: "Boné Performance Sport",
          protocol: null,
        },
        {
          id: "PED-2025-009",
          client: "Equipe Vortex Running",
          items: 3,
          status: "Entregue",
          date: "2025-07-04",
          product: "Camisa Manga Curta Performance",
          protocol: null,
        },
        {
          id: "PED-2025-010",
          client: "Clube Atlético BH",
          items: 15,
          status: "Entregue",
          date: "2025-07-03",
          product: "Uniforme Esportivo Completo",
          protocol: null,
        },
      ]);
    }
  }, [orders]);

  // ✅ Organizar pedidos por etapa (linha de produção)
  const getOrdersByStage = () => {
    const stages = [
      { id: "corte", name: "Corte", color: "#6366f1", items: [] },
      { id: "costura", name: "Costura", color: "#8b5cf6", items: [] },
      { id: "estamparia", name: "Estamparia", color: "#D4AF37", items: [] },
      { id: "acabamento", name: "Acabamento", color: "#10b981", items: [] },
      { id: "expedicao", name: "Expedição", color: "#84cc16", items: [] },
    ];

    // Adiciona pedidos em produção
    productionOrders.forEach((order) => {
      const stageId = order.productionLine || "corte";
      const stageIndex = STAGE_ORDER.indexOf(stageId);

      if (stageIndex !== -1 && stages[stageIndex]) {
        stages[stageIndex].items.push({
          id: order.id,
          product: order.product || order.client || "Produto",
          qty: order.items || 1,
          client: order.client || "Cliente",
          since: order.date
            ? new Date(order.date).toLocaleDateString("pt-BR")
            : "Hoje",
          protocol: order.protocol,
          isCustom: false,
          type: "Pedido",
          currentStage: stageIndex,
          orderData: order,
        });
      }
    });

    return stages;
  };

  const stages = getOrdersByStage();
  const totalInProd = stages.reduce(
    (a, s) => a + s.items.reduce((b, i) => b + i.qty, 0),
    0,
  );

  // ✅ Calcular ordens ativas
  const activeOrders = stages.reduce((a, s) => a + s.items.length, 0);

  // ✅ Calcular entregues hoje
  const completedToday = recentCompleted.filter((o) => {
    const today = new Date().toDateString();
    return new Date(o.date).toDateString() === today;
  }).length;

  // ✅ FUNÇÃO PARA AVANÇAR OU FINALIZAR
  const handleAdvanceStatus = (item, stageIndex) => {
    const orderId = item.id;

    // Encontra o pedido na lista de produção
    const orderIndex = productionOrders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) return;

    const order = productionOrders[orderIndex];
    const currentStage = order.productionLine || "corte";
    const currentStageIndex = STAGE_ORDER.indexOf(currentStage);
    const nextStageIndex = currentStageIndex + 1;

    // ✅ Se já está na última etapa (Expedição), finaliza
    if (currentStageIndex >= STAGE_ORDER.length - 1) {
      // Remove da produção
      const updatedOrders = [...productionOrders];
      const removed = updatedOrders.splice(orderIndex, 1)[0];
      setProductionOrders(updatedOrders);

      // Adiciona aos entregues
      const completedItem = {
        ...removed,
        status: "Entregue",
        date: new Date().toISOString(),
        product: item.product,
      };
      setRecentCompleted((prev) => [completedItem, ...prev].slice(0, 5));

      // Força re-render
      setRefreshKey((prev) => prev + 1);
      return;
    }

    // ✅ Avança para a próxima etapa
    const nextStage = STAGE_ORDER[nextStageIndex];
    const updatedOrders = [...productionOrders];
    updatedOrders[orderIndex] = {
      ...order,
      productionLine: nextStage,
      date: new Date().toISOString(),
    };
    setProductionOrders(updatedOrders);

    // Força re-render
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ Verifica se está na última etapa
  const isLastStage = (item) => {
    const stage = item.orderData?.productionLine || "corte";
    return stage === "expedicao";
  };

  // ✅ Verifica se está entregue
  const isFinished = (item) => {
    return item.orderData?.status === "Entregue";
  };

  return (
    <div>
      <PageHeader
        title="Produção"
        subtitle="Acompanhamento de ordens de serviço por etapa"
      />

      {/* Overview */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-white mb-1">
            {totalInProd || 318}
          </div>
          <div className="text-xs text-slate-500">Peças em produção</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-[#D4AF37] mb-1">
            {activeOrders || 10}
          </div>
          <div className="text-xs text-slate-500">Ordens ativas</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-emerald-400 mb-1">
            {completedToday || 8}
          </div>
          <div className="text-xs text-slate-500">Entregues hoje</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-blue-400 mb-1">
            {orders.length > 0
              ? (
                  orders.reduce((a, o) => a + (o.items || 0), 0) /
                  orders.length /
                  10
                ).toFixed(1)
              : "1.2"}
          </div>
          <div className="text-xs text-slate-500">Tempo médio (dias)</div>
        </Card>
      </div>

      {/* Kanban board */}
      {productionOrders.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Package size={48} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Nenhum pedido em produção
          </h3>
          <p className="text-sm text-slate-500">
            Os pedidos enviados para produção aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {stages.map((stage) => (
              <div key={stage.id} className="w-64 flex-shrink-0">
                {/* Stage header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: stage.color }}
                  />
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {stage.name}
                  </span>
                  <span className="ml-auto text-xs text-slate-600">
                    {stage.items.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {stage.items.map((item) => {
                    const finished = isFinished(item);
                    const lastStage = isLastStage(item);
                    const stageIndex = STAGE_ORDER.indexOf(stage.id);

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`glass rounded-xl p-4 border transition-all ${
                          finished
                            ? "border-emerald-500/30 bg-emerald-500/5"
                            : "border-white/0 hover:border-white/8"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-mono text-[10px] text-[#D4AF37] font-semibold">
                            {item.id}
                          </span>
                          <span className="text-[10px] text-slate-600 flex items-center gap-1">
                            <Clock size={9} />
                            {item.since}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-white leading-tight mb-2">
                          {item.product}
                        </div>
                        <div className="text-xs text-slate-500 mb-3">
                          {item.client}
                          {item.protocol && (
                            <span className="ml-2 text-[#D4AF37] text-[9px]">
                              Encomenda: {item.protocol}
                            </span>
                          )}
                        </div>

                        {/* TRACINHOS DE PROGRESSO */}
                        <div className="flex items-center gap-1 mb-3">
                          {STAGE_ORDER.map((stageId, idx) => {
                            const isActive = idx <= stageIndex;
                            const stageColor = PRODUCTION_LINES.find(
                              (s) => s.id === stageId,
                            )?.color;

                            return (
                              <div
                                key={stageId}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full transition-all ${
                                    isActive
                                      ? "scale-100"
                                      : "scale-75 opacity-30"
                                  }`}
                                  style={{
                                    background: isActive ? stageColor : "#333",
                                  }}
                                />
                                {idx < STAGE_ORDER.length - 1 && (
                                  <div
                                    className={`w-4 h-0.5 transition-all ${
                                      isActive ? "opacity-100" : "opacity-30"
                                    }`}
                                    style={{
                                      background: isActive
                                        ? stageColor
                                        : "#333",
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-bold"
                            style={{ color: stage.color }}
                          >
                            {item.qty} un.
                          </span>
                          {finished ? (
                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                              <Check size={14} /> Entregue
                            </span>
                          ) : lastStage ? (
                            <button
                              onClick={() =>
                                handleAdvanceStatus(item, stageIndex)
                              }
                              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                            >
                              Finalizar <ChevronRight size={10} />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleAdvanceStatus(item, stageIndex)
                              }
                              className="text-[10px] text-[#D4AF37] hover:text-[#e8c970] flex items-center gap-1 transition-colors"
                            >
                              Avançar <ChevronRight size={10} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}

                  {stage.items.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-white/5 p-6 text-center">
                      <p className="text-xs text-slate-700">Vazio</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Entregues recentemente */}
      {recentCompleted.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold font-display text-white mb-4 flex items-center gap-2">
            <CheckCircle size={16} className="text-emerald-400" />
            Entregues Recentemente
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            {recentCompleted.map((item, i) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 px-6 py-4 ${
                  i < recentCompleted.length - 1
                    ? "border-b border-white/5"
                    : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={16} className="text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">
                    {item.client || "Cliente"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.items || 0} un. • {item.id}
                    {item.protocol && (
                      <span className="ml-2 text-[#D4AF37]">
                        Encomenda: {item.protocol}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-slate-600">
                  {item.date
                    ? new Date(item.date).toLocaleDateString("pt-BR")
                    : "Hoje"}
                </div>
                <StatusBadge status={item.status || "Entregue"} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
