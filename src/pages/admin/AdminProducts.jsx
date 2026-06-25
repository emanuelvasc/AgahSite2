import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Package,
  Tag,
  Layers,
  Edit2,
  Trash2,
  Filter,
} from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  StatusBadge,
  Modal,
  Input,
  Select,
  Card,
  Table,
  TableRow,
  TableCell,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

const categories = [
  "Todas",
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

export default function AdminProducts() {
  const { products } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  const margin = (p) => (((p.price - p.cost) / p.price) * 100).toFixed(0);

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle={`${products.length} produtos cadastrados`}
        actions={
          <>
            <Button variant="secondary" icon={Filter} size="sm">
              Filtros
            </Button>
            <Button icon={Plus} onClick={() => setShowModal(true)}>
              Novo Produto
            </Button>
          </>
        }
      />

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              category === cat
                ? "gradient-brand text-white"
                : "glass-light text-slate-400 hover:text-white border border-white/8"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="flex-1 max-w-sm"
        />
        <div className="flex glass-light rounded-xl border border-white/8 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-500"}`}
          >
            <Layers size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-500"}`}
          >
            <Tag size={14} />
          </button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-2xl overflow-hidden card-hover cursor-pointer"
              onClick={() => setSelected(product)}
            >
              {/* ✅ IMAGEM CORRIGIDA: object-contain + flex + padding */}
              <div className="h-48 relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-2">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg class="text-white/10" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                            <path d="M4 18l4-4 2 2 4-4 4 4"/>
                            <path d="M4 6h16"/>
                            <path d="M4 10h10"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package size={48} className="text-white/10" />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-mono bg-black/70 text-slate-300 px-2 py-0.5 rounded-md">
                    {product.code}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={product.status} />
                </div>
                {product.customizable && (
                  <div className="absolute bottom-3 right-3 text-[10px] bg-[#D4AF37]/80 text-black px-2 py-0.5 rounded-full font-semibold">
                    Custom
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="text-xs text-slate-500 mb-1">
                  {product.category}
                </div>
                <h3 className="text-sm font-semibold text-white mb-3 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-white">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${parseInt(margin(product)) >= 50 ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}
                  >
                    {margin(product)}% margem
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Layers size={11} /> {product.stock} un.
                  </span>
                  <span className="text-slate-600">{product.fabric}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl p-6">
          <Table
            headers={[
              "Produto",
              "Categoria",
              "Tecido",
              "Preço",
              "Custo",
              "Margem",
              "Estoque",
              "Status",
              "",
            ]}
          >
            {filtered.map((p, i) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* ✅ IMAGEM CORRIGIDA: object-contain + flex + padding na lista */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#0a0a0a] flex items-center justify-center p-1 flex-shrink-0">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentElement.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center">
                                <svg class="text-white/20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                                  <path d="M4 18l4-4 2 2 4-4 4 4"/>
                                  <path d="M4 6h16"/>
                                  <path d="M4 10h10"/>
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        {p.code}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-white/5 px-2 py-1 rounded-lg">
                    {p.category}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {p.fabric}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-white">
                    R$ {p.price.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500">
                  R$ {p.cost.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold ${parseInt(margin(p)) >= 50 ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    {margin(p)}%
                  </span>
                </TableCell>
                <TableCell>{p.stock} un.</TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Edit2}
                      onClick={() => setSelected(p)}
                    />
                    <Button variant="ghost" size="sm" icon={Trash2} />
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </Table>
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Produto"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              {/* ✅ IMAGEM CORRIGIDA: object-contain + flex + padding no modal */}
              <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-[#0a0a0a] flex items-center justify-center p-2">
                {selected.image ? (
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="text-white/20" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18"/>
                            <path d="M4 18l4-4 2 2 4-4 4 4"/>
                            <path d="M4 6h16"/>
                            <path d="M4 10h10"/>
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={32} className="text-white/20" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs font-mono text-[#D4AF37] mb-1">
                  {selected.code}
                </div>
                <h3 className="text-lg font-bold font-display text-white">
                  {selected.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <StatusBadge status={selected.status} />
                  {selected.customizable && (
                    <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/20 px-2 py-0.5 rounded-full font-semibold uppercase">
                      Personalizável
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-white">
                  R$ {selected.price.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Preço de Venda
                </div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-slate-400">
                  R$ {selected.cost.toFixed(2).replace(".", ",")}
                </div>
                <div className="text-xs text-slate-500 mt-1">Custo</div>
              </div>
              <div className="glass-light rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-emerald-400">
                  {margin(selected)}%
                </div>
                <div className="text-xs text-slate-500 mt-1">Margem</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass-light rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Categoria</div>
                <div className="text-white">{selected.category}</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Tecido</div>
                <div className="text-white">{selected.fabric}</div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Estoque</div>
                <div className="text-white font-semibold">
                  {selected.stock} unidades
                </div>
              </div>
              <div className="glass-light rounded-xl p-3">
                <div className="text-xs text-slate-500 mb-1">Tamanhos</div>
                <div className="flex gap-1 flex-wrap">
                  {selected.sizes.map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-white/8 px-1.5 py-0.5 rounded text-white"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-light rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-2">
                Cores disponíveis
              </div>
              <div className="flex gap-2 flex-wrap">
                {selected.colors.map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-slate-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelected(null)}
                className="flex-1"
              >
                Fechar
              </Button>
              <Button className="flex-1" icon={Edit2}>
                Editar Produto
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Produto"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nome do produto"
              placeholder="Ex: Camisa Manga Curta"
              required
              className="col-span-2"
            />
            <Input label="Código" placeholder="AGH-000" required />
            <Input label="Categoria" placeholder="Camisas" />
            <Input
              label="Tecido"
              placeholder="Dry Fit 100% Poliéster"
              className="col-span-2"
            />
            <Input
              label="Preço de Venda"
              type="number"
              placeholder="89.90"
              required
            />
            <Input label="Custo" type="number" placeholder="32.00" required />
            <Input label="Estoque inicial" type="number" placeholder="0" />
            <Input
              label="Tamanhos (sep. por vírgula)"
              placeholder="PP,P,M,G,GG"
            />
            <Input
              label="URL da Imagem"
              placeholder="https://exemplo.com/imagem.jpg"
              className="col-span-2"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button className="flex-1">Criar Produto</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
