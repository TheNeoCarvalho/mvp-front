const API_URL = "http://localhost:4000/api";

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!response.ok) throw new Error(`Erro na API: ${response.status}`);
  const data = await response.json();
  return data.data ?? data;
}

export interface Filial {
  id: number;
  nome: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  endereco: string;
  cidade: string;
  estado: string;
  status: "ATIVA" | "INATIVA";
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj?: string;
  responsavel?: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  regioesAtendidas: string[];
  categorias: string[];
  prazoMedioEntrega?: number;
  custoMedioEntrega?: number;
  avaliacao?: number;
  status: "ATIVO" | "INATIVO";
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Insumo {
  id: number;
  nome: string;
  categoria: string;
  unidadeMedida: string;
  estoqueMinimo?: number;
  stockQuantity: number;
  descricao?: string;
  status: "ATIVO" | "INATIVO";
  createdAt: string;
  updatedAt: string;
}

export interface SolicitacaoHistorico {
  id: number;
  solicitacaoId: number;
  usuarioId?: number;
  acao: string;
  descricao: string;
  createdAt: string;
}

export interface SolicitacaoItem {
  id: number;
  insumoId: number;
  quantidade: number;
  quantidadeAprovada?: number;
  insumo?: Insumo;
}

export interface Solicitacao {
  id: number;
  filialId: number;
  urgencia: "BAIXA" | "MEDIA" | "ALTA";
  justificativa: string;
  observacao?: string;
  status: "PENDENTE" | "EM_ANALISE" | "APROVADA" | "REPROVADA" | "AJUSTE_SOLICITADO" | "AUTORIZADA" | "PENDENTE_APROVACAO" | "ENVIADA_FORNECEDOR" | "EM_TRANSPORTE" | "ENTREGUE" | "CANCELADA";
  fornecedorId?: number;
  observacaoMatriz?: string;
  valorAprovado?: number;
  dataEntregaPrevista?: string;
  createdAt: string;
  updatedAt: string;
  filial?: Filial;
  fornecedor?: Fornecedor;
  itens?: SolicitacaoItem[];
  historicos?: SolicitacaoHistorico[];
}

export interface PedidoItem {
  id: number;
  insumoId: number;
  quantidade: number;
  precoUnitario: number;
  insumo?: Insumo;
}

export interface Pedido {
  id: number;
  solicitacaoId?: number;
  filialId: number;
  fornecedorId: number;
  valorTotal?: number;
  prazoPrevisto?: string;
  dataEntregaPrevista?: string;
  dataEntregaReal?: string;
  status: "APROVADO" | "ENVIADO_FORNECEDOR" | "EM_SEPARACAO" | "EM_TRANSPORTE" | "ENTREGUE" | "CANCELADO";
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  filial?: Filial;
  fornecedor?: Fornecedor;
  itens?: PedidoItem[];
  solicitacao?: Solicitacao;
}

export interface Consumo {
  id: number;
  filialId: number;
  insumoId: number;
  pedidoId: number;
  solicitacaoId?: number;
  fornecedorId: number;
  quantidade: number;
  valor: number;
  data: string;
  filial?: Filial;
  insumo?: Insumo;
  fornecedor?: Fornecedor;
}

export interface Alerta {
  id: number;
  tipo: string;
  titulo: string;
  descricao: string;
  filialId?: number;
  lido: boolean;
  createdAt: string;
  filial?: Filial;
}

export interface DashboardStats {
  totalFiliais: number;
  totalFornecedores: number;
  totalInsumos: number;
  solicitacoesPendentes: number;
  solicitacoesAprovadas: number;
  solicitacoesReprovadas: number;
  pedidosEmAndamento: number;
  pedidosEntregues: number;
  alertasNaoLidos: number;
  gastoMes: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T[];
  meta?: PaginationMeta;
}

export const api = {
  dashboard: {
    getEstatisticas: () => fetchAPI<DashboardStats>("/dashboard/estatisticas"),
    getRankingFiliais: (limit?: number) => fetchAPI<any[]>(`/dashboard/ranking-filiais?limit=${limit || 5}`),
    getRankingFornecedores: (limit?: number) => fetchAPI<any[]>(`/dashboard/ranking-fornecedores?limit=${limit || 5}`),
    getRankingInsumos: (limit?: number) => fetchAPI<any[]>(`/dashboard/ranking-insumos?limit=${limit || 5}`),
    getAlertas: (limit?: number) => fetchAPI<Alerta[]>(`/dashboard/alertas?limit=${limit || 10}`),
    getGastosPorMes: (meses?: number) => fetchAPI<any[]>(`/dashboard/gastos-por-mes?meses=${meses || 6}`),
    getSolicitacoesPorStatus: () => fetchAPI<any[]>("/dashboard/solicitacoes-status"),
    getEstatisticasFilial: (filialId: number) => fetchAPI<any>(`/dashboard/filial/${filialId}`),
  },

  filiais: {
    getAll: (params?: { nome?: string; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Filial>>(`/filiais?${query}`);
    },
    getById: (id: number) => fetchAPI<Filial>(`/filiais/${id}`),
    create: (data: Partial<Filial>) => fetchAPI<Filial>("/filiais", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Filial>) => fetchAPI<Filial>(`/filiais/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI<any>(`/filiais/${id}`, { method: "DELETE" }),
    getAtivas: () => fetchAPI<Filial[]>("/filiais"),
  },

  fornecedores: {
    getAll: (params?: { nome?: string; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Fornecedor>>(`/fornecedores?${query}`);
    },
    getById: (id: number) => fetchAPI<Fornecedor>(`/fornecedores/${id}`),
    create: (data: Partial<Fornecedor>) => fetchAPI<Fornecedor>("/fornecedores", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Fornecedor>) => fetchAPI<Fornecedor>(`/fornecedores/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI<any>(`/fornecedores/${id}`, { method: "DELETE" }),
    getAtivos: () => fetchAPI<Fornecedor[]>("/fornecedores"),
  },

  insumos: {
    getAll: (params?: { nome?: string; categoria?: string; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Insumo>>(`/insumos?${query}`);
    },
    getById: (id: number) => fetchAPI<Insumo>(`/insumos/${id}`),
    create: (data: Partial<Insumo>) => fetchAPI<Insumo>("/insumos", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Insumo>) => fetchAPI<Insumo>(`/insumos/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: number) => fetchAPI<any>(`/insumos/${id}`, { method: "DELETE" }),
    getCategorias: () => fetchAPI<any[]>("/insumos/categorias"),
    getPorCategoria: (categoria: string) => fetchAPI<Insumo[]>(`/insumos/categoria/${categoria}`),
  },

  solicitacoes: {
    getAll: (params?: { filialId?: number; status?: string; urgencia?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Solicitacao>>(`/solicitacoes?${query}`);
    },
    getById: (id: number) => fetchAPI<Solicitacao>(`/solicitacoes/${id}`),
    create: (data: { filialId: number; urgencia: string; justificativa: string; observacao?: string; itens: { insumoId: number; quantidade: number }[] }) =>
      fetchAPI<Solicitacao>("/solicitacoes", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: number, status: string, observacao?: string) =>
      fetchAPI<Solicitacao>(`/solicitacoes/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, observacao }) }),
    aprobar: (id: number, data: { fornecedorId: number; valorAprovado: number; dataEntregaPrevista?: string; observacao?: string }) =>
      fetchAPI<Solicitacao>(`/solicitacoes/${id}/aprovar`, { method: "POST", body: JSON.stringify(data) }),
    reprovar: (id: number, observacao: string) =>
      fetchAPI<Solicitacao>(`/solicitacoes/${id}/reprovar`, { method: "POST", body: JSON.stringify({ observacao }) }),
    delete: (id: number) => fetchAPI<any>(`/solicitacoes/${id}`, { method: "DELETE" }),
  },

  pedidos: {
    getAll: (params?: { filialId?: number; fornecedorId?: number; status?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Pedido>>(`/pedidos?${query}`);
    },
    getById: (id: number) => fetchAPI<Pedido>(`/pedidos/${id}`),
    create: (data: { solicitacaoId: number; fornecedorId: number; valorTotal: number; dataEntregaPrevista?: string; prazoPrevisto?: string; observacoes?: string }) =>
      fetchAPI<Pedido>("/pedidos", { method: "POST", body: JSON.stringify(data) }),
    updateStatus: (id: number, status: string, observacoes?: string) =>
      fetchAPI<Pedido>(`/pedidos/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, observacoes }) }),
    delete: (id: number) => fetchAPI<any>(`/pedidos/${id}`, { method: "DELETE" }),
    registrarConsumo: (id: number) => fetchAPI<any>(`/pedidos/${id}/registrar-consumo`, { method: "POST" }),
  },

  consumo: {
    getAll: (params?: { filialId?: number; insumoId?: number; fornecedorId?: number; dataInicio?: string; dataFim?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<ApiResponse<Consumo>>(`/consumo?${query}`);
    },
    porFilial: (filialId?: number) => fetchAPI<any[]>(`/consumo/por-filial${filialId ? `?filialId=${filialId}` : ""}`),
    porInsumo: (insumoId?: number) => fetchAPI<any[]>(`/consumo/por-insumo${insumoId ? `?insumoId=${insumoId}` : ""}`),
    porFornecedor: (fornecedorId?: number) => fetchAPI<any[]>(`/consumo/por-fornecedor${fornecedorId ? `?fornecedorId=${fornecedorId}` : ""}`),
    rankingFiliais: (limit?: number) => fetchAPI<any[]>(`/consumo/ranking-filiais?limit=${limit || 10}`),
    rankingInsumos: (limit?: number) => fetchAPI<any[]>(`/consumo/ranking-insumos?limit=${limit || 10}`),
    rankingFornecedores: (limit?: number) => fetchAPI<any[]>(`/consumo/ranking-fornecedores?limit=${limit || 10}`),
  },

  alertas: {
    getAll: (params?: { filialId?: number; lido?: boolean }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchAPI<Alerta[]>(`/alertas?${query}`);
    },
    getNaoLidos: () => fetchAPI<Alerta[]>("/alertas?lido=false"),
    criar: (data: { tipo: string; titulo: string; descricao: string; filialId?: number }) =>
      fetchAPI<Alerta>("/alertas", { method: "POST", body: JSON.stringify(data) }),
    marcarLido: (id: number) => fetchAPI<Alerta>(`/alertas/${id}/ler`, { method: "PATCH" }),
    delete: (id: number) => fetchAPI<any>(`/alertas/${id}`, { method: "DELETE" }),
    gerar: () => fetchAPI<Alerta[]>("/alertas/gerar", { method: "GET" }),
    contar: () => fetchAPI<number>("/alertas/contar"),
  },
};