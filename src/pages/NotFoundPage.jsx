import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#000000" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-bold font-display gradient-text mb-4">
          404
        </div>
        <h1 className="text-xl font-bold text-white mb-2">
          Página não encontrada
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
        >
          <Home size={16} /> Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
