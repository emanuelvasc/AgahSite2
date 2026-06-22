import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Star,
  Filter,
  Search,
  Check,
  ArrowLeft,
  X,
  Zap,
} from "lucide-react";
import { SearchInput, Button, Card } from "../../components/ui";
import { useApp } from "../../context/AppContext";
import { products as allProducts } from "../../data/mockData";

const categories = [
  "Todos",
  "Camisas",
  "Regatas",
  "Uniformes",
  "Shorts",
  "Calças",
  "Leggings",
  "Jaquetas",
  "Moletons",
  "Bermudas",
  "Acessórios",
];

function ProductCard({ product, onClick }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useApp();

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1, product.sizes[0], product.colors[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass rounded-2xl overflow-hidden card-hover cursor-pointer group"
      onClick={() => onClick(product)}
    >
      {/* Image */}
      <div
        className="h-44 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Package
            size={48}
            className="text-white/8 group-hover:text-white/12 transition-colors"
          />
        </div>
        {product.customizable && (
          <div className="absolute top-3 left-3 text-[10px] bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-1 rounded-full font-semibold uppercase backdrop-blur-sm">
            ✦ Custom
          </div>
        )}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 glass rounded-full px-2 py-1">
            <Star size={10} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-white font-semibold">
              4.{8 - (product.id % 3)}
            </span>
          </div>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-4">
        <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
          {product.category}
        </div>
        <h3 className="text-sm font-semibold text-white mb-2 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c}
                className="text-[10px] bg-white/6 text-slate-400 px-1.5 py-0.5 rounded"
              >
                {c}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-slate-600">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-white">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-[10px] text-slate-600">
              ou 3x R$ {(product.price / 3).toFixed(2).replace(".", ",")}
            </div>
          </div>
          <button
            onClick={handleAdd}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              added
                ? "bg-emerald-500/20 text-emerald-400"
                : "gradient-brand text-white hover:opacity-90"
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductDetailModal({ product, onClose }) {
  const { addToCart } = useApp();
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, qty, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col xl:flex-row">
          {/* Image */}
          <div
            className="xl:w-64 h-64 xl:h-auto flex-shrink-0 flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
            }}
          >
            <Package size={64} className="text-white/10" />
            {product.customizable && (
              <div className="absolute bottom-4 left-4 text-xs bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 rounded-full font-semibold">
                ✦ Personalizável
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 p-6">
            <div className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
              {product.category} • {product.code}
            </div>
            <h2 className="text-xl font-bold font-display text-white mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">
                4.8 (24 avaliações)
              </span>
            </div>

            <div className="text-2xl font-bold text-white mb-1">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </div>
            <div className="text-xs text-slate-500 mb-5">
              ou 3x de R$ {(product.price / 3).toFixed(2).replace(".", ",")} sem
              juros
            </div>

            {/* Sizes */}
            <div className="mb-4">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Tamanho
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedSize === s
                        ? "gradient-brand text-white"
                        : "glass-light text-slate-400 border border-white/8 hover:border-white/20"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-5">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Cor:{" "}
                <span className="text-white normal-case">{selectedColor}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedColor === c
                        ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37] border"
                        : "glass-light text-slate-400 border border-white/8 hover:border-white/20"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Qtd.
              </div>
              <div className="flex items-center gap-2 glass-light rounded-xl border border-white/8 px-3 py-1.5">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-slate-400 hover:text-white transition-colors w-5 text-center"
                >
                  −
                </button>
                <span className="text-white font-semibold w-6 text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="text-slate-400 hover:text-white transition-colors w-5 text-center"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-600 mb-4">
              Tecido: {product.fabric} • Estoque: {product.stock} un.
            </div>

            <button
              onClick={handleAdd}
              className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                added
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "gradient-brand text-white hover:opacity-90 glow-brand-sm"
              }`}
            >
              {added ? (
                <>
                  <Check size={16} /> Adicionado ao carrinho!
                </>
              ) : (
                <>
                  <ShoppingCart size={16} /> Adicionar ao Carrinho
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClientProducts() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selected, setSelected] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  const filtered = allProducts
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || p.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-white">
          Catálogo de Produtos
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Confecção esportiva premium — {allProducts.length} produtos
          disponíveis
        </p>
      </div>

      {/* Categories */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? "gradient-brand text-white"
                : "glass-light text-slate-400 border border-white/8 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="flex-1 max-w-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-light border border-white/10 rounded-xl text-sm text-slate-300 px-3 py-2.5 transition-colors"
          style={{ background: "#0a0a0a" }}
        >
          <option value="name">Nome A-Z</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
        </select>
        <span className="text-xs text-slate-600">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category + search}
          className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onClick={setSelected} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Package size={40} className="text-slate-700 mx-auto mb-4" />
          <div className="text-white font-semibold mb-2">
            Nenhum produto encontrado
          </div>
          <div className="text-sm text-slate-500">
            Tente outra busca ou categoria
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <ProductDetailModal
            product={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
