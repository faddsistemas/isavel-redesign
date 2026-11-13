export interface Acessorio {
  nome: string;
  categoria: string | null;
  destaque: boolean;
  slug: string;
}

export interface Veiculo {
  id: number;
  tipo: string;
  tipo_slug: string;
  marca: string;
  marca_slug: string;
  modelo: string;
  versao: string;
  versao_slug: string;
  ano_fabricacao: string;
  ano_modelo: string;
  km: number;
  preco: number;
  preco_promocao: number | null;
  valor_fipe: number | null;
  combustivel: string;
  cambio: string;
  cor: string;
  carroceria: string;
  portas: number;
  potencia_cv: number | null;
  zero_km: boolean;
  placa_final: string;
  loja: string;
  loja_id: number;
  loja_slug: string;
  foto_capa: string;
  fotos: string[];
  acessorios: Acessorio[];
  tags: string[];
  url: string;
  atualizacao: string;
  publicacao: string;
}

export interface VehiclesFile {
  veiculos: Veiculo[];
  total: number;
}

export interface VehicleRouteParams {
  tipo: string;
  marca: string;
  modelo: string;
  ano: string;
  id: string;
}

export interface StockFilters {
  termo?: string;
  marca?: string;
  modelo?: string;
  anoMin?: string;
  anoMax?: string;
  precoMin?: string;
  precoMax?: string;
  cambio?: string;
  combustivel?: string;
  loja?: string;
  tipo?: string;
  ordenacao?: string;
}
