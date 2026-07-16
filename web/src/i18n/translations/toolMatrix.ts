import type { Namespace } from '../types';

const toolMatrix: Namespace<{
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  toolsCompared: string;
  categories: string;
  skillLevels: string;
  cta: string;
}> = {
  en: {
    badge: 'Tool Comparison Matrix',
    titleLine1: 'Pick Your',
    titleLine2: 'Tool',
    description: 'A comparative matrix of the leading AI coding tools in 2026. Find the perfect fit for your workflow — from IDE integrations to full app builders.',
    toolsCompared: 'Tools compared',
    categories: 'Categories',
    skillLevels: 'Skill levels',
    cta: 'View Full Comparison',
  },
  es: {
    badge: 'Matriz de comparación de herramientas',
    titleLine1: 'Elige tu',
    titleLine2: 'herramienta',
    description: 'Una matriz comparativa de las principales herramientas de coding con IA en 2026. Encuentra la opción ideal para tu flujo de trabajo, desde integraciones con IDE hasta generadores completos de apps.',
    toolsCompared: 'Herramientas comparadas',
    categories: 'Categorías',
    skillLevels: 'Niveles de habilidad',
    cta: 'Ver comparación completa',
  },
  pt: {
    badge: 'Matriz de comparação de ferramentas',
    titleLine1: 'Escolha sua',
    titleLine2: 'ferramenta',
    description: 'Uma matriz comparativa das principais ferramentas de coding com IA em 2026. Encontre a opção ideal para seu fluxo de trabalho, desde integrações com IDE até construtores completos de apps.',
    toolsCompared: 'Ferramentas comparadas',
    categories: 'Categorias',
    skillLevels: 'Níveis de habilidade',
    cta: 'Ver comparação completa',
  },
  zh: {
    badge: '工具对比矩阵',
    titleLine1: '选择你的',
    titleLine2: '工具',
    description: '2026 年主流 AI 编程工具对比矩阵。从 IDE 集成到完整应用构建器，找到最适合你工作流的工具。',
    toolsCompared: '对比工具数',
    categories: '分类',
    skillLevels: '技能等级',
    cta: '查看完整对比',
  },
};

export default toolMatrix;
