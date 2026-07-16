import type { Namespace } from '../types';

const communityPrompts: Namespace<{
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  submitPrompt: string;
  filters: string;
  categoryLabel: string;
  toolLabel: string;
  stackLabel: string;
  countOne: string;
  countOther: string;
  emptyTitle: string;
  emptyClearFilters: string;
  official: string;
  curated: string;
  upvote: string;
  upvoted: string;
  showMore: string;
  showLess: string;
  copyPrompt: string;
  byAuthor: string;
}> = {
  en: {
    title: 'Prompt Library',
    subtitle:
      'Curated prompts plus community submissions. Upvote the ones you find useful, copy them into your agent, or submit your own via GitHub.',
    searchPlaceholder: 'Search community prompts...',
    submitPrompt: 'Submit a prompt',
    filters: 'Filters',
    categoryLabel: 'Category',
    toolLabel: 'Tool',
    stackLabel: 'Stack',
    countOne: '{count} community prompt',
    countOther: '{count} community prompts',
    emptyTitle: 'No community prompts match your filters.',
    emptyClearFilters: 'Clear all filters',
    official: 'Official',
    curated: 'Curated',
    upvote: 'Upvote',
    upvoted: 'Upvoted',
    showMore: 'Show more',
    showLess: 'Show less',
    copyPrompt: 'Copy prompt',
    byAuthor: 'by {author}',
  },
  es: {
    title: 'Biblioteca de prompts',
    subtitle:
      'Prompts seleccionados más contribuciones de la comunidad. Vota los útiles, cópialos en tu agente o envía el tuyo por GitHub.',
    searchPlaceholder: 'Buscar prompts de la comunidad...',
    submitPrompt: 'Enviar un prompt',
    filters: 'Filtros',
    categoryLabel: 'Categoría',
    toolLabel: 'Herramienta',
    stackLabel: 'Stack',
    countOne: '{count} prompt de la comunidad',
    countOther: '{count} prompts de la comunidad',
    emptyTitle: 'Ningún prompt de la comunidad coincide con tus filtros.',
    emptyClearFilters: 'Limpiar filtros',
    official: 'Oficial',
    curated: 'Curado',
    upvote: 'Votar',
    upvoted: 'Votado',
    showMore: 'Mostrar más',
    showLess: 'Mostrar menos',
    copyPrompt: 'Copiar prompt',
    byAuthor: 'por {author}',
  },
  pt: {
    title: 'Biblioteca de prompts',
    subtitle:
      'Prompts selecionados mais envios da comunidade. Vote nos úteis, copie para o seu agente ou envie o seu pelo GitHub.',
    searchPlaceholder: 'Buscar prompts da comunidade...',
    submitPrompt: 'Enviar um prompt',
    filters: 'Filtros',
    categoryLabel: 'Categoria',
    toolLabel: 'Ferramenta',
    stackLabel: 'Stack',
    countOne: '{count} prompt da comunidade',
    countOther: '{count} prompts da comunidade',
    emptyTitle: 'Nenhum prompt da comunidade corresponde aos seus filtros.',
    emptyClearFilters: 'Limpar filtros',
    official: 'Oficial',
    curated: 'Curado',
    upvote: 'Votar',
    upvoted: 'Votado',
    showMore: 'Mostrar mais',
    showLess: 'Mostrar menos',
    copyPrompt: 'Copiar prompt',
    byAuthor: 'por {author}',
  },
  zh: {
    title: 'Prompt 库',
    subtitle:
      '精选 Prompt 与社区投稿。为有用的 Prompt 点赞、复制到你的智能体中，或通过 GitHub 提交你自己的 Prompt。',
    searchPlaceholder: '搜索社区 Prompt...',
    submitPrompt: '提交 Prompt',
    filters: '筛选',
    categoryLabel: '分类',
    toolLabel: '工具',
    stackLabel: '技术栈',
    countOne: '{count} 个社区 Prompt',
    countOther: '{count} 个社区 Prompt',
    emptyTitle: '没有符合筛选条件的社区 Prompt。',
    emptyClearFilters: '清空所有筛选',
    official: '官方',
    curated: '精选',
    upvote: '点赞',
    upvoted: '已点赞',
    showMore: '展开',
    showLess: '收起',
    copyPrompt: '复制 Prompt',
    byAuthor: '作者 {author}',
  },
};

export default communityPrompts;
