import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import logoTextoAgah from "../../assets/agah-escrito.jpg";

const NAV_LINKS = [
  { label: "Início", href: "#home" },
  { label: "Produtos", href: "#produtos" },
  { label: "Eventos", href: "#eventos" },
  { label: "Diferenciais", href: "#diferenciais" },
  { label: "Contato", href: "#contato" },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  if (typeof window !== "undefined") {
    window.onscroll = () => setScrolled(window.scrollY > 20);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-white/8" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#home" className="flex items-center">
          <img
            src={logoTextoAgah}
            alt="AGAH"
            className="h-8 w-auto object-contain"
          />
        </a>

        <nav className="hidden xl:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate("/registrar")}
            className="inline-flex items-center gap-2 gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-brand-sm hover:opacity-90 transition-all"
          >
            Cadastrar <ArrowRight size={14} />
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="xl:hidden text-white p-2"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden glass border-t border-white/8 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-slate-300 py-2"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => navigate("/login")}
                className="mt-2 gradient-brand text-white text-sm font-semibold px-5 py-3 rounded-xl text-center"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/registrar")}
                className="gradient-brand text-white text-sm font-semibold px-5 py-3 rounded-xl text-center"
              >
                Cadastrar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
