import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Package,
  Star,
  ShoppingBag,
  ClipboardList,
  Trophy,
  Zap,
  Bike,
  Shirt,
  Users,
  Award,
  Clock,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button, Card } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { products } from "../../data/mockData";

// Imagens do carrossel
import slide1 from "../../assets/slide1-agah.jpg";
import slide2 from "../../assets/slide2-night-run.jpg";
import slide3 from "../../assets/slide3-agah-creative.jpg";

// Slides
const slides = [
  {
    id: 1,
    image: slide3,
    title: "Performance que veste sua marca",
    subtitle: "Uniformes personalizados para equipes e academias",
    badge: "Confecção Esportiva Premium",
    buttonText: "Fazer Orçamento",
    buttonLink: "/cliente/encomendas",
    button2Text: "Solicitar Orçamento",
    button2Link: "/cliente/encomendas",
    imagePosition: "center 50%",
  },
  {
    id: 2,
    image: slide2,
    title: "Tecnologia que <br /><span class='text-[#BA9730]'>move você</span>",
    subtitle: "Roupas técnicas com alta performance e conforto",
    badge: "Nova Coleção 2026",
    buttonText: "Fazer Orçamento",
    buttonLink: "/cliente/encomendas",
    button2Text: "Saiba Mais",
    button2Link: "/cliente/sobre",
    imagePosition: "center 40%",
  },
  {
    id: 3,
    image: slide1,
    title: "Sua marca, <br /><span class='text-[#BA9730]'>nosso tecido</span>",
    subtitle: "Personalização total com qualidade premium",
    badge: "100% Personalizável",
    buttonText: "Fazer Orçamento",
    buttonLink: "/cliente/encomendas",
    button2Text: "Nova Encomenda",
    button2Link: "/cliente/encomendas",
    imagePosition: "center 40%",
  },
];

// Categorias de produtos com imagens - IMAGENS INTEIRAS
const productCategories = [
  {
    id: "ciclismo-uniforme",
    name: "Uniformes de Ciclismo",
    description:
      "Uniformes completos com tecnologia avançada para máximo conforto e performance.",
    icon: Bike,
    products: products.filter(
      (p) => p.name.includes("Ciclismo") || p.name.includes("Kit Ciclismo"),
    ),
    color: "from-[#BA9730]/20 to-[#8a6e20]/10",
    border: "border-[#BA9730]/20",
    image:
      "https://i.pinimg.com/736x/79/ae/0b/79ae0bc5b9f517fdc93eb53ab62d457c.jpg",
  },
  {
    id: "kits-ciclismo",
    name: "Kits de Ciclismo",
    description:
      "Kits completos com camisa, bermuda e acessórios para ciclistas.",
    icon: Bike,
    products: products.filter((p) => p.name.includes("Kit Ciclismo")),
    color: "from-blue-500/20 to-blue-600/10",
    border: "border-blue-500/20",
    image:
      "https://lojavelor.com/cdn/shop/files/S010d78bb5191430ab627580d63775c7eh_7a3b6cdc-59a1-4cf2-8dae-b1196eb938a4.webp?v=1774550662&width=1024",
  },
  {
    id: "camisas-ciclismo",
    name: "Camisas de Ciclismo",
    description:
      "Camisas técnicas com tecidos leves e respiráveis para longas pedaladas.",
    icon: Shirt,
    products: products.filter((p) => p.name.includes("Camisa Ciclismo")),
    color: "from-emerald-500/20 to-emerald-600/10",
    border: "border-emerald-500/20",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYywwrWBCtGO2BQd5bqI8oPKsf2eO_hYwk_lU2-Te6IzfBf_QzPyekdy69&s=10",
  },
  {
    id: "macaquinhos",
    name: "Macaquinhos de Ciclismo",
    description:
      "Macaquinhos aerodinâmicos com tecnologia de compressão e conforto.",
    icon: Users,
    products: products.filter((p) => p.name.includes("Macaquinho")),
    color: "from-violet-500/20 to-violet-600/10",
    border: "border-violet-500/20",
    image:
      "https://cdn.awsli.com.br/310x374/1896/1896433/produto/338706403/5713f4d4b41372f750ed848deffed396-fhxziepmui.jpg",
  },
  {
    id: "uniformes-futebol",
    name: "Uniformes de Futebol",
    description:
      "Uniformes completos para times e academias, com personalização total.",
    icon: Trophy,
    products: products.filter(
      (p) =>
        p.category === "Uniformes" &&
        !p.name.includes("Ciclismo") &&
        !p.name.includes("Macaquinho"),
    ),
    color: "from-red-500/20 to-red-600/10",
    border: "border-red-500/20",
    image: "https://cf.shopee.com.br/file/bc720e4937ccb88b87dc84bd441089dd",
  },
  {
    id: "camisas-esportivas",
    name: "Camisas Esportivas",
    description:
      "Camisas para corrida, academia e atividades esportivas em geral.",
    icon: Shirt,
    products: products.filter(
      (p) =>
        p.category === "Camisas" &&
        !p.name.includes("Ciclismo") &&
        !p.name.includes("Estampada"),
    ),
    color: "from-amber-500/20 to-amber-600/10",
    border: "border-amber-500/20",
    image: "https://imgs.extra.com.br/1509415692/1xg.jpg?imwidth=1000",
  },
  {
    id: "outros",
    name: "Outros Produtos",
    description: "Acessórios e outros produtos esportivos da AGAH.",
    icon: Package,
    products: products.filter(
      (p) =>
        p.category === "Acessórios" ||
        p.name.includes("Boné") ||
        p.name.includes("Estampada"),
    ),
    color: "from-slate-500/20 to-slate-600/10",
    border: "border-slate-500/20",
    image:
      "https://http2.mlstatic.com/D_NQ_NP_648468-MLB89966786801_082025-O-conjunto-varios-roupa-bike-kit-ciclismo-camisa-e-short-pro.webp",
  },
];

// Filtra categorias que têm produtos
const availableCategories = productCategories.filter(
  (cat) => cat.products.length > 0,
);

export default function ClientDashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Cliente";
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      {/* Hero Banner - Carrossel */}
      <div className="relative rounded-3xl overflow-hidden mb-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentSlide].image}
              alt="AGAH Sportswear"
              className="w-full h-full object-cover"
              style={{
                objectPosition:
                  slides[currentSlide].imagePosition || "center 40%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative p-8 z-10 w-full min-h-[400px] flex items-center">
          <div className="max-w-2xl">
            <motion.div
              key={currentSlide + "-content"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-xs text-[#BA9730] font-semibold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-8 h-0.5 bg-[#BA9730]" />
                {slides[currentSlide].badge}
              </div>
              <h1
                className="text-3xl md:text-5xl font-bold font-display text-white leading-tight mb-3"
                dangerouslySetInnerHTML={{ __html: slides[currentSlide].title }}
              />
              <p className="text-slate-300 text-sm md:text-base max-w-lg mb-5">
                {slides[currentSlide].subtitle}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={slides[currentSlide].buttonLink}
                  className="inline-flex items-center gap-2 bg-[#BA9730] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#BA9730]/25"
                >
                  {slides[currentSlide].buttonText} <ArrowRight size={15} />
                </Link>
                <Link
                  to={slides[currentSlide].button2Link}
                  className="inline-flex items-center gap-2 glass-light text-white text-sm font-medium px-6 py-3 rounded-xl border border-white/15 hover:border-[#BA9730]/50 transition-all backdrop-blur-sm"
                >
                  {slides[currentSlide].button2Text}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass-light hover:bg-white/20 transition-colors text-white/70 hover:text-white border border-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass-light hover:bg-white/20 transition-colors text-white/70 hover:text-white border border-white/10"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "w-8 bg-[#BA9730]"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Categorias de Produtos - IMAGENS INTEIRAS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Nossos Produtos
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Confira nossa linha completa de produtos esportivos
            </p>
          </div>
          <Link
            to="/cliente/encomendas"
            className="text-sm text-[#BA9730] hover:text-[#d4a840] transition-colors flex items-center gap-1"
          >
            Fazer Orçamento <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {availableCategories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl overflow-hidden card-hover group"
            >
              <Link to="/cliente/encomendas" className="block">
                <div className="h-48 relative overflow-hidden bg-[#0a0a0a] p-2">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-lg"
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
                          <div class="absolute bottom-2 right-2 text-[8px] bg-black/70 text-white px-2 py-0.5 rounded-full">
                            Imagem indisponível
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon
                        size={48}
                        className="text-white/10 group-hover:text-white/20 transition-colors"
                      />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded-full">
                    {category.products.length} produtos
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#BA9730] font-medium">
                    Fazer Orçamento <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Produtos em Destaque */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Star size={18} className="text-[#BA9730] fill-[#BA9730]" />
              Destaques
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Os produtos mais procurados da AGAH
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl overflow-hidden card-hover group"
            >
              <Link to="/cliente/produtos" className="block">
                <div className="h-32 relative overflow-hidden bg-[#0a0a0a]">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package
                        size={32}
                        className="text-white/10 group-hover:text-white/15 transition-colors"
                      />
                    </div>
                  )}
                  {product.customizable && (
                    <div className="absolute top-2 left-2 text-[8px] bg-[#BA9730] text-black px-2 py-0.5 rounded-full font-semibold uppercase">
                      Custom
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[8px] text-slate-500 uppercase tracking-wider mb-0.5">
                    {product.category}
                  </div>
                  <h3 className="text-xs font-semibold text-white leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#BA9730]">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-[8px] text-slate-500">
                      {product.stock} un.
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="relative rounded-3xl overflow-hidden p-8 text-center">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #0a0a0a 0%, #1a0f40 50%, #0a0a0a 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 300">
            <circle cx="700" cy="50" r="150" fill="#BA9730" />
            <circle cx="100" cy="250" r="100" fill="#BA9730" />
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-3">
            Pronto para vestir sua equipe?
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto mb-6">
            Solicite um orçamento personalizado e descubra como a AGAH pode
            transformar a identidade visual do seu time.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/cliente/encomendas"
              className="inline-flex items-center gap-2 bg-[#BA9730] text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-[#BA9730]/25"
            >
              Solicitar Orçamento <ArrowRight size={16} />
            </Link>
            <Link
              to="/cliente/produtos"
              className="inline-flex items-center gap-2 glass-light text-white font-medium px-6 py-3 rounded-xl border border-white/15 hover:border-[#BA9730]/50 transition-all"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
