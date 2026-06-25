import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Package,
  Trophy,
  Zap,
  Shield,
  Award,
  Users,
  Star,
  Check,
  MapPin,
  Calendar,
  Mail,
  Phone,
  AtSign,
  Share2,
  ChevronRight,
  Sparkles,
  Send,
} from "lucide-react";
import LandingNav from "./LandingNav";
import { products, events } from "../../data/mockData";
import { Button, Input } from "../../components/ui";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

// ─── HERO ─────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 -translate-y-1/3 translate-x-1/4"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-10 translate-y-1/3 -translate-x-1/4"
          style={{
            background: "radial-gradient(circle, #D4AF37 0%, transparent 65%)",
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          viewBox="0 0 1400 800"
        >
          <line
            x1="0"
            y1="400"
            x2="1400"
            y2="400"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <line
            x1="700"
            y1="0"
            x2="700"
            y2="800"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <circle
            cx="700"
            cy="400"
            r="250"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
          />
          <circle
            cx="700"
            cy="400"
            r="150"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid xl:grid-cols-2 gap-12 items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass-light border border-[#D4AF37]/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-[#D4AF37]" />
            <span className="text-xs font-medium text-[#D4AF37]">
              Confecção Esportiva Premium
            </span>
          </div>

          <h1 className="text-4xl xl:text-6xl font-bold font-display text-white leading-[1.1] mb-6">
            Performance que
            <br />
            veste <span className="gradient-text">sua marca</span>
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
            Uniformes personalizados, roupas técnicas e produção sob demanda
            para equipes, academias e eventos esportivos. Qualidade premium, do
            tecido ao acabamento.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-7 py-3.5 rounded-xl glow-brand hover:opacity-90 transition-all"
            >
              Solicitar Orçamento <ArrowRight size={18} />
            </button>
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 glass-light text-white font-medium px-7 py-3.5 rounded-xl border border-white/15 hover:border-white/25 transition-all"
            >
              Ver Produtos
            </a>
          </div>

          <div className="flex items-center gap-8">
            {[
              { value: "5+", label: "Anos de mercado" },
              { value: "2k+", label: "Clientes" },
              { value: "50k+", label: "Peças produzidas" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold font-display text-white">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden xl:block"
        >
          <div
            className="relative h-[480px] rounded-3xl overflow-hidden border border-white/10"
            style={{
              background: "#0a0a0a",
            }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmiuBaJ-47KAXsfBpJ_ioMI54P5zdrnuoWwqIrmtbko2wxUJzDsFmeQwU&s=10"
              alt="Produtos AGAH"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30"></div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-8 glass rounded-2xl p-4 border border-white/10 shadow-xl z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-white font-semibold">
                  4.9/5.0
                </span>
              </div>
              <div className="text-[10px] text-slate-300">
                +2.000 avaliações
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-32 right-8 glass rounded-2xl p-4 border border-white/10 shadow-xl z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Zap size={12} className="text-[#D4AF37]" />
                <span className="text-xs text-white font-semibold">
                  Produção Rápida
                </span>
              </div>
              <div className="text-[10px] text-slate-300">10-20 dias úteis</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-8 left-12 glass rounded-2xl p-4 border border-white/10 shadow-xl z-10"
            >
              <div className="flex items-center gap-2 mb-1">
                <Shield size={12} className="text-emerald-400" />
                <span className="text-xs text-white font-semibold">
                  100% Personalizável
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FEATURED PRODUCTS COM IMAGENS ATUALIZADAS ──────────
function FeaturedProducts() {
  const navigate = useNavigate();
  const featured = products.slice(0, 4);

  // Imagens atualizadas dos produtos
  const productImages = {
    1: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUsbwHMVb_uPxNkEhnFzmuaFM2J1c0v3oSwYqhd13siZbGYqMH4Mb0ebE&s=10",
    2: "https://static.santosbikes.com.br/public/santosbikes/imagens/produtos/a2ea238aa0c92ed0761fd9a6dac22cd5.png",
    3: "https://static.santosbikes.com.br/public/santosbikes/imagens/produtos/camisa-ciclismo-agah-soft-7090.png",
    4: "https://agahsports.com.br/wp-content/uploads/2025/11/Imagem-do-WhatsApp-de-2025-11-18-as-23.52.37_ac0c7aa8.jpg",
  };

  // Nomes atualizados dos produtos
  const productNames = {
    1: "Camisa Night Run",
    2: "Kit AGAH Ciclismo",
    3: "Camisa Ciclismo Pro",
    4: "Camisa AGAH Personalizada",
  };

  return (
    <section id="produtos" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Catálogo
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold font-display text-white mb-4">
            Roupas esportivas que performam
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Camisas, uniformes, leggings e acessórios desenvolvidos com tecidos
            técnicos de alta performance.
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
          {featured.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
              onClick={() => navigate("/login")}
            >
              <div className="h-56 relative overflow-hidden bg-[#0a0a0a]">
                {productImages[p.id] ? (
                  <img
                    src={productImages[p.id]}
                    alt={productNames[p.id] || p.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    style={{
                      objectPosition: i === 0 ? "center 65%" : "center",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg class="text-white/10" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                            <path d="M4 18l4-4 2 2 4-4 4 4"/>
                            <path d="M4 6h16"/>
                            <path d="M4 10h10"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package
                      size={36}
                      className="text-white/10 group-hover:text-white/15 transition-colors"
                    />
                  </div>
                )}
                {p.customizable && (
                  <span className="absolute top-3 left-3 text-[9px] bg-[#D4AF37]/80 text-black px-2 py-0.5 rounded-full font-semibold uppercase">
                    Custom
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="text-[10px] text-slate-500 uppercase mb-1">
                  {p.category}
                </div>
                <h3 className="text-sm font-semibold text-white mb-2 leading-tight line-clamp-2">
                  {productNames[p.id] || p.name}
                </h3>
                <div className="text-lg font-bold text-white">
                  R$ {p.price.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 glass-light text-white font-medium px-6 py-3 rounded-xl border border-white/15 hover:border-[#D4AF37]/30 transition-all"
          >
            Ver Catálogo Completo <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── EVENTS COM IMAGENS E LOCALIZAÇÃO ATUALIZADAS ──────
function EventsSection() {
  const navigate = useNavigate();

  const eventosAtualizados = [
    {
      id: 1,
      name: "Agah Night Run",
      location: "Muriaé, MG",
      date: "2025-08-15",
      price: 89.9,
      image:
        "https://cdn.fotto.com.br/galleries/319845/cover.1776592898106.jpg",
    },
    {
      id: 2,
      name: "Corre Pela Vida",
      location: "Muriaé, MG",
      date: "2025-09-20",
      price: 69.9,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcVgPQ_bV4MBxvUS92nZfHgO3PwGKWt_RjvDg99AhXxg&s=10",
    },
    {
      id: 3,
      name: "Corre Delas",
      location: "Muriaé, MG",
      date: "2025-10-05",
      price: 79.9,
      image:
        "https://i.ytimg.com/vi/rHiaw-zBwos/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBrMYx3VuFscQAGABemA7QdcJyPIA",
    },
  ];

  return (
    <section
      id="eventos"
      className="py-24 px-6 relative"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Eventos
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold font-display text-white mb-4">
            Corridas e eventos esportivos
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Participe dos melhores eventos esportivos da região com a chancela
            AGAH.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {eventosAtualizados.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl overflow-hidden card-hover cursor-pointer"
              onClick={() => navigate("/login")}
            >
              <div className="h-48 relative overflow-hidden bg-[#0a0a0a]">
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    objectPosition: i === 0 ? "center 20%" : "center",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="absolute inset-0 flex items-center justify-center">
                        <svg class="text-white/10" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                          <path d="M4 18l4-4 2 2 4-4 4 4"/>
                          <path d="M4 6h16"/>
                          <path d="M4 10h10"/>
                        </svg>
                      </div>
                    `;
                  }}
                />
                <div className="absolute top-3 left-3 glass rounded-lg px-2.5 py-1.5 text-center border border-white/10 backdrop-blur-sm">
                  <div className="text-sm font-bold text-white leading-none">
                    {new Date(event.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                    })}
                  </div>
                  <div className="text-[9px] text-[#D4AF37] uppercase font-semibold">
                    {new Date(event.date).toLocaleDateString("pt-BR", {
                      month: "short",
                    })}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white font-display mb-2">
                  {event.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1.5">
                  <MapPin size={11} />
                  {event.location}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold text-white">
                    R$ {event.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span className="text-xs text-[#D4AF37] font-semibold flex items-center gap-1">
                    Inscreva-se <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DIFFERENTIALS ────────────────────────────────────────
function Differentials() {
  const items = [
    {
      icon: Zap,
      title: "Produção Rápida",
      desc: "Prazo médio de 10 a 20 dias úteis após aprovação do orçamento",
    },
    {
      icon: Package,
      title: "100% Personalizável",
      desc: "Do tecido ao acabamento, tudo sob medida para sua equipe",
    },
    {
      icon: Award,
      title: "Qualidade Premium",
      desc: "Tecidos técnicos de alta performance e durabilidade comprovada",
    },
    {
      icon: Users,
      title: "Atendimento Dedicado",
      desc: "Equipe especializada do orçamento à entrega final",
    },
  ];

  return (
    <section id="diferenciais" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Por que a AGAH
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold font-display text-white mb-4">
            Diferenciais que fazem a diferença
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6 card-hover"
            >
              <div className="w-12 h-12 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center mb-4">
                <item.icon size={22} className="text-[#D4AF37]" />
              </div>
              <h3 className="font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: "Clube Atlético BH",
      role: "Time de Futebol Amador",
      text: "A qualidade dos uniformes superou nossas expectativas. Equipe toda satisfeita com o caimento e durabilidade.",
      stars: 5,
    },
    {
      name: "Equipe Vortex Running",
      role: "Grupo de Corrida",
      text: "Atendimento excepcional e prazo de entrega cumprido à risca. Já é nosso fornecedor oficial.",
      stars: 5,
    },
    {
      name: "Academia FitPower",
      role: "Academia de Treinamento",
      text: "Personalização perfeita com nossa marca. Os instrutores adoraram as camisas dry fit.",
      stars: 5,
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Depoimentos
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold font-display text-white mb-4">
            Quem confia na AGAH
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {t.name
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────
function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, #b08526 0%, #D4AF37 50%, #e8c970 100%)",
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 800 300">
              <circle cx="700" cy="50" r="150" fill="white" />
              <circle cx="100" cy="250" r="100" fill="white" />
            </svg>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl xl:text-4xl font-bold font-display text-white mb-4">
              Pronto para vestir sua equipe?
            </h2>
            <p className="text-white/90 max-w-lg mx-auto mb-8">
              Solicite um orçamento personalizado e descubra como a AGAH pode
              transformar a identidade visual do seu time.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="inline-flex items-center gap-2 bg-white text-[#D4AF37] font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all"
            >
              Solicitar Orçamento Agora <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT/FOOTER ───────────────────────────────────────
function ContactFooter() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      id="contato"
      className="py-24 px-6"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-7xl mx-auto grid xl:grid-cols-2 gap-12">
        <div>
          <div className="text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-3">
            Fale Conosco
          </div>
          <h2 className="text-3xl font-bold font-display text-white mb-6">
            Vamos criar algo juntos
          </h2>

          {sent ? (
            <div className="glass rounded-2xl p-8 text-center">
              <Check size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-medium">
                Mensagem enviada! Responderemos em breve.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <Input
                label="Nome"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Seu nome"
              />
              <Input
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="seu@email.com"
              />
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  placeholder="Conte-nos sobre seu projeto..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600"
                />
              </div>
              <Button type="submit" icon={Send} className="w-full">
                Enviar Mensagem
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4 mb-10">
            {[
              { icon: Mail, value: "contato@agah.com.br" },
              { icon: Phone, value: "(31) 99999-0000" },
              { icon: MapPin, value: "Muriaé, MG — Brasil" },
            ].map((item) => (
              <div key={item.value} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center">
                  <item.icon size={16} className="text-[#D4AF37]" />
                </div>
                <span className="text-sm text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">AG</span>
              </div>
              <img
                src={logoTextoAgah}
                alt="AGAH"
                className="h-6 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 mb-4 max-w-sm">
              Confecção esportiva premium para equipes, academias e eventos.
              Performance que veste sua marca.
            </p>
            <div className="flex gap-3 mb-6">
              {[AtSign, Share2].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 glass-light rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/8"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
            <div className="text-xs text-slate-600 border-t border-white/6 pt-4">
              © 2025 AGAH Confecção Esportiva. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: "#000000" }}>
      <LandingNav />
      <Hero />
      <FeaturedProducts />
      <EventsSection />
      <Differentials />
      <Testimonials />
      <CTASection />
      <ContactFooter />
    </div>
  );
}
