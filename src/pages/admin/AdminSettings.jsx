import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Building2,
  Save,
  Check,
  Upload,
  X,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ABAS SEM APARÊNCIA E SEM 2FA
const TABS = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Shield },
];

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
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-[#D4AF37]" : "bg-white/10"
        }`}
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

export default function AdminSettings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("empresa");
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // ─── ESTADO DADOS DA EMPRESA ──────────────────────────────
  const [companyData, setCompanyData] = useState({
    name: "AGAH Confecção Esportiva",
    cnpj: "12.345.678/0001-90",
    phone: "(31) 99999-0000",
    email: "contato@agah.com",
    website: "www.agah.com.br",
    address: "Rua das Confecções, 123",
    city: "Contagem",
    state: "MG",
    description:
      "Confecção esportiva premium especializada em uniformes personalizados, roupas técnicas e produção sob demanda.",
  });

  // ─── ESTADO PERFIL ──────────────────────────────────────────
  const [profileData, setProfileData] = useState({
    name: user?.name || "Carlos Mendes",
    email: user?.email || "admin@agah.com",
    phone: "(00) 00000-0000",
    role: "Administrador",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // ─── ESTADO SEGURANÇA ──────────────────────────────────────
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // ─── ESTADO NOTIFICAÇÕES ──────────────────────────────────
  const [notifs, setNotifs] = useState({
    newOrder: true,
    lowStock: true,
    newMessage: true,
    dailyReport: false,
    weeklyReport: true,
    newClient: false,
  });

  // ─── FUNÇÕES DE INPUT ──────────────────────────────────────
  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
    if (saveMessage) setSaveMessage("");
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (saveMessage) setSaveMessage("");
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  // ─── FUNÇÃO SALVAR ──────────────────────────────────────────
  const handleSave = () => {
    setSaved(true);
    setSaveMessage("✅ Alterações salvas com sucesso!");
    setTimeout(() => {
      setSaved(false);
      setSaveMessage("");
    }, 3000);
  };

  // ─── FUNÇÃO ALTERAR SENHA ──────────────────────────────────
  const handleChangePassword = () => {
    if (!passwordData.current) {
      setPasswordError("⚠️ Digite a senha atual.");
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError("⚠️ A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError("⚠️ As senhas não coincidem.");
      return;
    }

    setPasswordSuccess("✅ Senha alterada com sucesso!");
    setPasswordData({ current: "", new: "", confirm: "" });
    setTimeout(() => setPasswordSuccess(""), 3000);
  };

  // ─── FUNÇÃO UPLOAD FOTO ────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ─── FUNÇÃO SAIR ────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0a" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">
              Configurações
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gerencie as configurações do sistema
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

        {saveMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
            <Check size={16} className="text-emerald-400 flex-shrink-0" />
            <span className="text-sm text-emerald-400">{saveMessage}</span>
          </div>
        )}

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
              {/* ─── EMPRESA ────────────────────────────────────── */}
              {activeTab === "empresa" && (
                <Card>
                  <h2 className="text-base font-semibold font-display text-white mb-6">
                    Dados da Empresa
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Nome da Empresa
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={companyData.name}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={companyData.cnpj}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={companyData.phone}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={companyData.email}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Website
                      </label>
                      <input
                        type="text"
                        name="website"
                        value={companyData.website}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Endereço
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={companyData.address}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Cidade
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={companyData.city}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Estado
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={companyData.state}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Descrição
                      </label>
                      <textarea
                        name="description"
                        rows={3}
                        value={companyData.description}
                        onChange={handleCompanyChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600 outline-none"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* ─── PERFIL ────────────────────────────────────── */}
              {activeTab === "perfil" && (
                <Card>
                  <h2 className="text-base font-semibold font-display text-white mb-6">
                    Perfil do Administrador
                  </h2>
                  <div className="flex items-center gap-4 mb-6 p-4 glass-light rounded-xl">
                    <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center text-white font-bold text-xl overflow-hidden">
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="Perfil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        profileData.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {profileData.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {profileData.email}
                      </div>
                      <div className="text-xs text-[#D4AF37] mt-0.5">
                        {profileData.role}
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Upload}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Alterar Foto
                      </Button>
                      {profileImagePreview && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={X}
                          onClick={() => {
                            setProfileImagePreview(null);
                            setProfileImage(null);
                          }}
                        >
                          Remover
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Nome
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Telefone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                        Cargo
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={profileData.role}
                        onChange={handleProfileChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
                      />
                    </div>
                  </div>
                </Card>
              )}

              {/* ─── NOTIFICAÇÕES ────────────────────────────── */}
              {activeTab === "notificacoes" && (
                <Card>
                  <h2 className="text-base font-semibold font-display text-white mb-6">
                    Preferências de Notificação
                  </h2>
                  <div className="space-y-0">
                    {[
                      {
                        key: "newOrder",
                        label: "Novo pedido recebido",
                        description:
                          "Notificar quando um novo pedido for criado",
                      },
                      {
                        key: "lowStock",
                        label: "Estoque baixo",
                        description:
                          "Alertar quando produtos atingirem estoque mínimo",
                      },
                      {
                        key: "newMessage",
                        label: "Nova mensagem de atendimento",
                        description: "Notificar novas mensagens de clientes",
                      },
                      {
                        key: "newClient",
                        label: "Novo cliente cadastrado",
                        description:
                          "Alertar quando um novo cliente se registrar",
                      },
                      {
                        key: "dailyReport",
                        label: "Relatório diário",
                        description: "Receber resumo do dia por e-mail",
                      },
                      {
                        key: "weeklyReport",
                        label: "Relatório semanal",
                        description: "Receber relatório semanal de desempenho",
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

              {/* ─── SEGURANÇA ────────────────────────────────── */}
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

                      {passwordError && (
                        <div className="mb-3 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
                          {passwordSuccess}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                            Senha atual
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="current"
                              value={passwordData.current}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                            Nova senha
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="new"
                              value={passwordData.new}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                            Confirmar nova senha
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirm"
                              value={passwordData.confirm}
                              onChange={handlePasswordChange}
                              placeholder="••••••••"
                              className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                        <Button size="sm" onClick={handleChangePassword}>
                          Atualizar Senha
                        </Button>
                      </div>
                    </div>

                    {/* ✅ 2FA REMOVIDO */}

                    {/* Sair da Conta */}
                    <div className="p-4 glass-light rounded-xl border border-red-500/15">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-red-300 mb-1">
                            Sair da Conta
                          </div>
                          <div className="text-xs text-slate-500">
                            Encerre sua sessão atual
                          </div>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={LogOut}
                          onClick={handleLogout}
                        >
                          Sair
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
