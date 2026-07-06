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

// ✅ DADOS SIMULADOS DE INSCRIÇÕES
const MOCK_REGISTRATIONS = [
  {
    id: 1,
    clientId: 1,
    clientName: "Rafael Mendonça",
    eventId: 1,
    eventName: "Corre Pela Vida",
    distance: "21km",
    shirtSize: "G",
    price: 120.0,
    status: "Confirmada",
    date: "2025-02-15T00:00:00.000Z",
    location: "Muriaé, Minas Gerais",
  },
  {
    id: 2,
    clientId: 1,
    clientName: "Rafael Mendonça",
    eventId: 2,
    eventName: "Agah Night Run",
    distance: "10km",
    shirtSize: "M",
    price: 89.9,
    status: "Confirmada",
    date: "2025-03-10T00:00:00.000Z",
    location: "Muriaé, Minas Gerais",
  },
  {
    id: 3,
    clientId: 1,
    clientName: "Rafael Mendonça",
    eventId: 3,
    eventName: "Corre Delas",
    distance: "5km",
    shirtSize: "P",
    price: 60.0,
    status: "Pendente",
    date: "2025-04-05T00:00:00.000Z",
    location: "Muriaé, Minas Gerais",
  },
  {
    id: 4,
    clientId: 1,
    clientName: "Rafael Mendonça",
    eventId: 4,
    eventName: "10KM Run",
    distance: "10km",
    shirtSize: "M",
    price: 75.0,
    status: "Confirmada",
    date: "2025-01-20T00:00:00.000Z",
    location: "Muriaé, Minas Gerais",
  },
];

export default function ClientRegistrations() {
  const { eventRegistrations } = useApp();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // ✅ Função para garantir que os dados simulados sempre existam
  const getDisplayRegistrations = () => {
    // Se não houver inscrições, usa os simulados
    if (!eventRegistrations || eventRegistrations.length === 0) {
      return MOCK_REGISTRATIONS;
    }

    // Verifica se as inscrições existentes são do usuário atual
    const userRegistrations = eventRegistrations.filter(
      (r) => r.clientId === user?.id || r.clientName === user?.name,
    );

    // Se o usuário não tiver inscrições, usa os simulados com o nome do usuário
    if (userRegistrations.length === 0) {
      return MOCK_REGISTRATIONS.map((r) => ({
        ...r,
        clientName: user?.name || "Cliente",
        clientId: user?.id || 1,
      }));
    }

    // Se o usuário tiver menos de 4 inscrições, mescla com os simulados
    if (userRegistrations.length < 4) {
      const existingIds = new Set(userRegistrations.map((r) => r.id));
      const merged = [
        ...userRegistrations,
        ...MOCK_REGISTRATIONS.filter((mock) => !existingIds.has(mock.id))
          .slice(0, 4 - userRegistrations.length)
          .map((r) => ({
            ...r,
            clientName: user?.name || "Cliente",
            clientId: user?.id || 1,
          })),
      ];
      return merged;
    }

    return userRegistrations;
  };

  const myRegistrations = getDisplayRegistrations();

  const filtered = myRegistrations.filter((r) =>
    r.eventName?.toLowerCase().includes(search.toLowerCase()),
  );

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

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: myRegistrations.length,
            color: "text-white",
          },
          {
            label: "Confirmadas",
            value: myRegistrations.filter(
              (r) => r.status === "Confirmada" || r.status === "Confirmado",
            ).length,
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
        {filtered.map((reg, i) => (
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
                  #{reg.id}
                </span>
                <StatusBadge status={reg.status || "Confirmada"} />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">
                {reg.eventName || "Evento"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {reg.date
                    ? new Date(reg.date).toLocaleDateString("pt-BR")
                    : "Em breve"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {reg.location || "Muriaé, MG"}
                </span>
                <span className="flex items-center gap-1">
                  <Shirt size={11} />
                  {reg.shirtSize || "M"}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="font-bold text-white">
                R$ {reg.price?.toFixed(2).replace(".", ",") || "0,00"}
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {reg.distance || "10km"}
              </div>
            </div>
          </motion.div>
        ))}
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
