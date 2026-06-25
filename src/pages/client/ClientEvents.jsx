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
  CreditCard,
  Smartphone,
  Lock,
  Shield,
  Info,
} from "lucide-react";
import { StatusBadge, Button, Modal, Card } from "../../components/ui";
import { events } from "../../data/mockData";

// URLs das imagens para cada evento
const eventImages = {
  1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIXUMcoFqVfPLSWDBbhv9sDOxq59-16fgz9RfI9dLLdq3y_XwWL1kjEzs&s=10",
  2: "https://i.ytimg.com/vi/SNh59cxQixQ/maxresdefault.jpg",
  3: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmb6csdFTy_c3V_c4hzZp-ahn2o4U5AtQNauBcSyawoFPAHiYS-QSwTZU&s=10",
  4: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsfzo0PNjsgZ8Rwan2Fe7xh8kFZ_QHFj-0MXtTXA2z5nGghzppgEY4dcJC&s=10",
};

// Mapeamento dos novos nomes dos eventos
const eventNames = {
  1: "Corre Pela Vida",
  2: "Agah Night Run",
  3: "Corre Delas",
  4: "10KM Run",
};

// Posições das imagens para cada evento
const imagePositions = {
  1: "center 40%",
  2: "center 40%",
  3: "center 25%",
  4: "center 30%",
};

function EventCard({ event, onClick }) {
  const pct = (event.participants / event.maxParticipants) * 100;
  const imageUrl = eventImages[event.id] || null;
  const displayName = eventNames[event.id] || event.name;
  const imagePosition = imagePositions[event.id] || "center 40%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
      onClick={() => onClick(event)}
    >
      <div className="h-44 relative overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={displayName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ objectPosition: imagePosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Trophy
              size={56}
              className="text-[#D4AF37]/15 group-hover:text-[#D4AF37]/25 transition-colors"
            />
          </div>
        )}

        <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 text-center border border-white/10 backdrop-blur-sm">
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
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-white font-display text-base leading-tight drop-shadow-lg">
            {displayName}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin size={12} className="text-slate-600 flex-shrink-0" />
            Muriaé, Minas Gerais
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

// ─── COMPONENTE DE PAGAMENTO ──────────────────────────────
function PaymentSection({
  event,
  onConfirm,
  onCancel,
  selectedDistance,
  selectedSize,
}) {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const paymentMethods = [
    { id: "pix", label: "PIX", icon: Smartphone, color: "text-green-400" },
    {
      id: "card",
      label: "Cartão de Crédito",
      icon: CreditCard,
      color: "text-blue-400",
    },
  ];

  const handlePayment = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setPaid(true);
    setTimeout(() => {
      onConfirm();
    }, 500);
  };

  if (paid) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-4"
        >
          <Check size={28} className="text-emerald-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white mb-2">
          Pagamento Confirmado!
        </h3>
        <p className="text-slate-400 text-sm">Processando sua inscrição...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="glass-light rounded-xl p-4 space-y-2 border border-white/8">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Evento</span>
          <span className="text-white font-medium">
            {event.displayName || event.name}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Categoria</span>
          <span className="text-white font-medium">{selectedDistance}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Camiseta</span>
          <span className="text-white font-medium">{selectedSize}</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-white/8">
          <span className="text-slate-400">Valor</span>
          <span className="text-xl font-bold text-[#D4AF37]">
            R$ {event.price.toFixed(2)}
          </span>
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
          Selecione a forma de pagamento
        </div>
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`p-3 rounded-xl text-center transition-all border-2 ${
                paymentMethod === method.id
                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                  : "border-white/10 hover:border-white/20 glass-light"
              }`}
            >
              <method.icon
                size={20}
                className={`mx-auto mb-1 ${paymentMethod === method.id ? "text-[#D4AF37]" : "text-slate-400"}`}
              />
              <div
                className={`text-[9px] font-semibold ${
                  paymentMethod === method.id ? "text-white" : "text-slate-400"
                }`}
              >
                {method.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {paymentMethod === "card" && (
        <div className="glass-light rounded-xl p-4 space-y-3 border border-white/8">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Número do cartão
              </label>
              <input
                type="text"
                placeholder="0000 0000 0000 0000"
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Validade
              </label>
              <input
                type="text"
                placeholder="MM/AA"
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Nome no cartão
              </label>
              <input
                type="text"
                placeholder="Nome como está no cartão"
                className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-[10px] text-slate-500">
        <Lock size={12} className="text-[#D4AF37]" />
        <span>Pagamento seguro com criptografia</span>
        <Shield size={12} className="text-[#D4AF37] ml-2" />
        <span>Dados protegidos</span>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button onClick={handlePayment} disabled={loading} className="flex-1">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processando...
            </>
          ) : (
            `Pagar R$ ${event.price.toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}

export default function ClientEvents() {
  const [selected, setSelected] = useState(null);
  const [registered, setRegistered] = useState({});
  const [registering, setRegistering] = useState(false);
  const [regDone, setRegDone] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [step, setStep] = useState("details");
  const [showFeaturedDetails, setShowFeaturedDetails] = useState(false);

  const shirtSizes = ["PP", "P", "M", "G", "GG", "XGG"];

  const handleRegister = async () => {
    setRegistering(true);
    await new Promise((r) => setTimeout(r, 1400));
    setRegistered((prev) => ({ ...prev, [selected.id]: true }));
    setRegistering(false);
    setRegDone(true);
    setStep("done");
    setTimeout(() => {
      setRegDone(false);
      setSelected(null);
      setStep("details");
      setSelectedDistance("");
    }, 2000);
  };

  const handleConfirmPayment = () => {
    handleRegister();
  };

  const handleCancelPayment = () => {
    setStep("details");
  };

  const displayEvents = events.map((event) => ({
    ...event,
    displayName: eventNames[event.id] || event.name,
  }));

  const featuredImage =
    "https://alfred.alboompro.com/crop/width/420/height/300/mp/tc/type/jpeg/url/cdn.fotto.com.br/galleries/319845/cover.1776592898106.jpg";

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
        className="relative rounded-3xl overflow-hidden mb-8 min-h-[200px] flex items-center cursor-pointer group"
        onClick={() => setShowFeaturedDetails(true)}
      >
        <div className="absolute inset-0">
          <img
            src={featuredImage}
            alt="Agah Night Run"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 48%" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-10 -top-10 w-64 h-64 rounded-full opacity-10"
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
          <div
            className="absolute bottom-0 left-0 right-0 h-20 opacity-10"
            style={{
              background: "linear-gradient(180deg, transparent, #D4AF37)",
            }}
          />
        </div>

        <div className="relative p-8 z-10 w-full">
          <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
            🏆 Em destaque
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-1">
            Agah Night Run 2026
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            42km • 21km • 10km — Muriaé, Minas Gerais — 10 de Maio
          </p>
          <Button
            icon={Info}
            className="group-hover:scale-105 transition-transform"
          >
            Ver Detalhes
          </Button>
        </div>
      </motion.div>

      {/* Modal de Detalhes do Evento em Destaque */}
      <Modal
        isOpen={showFeaturedDetails}
        onClose={() => setShowFeaturedDetails(false)}
        title="Agah Night Run 2026"
        size="lg"
      >
        <div className="space-y-5">
          <div className="relative rounded-2xl overflow-hidden h-40">
            <img
              src={featuredImage}
              alt="Agah Night Run"
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 48%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
            <div className="absolute top-3 right-3">
              <StatusBadge status="Inscrições abertas" />
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                🏆 Evento em Destaque
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-display text-white mb-2">
              Agah Night Run 2026
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              A maior corrida noturna de Minas Gerais. Percurso iluminado com
              estrutura completa, música ao vivo e premiação especial para os
              primeiros colocados. Venha viver essa experiência única em Muriaé!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: "Data", value: "10 de Maio, 2025" },
              { icon: MapPin, label: "Local", value: "Muriaé, Minas Gerais" },
              { icon: Clock, label: "Distâncias", value: "42km / 21km / 10km" },
              { icon: Users, label: "Inscrições", value: "890/2000" },
            ].map((item) => (
              <div key={item.label} className="glass-light rounded-xl p-3">
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

          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              Selecione a Categoria
            </div>
            <div className="flex gap-2 flex-wrap">
              {["42km", "21km", "10km"].map((d) => (
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

          <div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              Tamanho da Camiseta
            </div>
            <div className="flex gap-2 flex-wrap">
              {shirtSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedSize === size
                      ? "gradient-brand text-white"
                      : "glass-light text-slate-400 border border-white/8 hover:border-white/20"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/6">
            <div>
              <div className="text-2xl font-bold text-white">R$ 180,00</div>
              <div className="text-xs text-slate-500">por participante</div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowFeaturedDetails(false)}
              >
                Fechar
              </Button>
              <Button
                onClick={() => {
                  setShowFeaturedDetails(false);
                  const event = events.find((e) => e.id === 3);
                  if (event) {
                    setSelected(event);
                    setStep("details");
                  }
                }}
              >
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-5">
        {displayEvents.map((event, i) => (
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

      {/* Event detail modal com pagamento - TÍTULO CORRIGIDO E BOTÃO FECHAR FUNCIONANDO */}
      <Modal
        isOpen={!!selected}
        onClose={() => {
          // Fecha o modal independente da etapa
          setSelected(null);
          setStep("details");
          setSelectedDistance("");
          setSelectedSize("M");
        }}
        title={step === "payment" ? "Realizar Pagamento" : "Detalhes do Evento"}
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
                  Você está inscrito em {selected.displayName || selected.name}.
                  Boa corrida! 🏃
                </p>
              </div>
            ) : step === "payment" ? (
              <PaymentSection
                event={selected}
                onConfirm={handleConfirmPayment}
                onCancel={handleCancelPayment}
                selectedDistance={selectedDistance}
                selectedSize={selectedSize}
              />
            ) : (
              <>
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
                      {selected.displayName || selected.name}
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
                    {
                      icon: MapPin,
                      label: "Local",
                      value: "Muriaé, Minas Gerais",
                    },
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

                <div>
                  <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    Tamanho da Camiseta
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {shirtSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSize === size
                            ? "gradient-brand text-white"
                            : "glass-light text-slate-400 border border-white/8 hover:border-white/20"
                        }`}
                      >
                        {size}
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
                    onClick={() => setStep("payment")}
                    disabled={!selectedDistance || registered[selected.id]}
                  >
                    {registered[selected.id]
                      ? "Já inscrito!"
                      : "Avançar para Pagamento"}
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
