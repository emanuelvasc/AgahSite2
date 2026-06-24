import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  Shirt,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import { StatusBadge, SearchInput, Card, Button } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function ClientRegistrations() {
  const { eventRegistrations, events } = useApp();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const myRegistrations = eventRegistrations.filter(
    (r) => r.clientId === 1 || r.clientName === user?.name,
  );

  const filtered = myRegistrations.filter((r) =>
    r.eventName.toLowerCase().includes(search.toLowerCase()),
  );

  const findEvent = (eventId) => events.find((e) => e.id === eventId);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Minhas Inscrições
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {myRegistrations.length} inscrições em corridas e eventos
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: myRegistrations.length,
            color: "text-white",
          },
          {
            label: "Confirmadas",
            value: myRegistrations.filter((r) => r.status === "Confirmada")
              .length,
            color: "text-emerald-400",
          },
          {
            label: "Pendentes",
            value: myRegistrations.filter((r) => r.status === "Pendente")
              .length,
            color: "text-amber-400",
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

      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar inscrição..."
          className="flex-1 max-w-xs"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((reg, i) => {
          const event = findEvent(reg.eventId);
          return (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-5 flex items-center gap-4 border border-white/6"
            >
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-[#D4AF37]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#D4AF37]">
                    {reg.id}
                  </span>
                  <StatusBadge status={reg.status} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1.5">
                  {reg.eventName}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  {event && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(event.date).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  {event && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {event.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Shirt size={11} />
                    {reg.shirtSize}
                  </span>
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-bold text-white">
                  R$ {reg.price.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {reg.distance}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-5">
            <ClipboardCheck size={32} className="text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Nenhuma inscrição encontrada
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            Você ainda não se inscreveu em nenhum evento, ou sua busca não
            encontrou resultados.
          </p>
          <Link
            to="/cliente/eventos"
            className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Ver Corridas e Eventos <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
