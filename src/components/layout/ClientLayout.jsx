import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Home,
  Package,
  ShoppingCart,
  ShoppingBag,
  ClipboardList,
  Trophy,
  MessageSquare,
  User,
  Settings,
  Info,
  Phone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  ClipboardCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

const navItems = [
  { to: "/cliente", label: "Início", icon: Home, end: true },
  { to: "/cliente/produtos", label: "Produtos", icon: Package },
  {
    to: "/cliente/carrinho",
    label: "Carrinho",
    icon: ShoppingCart,
    badge: "cart",
  },
  { to: "/cliente/pedidos", label: "Meus Pedidos", icon: ShoppingBag },
  {
    to: "/cliente/encomendas",
    label: "Minhas Encomendas",
    icon: ClipboardList,
  },
  { to: "/cliente/eventos", label: "Corridas e Eventos", icon: Trophy },
  {
    to: "/cliente/inscricoes",
    label: "Minhas Inscrições",
    icon: ClipboardCheck,
  },
  { to: "/cliente/atendimento", label: "Atendimento", icon: MessageSquare },
  { to: "/cliente/perfil", label: "Perfil", icon: User },
  { to: "/cliente/configuracoes", label: "Configurações", icon: Settings },
  { to: "/cliente/sobre", label: "Sobre", icon: Info },
  { to: "/cliente/contato", label: "Contato", icon: Phone },
];

const topNavLinks = [
  { label: "Início", href: "/cliente" },
  { label: "Produtos", href: "/cliente/produtos" },
  { label: "Eventos", href: "/cliente/eventos" },
  { label: "Contato", href: "/cliente/atendimento" },
];

export default function ClientLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#000000" }}
    >
      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex flex-col h-full flex-shrink-0 relative z-20"
        style={{
          background: "#0a0a0a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center h-16 px-4 border-b border-white/6">
          <Link to="/cliente" className="flex items-center overflow-hidden">
            <AnimatePresence>
              {!collapsed ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-shrink-0 flex items-center"
                >
                  <img
                    src={logoTextoAgah}
                    alt="AGAH"
                    className="h-7 w-auto object-contain"
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex-shrink-0 flex items-center"
                >
                  <img
                    src={logoTextoAgah}
                    alt="AGAH"
                    className="h-5 w-auto object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {!collapsed && (
          <div className="px-4 pt-3 pb-1">
            <span className="text-[10px] font-semibold text-[#D4AF37]/70 uppercase tracking-widest">
              Área do Cliente
            </span>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
          {navItems.map(({ to, label, icon: Icon, end, badge }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group relative
                ${
                  isActive
                    ? "sidebar-active text-white"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/4"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex-shrink-0">
                    <Icon
                      size={18}
                      className={isActive ? "text-[#D4AF37]" : ""}
                    />
                    {badge === "cart" && cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                        {cartCount > 9 ? "9+" : cartCount}
                      </span>
                    )}
                  </div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap font-medium overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-[#1e1e1e] rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 border border-white/10">
                      {label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-white/6">
          <div className="flex items-center gap-3 px-1 mb-2">
            <Link
              to="/cliente/configuracoes"
              className="flex items-center gap-3 flex-1 min-w-0 hover:bg-white/5 rounded-xl p-1 transition-colors"
            >
              <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user?.avatar}
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 overflow-hidden min-w-0"
                  >
                    <div className="text-sm font-medium text-white truncate">
                      {user?.name}
                    </div>
                    <div className="text-xs text-slate-500">Cliente</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm"
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-16 flex items-center justify-between px-6 border-b border-white/6 flex-shrink-0"
          style={{ background: "#0a0a0a" }}
        >
          <Link
            to="/cliente"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <img
              src={logoTextoAgah}
              alt="AGAH"
              className="h-4 w-auto object-contain"
            />
            <span className="text-slate-600 text-sm">/ Cliente</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {topNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-slate-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
              <Bell size={18} />
            </button>
            <NavLink
              to="/cliente/carrinho"
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
            <Link
              to="/cliente/configuracoes"
              className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              {user?.avatar}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
