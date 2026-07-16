import type { Namespace } from '../types';

const navigation: Namespace<{
  logo: string;
  home: string;
  docs: string;
  wizard: string;
  optimize: string;
  community: string;
  tools: string;
  templates: string;
  contribute: string;
  contributeOnGitHub: string;
}> = {
  en: {
    logo: 'THE VIBE CODING HANDBOOK',
    home: 'Home',
    docs: 'Docs',
    wizard: 'Wizard',
    optimize: 'Optimize',
    community: 'Community',
    tools: 'Tools',
    templates: 'Templates',
    contribute: 'Contribute',
    contributeOnGitHub: 'Contribute on GitHub',
  },
  es: {
    logo: 'THE VIBE CODING HANDBOOK',
    home: 'Inicio',
    docs: 'Docs',
    wizard: 'Asistente',
    optimize: 'Optimizar',
    community: 'Comunidad',
    tools: 'Herramientas',
    templates: 'Plantillas',
    contribute: 'Contribuir',
    contributeOnGitHub: 'Contribuir en GitHub',
  },
  pt: {
    logo: 'THE VIBE CODING HANDBOOK',
    home: 'Início',
    docs: 'Docs',
    wizard: 'Assistente',
    optimize: 'Otimizar',
    community: 'Comunidade',
    tools: 'Ferramentas',
    templates: 'Modelos',
    contribute: 'Contribuir',
    contributeOnGitHub: 'Contribuir no GitHub',
  },
  zh: {
    logo: 'THE VIBE CODING HANDBOOK',
    home: '首页',
    docs: '文档',
    wizard: '向导',
    optimize: '优化',
    community: '社区',
    tools: '工具',
    templates: '模板',
    contribute: '贡献',
    contributeOnGitHub: '在 GitHub 上贡献',
  },
};

export default navigation;
