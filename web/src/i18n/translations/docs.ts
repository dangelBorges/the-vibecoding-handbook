import type { Namespace } from '../types';

const docs: Namespace<{
  contents: string;
  loading: string;
  chapterOf: string;
  minRead: string;
  previous: string;
  next: string;
}> = {
  en: {
    contents: 'Contents',
    loading: 'Loading...',
    chapterOf: 'Chapter {current} of {total}',
    minRead: '{minutes} min read',
    previous: 'Previous',
    next: 'Next',
  },
  es: {
    contents: 'Contenido',
    loading: 'Cargando...',
    chapterOf: 'Capítulo {current} de {total}',
    minRead: '{minutes} min de lectura',
    previous: 'Anterior',
    next: 'Siguiente',
  },
  pt: {
    contents: 'Conteúdo',
    loading: 'Carregando...',
    chapterOf: 'Capítulo {current} de {total}',
    minRead: '{minutes} min de leitura',
    previous: 'Anterior',
    next: 'Próximo',
  },
  zh: {
    contents: '目录',
    loading: '加载中...',
    chapterOf: '第 {current} 章，共 {total} 章',
    minRead: '{minutes} 分钟阅读',
    previous: '上一章',
    next: '下一章',
  },
};

export default docs;
