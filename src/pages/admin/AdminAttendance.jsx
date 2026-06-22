import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Paperclip,
  Search,
  Circle,
  CheckCheck,
  Clock,
  Filter,
} from "lucide-react";
import { StatusBadge, SearchInput, Button, Avatar } from "../../components/ui";
import { useApp } from "../../context/AppContext";

const MOCK_CONV = {
  1: [
    {
      id: 1,
      from: "client",
      text: "Boa tarde! Gostaria de saber sobre o prazo de entrega do meu pedido PED-2025-001.",
      time: "14:10",
    },
    {
      id: 2,
      from: "admin",
      text: "Olá Rafael! Tudo bem? Seu pedido está em fase de expedição e deve ser entregue até sexta-feira.",
      time: "14:15",
    },
    {
      id: 3,
      from: "client",
      text: "Perfeito! E tem como incluir mais 2 camisas no mesmo pedido?",
      time: "14:32",
    },
  ],
  2: [
    {
      id: 1,
      from: "client",
      text: "Aprovamos o orçamento enviado! Podemos dar início à produção.",
      time: "11:05",
    },
    {
      id: 2,
      from: "admin",
      text: "Ótimo! Já encaminhamos para a equipe de produção. Prazo estimado: 10 dias úteis.",
      time: "11:20",
    },
    { id: 3, from: "client", text: "Perfeito. Aguardamos! 👍", time: "11:22" },
  ],
  3: [
    {
      id: 1,
      from: "client",
      text: "Bom dia! Precisamos de 50 camisas dry fit para nossos instrutores com logo da academia.",
      time: "09:30",
    },
    {
      id: 2,
      from: "client",
      text: "Tamanhos variados: PP ao GG. Cores: preta com detalhes laranja.",
      time: "09:31",
    },
    {
      id: 3,
      from: "client",
      text: "Você pode me enviar um orçamento?",
      time: "09:45",
    },
  ],
  4: [
    {
      id: 1,
      from: "client",
      text: "Olá! Sobre o pedido ENC-2025-002, gostaríamos de alterar as cores dos uniformes.",
      time: "Ontem 15:30",
    },
    {
      id: 2,
      from: "admin",
      text: "Olá! Pode nos passar as novas cores? Verificamos se ainda é possível alterar antes da produção.",
      time: "Ontem 16:10",
    },
    {
      id: 3,
      from: "client",
      text: "Queremos trocar o azul royal pelo azul marinho, mesma tonalidade do logo.",
      time: "Ontem 16:45",
    },
    {
      id: 4,
      from: "admin",
      text: "Confirmado! Já fizemos a alteração na OS. Produção segue normalmente.",
      time: "Ontem 17:00",
    },
  ],
};

const STATUS_OPTIONS = ["Todos", "Aberto", "Respondido", "Fechado"];

export default function AdminAttendance() {
  const { messages, setMessages } = useApp();
  const [activeId, setActiveId] = useState(1);
  const [conv, setConv] = useState(MOCK_CONV);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const bottomRef = useRef(null);

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "Todos" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeConv = conv[activeId] || [];
  const activeMsg = messages.find((m) => m.id === activeId);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      from: "admin",
      text: input.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setConv((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), msg],
    }));
    setInput("");
    setMessages((prev) =>
      prev.map((m) =>
        m.id === activeId
          ? { ...m, unread: false, status: "Respondido", preview: input.trim() }
          : m,
      ),
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv, activeId]);

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-white">
            Atendimento
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {messages.filter((m) => m.unread).length} mensagens não lidas
          </p>
        </div>
        <Button icon={MessageSquare} size="sm">
          Nova Conversa
        </Button>
      </div>

      <div className="flex gap-4 h-[calc(100vh-200px)]">
        {/* Sidebar list */}
        <div className="w-80 flex-shrink-0 flex flex-col glass rounded-2xl overflow-hidden">
          {/* Search & Filter */}
          <div className="p-4 border-b border-white/6 space-y-3">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversa..."
            />
            <div className="flex gap-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all ${statusFilter === s ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "text-slate-500 hover:text-slate-300"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                onClick={() => setActiveId(msg.id)}
                className={`w-full text-left p-4 border-b border-white/5 transition-all hover:bg-white/4 ${activeId === msg.id ? "bg-[#D4AF37]/8 border-l-2 border-l-[#D4AF37]" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={msg.from} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm font-medium truncate ${msg.unread ? "text-white" : "text-slate-400"}`}
                      >
                        {msg.from}
                      </span>
                      <span className="text-[10px] text-slate-600 flex-shrink-0 ml-2">
                        {msg.time}
                      </span>
                    </div>
                    <div
                      className={`text-xs truncate mb-1.5 ${msg.unread ? "text-slate-300" : "text-slate-500"}`}
                    >
                      {msg.subject}
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={msg.status} />
                      {msg.unread && (
                        <span className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col glass rounded-2xl overflow-hidden">
          {activeMsg && (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-4 px-6 py-4 border-b border-white/6">
                <Avatar name={activeMsg.from} />
                <div className="flex-1">
                  <div className="font-semibold text-white">
                    {activeMsg.from}
                  </div>
                  <div className="text-xs text-slate-500">
                    {activeMsg.subject}
                  </div>
                </div>
                <StatusBadge status={activeMsg.status} />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence initial={false}>
                  {activeConv.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] ${m.from === "admin" ? "items-end" : "items-start"} flex flex-col gap-1`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            m.from === "admin"
                              ? "gradient-brand text-white rounded-br-md"
                              : "glass-light text-slate-200 rounded-bl-md border border-white/8"
                          }`}
                        >
                          {m.text}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-600 px-1">
                          {m.from === "admin" ? (
                            <CheckCheck size={10} className="text-[#D4AF37]" />
                          ) : (
                            <Clock size={10} />
                          )}
                          {m.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-4 border-t border-white/6">
                <div className="flex items-center gap-3 glass-light rounded-xl border border-white/10 px-4 py-3">
                  <button className="text-slate-500 hover:text-white transition-colors">
                    <Paperclip size={16} />
                  </button>
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      (e.preventDefault(), sendMessage())
                    }
                    placeholder="Digite sua resposta..."
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center disabled:opacity-30 transition-all hover:opacity-90"
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
