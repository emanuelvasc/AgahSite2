import { motion } from "framer-motion";
import { statusConfig } from "../../data/mockData";

// ─── STATUS BADGE ──────────────────────────────────────────
export function StatusBadge({ status }) {
  const cfg = statusConfig[status] || {
    color: "bg-slate-500/15 text-slate-400",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

// ─── CARD ──────────────────────────────────────────────────
export function Card({ children, className = "", hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-6 ${hover ? "card-hover cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────
export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  accent = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 card-hover relative overflow-hidden ${accent ? "border border-[#D4AF37]/20" : ""}`}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`p-2.5 rounded-xl ${accent ? "bg-[#D4AF37]/20" : "bg-white/5"}`}
        >
          <Icon
            size={20}
            className={accent ? "text-[#D4AF37]" : "text-slate-400"}
          />
        </div>
        {trendValue !== undefined && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-lg ${Number(trendValue) >= 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}
          >
            {Number(trendValue) >= 0 ? "+" : ""}
            {trendValue}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold font-display text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-400">{title}</div>
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
}

// ─── BUTTON ────────────────────────────────────────────────
export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  disabled,
  type = "button",
  icon: Icon,
}) {
  const variants = {
    primary:
      "gradient-brand text-white font-semibold glow-brand-sm hover:opacity-90 active:opacity-80",
    secondary:
      "glass-light text-white border border-white/10 hover:border-white/20 hover:bg-white/8",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger:
      "bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25",
    outline: "border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

// ─── INPUT ─────────────────────────────────────────────────
export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  className = "",
  required,
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
          {required && <span className="text-[#D4AF37] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-slate-600 focus:border-[#D4AF37]/50 focus:bg-white/7 transition-colors ${Icon ? "pl-9 pr-4" : "px-4"} py-2.5`}
        />
      </div>
    </div>
  );
}

// ─── SELECT ────────────────────────────────────────────────
export function Select({ label, value, onChange, options, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#141414] border border-white/10 rounded-xl text-white text-sm px-4 py-2.5 focus:border-[#D4AF37]/50 transition-colors appearance-none"
        style={{ background: "#141414" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── MODAL ─────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`relative w-full ${sizes[size]} glass rounded-2xl border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/8">
          <h2 className="text-lg font-semibold font-display text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── SEARCH INPUT ──────────────────────────────────────────
export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-slate-600 pl-9 pr-4 py-2.5 focus:border-[#D4AF37]/40 transition-colors"
      />
    </div>
  );
}

// ─── TABLE ─────────────────────────────────────────────────
export function Table({ headers, children, className = "" }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/8">
            {headers.map((h) => (
              <th
                key={h}
                className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function TableRow({ children, onClick, className = "" }) {
  return (
    <tr
      onClick={onClick}
      className={`border-b border-white/5 hover:bg-white/3 transition-colors ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = "" }) {
  return (
    <td className={`py-3.5 pr-4 text-slate-300 ${className}`}>{children}</td>
  );
}

// ─── EMPTY STATE ───────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-white/5 rounded-2xl mb-4">
        <Icon size={32} className="text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  );
}

// ─── PAGE HEADER ───────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold font-display text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

// ─── MINI CHART BAR ────────────────────────────────────────
export function MiniBarChart({ data, color = "#D4AF37" }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all"
          style={{
            height: `${(d.value / max) * 100}%`,
            background: color,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  );
}

// ─── AVATAR ────────────────────────────────────────────────
export function Avatar({ name, size = "sm" }) {
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  return (
    <div
      className={`${sizes[size]} rounded-full gradient-brand flex items-center justify-center font-bold text-white flex-shrink-0`}
    >
      {initials}
    </div>
  );
}
