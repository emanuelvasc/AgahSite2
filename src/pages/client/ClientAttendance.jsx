// ─── CLIENT ATTENDANCE ────────────────────────────────────
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  Headphones,
  Zap,
  FileText,
} from "lucide-react";
import { Button } from "../../components/ui";

const INITIAL_MESSAGES = [
  {
    id: 1,
    from: "agent",
    text: "Olá! Bem-vindo ao atendimento AGAH. Como posso ajudar você hoje?",
    time: "09:00",
  },
];

const QUICK_MSGS = [
  "Quero solicitar um orçamento",
  "Qual o prazo de produção?",
  "Como funciona a personalização?",
  "Status do meu pedido",
];

export function ClientAttendance() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  const AUTO_REPLIES = {
    orçamento:
      "Para solicitar um orçamento, você pode usar o módulo de Encomendas Personalizadas ou descrever aqui o que precisa (produto, quantidade, personalização e prazo desejado).",
    prazo:
      "Nosso prazo médio de produção é de 10 a 20 dias úteis após aprovação do orçamento, dependendo da quantidade e complexidade da personalização.",
    personalização:
      "Trabalhamos com sublimação total, bordado, silk screen e termocolante. Cada método tem suas vantagens — quer saber qual é o melhor para seu projeto?",
    status:
      'Para verificar o status do seu pedido, acesse o menu "Meus Pedidos". Se preferir, me informe o número do pedido que verifico para você!',
    default:
      "Obrigado pela mensagem! Nossa equipe responderá em breve. Você também pode usar o módulo de Encomendas para solicitações detalhadas.",
  };

  const sendMsg = (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: Date.now(),
      from: "user",
      text: text.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(
      () => {
        const key =
          Object.keys(AUTO_REPLIES).find((k) =>
            text.toLowerCase().includes(k),
          ) || "default";
        const reply = {
          id: Date.now() + 1,
          from: "agent",
          text: AUTO_REPLIES[key],
          time: new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, reply]);
        setTyping(false);
      },
      1200 + Math.random() * 800,
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-white">
          Atendimento
        </h1>
        <p className="text-slate-500 text-sm mt-1">Fale com nossa equipe</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-220px)]">
        {/* Sidebar */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                <Headphones size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Atendimento
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online agora
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              Horário de atendimento:
              <br />
              Seg–Sex, 8h–18h
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Mensagens Rápidas
            </div>
            <div className="space-y-2">
              {QUICK_MSGS.map((msg) => (
                <button
                  key={msg}
                  onClick={() => sendMsg(msg)}
                  className="w-full text-left text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Zap size={11} className="text-[#D4AF37] flex-shrink-0" />
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Atalhos
            </div>
            <button className="w-full flex items-center gap-2 text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all">
              <FileText size={13} className="text-slate-500" /> Nova Encomenda
            </button>
          </div>
        </div>

        {/* Chat */}
        <div className="xl:col-span-3 flex flex-col glass rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/6">
            <div className="w-9 h-9 gradient-brand rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">AG</span>
            </div>
            <div>
              <div className="font-semibold text-white text-sm">
                AGAH Suporte
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[72%] flex flex-col gap-1 ${m.from === "user" ? "items-end" : "items-start"}`}
                  >
                    {m.from === "agent" && (
                      <div className="w-6 h-6 gradient-brand rounded-full flex items-center justify-center mb-0.5">
                        <span className="text-[9px] text-white font-bold">
                          AG
                        </span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        m.from === "user"
                          ? "gradient-brand text-white rounded-br-md"
                          : "glass-light text-slate-200 rounded-bl-md border border-white/8"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[10px] text-slate-600 px-1 ${m.from === "user" ? "flex-row-reverse" : ""}`}
                    >
                      {m.from === "user" ? (
                        <CheckCheck size={10} className="text-[#D4AF37]" />
                      ) : (
                        <Clock size={10} />
                      )}
                      {m.time}
                    </div>
                  </div>
                </motion.div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glass-light rounded-2xl rounded-bl-md px-4 py-3 border border-white/8 flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-slate-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
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
                  (e.preventDefault(), sendMsg(input))
                }
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-600 outline-none"
              />
              <button
                onClick={() => sendMsg(input)}
                disabled={!input.trim()}
                className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center disabled:opacity-30 hover:opacity-90 transition-all"
              >
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientAttendance;
