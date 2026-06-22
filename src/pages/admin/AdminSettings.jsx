import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Building2,
  Save,
  Check,
} from "lucide-react";
import { Card, Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

const TABS = [
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "aparencia", label: "Aparência", icon: Palette },
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

export default function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("empresa");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState({
    newOrder: true,
    lowStock: true,
    newMessage: true,
    dailyReport: false,
    weeklyReport: true,
    newClient: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
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
            {activeTab === "empresa" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Dados da Empresa
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nome da Empresa"
                    value="AGAH Confecção Esportiva"
                    onChange={() => {}}
                    className="col-span-2"
                  />
                  <Input
                    label="CNPJ"
                    value="12.345.678/0001-90"
                    onChange={() => {}}
                  />
                  <Input
                    label="Telefone"
                    value="(31) 99999-0000"
                    onChange={() => {}}
                  />
                  <Input
                    label="E-mail"
                    type="email"
                    value="contato@agah.com"
                    onChange={() => {}}
                  />
                  <Input
                    label="Website"
                    value="www.agah.com.br"
                    onChange={() => {}}
                  />
                  <Input
                    label="Endereço"
                    value="Rua das Confecções, 123"
                    onChange={() => {}}
                    className="col-span-2"
                  />
                  <Input label="Cidade" value="Contagem" onChange={() => {}} />
                  <Input label="Estado" value="MG" onChange={() => {}} />
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                      Descrição
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Confecção esportiva premium especializada em uniformes personalizados, roupas técnicas e produção sob demanda."
                      className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 resize-none focus:border-[#D4AF37]/50 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "perfil" && (
              <Card>
                <h2 className="text-base font-semibold font-display text-white mb-6">
                  Perfil do Administrador
                </h2>
                <div className="flex items-center gap-4 mb-6 p-4 glass-light rounded-xl">
                  <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {user?.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{user?.name}</div>
                    <div className="text-sm text-slate-500">{user?.email}</div>
                    <div className="text-xs text-[#D4AF37] mt-0.5">
                      Administrador
                    </div>
                  </div>
                  <Button variant="secondary" size="sm" className="ml-auto">
                    Alterar Foto
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Nome"
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
                  <Input
                    label="Cargo"
                    value="Administrador"
                    onChange={() => {}}
                  />
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
                      key: "newOrder",
                      label: "Novo pedido recebido",
                      description: "Notificar quando um novo pedido for criado",
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
                    <Button variant="danger" size="sm">
                      Encerrar todas as sessões
                    </Button>
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
