"use client";

import { useState, useEffect } from "react";
import { Bell, AlertTriangle, Check, Trash2, RefreshCw } from "lucide-react";
import { api, Alerta } from "@/lib/api";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroLido, setFiltroLido] = useState<"" | "true" | "false">("");

  useEffect(() => { carregarAlertas(); }, []);

  async function carregarAlertas() {
    try {
      const params: any = {};
      if (filtroLido === "true") params.lido = true;
      if (filtroLido === "false") params.lido = false;
      const response = await api.alertas.getAll(params);
      setAlertas(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregarAlertas(); }, [filtroLido]);

  async function handleMarcarLido(id: number) {
    try {
      await api.alertas.marcarLido(id);
      carregarAlertas();
    } catch (err) {
      console.error("Erro ao marcar como lido:", err);
    }
  }

  async function handleExcluir(id: number) {
    try {
      await api.alertas.delete(id);
      carregarAlertas();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  async function handleGerarAlertas() {
    try {
      await api.alertas.gerar();
      carregarAlertas();
    } catch (err) {
      console.error("Erro ao gerar alertas:", err);
    }
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }

  const getTipoCor = (tipo: string) => {
    switch (tipo) {
      case "DESPERDICIO": return "bg-red-500/20 text-red-400";
      case "PENDENCIA": return "bg-yellow-500/20 text-yellow-400";
      case "GERAL": return "bg-blue-500/20 text-blue-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const naoLidos = alertas.filter(a => !a.lido).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Alertas</h1>
          <p className="text-[#94A3B8] mt-1">Notificações e alertas do sistema</p>
        </div>
        <button onClick={handleGerarAlertas} className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
          <RefreshCw size={20} /> Gerar Alertas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Total de Alertas</p>
              <h2 className="text-2xl font-bold text-white">{alertas.length}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Bell className="text-blue-400" size={22} />
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#94A3B8] text-sm">Não Lidos</p>
              <h2 className="text-2xl font-bold text-white">{naoLidos}</h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="text-yellow-400" size={22} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setFiltroLido("")} className={`px-4 py-2 rounded-xl ${filtroLido === "" ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#94A3B8]"}`}>
          Todos
        </button>
        <button onClick={() => setFiltroLido("false")} className={`px-4 py-2 rounded-xl ${filtroLido === "false" ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#94A3B8]"}`}>
          Não Lidos
        </button>
        <button onClick={() => setFiltroLido("true")} className={`px-4 py-2 rounded-xl ${filtroLido === "true" ? "bg-[#2563EB] text-white" : "bg-[#1E293B] text-[#94A3B8]"}`}>
          Lidos
        </button>
      </div>

      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
        {loading ? (
          <div className="text-center text-[#64748B] py-8">Carregando...</div>
        ) : alertas.length === 0 ? (
          <div className="text-center text-[#64748B] py-8">Nenhum alerta encontrado</div>
        ) : (
          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div key={alerta.id} className={`flex items-start justify-between p-4 rounded-xl ${alerta.lido ? "bg-[#0F172A]/50" : "bg-[#0F172A]"}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getTipoCor(alerta.tipo)}`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium">{alerta.titulo}</h3>
                      {alerta.lido && <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded">Lido</span>}
                    </div>
                    <p className="text-[#94A3B8] text-sm mt-1">{alerta.descricao}</p>
                    {alerta.filial && (
                      <p className="text-[#64748B] text-xs mt-2">Filial: {alerta.filial.nome}</p>
                    )}
                    <p className="text-[#64748B] text-xs">{formatarData(alerta.createdAt)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!alerta.lido && (
                    <button onClick={() => handleMarcarLido(alerta.id)} className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/30">
                      <Check size={16} />
                    </button>
                  )}
                  <button onClick={() => handleExcluir(alerta.id)} className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/30">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}