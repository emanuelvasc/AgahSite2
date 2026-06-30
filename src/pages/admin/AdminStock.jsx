import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  TrendingDown,
  Package,
  RefreshCw,
  Plus,
  Minus,
  Trash2,
  Save,
  X,
  Check,
} from "lucide-react";
import {
  PageHeader,
  SearchInput,
  Button,
  Card,
  Table,
  TableRow,
  TableCell,
  Modal,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function AdminStock() {
  const { products, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingStock, setEditingStock] = useState(null);
  const [tempQuantity, setTempQuantity] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    if (filter === "baixo") return matchSearch && p.stock <= 50;
    if (filter === "critico") return matchSearch && p.stock <= 20;
    return matchSearch;
  });

  const totalItems = products.reduce((a, p) => a + p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 50).length;
  const critical = products.filter((p) => p.stock <= 20).length;
  const totalValue = products.reduce((a, p) => a + p.stock * p.cost, 0);

  const stockColor = (qty) => {
    if (qty <= 20) return "text-red-400";
    if (qty <= 50) return "text-amber-400";
    return "text-emerald-400";
  };
  const stockBg = (qty) => {
    if (qty <= 20) return "bg-red-500/15";
    if (qty <= 50) return "bg-amber-500/15";
    return "bg-emerald-500/15";
  };

  // ─── FUNÇÕES DE ESTOQUE ──────────────────────────────────
  const handleOpenEdit = (product) => {
    setEditingStock(product.id);
    setTempQuantity(product.stock);
    setSuccessMessage("");
  };

  const handleSaveStock = (product) => {
    setIsSaving(true);
    setTimeout(() => {
      updateProduct(product.id, { stock: tempQuantity });
      setEditingStock(null);
      setIsSaving(false);
      setSuccessMessage("✅ Estoque atualizado com sucesso!");
      setTimeout(() => setSuccessMessage(""), 3000);
    }, 500);
  };

  const handleCancelEdit = () => {
    setEditingStock(null);
    setTempQuantity(0);
  };

  const handleQuantityChange = (product, delta) => {
    const newQty = Math.max(0, tempQuantity + delta);
    setTempQuantity(newQty);
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
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Estoque"
        subtitle="Controle de inventário por produto"
        actions={
          <Button
            icon={RefreshCw}
            variant="secondary"
            onClick={() => window.location.reload()}
          >
            Atualizar
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-white mb-1">
            {totalItems.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Total de Unidades</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-amber-400 mb-1">
            {lowStock}
          </div>
          <div className="text-xs text-slate-500">Estoque Baixo (≤50)</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-red-400 mb-1">
            {critical}
          </div>
          <div className="text-xs text-slate-500">Estoque Crítico (≤20)</div>
        </Card>
        <Card className="py-4">
          <div className="text-2xl font-bold font-display text-[#D4AF37] mb-1">
            R$ {(totalValue / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-slate-500">Valor em Estoque</div>
        </Card>
      </div>

      {/* Alerts */}
      {critical > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-red-500/8 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-semibold text-red-300">
              {critical} produto{critical > 1 ? "s" : ""} com estoque crítico
            </div>
            <div className="text-xs text-red-400/70 mt-0.5">
              Providencie reposição urgente dos itens abaixo
            </div>
          </div>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
          <Check size={16} className="text-emerald-400 flex-shrink-0" />
          <span className="text-sm text-emerald-400">{successMessage}</span>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {[
          ["todos", "Todos"],
          ["baixo", "Estoque Baixo"],
          ["critico", "Crítico"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === val
                ? "gradient-brand text-white"
                : "glass-light text-slate-400 border border-white/8"
            }`}
          >
            {label}
          </button>
        ))}
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="ml-auto w-64"
        />
      </div>

      <div className="glass rounded-2xl p-6">
        <Table
          headers={[
            "Produto",
            "Código",
            "Categoria",
            "Estoque",
            "Valor Unitário",
            "Valor Total",
            "Status",
            "Ações",
          ]}
        >
          {filtered.map((p, i) => {
            const isEditing = editingStock === p.id;
            return (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 hover:bg-white/3 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Package size={14} className="text-slate-500" />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {p.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-xs text-[#D4AF37]">
                    {p.code}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs bg-white/5 px-2 py-1 rounded-lg text-slate-400">
                    {p.category}
                  </span>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(p, -1)}
                        className="p-1 rounded-lg glass-light text-slate-400 hover:text-white transition-colors"
                        disabled={tempQuantity <= 0}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={tempQuantity}
                        onChange={(e) =>
                          setTempQuantity(
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="w-16 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center px-2 py-1 focus:border-[#D4AF37]/50 transition-colors outline-none"
                        min="0"
                      />
                      <button
                        onClick={() => handleQuantityChange(p, 1)}
                        className="p-1 rounded-lg glass-light text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold text-sm ${stockColor(p.stock)}`}
                      >
                        {p.stock}
                      </span>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full w-16 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((p.stock / 200) * 100, 100)}%`,
                            background:
                              p.stock <= 20
                                ? "#ef4444"
                                : p.stock <= 50
                                  ? "#f59e0b"
                                  : "#10b981",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-slate-400">
                  R$ {p.cost.toFixed(2)}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-white">
                    R${" "}
                    {(p.stock * p.cost).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-lg ${stockBg(p.stock)} ${stockColor(p.stock)}`}
                  >
                    {p.stock <= 20
                      ? "Crítico"
                      : p.stock <= 50
                        ? "Baixo"
                        : "Normal"}
                  </span>
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveStock(p)}
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                        disabled={isSaving}
                        title="Salvar"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                        title="Editar estoque"
                      >
                        <Plus size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Excluir produto"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </TableCell>
              </motion.tr>
            );
          })}
        </Table>
      </div>

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
