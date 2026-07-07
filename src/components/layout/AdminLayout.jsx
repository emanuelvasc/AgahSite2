import { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Package,
  Boxes,
  ShoppingBag,
  ClipboardList,
  Factory,
  Truck,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Trophy,
  ClipboardCheck,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import logoTextoAgah from "../../assets/agah-escrito.jpg";
import { NotificationBell } from "../../components/ui/NotificationBell";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/estoque", label: "Estoque", icon: Boxes },
  { to: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { to: "/admin/encomendas", label: "Encomendas", icon: ClipboardList },
  { to: "/admin/eventos", label: "Corridas e Eventos", icon: Trophy },
  { to: "/admin/inscricoes", label: "Inscrições", icon: ClipboardCheck },
  { to: "/admin/producao", label: "Produção", icon: Factory },
  { to: "/admin/fornecedores", label: "Fornecedores", icon: Truck },
  { to: "/admin/relatorios", label: "Relatórios", icon: BarChart3 },
  { to: "/admin/atendimento", label: "Atendimento", icon: MessageSquare },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

const topNavLinks = [
  { label: "Início", href: "/admin" },
  { label: "Produtos", href: "/admin/produtos" },
  { label: "Eventos", href: "/admin/eventos" },
  { label: "Contato", href: "/admin/atendimento" },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ✅ Fecha o sidebar em mobile automaticamente
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Sidebar - Responsivo */}
      <motion.aside
        animate={{
          width: collapsed ? 68 : 240,
          transform: mobileMenuOpen ? "translateX(0)" : "translateX(0)",
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`flex flex-col h-full flex-shrink-0 relative z-20 ${
          mobileMenuOpen
            ? "fixed inset-y-0 left-0 w-64 shadow-2xl"
            : "hidden md:flex"
        }`}
        style={{
          background: "#0a0a0a",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Overlay para mobile */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <div className="relative z-20 flex flex-col h-full">
          <div className="flex items-center h-16 px-4 border-b border-white/6">
            <Link to="/admin" className="flex items-center overflow-hidden">
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
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileMenuOpen(false);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              className="ml-auto p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors flex-shrink-0"
            >
              {collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>

          {!collapsed && (
            <div className="px-4 pt-3 pb-1">
              <span className="text-[10px] font-semibold text-[#D4AF37]/70 uppercase tracking-widest">
                Painel Admin
              </span>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => {
                  if (window.innerWidth < 768) setMobileMenuOpen(false);
                }}
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
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-[#D4AF37] flex-shrink-0"
                          : "flex-shrink-0"
                      }
                    />
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
                to="/admin/configuracoes"
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
                      <div className="text-xs text-slate-500">
                        Administrador
                      </div>
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
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/6 flex-shrink-0"
          style={{ background: "#0a0a0a" }}
        >
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity md:flex"
          >
            <img
              src={logoTextoAgah}
              alt="AGAH"
              className="h-4 w-auto object-contain"
            />
            <span className="text-slate-600 text-sm hidden sm:inline">
              / Admin
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />
            <Link
              to="/admin/configuracoes"
              className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity cursor-pointer"
            >
              {user?.avatar}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
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
