import type { Namespace } from '../types';

const common: Namespace<{
  backToHome: string;
  backToWizard: string;
  search: string;
  filter: string;
  filters: string;
  submit: string;
  copy: string;
  copied: string;
  download: string;
  upvote: string;
  upvoted: string;
  official: string;
  curated: string;
  showMore: string;
  showLess: string;
  clear: string;
  clearAllFilters: string;
  previous: string;
  next: string;
  stepOf: string;
}> = {
  en: {
    backToHome: 'Back to home',
    backToWizard: 'Back to wizard',
    search: 'Search',
    filter: 'Filter',
    filters: 'Filters',
    submit: 'Submit',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    upvote: 'Upvote',
    upvoted: 'Upvoted',
    official: 'Official',
    curated: 'Curated',
    showMore: 'Show more',
    showLess: 'Show less',
    clear: 'Clear',
    clearAllFilters: 'Clear all filters',
    previous: 'Previous',
    next: 'Next',
    stepOf: 'Step {current} of {total}',
  },
  es: {
    backToHome: 'Volver al inicio',
    backToWizard: 'Volver al asistente',
    search: 'Buscar',
    filter: 'Filtrar',
    filters: 'Filtros',
    submit: 'Enviar',
    copy: 'Copiar',
    copied: '¡Copiado!',
    download: 'Descargar',
    upvote: 'Votar',
    upvoted: 'Votado',
    official: 'Oficial',
    curated: 'Curado',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    clear: 'Limpiar',
    clearAllFilters: 'Limpiar filtros',
    previous: 'Anterior',
    next: 'Siguiente',
    stepOf: 'Paso {current} de {total}',
  },
  pt: {
    backToHome: 'Voltar ao início',
    backToWizard: 'Voltar ao assistente',
    search: 'Buscar',
    filter: 'Filtrar',
    filters: 'Filtros',
    submit: 'Enviar',
    copy: 'Copiar',
    copied: 'Copiado!',
    download: 'Baixar',
    upvote: 'Votar',
    upvoted: 'Votado',
    official: 'Oficial',
    curated: 'Curado',
    showMore: 'Mostrar mais',
    showLess: 'Mostrar menos',
    clear: 'Limpar',
    clearAllFilters: 'Limpar filtros',
    previous: 'Anterior',
    next: 'Próximo',
    stepOf: 'Etapa {current} de {total}',
  },
  zh: {
    backToHome: '返回首页',
    backToWizard: '返回向导',
    search: '搜索',
    filter: '筛选',
    filters: '筛选条件',
    submit: '提交',
    copy: '复制',
    copied: '已复制',
    download: '下载',
    upvote: '点赞',
    upvoted: '已点赞',
    official: '官方',
    curated: '精选',
    showMore: '展开',
    showLess: '收起',
    clear: '清空',
    clearAllFilters: '清空所有筛选',
    previous: '上一章',
    next: '下一章',
    stepOf: '步骤 {current} / {total}',
  },
};

export default common;
