import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  User,
  Phone,
  CheckCircle,
  AlertCircle,
  Trophy,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Por favor, informe seu nome completo.");
      return false;
    }
    if (!form.email.trim()) {
      setError("Por favor, informe seu e-mail.");
      return false;
    }
    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Por favor, informe um e-mail válido.");
      return false;
    }
    if (!form.phone.trim()) {
      setError("Por favor, informe seu telefone.");
      return false;
    }
    if (form.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setRegistered(true);

    setTimeout(() => {
      const result = login(form.email, form.password);
      if (result.success) {
        navigate(result.role === "admin" ? "/admin" : "/cliente");
      } else {
        navigate("/login");
      }
    }, 2000);
  };

  const fillDemo = () => {
    setForm({
      name: "Cliente Demo",
      email: "cliente@agah.com",
      phone: "(31) 99999-9999",
      password: "cliente123",
      confirmPassword: "cliente123",
    });
    setError("");
  };

  if (registered) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#000000" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle size={40} className="text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold font-display text-white mb-3">
            Cadastro Realizado!
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Sua conta foi criada com sucesso. Redirecionando...
          </p>
          <div className="w-12 h-12 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#000000" }}>
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] p-12 relative overflow-hidden"
        style={{
          background: "#0a0a0a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, #D4AF37 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-0 right-0 h-px opacity-10"
            style={{
              background:
                "linear-gradient(90deg, transparent, #D4AF37, transparent)",
            }}
          />
        </div>

        <div className="relative">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Voltar ao site
          </Link>

          <div className="flex flex-col items-center mb-8">
            <img
              src={logoTextoAgah}
              alt="AGAH"
              className="h-10 w-auto object-contain"
            />
          </div>

          <h2 className="text-3xl font-bold font-display text-white leading-tight mb-4 text-center">
            Confecção Esportiva
            <br />
            <span className="gradient-text">Premium</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed text-center">
            Uniformes personalizados, roupas esportivas e produção sob demanda
            para equipes, academias e eventos.
          </p>
        </div>

        <div className="relative space-y-4">
          {[
            { icon: Trophy, text: "Corridas e eventos esportivos" },
            { icon: Shirt, text: "Uniformes 100% personalizados" },
            { icon: Sparkles, text: "Produção rápida e qualidade premium" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                <item.icon size={16} className="text-[#D4AF37]" />
              </div>
              <span className="text-sm text-slate-300">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <div className="lg:hidden flex flex-col items-center mb-6">
              <img
                src={logoTextoAgah}
                alt="AGAH"
                className="h-8 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold font-display text-white mb-2 text-center">
              Criar Conta
            </h1>
            <p className="text-slate-500 text-sm text-center">
              Cadastre-se para começar a usar a plataforma
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Nome completo
              </label>
              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors pl-9 pr-4 py-3"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors pl-9 pr-4 py-3"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Telefone
              </label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors pl-9 pr-4 py-3"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors pl-9 pr-10 py-3"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors pl-9 pr-10 py-3"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-brand text-white font-semibold py-3 rounded-xl glow-brand-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Criando conta...
                </>
              ) : (
                "Criar Conta"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Já tem uma conta?{" "}
              <Link
                to="/login"
                className="text-[#D4AF37] hover:text-[#e8c970] transition-colors font-semibold"
              >
                Faça login
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5">
            <button
              onClick={fillDemo}
              className="w-full text-center text-xs text-[#D4AF37] hover:text-[#e8c970] transition-colors font-medium"
            >
              ⚡ Preencher com dados demo
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            <Link
              to="/"
              className="text-slate-500 hover:text-white transition-colors"
            >
              ← Voltar para o site
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
