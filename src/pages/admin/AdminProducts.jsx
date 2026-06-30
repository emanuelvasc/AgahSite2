import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Package,
  Tag,
  Layers,
  Edit2,
  Trash2,
  Filter,
  X,
  Check,
  Search,
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

// CATEGORIAS ATUALIZADAS
const categories = ["Todas", "Camisas", "Uniformes", "Shorts", "Kits"];

const statusOptions = ["Ativo", "Inativo", "Em produção"];

export default function AdminProducts() {
  const { products, addProduct, deleteProduct, updateProduct } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [viewMode, setViewMode] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Estado para novo produto
  const [newProduct, setNewProduct] = useState({
    name: "",
    code: "",
    category: "Camisas",
    fabric: "",
    price: "",
    cost: "",
    stock: "",
    sizes: "",
    colors: "",
    image: "",
    customizable: false,
    status: "Ativo",
  });

  // Estado para edição de produto
  const [editingProduct, setEditingProduct] = useState({
    id: null,
    name: "",
    code: "",
    category: "Camisas",
    fabric: "",
    price: "",
    cost: "",
    stock: "",
    sizes: "",
    colors: "",
    image: "",
    customizable: false,
    status: "Ativo",
  });

  // Filtrar produtos
  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Todas" || p.category === category;
    return matchSearch && matchCat;
  });

  const margin = (p) => {
    if (!p.cost || p.cost === 0) return "0";
    return (((p.price - p.cost) / p.price) * 100).toFixed(0);
  };

  // ─── FUNÇÕES DE FORMULÁRIO ──────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (validationError) setValidationError("");
    if (successMessage) setSuccessMessage("");
  };

  // ─── CRIAR PRODUTO ──────────────────────────────────────
  const handleCreateProduct = () => {
    if (!newProduct.name.trim()) {
      setValidationError("⚠️ O campo Nome é obrigatório.");
      return;
    }
    if (!newProduct.code.trim()) {
      setValidationError("⚠️ O campo Código é obrigatório.");
      return;
    }
    if (!newProduct.price || parseFloat(newProduct.price) <= 0) {
      setValidationError(
        "⚠️ O campo Preço de Venda é obrigatório e deve ser maior que 0.",
      );
      return;
    }
    if (!newProduct.cost || parseFloat(newProduct.cost) <= 0) {
      setValidationError(
        "⚠️ O campo Custo é obrigatório e deve ser maior que 0.",
      );
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
      const productToAdd = {
        id: maxId + 1,
        name: newProduct.name.trim(),
        code: newProduct.code.trim().toUpperCase(),
        category: newProduct.category,
        fabric: newProduct.fabric || "Dry Fit",
        price: parseFloat(newProduct.price),
        cost: parseFloat(newProduct.cost),
        stock: parseInt(newProduct.stock) || 0,
        sizes: newProduct.sizes.split(",").map((s) => s.trim()),
        colors: newProduct.colors.split(",").map((c) => c.trim()),
        image: newProduct.image || null,
        customizable: newProduct.customizable,
        status: newProduct.status,
      };

      addProduct(productToAdd);

      setNewProduct({
        name: "",
        code: "",
        category: "Camisas",
        fabric: "",
        price: "",
        cost: "",
        stock: "",
        sizes: "",
        colors: "",
        image: "",
        customizable: false,
        status: "Ativo",
      });
      setValidationError("");
      setSuccessMessage("✅ Produto criado com sucesso!");
      setIsSaving(false);

      setTimeout(() => {
        setShowModal(false);
        setSuccessMessage("");
      }, 1000);
    }, 500);
  };

  // ─── EDIÇÃO DE PRODUTO ──────────────────────────────────
  const handleEditProduct = (product) => {
    setEditingProduct({
      id: product.id,
      name: product.name,
      code: product.code,
      category: product.category,
      fabric: product.fabric || "",
      price: product.price.toString(),
      cost: product.cost ? product.cost.toString() : "",
      stock: product.stock.toString(),
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
      colors: Array.isArray(product.colors) ? product.colors.join(", ") : "",
      image: product.image || "",
      customizable: product.customizable || false,
      status: product.status || "Ativo",
    });
    setShowEditModal(true);
    setValidationError("");
    setSuccessMessage("");
  };

  const handleSaveEdit = () => {
    if (!editingProduct.name.trim()) {
      setValidationError("⚠️ O campo Nome é obrigatório.");
      return;
    }
    if (!editingProduct.code.trim()) {
      setValidationError("⚠️ O campo Código é obrigatório.");
      return;
    }
    if (!editingProduct.price || parseFloat(editingProduct.price) <= 0) {
      setValidationError(
        "⚠️ O campo Preço de Venda é obrigatório e deve ser maior que 0.",
      );
      return;
    }
    if (!editingProduct.cost || parseFloat(editingProduct.cost) <= 0) {
      setValidationError(
        "⚠️ O campo Custo é obrigatório e deve ser maior que 0.",
      );
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      const updatedProduct = {
        name: editingProduct.name.trim(),
        code: editingProduct.code.trim().toUpperCase(),
        category: editingProduct.category,
        fabric: editingProduct.fabric || "Dry Fit",
        price: parseFloat(editingProduct.price),
        cost: parseFloat(editingProduct.cost),
        stock: parseInt(editingProduct.stock) || 0,
        sizes: editingProduct.sizes.split(",").map((s) => s.trim()),
        colors: editingProduct.colors.split(",").map((c) => c.trim()),
        image: editingProduct.image || null,
        customizable: editingProduct.customizable,
        status: editingProduct.status,
      };

      updateProduct(editingProduct.id, updatedProduct);

      if (selected && selected.id === editingProduct.id) {
        setSelected({ ...selected, ...updatedProduct });
      }

      setValidationError("");
      setSuccessMessage("✅ Produto atualizado com sucesso!");
      setIsSaving(false);

      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage("");
        setEditingProduct({
          id: null,
          name: "",
          code: "",
          category: "Camisas",
          fabric: "",
          price: "",
          cost: "",
          stock: "",
          sizes: "",
          colors: "",
          image: "",
          customizable: false,
          status: "Ativo",
        });
      }, 1000);
    }, 500);
  };

  // ─── EXCLUIR PRODUTO ────────────────────────────────────
  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      setShowDeleteConfirm(false);
      if (selected && selected.id === productToDelete.id) {
        setSelected(null);
      }
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  // ─── FILTRO ─────────────────────────────────────────────
  const handleCategoryFilter = (cat) => {
    setCategory(cat);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("Todas");
  };

  return (
    <div>
      <PageHeader
        title="Produtos"
        subtitle={`${products.length} produtos cadastrados`}
        actions={
          <>
            <Button
              variant="secondary"
              icon={Filter}
              size="sm"
              onClick={clearFilters}
            >
              Limpar Filtros
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
            onClick={() => handleCategoryFilter(cat)}
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
          placeholder="Buscar produto por nome ou código..."
          className="flex-1 max-w-sm"
        />
        <div className="flex glass-light rounded-xl border border-white/8 p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-white/10 text-white" : "text-slate-500"
            }`}
          >
            <Layers size={14} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-white/10 text-white" : "text-slate-500"
            }`}
          >
            <Tag size={14} />
          </button>
        </div>
        <span className="text-xs text-slate-600">
          {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
        </span>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(p);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProduct(p);
                      }}
                    />
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </Table>
        </div>
      )}

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

      {/* ─── MODAL DE DETALHES DO PRODUTO ─────────────────── */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Detalhes do Produto"
        size="lg"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
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
                <div>
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
              {/* ✅ Botão Excluir no modal de detalhes */}
              <button
                onClick={() => {
                  const productToDelete = selected;
                  setSelected(null);
                  handleDeleteProduct(productToDelete);
                }}
                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors flex-shrink-0"
                title="Excluir produto"
              >
                <Trash2 size={18} />
              </button>
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
                  {Array.isArray(selected.sizes) &&
                    selected.sizes.map((s) => (
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
                {Array.isArray(selected.colors) &&
                  selected.colors.map((c) => (
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
              <Button
                className="flex-1"
                icon={Edit2}
                onClick={() => {
                  const product = selected;
                  setSelected(null);
                  handleEditProduct(product);
                }}
              >
                Editar Produto
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ─── MODAL DE CRIAÇÃO DE PRODUTO ──────────────────── */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setNewProduct({
            name: "",
            code: "",
            category: "Camisas",
            fabric: "",
            price: "",
            cost: "",
            stock: "",
            sizes: "",
            colors: "",
            image: "",
            customizable: false,
            status: "Ativo",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Novo Produto"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Nome do produto *
              </label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
                placeholder="Ex: Camisa Manga Curta"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Código *
              </label>
              <input
                type="text"
                name="code"
                value={newProduct.code}
                onChange={handleInputChange}
                placeholder="AGH-000"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Categoria
              </label>
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
              >
                {categories
                  .filter((c) => c !== "Todas")
                  .map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0a0a0a]">
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Tecido
              </label>
              <input
                type="text"
                name="fabric"
                value={newProduct.fabric}
                onChange={handleInputChange}
                placeholder="Dry Fit 100% Poliéster"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Preço de Venda *
              </label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                placeholder="89.90"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Custo *
              </label>
              <input
                type="number"
                name="cost"
                value={newProduct.cost}
                onChange={handleInputChange}
                placeholder="32.00"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Estoque inicial
              </label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleInputChange}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Tamanhos (sep. por vírgula)
              </label>
              <input
                type="text"
                name="sizes"
                value={newProduct.sizes}
                onChange={handleInputChange}
                placeholder="PP,P,M,G,GG"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Cores (sep. por vírgula)
              </label>
              <input
                type="text"
                name="colors"
                value={newProduct.colors}
                onChange={handleInputChange}
                placeholder="Branco, Preto, Azul"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                URL da Imagem
              </label>
              <input
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Personalizável
              </label>
              <input
                type="checkbox"
                name="customizable"
                checked={newProduct.customizable}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]/50"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={newProduct.status}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="bg-[#0a0a0a]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {validationError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                setNewProduct({
                  name: "",
                  code: "",
                  category: "Camisas",
                  fabric: "",
                  price: "",
                  cost: "",
                  stock: "",
                  sizes: "",
                  colors: "",
                  image: "",
                  customizable: false,
                  status: "Ativo",
                });
                setValidationError("");
                setSuccessMessage("");
              }}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateProduct}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Criar Produto"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE EDIÇÃO DE PRODUTO ───────────────────── */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct({
            id: null,
            name: "",
            code: "",
            category: "Camisas",
            fabric: "",
            price: "",
            cost: "",
            stock: "",
            sizes: "",
            colors: "",
            image: "",
            customizable: false,
            status: "Ativo",
          });
          setValidationError("");
          setSuccessMessage("");
        }}
        title="Editar Produto"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Nome do produto *
              </label>
              <input
                type="text"
                name="name"
                value={editingProduct.name}
                onChange={handleEditInputChange}
                placeholder="Ex: Camisa Manga Curta"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Código *
              </label>
              <input
                type="text"
                name="code"
                value={editingProduct.code}
                onChange={handleEditInputChange}
                placeholder="AGH-000"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Categoria
              </label>
              <select
                name="category"
                value={editingProduct.category}
                onChange={handleEditInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
              >
                {categories
                  .filter((c) => c !== "Todas")
                  .map((cat) => (
                    <option key={cat} value={cat} className="bg-[#0a0a0a]">
                      {cat}
                    </option>
                  ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Tecido
              </label>
              <input
                type="text"
                name="fabric"
                value={editingProduct.fabric}
                onChange={handleEditInputChange}
                placeholder="Dry Fit 100% Poliéster"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Preço de Venda *
              </label>
              <input
                type="number"
                name="price"
                value={editingProduct.price}
                onChange={handleEditInputChange}
                placeholder="89.90"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Custo *
              </label>
              <input
                type="number"
                name="cost"
                value={editingProduct.cost}
                onChange={handleEditInputChange}
                placeholder="32.00"
                step="0.01"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Estoque
              </label>
              <input
                type="number"
                name="stock"
                value={editingProduct.stock}
                onChange={handleEditInputChange}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Tamanhos (sep. por vírgula)
              </label>
              <input
                type="text"
                name="sizes"
                value={editingProduct.sizes}
                onChange={handleEditInputChange}
                placeholder="PP,P,M,G,GG"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Cores (sep. por vírgula)
              </label>
              <input
                type="text"
                name="colors"
                value={editingProduct.colors}
                onChange={handleEditInputChange}
                placeholder="Branco, Preto, Azul"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                URL da Imagem
              </label>
              <input
                type="text"
                name="image"
                value={editingProduct.image}
                onChange={handleEditInputChange}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors outline-none"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Personalizável
              </label>
              <input
                type="checkbox"
                name="customizable"
                checked={editingProduct.customizable}
                onChange={handleEditInputChange}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#D4AF37] focus:ring-[#D4AF37]/50"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={editingProduct.status}
                onChange={handleEditInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm px-4 py-3 focus:border-[#D4AF37]/50 transition-colors outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s} className="bg-[#0a0a0a]">
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {validationError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2">
              <X size={16} className="text-red-400 flex-shrink-0" />
              <span className="text-sm text-red-400">{validationError}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2">
              <Check size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-emerald-400">{successMessage}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditingProduct({
                  id: null,
                  name: "",
                  code: "",
                  category: "Camisas",
                  fabric: "",
                  price: "",
                  cost: "",
                  stock: "",
                  sizes: "",
                  colors: "",
                  image: "",
                  customizable: false,
                  status: "Ativo",
                });
                setValidationError("");
                setSuccessMessage("");
              }}
              className="flex-1"
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="flex-1"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                "Atualizar Produto"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ─── MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ────────────── */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        title="Confirmar Exclusão"
        size="sm"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tem certeza?
            </h3>
            <p className="text-sm text-slate-400">
              Você está prestes a excluir o produto <br />
              <span className="text-white font-semibold">
                "{productToDelete?.name}"
              </span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={cancelDelete}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
