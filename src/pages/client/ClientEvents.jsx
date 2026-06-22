import { useState } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  Clock,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { StatusBadge, Button, Modal, Card } from "../../components/ui";
import { events } from "../../data/mockData";

function EventCard({ event, onClick }) {
  const pct = (event.participants / event.maxParticipants) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
      onClick={() => onClick(event)}
    >
      {/* Banner */}
      <div
        className="h-44 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f1729 0%, #1a0f40 50%, #0a0a0a 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Trophy
            size={56}
            className="text-[#D4AF37]/15 group-hover:text-[#D4AF37]/25 transition-colors"
          />
        </div>
        {/* Date badge */}
        <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 text-center border border-white/10">
          <div className="text-lg font-bold text-white leading-none">
            {new Date(event.date).toLocaleDateString("pt-BR", {
              day: "2-digit",
            })}
          </div>
          <div className="text-[10px] text-[#D4AF37] font-semibold uppercase">
            {new Date(event.date).toLocaleDateString("pt-BR", {
              month: "short",
            })}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <StatusBadge status={event.status} />
        </div>
        {/* Gradient overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: "linear-gradient(0deg, #000000, transparent)" }}
        />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-white font-display text-base mb-2 leading-tight">
          {event.name}
        </h3>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin size={12} className="text-slate-600 flex-shrink-0" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock size={12} className="text-slate-600 flex-shrink-0" />
            Distâncias: {event.distance}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users size={12} className="text-slate-600 flex-shrink-0" />
            {event.participants}/{event.maxParticipants} inscritos
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background:
                  pct >= 85
                    ? "#f59e0b"
                    : "linear-gradient(90deg,#D4AF37,#e8c970)",
              }}
            />
          </div>
          <div className="text-[10px] text-slate-600 mt-1">
            {pct.toFixed(0)}% das vagas preenchidas
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-white">
              R$ {event.price.toFixed(0)}
            </div>
            <div className="text-[10px] text-slate-500">por categoria</div>
          </div>
          <Button size="sm" icon={ChevronRight}>
            Inscrever-se
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ClientEvents() {
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState({});
  const [registering, setRegistering] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("");

  const handleRegister = async () => {
    setRegistering(true);
    await new Promise((r) => setTimeout(r, 1400));
    setRegistered((prev) => ({ ...prev, [selected.id]: true }));
    setRegistering(false);
    setRegDone(true);
    setTimeout(() => {
      setRegDone(false);
      setSelected(null);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Corridas & Eventos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Participe dos melhores eventos esportivos da região
        </p>
      </div>

      {/* Featured banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative rounded-3xl overflow-hidden mb-8 min-h-[160px] flex items-end"
        style={{
          background:
            "linear-gradient(135deg, #0f1729 0%, #1a0f40 50%, #0a0a0a 100%)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-20"
            style={{
              background: "radial-gradient(circle, #D4AF37, transparent 65%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-96 h-px opacity-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
        </div>
        <div className="relative p-8 z-10">
          <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-2">
            🏆 Em destaque
          </div>
          <h2 className="text-2xl font-bold font-display text-white mb-1">
            Maratona BH 2025
          </h2>
          <p className="text-slate-400 text-sm mb-4">
            42km • 21km • 10km — Mineirão, Belo Horizonte — 10 de Maio
          </p>
          <Button icon={Trophy}>Ver Detalhes</Button>
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="relative">
              <EventCard event={event} onClick={setSelected} />
              {registered[event.id] && (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/30">
                  <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-semibold text-sm px-4 py-2 rounded-full">
                    <Check size={16} /> Inscrito!
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Event detail modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Evento"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            {regDone ? (
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
                  Inscrição Confirmada!
                </h3>
                <p className="text-slate-400 text-sm">
                  Você está inscrito em {selected.name}. Boa corrida! 🏃
                </p>
              </div>
            ) : (
              <>
                {/* Event info */}
                <div className="glass-light rounded-xl overflow-hidden">
                  <div
                    className="h-24 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #0f1729, #1a0f40)",
                    }}
                  >
                    <Trophy size={40} className="text-[#D4AF37]/30" />
                  </div>
                </div>

                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-xl font-bold font-display text-white">
                      {selected.name}
                    </h2>
                    <StatusBadge status={selected.status} />
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {selected.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      icon: Calendar,
                      label: "Data",
                      value: new Date(selected.date).toLocaleDateString(
                        "pt-BR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      ),
                    },
                    { icon: MapPin, label: "Local", value: selected.location },
                    {
                      icon: Clock,
                      label: "Distâncias",
                      value: selected.distance,
                    },
                    {
                      icon: Users,
                      label: "Vagas restantes",
                      value: `${selected.maxParticipants - selected.participants} de ${selected.maxParticipants}`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="glass-light rounded-xl p-3"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <item.icon size={12} className="text-slate-500" />
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>
                      <div className="text-sm text-white font-medium">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Distance selection */}
                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                    Selecione a Categoria
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {selected.distance.split(" / ").map((d) => (
                      <button
                        key={d}
                        onClick={() => setSelectedDistance(d)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedDistance === d
                            ? "gradient-brand text-white"
                            : "glass-light text-slate-400 border border-white/8 hover:border-white/20"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/6">
                  <div>
                    <div className="text-2xl font-bold text-white">
                      R$ {selected.price.toFixed(0)}
                    </div>
                    <div className="text-xs text-slate-500">
                      por participante
                    </div>
                  </div>
                  <Button
                    onClick={handleRegister}
                    disabled={
                      registering ||
                      !selectedDistance ||
                      registered[selected.id]
                    }
                  >
                    {registering ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Processando...
                      </>
                    ) : registered[selected.id] ? (
                      "Já inscrito!"
                    ) : (
                      "Confirmar Inscrição"
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
