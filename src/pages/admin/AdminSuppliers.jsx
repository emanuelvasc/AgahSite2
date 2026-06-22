import { useState } from "react";
import { motion } from "framer-motion";
import { Truck, Plus, Mail, Phone, MapPin, Building2 } from "lucide-react";
import {
  PageHeader,
  Button,
  SearchInput,
  StatusBadge,
  Modal,
  Input,
  Card,
  Avatar,
} from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function AdminSuppliers() {
  const { suppliers } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <PageHeader
        title="Fornecedores"
        subtitle={`${suppliers.length} fornecedores cadastrados`}
        actions={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            Novo Fornecedor
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar fornecedor..."
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {filtered.map((supplier, i) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass rounded-2xl p-6 card-hover cursor-pointer"
            onClick={() => setSelected(supplier)}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center flex-shrink-0">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-white font-display">
                    {supplier.name}
                  </h3>
                  <StatusBadge status={supplier.status} />
                </div>
                <div className="text-xs text-[#D4AF37] mt-0.5">
                  {supplier.category}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail size={12} className="text-slate-600 flex-shrink-0" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Phone size={12} className="text-slate-600 flex-shrink-0" />
                {supplier.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                <MapPin size={12} className="text-slate-600 flex-shrink-0" />
                {supplier.city}, {supplier.state}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 col-span-2">
                <span className="text-slate-600">Contato:</span>
                {supplier.contact}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/6 flex gap-2">
              <Button variant="ghost" size="sm">
                Ver Pedidos
              </Button>
              <Button variant="ghost" size="sm">
                Editar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Novo Fornecedor"
      >
        <div className="space-y-4">
          <Input label="Razão Social" placeholder="Nome da empresa" required />
          <Input
            label="Categoria"
            placeholder="Tecidos, Aviamentos..."
            required
          />
          <Input label="Nome do Contato" placeholder="Nome do responsável" />
          <Input
            label="E-mail"
            type="email"
            placeholder="contato@empresa.com"
          />
          <Input label="Telefone" placeholder="(00) 00000-0000" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Cidade" placeholder="Cidade" />
            <Input label="Estado" placeholder="UF" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button className="flex-1">Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
