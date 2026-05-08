"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  AlertTriangle,
  DollarSign,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";

interface User {
  id: number;
  nome: string;
  tipo: "MATRIZ" | "FILIAL";
  filialId?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [rankingFiliais, setRankingFiliais] = useState<any[]>([]);
  const [rankingFornecedores, setRankingFornecedores] = useState<any[]>([]);
  const [rankingInsumos, setRankingInsumos] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      if (user?.tipo === "FILIAL" && user.filialId) {
        const [solicitacoesRes, pedidosRes, alertasRes] = await Promise.all([
          api.solicitacoes.getAll({ filialId: user.filialId, limit: 100 }),
          api.pedidos.getAll({ filialId: user.filialId, limit: 100 }),
          api.alertas.getAll({ filialId: user.filialId }),
        ]);
        
        const solicitacoes = Array.isArray(solicitacoesRes) ? solicitacoesRes : solicitacoesRes.data || [];
        const pedidos = Array.isArray(pedidosRes) ? pedidosRes : pedidosRes.data || [];
        
        setStats({
          minhasSolicitacoes: solicitacoes.length,
          solicitacoesPendentes: solicitacoes.filter((s: any) => s.status === "PENDENTE" || s.status === "PENDENTE_APROVACAO").length,
          solicitacoesAprovadas: solicitacoes.filter((s: any) => s.status === "APROVADA" || s.status === "AUTORIZADA").length,
          meusPedidos: pedidos.length,
          pedidosEntregues: pedidos.filter((p: any) => p.status === "ENTREGUE").length,
        });
        setAlertas(alertasRes);
      } else {
        const [statsData, filiaisData, fornecedoresData, insumosData, alertasData] = await Promise.all([
          api.dashboard.getEstatisticas(),
          api.dashboard.getRankingFiliais(5),
          api.dashboard.getRankingFornecedores(5),
          api.dashboard.getRankingInsumos(5),
          api.dashboard.getAlertas(5),
        ]);
        setStats(statsData);
        setRankingFiliais(filiaisData);
        setRankingFornecedores(fornecedoresData);
        setRankingInsumos(insumosData);
        setAlertas(alertasData);
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor || 0);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-[#64748B]">Carregando dashboard...</div>
      </div>
    );
  }

  const isMatriz = user?.tipo === "MATRIZ";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          {isMatriz ? "Dashboard da Matriz" : "Dashboard da Filial"}
        </h1>
        <p className="text-[#94A3B8] mt-1">
          {isMatriz ? "Visão geral do sistema" : `Bem-vindo, ${user?.nome || "Usuário"}`}
        </p>
      </div>

      {isMatriz ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <CardDashboard titulo="Solicitações Pendentes" valor={stats?.solicitacoesPendentes || 0} icone={ClipboardList} cor="yellow" />
            <CardDashboard titulo="Solicitações Aprovadas" valor={stats?.solicitacoesAprovadas || 0} icone={CheckCircle} cor="green" />
            <CardDashboard titulo="Solicitações Reprovadas" valor={stats?.solicitacoesReprovadas || 0} icone={XCircle} cor="red" />
            <CardDashboard titulo="Pedidos em Andamento" valor={stats?.pedidosEmAndamento || 0} icone={Truck} cor="blue" />
            <CardDashboard titulo="Pedidos Entregues" valor={stats?.pedidosEntregues || 0} icone={Package} cor="green" />
            <CardDashboard titulo="Gasto do Mês" valor={formatarMoeda(stats?.gastoMes || 0)} icone={DollarSign} cor="purple" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardRanking titulo="Filiais com Maior Consumo" dados={rankingFiliais} />
            <CardRanking titulo="Fornecedores Mais Utilizados" dados={rankingFornecedores} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardRanking titulo="Insumos Mais Solicitados" dados={rankingInsumos} tipo="insumo" />
            <CardAlertas alertas={alertas} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardEstatistica titulo="Total de Filiais" valor={stats?.totalFiliais || 0} icone={Package} />
            <CardEstatistica titulo="Total de Fornecedores" valor={stats?.totalFornecedores || 0} icone={Truck} />
            <CardEstatistica titulo="Total de Insumos" valor={stats?.totalInsumos || 0} icone={ClipboardList} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <CardDashboard titulo="Minhas Solicitações" valor={stats?.minhasSolicitacoes || 0} icone={FileText} cor="blue" />
            <CardDashboard titulo="Pendentes" valor={stats?.solicitacoesPendentes || 0} icone={ClipboardList} cor="yellow" />
            <CardDashboard titulo="Aprovadas" valor={stats?.solicitacoesAprovadas || 0} icone={CheckCircle} cor="green" />
            <CardDashboard titulo="Meus Pedidos" valor={stats?.meusPedidos || 0} icone={Truck} cor="blue" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CardAlertas alertas={alertas} />
          </div>
        </>
      )}
    </div>
  );
}

function CardDashboard({ titulo, valor, icone: Icone, cor }: any) {
  const cores: Record<string, string> = {
    yellow: "bg-yellow-500/20 text-yellow-400",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#94A3B8] text-sm">{titulo}</p>
          <h2 className="text-2xl font-bold text-white mt-1">{valor}</h2>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cores[cor]}`}>
          <Icone size={22} />
        </div>
      </div>
    </div>
  );
}

function CardRanking({ titulo, dados, tipo }: any) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">{titulo}</h3>
      {dados.length === 0 ? (
        <p className="text-[#64748B]">Nenhum dado disponível</p>
      ) : (
        <div className="space-y-3">
          {dados.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-xl">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${index < 3 ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>
                  {index + 1}
                </span>
                <span className="text-white">
                  {tipo === "insumo" ? item.insumo?.nome : item.filial?.nome || item.fornecedor?.nome || "-"}
                </span>
              </div>
              <span className="text-green-400 font-medium">
                {tipo === "insumo" ? `${item.consumoTotal} uni` : (item.gastoTotal ? `R$ ${item.gastoTotal.toFixed(2)}` : `${item.pedidos} pedidos`)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CardAlertas({ alertas }: any) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Alertas Recentes</h3>
        <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
          {alertas.length} novos
        </span>
      </div>
      {alertas.length === 0 ? (
        <p className="text-[#64748B]">Nenhum alerta</p>
      ) : (
        <div className="space-y-3">
          {alertas.slice(0, 5).map((alerta: any, index: number) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-[#0F172A] rounded-xl">
              <AlertTriangle className="text-yellow-400 mt-1" size={18} />
              <div>
                <p className="text-white font-medium">{alerta.titulo}</p>
                <p className="text-[#64748B] text-sm">{alerta.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CardEstatistica({ titulo, valor, icone: Icone }: any) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 flex items-center justify-between">
      <div>
        <p className="text-[#94A3B8] text-sm">{titulo}</p>
        <h2 className="text-3xl font-bold text-white">{valor}</h2>
      </div>
      <Icone className="text-blue-400" size={32} />
    </div>
  );
}