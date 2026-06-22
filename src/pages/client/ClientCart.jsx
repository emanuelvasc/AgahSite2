import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Package,
  ArrowRight,
  Tag,
  Check,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui";

export default function ClientCart() {
  const { cart, removeFromCart, updateCartQty, cartTotal, clearCart } =
    useApp();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const navigate = useNavigate();

  const shipping = cartTotal > 300 ? 0 : 29.9;
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const total = cartTotal - discount + shipping;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "AGAH10") setCouponApplied(true);
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    await new Promise((r) => setTimeout(r, 1800));
    setOrdered(true);
    clearCart();
    setTimeout(() => navigate("/cliente/pedidos"), 2000);
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mb-6"
        >
          <Check size={40} className="text-emerald-400" />
        </motion.div>
        <h2 className="text-2xl font-bold font-display text-white mb-2">
          Pedido Realizado!
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Seu pedido foi confirmado. Redirecionando para seus pedidos...
        </p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold font-display text-white mb-8">
          Carrinho
        </h1>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-5">
            <ShoppingCart size={32} className="text-slate-600" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            Adicione produtos do catálogo para começar suas compras.
          </p>
          <Link
            to="/cliente/produtos"
            className="inline-flex items-center gap-2 gradient-brand text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all"
          >
            Ver Produtos <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Carrinho
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {cart.length} item{cart.length > 1 ? "s" : ""} selecionado
            {cart.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/8"
        >
          Limpar carrinho
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Items */}
        <div className="xl:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.key}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30, height: 0 }}
                className="glass rounded-2xl p-4 flex items-center gap-4"
              >
                {/* Product image */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #0a0a0a, #1a1a1a)",
                  }}
                >
                  <Package size={24} className="text-white/20" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white mb-1 truncate">
                    {item.product.name}
                  </h3>
                  <div className="flex gap-2 text-xs text-slate-500">
                    <span>
                      Tam: <span className="text-slate-300">{item.size}</span>
                    </span>
                    <span>•</span>
                    <span>
                      Cor: <span className="text-slate-300">{item.color}</span>
                    </span>
                  </div>
                  <div className="mt-2 font-bold text-[#D4AF37]">
                    R$ {item.product.price.toFixed(2).replace(".", ",")}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2 glass-light rounded-xl border border-white/8 px-3 py-1.5 flex-shrink-0">
                  <button
                    onClick={() =>
                      item.qty === 1
                        ? removeFromCart(item.key)
                        : updateCartQty(item.key, item.qty - 1)
                    }
                    className="text-slate-400 hover:text-white transition-colors w-5 text-center"
                  >
                    −
                  </button>
                  <span className="text-white font-semibold w-6 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.key, item.qty + 1)}
                    className="text-slate-400 hover:text-white transition-colors w-5 text-center"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-white">
                    R${" "}
                    {(item.product.price * item.qty)
                      .toFixed(2)
                      .replace(".", ",")}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.key)}
                    className="mt-1 text-slate-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Continue shopping */}
          <Link
            to="/cliente/produtos"
            className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#e8c970] transition-colors pt-2 px-1"
          >
            ← Continuar comprando
          </Link>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={14} className="text-[#D4AF37]" />
              <span className="text-sm font-semibold text-white">
                Cupom de Desconto
              </span>
            </div>
            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="AGAH10"
                disabled={couponApplied}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors disabled:opacity-50"
              />
              <Button
                size="sm"
                onClick={handleCoupon}
                disabled={couponApplied}
                variant={couponApplied ? "secondary" : "primary"}
              >
                {couponApplied ? <Check size={14} /> : "Aplicar"}
              </Button>
            </div>
            {couponApplied && (
              <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                <Check size={11} /> 10% de desconto aplicado!
              </div>
            )}
            {!couponApplied && (
              <div className="mt-2 text-xs text-slate-600">
                Use o cupom AGAH10 para 10% de desconto
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">
              Resumo do Pedido
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>R$ {cartTotal.toFixed(2).replace(".", ",")}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-emerald-400">
                  <span>Desconto (10%)</span>
                  <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Frete</span>
                <span
                  className={
                    shipping === 0 ? "text-emerald-400 font-semibold" : ""
                  }
                >
                  {shipping === 0
                    ? "Grátis"
                    : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
              {shipping === 0 && (
                <div className="text-xs text-emerald-400/70">
                  ✓ Frete grátis para pedidos acima de R$ 300
                </div>
              )}
              <div className="h-px bg-white/8" />
              <div className="flex justify-between font-bold text-white text-base">
                <span>Total</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="text-xs text-slate-500">
                ou 3x de R$ {(total / 3).toFixed(2).replace(".", ",")} sem juros
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-5 w-full gradient-brand text-white font-semibold py-3.5 rounded-xl glow-brand-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {checkingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                  Processando...
                </>
              ) : (
                <>
                  Finalizar Pedido <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-600">
              <span>🔒 Pagamento seguro</span>
              <span>📦 Entrega garantida</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
