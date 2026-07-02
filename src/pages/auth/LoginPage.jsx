import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  UserPlus,
  Trophy,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);
      setLoading(false);

      if (result.success) {
        navigate(result.role === "admin" ? "/admin" : "/cliente");
      } else {
        setError(result.error || "E-mail ou senha inválidos.");
      }
    } catch (err) {
      setLoading(false);
      setError("Erro ao fazer login. Tente novamente.");
    }
  };

  const fillDemo = (role) => {
    if (role === "admin") {
      setEmail("admin@agah.com");
      setPassword("admin123");
    } else {
      setEmail("cliente@agah.com");
      setPassword("cliente123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#000000" }}>
      {/* Left Panel */}
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

      {/* Right Panel */}
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
              Bem-vindo de volta
            </h1>
            <p className="text-slate-500 text-sm text-center">
              Entre na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {error}
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
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-slate-500">
              Não tem uma conta?{" "}
              <Link
                to="/registrar"
                className="text-[#D4AF37] hover:text-[#e8c970] transition-colors font-semibold inline-flex items-center gap-1"
              >
                <UserPlus size={14} />
                Criar conta
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-[#D4AF37]" />
              <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
                Acesso Demo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo("admin")}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/8 transition-all text-left"
              >
                <div className="text-xs font-semibold text-white mb-1">
                  Administrador
                </div>
                <div className="text-[11px] text-slate-500">admin@agah.com</div>
              </button>
              <button
                onClick={() => fillDemo("client")}
                className="p-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/8 transition-all text-left"
              >
                <div className="text-xs font-semibold text-white mb-1">
                  Cliente
                </div>
                <div className="text-[11px] text-slate-500">
                  cliente@agah.com
                </div>
              </button>
            </div>
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
