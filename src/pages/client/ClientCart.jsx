import { useState, useEffect } from "react";
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
  CreditCard,
  Smartphone,
  Lock,
  Shield,
  X,
  Copy,
  QrCode,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

// ─── COMPONENTE DE PAGAMENTO ──────────────────────────────
function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  total,
  cartItems,
  shipping,
  discount,
}) {
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [copied, setCopied] = useState(false);

  const paymentMethods = [
    { id: "pix", label: "PIX", icon: Smartphone },
    { id: "card", label: "Cartão de Crédito", icon: CreditCard },
  ];

  const pixKey = "agah@agahsports.com.br";
  const pixQrCode =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=agah@agahsports.com.br";

  useEffect(() => {
    if (showPix && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showPix]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = async () => {
    if (paymentMethod === "pix") {
      setShowPix(true);
      setTimeLeft(600);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setPaid(true);
    setTimeout(() => {
      onConfirm();
    }, 500);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePixConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      setShowPix(false);
      setTimeout(() => {
        onConfirm();
      }, 500);
    }, 2000);
  };

  if (!isOpen) return null;

  if (paid) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div className="relative w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-4"
          >
            <Check size={28} className="text-emerald-400" />
          </motion.div>
          <h3 className="text-lg font-bold text-white mb-2">
            Pagamento Confirmado!
          </h3>
          <p className="text-slate-400 text-sm">Processando seu pedido...</p>
        </div>
      </div>
    );
  }

  if (showPix) {
    const isExpired = timeLeft <= 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md glass rounded-3xl border border-white/10 shadow-2xl p-6"
        >
          <button
            onClick={() => {
              setShowPix(false);
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone size={24} className="text-green-400" />
              <h2 className="text-xl font-bold font-display text-white">
                Pagar com PIX
              </h2>
            </div>
            <p className="text-sm text-slate-400">
              Escaneie o QR Code ou copie a chave PIX
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="bg-white p-3 rounded-2xl">
              <img src={pixQrCode} alt="QR Code PIX" className="w-48 h-48" />
            </div>
          </div>

          <div className="glass-light rounded-xl p-3 mb-4">
            <div className="text-xs text-slate-400 mb-1">
              Chave PIX (E-mail)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white font-mono flex-1 truncate">
                {pixKey}
              </span>
              <button
                onClick={handleCopyPix}
                className="p-1.5 rounded-lg glass-light text-slate-400 hover:text-white transition-colors"
              >
                {copied ? (
                  <Check size={16} className="text-emerald-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            {copied && (
              <div className="text-xs text-emerald-400 mt-1">✓ Copiado!</div>
            )}
          </div>

          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <div
                className={`text-3xl font-bold font-mono ${isExpired ? "text-red-400" : "text-[#D4AF37]"}`}
              >
                {formatTime(timeLeft)}
              </div>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {isExpired
                ? "⏰ Tempo esgotado!"
                : "⏱️ Tempo restante para pagamento"}
            </div>
            <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(timeLeft / 600) * 100}%`,
                  background: timeLeft < 60 ? "#ef4444" : "#D4AF37",
                }}
              />
            </div>
          </div>

          <div className="glass-light rounded-xl p-3 text-center mb-4">
            <div className="text-xs text-slate-400">Valor a pagar</div>
            <div className="text-2xl font-bold text-[#D4AF37]">
              R$ {(total - discount + shipping).toFixed(2).replace(".", ",")}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setShowPix(false);
                setTimeLeft(600);
              }}
              className="flex-1"
            >
              Voltar
            </Button>
            <Button
              onClick={handlePixConfirm}
              disabled={loading || isExpired}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirmando...
                </>
              ) : isExpired ? (
                "Tempo Esgotado"
              ) : (
                "Confirmar Pagamento"
              )}
            </Button>
          </div>

          {isExpired && (
            <div className="mt-3 text-center text-xs text-red-400">
              O tempo para pagamento expirou. Clique em "Voltar" e tente
              novamente.
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg glass rounded-3xl border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] p-6"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl glass-light text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold font-display text-white mb-6 pr-8">
          Realizar Pagamento
        </h2>

        <div className="glass-light rounded-xl p-4 space-y-2 border border-white/8 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Itens</span>
            <span className="text-white font-medium">{cartItems} produtos</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="text-white font-medium">
              R$ {total.toFixed(2).replace(".", ",")}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-400">
              <span>Desconto</span>
              <span>- R$ {discount.toFixed(2).replace(".", ",")}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Frete</span>
            <span
              className={shipping === 0 ? "text-emerald-400" : "text-white"}
            >
              {shipping === 0
                ? "Grátis"
                : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-white/8">
            <span className="text-slate-400">Total</span>
            <span className="text-xl font-bold text-[#D4AF37]">
              R$ {(total - discount + shipping).toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
            Selecione a forma de pagamento
          </div>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-3 rounded-xl text-center transition-all border-2 ${
                  paymentMethod === method.id
                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-white/10 hover:border-white/20 glass-light"
                }`}
              >
                <method.icon
                  size={20}
                  className={`mx-auto mb-1 ${paymentMethod === method.id ? "text-[#D4AF37]" : "text-slate-400"}`}
                />
                <div
                  className={`text-[9px] font-semibold ${
                    paymentMethod === method.id
                      ? "text-white"
                      : "text-slate-400"
                  }`}
                >
                  {method.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {paymentMethod === "card" && (
          <div className="glass-light rounded-xl p-4 space-y-3 border border-white/8 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Número do cartão
                </label>
                <input
                  type="text"
                  placeholder="0000 0000 0000 0000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Validade
                </label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                  Nome no cartão
                </label>
                <input
                  type="text"
                  placeholder="Nome como está no cartão"
                  className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-sm px-3 py-2 placeholder:text-slate-600 focus:border-[#D4AF37]/50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-4">
          <Lock size={12} className="text-[#D4AF37]" />
          <span>Pagamento seguro com criptografia</span>
          <Shield size={12} className="text-[#D4AF37] ml-2" />
          <span>Dados protegidos</span>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button onClick={handlePayment} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              `Pagar R$ ${(total - discount + shipping).toFixed(2).replace(".", ",")}`
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClientCart() {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    cartTotal,
    clearCart,
    addOrder,
  } = useApp();
  const { user } = useAuth();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [ordered, setOrdered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();

  const shipping = cartTotal > 300 ? 0 : 29.9;
  const discount = couponApplied ? cartTotal * 0.1 : 0;
  const total = cartTotal - discount + shipping;

  const handleCoupon = () => {
    if (coupon.toUpperCase() === "AGAH10") setCouponApplied(true);
  };

  const handleCheckout = () => {
    setShowPayment(true);
  };

  const handleConfirmPayment = async () => {
    setShowPayment(false);
    setCheckingOut(true);

    // ✅ SALVA O PEDIDO NO BANCO/ESTADO
    const orderData = {
      client: user?.name || "Cliente",
      items: cart.reduce((acc, item) => acc + item.qty, 0),
      total: total,
      payment: "Pix",
      status: "Pendente",
      date: new Date().toISOString(),
      orderItems: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        qty: item.qty,
        size: item.size,
        color: item.color,
        price: item.product.price,
      })),
    };

    await addOrder(orderData);

    setTimeout(() => {
      setOrdered(true);
      clearCart();
      setTimeout(() => navigate("/cliente/pedidos"), 2000);
    }, 1000);
  };

  const handleCancelPayment = () => {
    setShowPayment(false);
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
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#0a0a0a] flex items-center justify-center p-1">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                            <svg class="text-white/20" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
                    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                      <Package size={24} className="text-white/20" />
                    </div>
                  )}
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

          <Link
            to="/cliente/produtos"
            className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#e8c970] transition-colors pt-2 px-1"
          >
            ← Continuar comprando
          </Link>
        </div>

        <div className="space-y-4">
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

      <PaymentModal
        isOpen={showPayment}
        onClose={handleCancelPayment}
        onConfirm={handleConfirmPayment}
        total={cartTotal}
        cartItems={cart.length}
        shipping={shipping}
        discount={discount}
      />
    </div>
  );
}
