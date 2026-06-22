import { useState } from "react";
import { motion } from "framer-motion";
import {
  Factory,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
} from "lucide-react";
import { PageHeader, Card, Button, StatusBadge } from "../../components/ui";

const stages = [
  {
    id: 1,
    name: "Corte",
    color: "#6366f1",
    items: [
      {
        id: "OS-001",
        product: "Camisa Manga Curta Performance",
        qty: 24,
        client: "Equipe Vortex Running",
        since: "2 dias",
      },
      {
        id: "OS-002",
        product: "Shorts Esportivo Pro",
        qty: 12,
        client: "Rafael Mendonça",
        since: "1 dia",
      },
    ],
  },
  {
    id: 2,
    name: "Costura",
    color: "#8b5cf6",
    items: [
      {
        id: "OS-003",
        product: "Uniforme Esportivo Completo",
        qty: 38,
        client: "Clube Atlético BH",
        since: "4 dias",
      },
      {
        id: "OS-004",
        product: "Regata Esportiva Elite",
        qty: 20,
        client: "Academia FitPower",
        since: "3 dias",
      },
    ],
  },
  {
    id: 3,
    name: "Estamparia",
    color: "#D4AF37",
    items: [
      {
        id: "OS-005",
        product: "Camisa Estampada Custom",
        qty: 15,
        client: "Equipe Vortex Running",
        since: "1 dia",
      },
    ],
  },
  {
    id: 4,
    name: "Acabamento",
    color: "#10b981",
    items: [
      {
        id: "OS-006",
        product: "Jaqueta Corta Vento",
        qty: 8,
        client: "Clube Atlético BH",
        since: "6 horas",
      },
      {
        id: "OS-007",
        product: "Moletom Fleece Premium",
        qty: 6,
        client: "Rafael Mendonça",
        since: "5 horas",
      },
    ],
  },
  {
    id: 5,
    name: "Controle QA",
    color: "#06b6d4",
    items: [
      {
        id: "OS-008",
        product: "Legging Feminina Sport",
        qty: 8,
        client: "Academia FitPower",
        since: "2 horas",
      },
    ],
  },
  {
    id: 6,
    name: "Expedição",
    color: "#84cc16",
    items: [
      {
        id: "OS-009",
        product: "Calça de Compressão Pro",
        qty: 6,
        client: "Clube Atlético BH",
        since: "1 hora",
      },
    ],
  },
];

const recentCompleted = [
  {
    id: "OS-100",
    product: "Boné Performance Sport",
    qty: 30,
    client: "Academia FitPower",
    date: "15/01/2025",
  },
  {
    id: "OS-099",
    product: "Camisa Manga Curta Performance",
    qty: 50,
    client: "Equipe Vortex Running",
    date: "14/01/2025",
  },
];

export default function AdminProduction() {
  const totalInProd = stages.reduce(
    (a, s) => a + s.items.reduce((b, i) => b + i.qty, 0),
    0,
  );

  return (
    <div>
      <PageHeader
        title="Produção"
        subtitle="Acompanhamento de ordens de serviço por etapa"
        actions={<Button icon={Factory}>Nova OS</Button>}
      />

      {/* Overview */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-white mb-1">
            {totalInProd}
          </div>
          <div className="text-xs text-slate-500">Peças em produção</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-[#D4AF37] mb-1">
            {stages.reduce((a, s) => a + s.items.length, 0)}
          </div>
          <div className="text-xs text-slate-500">Ordens ativas</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-emerald-400 mb-1">
            6
          </div>
          <div className="text-xs text-slate-500">Finalizadas hoje</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-blue-400 mb-1">
            2.4d
          </div>
          <div className="text-xs text-slate-500">Tempo médio</div>
        </Card>
      </div>

      {/* Kanban board */}
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
                {stage.items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4 card-hover cursor-pointer border border-white/0 hover:border-white/8 transition-all"
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
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs font-bold"
                        style={{ color: stage.color }}
                      >
                        {item.qty} un.
                      </span>
                      <button className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
                        Avançar <ChevronRight size={10} />
                      </button>
                    </div>
                    {/* Stage progress indicator */}
                    <div className="flex gap-1 mt-3">
                      {stages.map((s) => (
                        <div
                          key={s.id}
                          className="h-0.5 flex-1 rounded-full"
                          style={{
                            background:
                              s.id <= stage.id
                                ? stage.color
                                : "rgba(255,255,255,0.08)",
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ))}

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

      {/* Recently completed */}
      <div className="mt-8">
        <h2 className="text-base font-semibold font-display text-white mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          Concluídas Recentemente
        </h2>
        <div className="glass rounded-2xl overflow-hidden">
          {recentCompleted.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-6 py-4 ${i < recentCompleted.length - 1 ? "border-b border-white/5" : ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} className="text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">
                  {item.product}
                </div>
                <div className="text-xs text-slate-500">
                  {item.client} • {item.qty} un.
                </div>
              </div>
              <div className="text-xs text-slate-600">{item.date}</div>
              <span className="font-mono text-xs text-slate-600">
                {item.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
