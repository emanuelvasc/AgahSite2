import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Check,
  Bell,
  Shield,
  LogOut,
  Globe,
  AtSign,
  Share2,
  Target,
  Eye,
  Heart,
  Award,
  Truck,
  Clock,
  Users,
  Star,
  Settings,
  Palette,
  Building2,
} from "lucide-react";
import { Input, Button, Card } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

// ─── PROFILE ──────────────────────────────────────────────
export function ClientProfile() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "(31) 99123-4567",
    city: "Belo Horizonte",
    state: "MG",
    cep: "30000-000",
    address: "Rua das Flores, 123",
  });
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Meu Perfil
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie suas informações pessoais
          </p>
        </div>
        <Button
          icon={saved ? Check : Save}
          onClick={handleSave}
          className={
            saved
              ? "!bg-emerald-500/20 !text-emerald-400 border border-emerald-500/30"
              : ""
          }
        >
          {saved ? "Salvo!" : "Salvar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Avatar card */}
        <Card className="flex flex-col items-center text-center py-8">
          <div className="relative mb-5">
            <div className="w-24 h-24 gradient-brand rounded-3xl flex items-center justify-center text-white font-bold text-3xl">
              {user?.avatar}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 glass rounded-full border border-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <Camera size={14} />
            </button>
          </div>
          <div className="font-bold text-white text-lg font-display">
            {user?.name}
          </div>
          <div className="text-sm text-slate-500 mt-1">{user?.email}</div>
          <div className="mt-3 text-xs text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full">
            Cliente desde 2023
          </div>

          <div className="mt-6 w-full space-y-2 text-sm">
            {[
              { label: "Pedidos", value: "8" },
              { label: "Encomendas", value: "2" },
              { label: "Total gasto", value: "R$ 1.450" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex justify-between glass-light rounded-xl px-4 py-2.5"
              >
                <span className="text-slate-500">{s.label}</span>
                <span className="text-white font-semibold">{s.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Form */}
        <div className="xl:col-span-2 space-y-5">
          <Card>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <User size={14} className="text-[#D4AF37]" />
              Dados Pessoais
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="col-span-2"
              />
              <Input
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="col-span-2"
              />
              <Input
                label="Telefone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
              <Input label="CPF" value="***.***.***-00" onChange={() => {}} />
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={14} className="text-[#D4AF37]" />
              Endereço
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="CEP"
                value={form.cep}
                onChange={(e) => update("cep", e.target.value)}
              />
              <Input
                label="Estado"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
              />
              <Input
                label="Cidade"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="col-span-2"
              />
              <Input
                label="Endereço"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="col-span-2"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── TOGGLE ────────────────────────────────────────────────
function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-white/6 last:border-0">
      <div className="flex-1 pr-4">
        <div className="text-sm font-medium text-white">{label}</div>
        {description && (
          <div className="text-xs text-slate-500 mt-0.5">{description}</div>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-[#D4AF37]" : "bg-white/10"}`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────
const TABS = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "aparencia", label: "Aparência", icon: Palette },
];

export function ClientSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("perfil");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    orders: true,
    promotions: false,
    events: true,
    newsletter: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Configurações
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gerencie as configurações da sua conta
          </p>
        </div>
        <Button
          icon={saved ? Check : Save}
          onClick={handleSave}
          className={
            saved
              ? "!bg-emerald-500/20 !text-emerald-400 border border-emerald-500/30"
              : ""
          }
        >
          {saved ? "Salvo!" : "Salvar Alterações"}
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  activeTab === tab.id
                    ? "sidebar-active text-white"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/4"
                }`}
              >
                <tab.icon
                  size={16}
                  className={activeTab === tab.id ? "text-[#D4AF37]" : ""}
                />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "perfil" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Meu Perfil
                </h2>
                <div className="flex items-center gap-4 mb-6 p-4 glass-light rounded-xl">
                  <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {user?.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{user?.name}</div>
                    <div className="text-sm text-slate-500">{user?.email}</div>
                    <div className="text-xs text-[#D4AF37] mt-0.5">Cliente</div>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-auto">
                    Alterar Foto
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nome completo"
                    value={user?.name || ""}
                    onChange={() => {}}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={user?.email || ""}
                    onChange={() => {}}
                  />
                  <Input label="Telefone" placeholder="(00) 00000-0000" />
                  <Input label="Data de Nascimento" type="date" />
                </div>
              </Card>
            )}

            {activeTab === "notificacoes" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Preferências de Notificação
                </h2>
                <div className="space-y-0">
                  {[
                    {
                      key: "orders",
                      label: "Atualizações de pedidos",
                      description:
                        "Receba notificações sobre o status dos seus pedidos",
                    },
                    {
                      key: "events",
                      label: "Novos eventos esportivos",
                      description:
                        "Seja avisado sobre novas corridas e eventos",
                    },
                    {
                      key: "promotions",
                      label: "Promoções e descontos",
                      description: "Ofertas exclusivas e cupons especiais",
                    },
                    {
                      key: "newsletter",
                      label: "Newsletter AGAH",
                      description: "Conteúdo esportivo e novidades da marca",
                    },
                  ].map((item) => (
                    <Toggle
                      key={item.key}
                      checked={notifs[item.key]}
                      onChange={(v) =>
                        setNotifs((prev) => ({ ...prev, [item.key]: v }))
                      }
                      label={item.label}
                      description={item.description}
                    />
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "seguranca" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Segurança e Acesso
                </h2>
                <div className="space-y-4">
                  <div className="p-4 glass-light rounded-xl border border-white/8">
                    <div className="text-sm font-semibold text-white mb-1">
                      Alterar Senha
                    </div>
                    <div className="text-xs text-slate-500 mb-4">
                      Última alteração: 30 dias atrás
                    </div>
                    <div className="space-y-3">
                      <Input
                        label="Senha atual"
                        type="password"
                        placeholder="••••••••"
                      />
                      <Input
                        label="Nova senha"
                        type="password"
                        placeholder="••••••••"
                      />
                      <Input
                        label="Confirmar nova senha"
                        type="password"
                        placeholder="••••••••"
                      />
                      <Button size="sm">Atualizar Senha</Button>
                    </div>
                  </div>
                  <div className="p-4 glass-light rounded-xl border border-white/8">
                    <div className="text-sm font-semibold text-white mb-1">
                      Autenticação em 2 Fatores
                    </div>
                    <div className="text-xs text-slate-500 mb-3">
                      Adicione uma camada extra de segurança à sua conta
                    </div>
                    <Button variant="secondary" size="sm">
                      Configurar 2FA
                    </Button>
                  </div>
                  <div className="p-4 glass-light rounded-xl border border-red-500/15">
                    <div className="text-sm font-semibold text-red-300 mb-1">
                      Zona de Perigo
                    </div>
                    <div className="text-xs text-slate-500 mb-3">
                      Ações irreversíveis para sua conta
                    </div>
                    <div className="flex gap-3">
                      <Button variant="danger" size="sm" onClick={handleLogout}>
                        Sair da conta
                      </Button>
                      <Button variant="danger" size="sm">
                        Excluir conta
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "aparencia" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Aparência do Sistema
                </h2>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                      Tema
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { name: "Dark (Atual)", active: true, bg: "#0a0a0a" },
                        { name: "Midnight", active: false, bg: "#0d1117" },
                        { name: "Deep Navy", active: false, bg: "#0f1729" },
                      ].map((theme) => (
                        <button
                          key={theme.name}
                          className={`p-3 rounded-xl border text-xs font-medium transition-all ${theme.active ? "border-[#D4AF37]/50 text-[#D4AF37]" : "border-white/10 text-slate-500 hover:border-white/20"}`}
                          style={{ background: theme.bg }}
                        >
                          {theme.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                      Cor de Destaque
                    </div>
                    <div className="flex gap-3">
                      {[
                        "#D4AF37",
                        "#8b5cf6",
                        "#06b6d4",
                        "#10b981",
                        "#ef4444",
                      ].map((color) => (
                        <button
                          key={color}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${color === "#D4AF37" ? "border-white scale-110" : "border-transparent hover:scale-105"}`}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                      Sidebar
                    </div>
                    <Toggle
                      checked={true}
                      onChange={() => {}}
                      label="Sidebar recolhível"
                      description="Permite minimizar a barra de navegação"
                    />
                    <Toggle
                      checked={false}
                      onChange={() => {}}
                      label="Ícones com labels"
                      description="Mostrar texto ao lado dos ícones quando expandida"
                    />
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────
export function ClientAbout() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Sobre a AGAH
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Conheça nossa história, missão e valores
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="mb-5">
            <img
              src={logoTextoAgah}
              alt="AGAH"
              className="h-8 w-auto object-contain"
            />
            <p className="text-sm text-slate-500">
              Confecção Esportiva Premium
            </p>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            Nascemos da paixão pelo esporte e pela qualidade. A AGAH é
            especializada em confecção esportiva premium, produzindo uniformes
            personalizados, roupas técnicas e peças exclusivas para equipes,
            academias e eventos esportivos.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Com sede em Minas Gerais, atendemos clientes em todo o Brasil,
            combinando tecnologia têxtil avançada com personalização sob medida
            para cada cliente.
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "5+", label: "Anos de mercado" },
            { value: "2k+", label: "Clientes atendidos" },
            { value: "50k+", label: "Peças produzidas" },
          ].map((s) => (
            <Card key={s.label} className="text-center py-5">
              <div className="text-2xl font-bold font-display gradient-text mb-1">
                {s.value}
              </div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card>
          <h3 className="font-semibold font-display text-white mb-4">
            Nossa Essência
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3 p-3 rounded-xl glass-light border border-white/6">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <Target size={18} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Missão</div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Vestir atletas e equipes com roupas esportivas de alta
                  qualidade, unindo performance, conforto e estilo para
                  potencializar o desempenho.
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl glass-light border border-white/6">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <Eye size={18} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Visão</div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Ser referência nacional em confecção esportiva personalizada,
                  reconhecida pela excelência em produtos, inovação e
                  atendimento.
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-3 rounded-xl glass-light border border-white/6">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <Heart size={18} className="text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Valores</div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  Paixão pelo esporte, qualidade em cada detalhe, compromisso
                  com o cliente, inovação constante e transparência em todas as
                  relações.
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold font-display text-white mb-4">
            Nossos Diferenciais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                icon: Clock,
                title: "Produção Rápida",
                desc: "Prazo médio de 10 a 20 dias úteis após aprovação",
              },
              {
                icon: Star,
                title: "100% Personalizável",
                desc: "Do tecido ao acabamento, tudo sob medida para você",
              },
              {
                icon: Award,
                title: "Qualidade Premium",
                desc: "Tecidos técnicos de alta performance e durabilidade",
              },
              {
                icon: Users,
                title: "Atendimento Dedicado",
                desc: "Equipe especializada do pedido à entrega",
              },
              {
                icon: Truck,
                title: "Entrega Nacional",
                desc: "Enviamos para todo o Brasil com rastreamento",
              },
            ].map((d) => (
              <div
                key={d.title}
                className="flex items-start gap-3 p-3 rounded-xl glass-light border border-white/6 hover:bg-white/3 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                  <d.icon size={14} className="text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">
                    {d.title}
                  </div>
                  <div className="text-xs text-slate-500">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold font-display text-white mb-3">
            Redes Sociais
          </h3>
          <div className="flex gap-3">
            {[
              { icon: AtSign, label: "@agahsports" },
              { icon: Share2, label: "AGAH Esportiva" },
              { icon: Globe, label: "agah.com.br" },
            ].map((s) => (
              <button
                key={s.label}
                className="flex-1 glass-light rounded-xl p-3 text-center hover:border-[#D4AF37]/30 border border-white/8 transition-all"
              >
                <s.icon size={18} className="text-slate-400 mx-auto mb-1.5" />
                <div className="text-[10px] text-slate-500">{s.label}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── CONTACT ──────────────────────────────────────────────
export function ClientContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">Contato</h1>
        <p className="text-slate-500 text-sm mt-1">
          Entre em contato com nossa equipe
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "E-mail", value: "contato@agah.com.br" },
            { icon: Phone, label: "Telefone", value: "(31) 99999-0000" },
            { icon: MapPin, label: "Endereço", value: "Contagem, MG — Brasil" },
          ].map((item) => (
            <Card key={item.label} className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D4AF37]/15 rounded-xl flex items-center justify-center">
                  <item.icon size={18} className="text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-sm font-medium text-white">
                    {item.value}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Card className="py-4">
            <div className="text-xs text-slate-500 mb-2">
              Horário de Atendimento
            </div>
            <div className="text-sm text-white font-medium">
              Seg a Sex, 8h–18h
            </div>
            <div className="text-xs text-slate-600 mt-1">Sábados: 8h–12h</div>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card>
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-4"
                >
                  <Check size={28} className="text-emerald-400" />
                </motion.div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-slate-400 text-sm">
                  Nossa equipe responderá em até 24h úteis.
                </p>
                <Button
                  variant="secondary"
                  className="mt-5"
                  onClick={() => setSent(false)}
                >
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-semibold font-display text-white mb-5">
                  Envie uma mensagem
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Seu Nome"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Nome completo"
                    required
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>
                <Input
                  label="Assunto"
                  value={form.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  placeholder="Como podemos ajudar?"
                  required
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Mensagem <span className="text-[#D4AF37]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Descreva sua dúvida, solicitação ou feedback..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={
                    sending || !form.name || !form.email || !form.message
                  }
                  className="w-full"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Enviando...
                    </>
                  ) : (
                    "Enviar Mensagem"
                  )}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
