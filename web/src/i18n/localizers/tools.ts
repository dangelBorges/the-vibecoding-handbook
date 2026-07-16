import { tools } from '../../data/tools';
import type { Tool } from '../../data/tools';
import type { Locale } from '../config';

type ToolCopy = Pick<Tool, 'tagline' | 'bestFor' | 'pros' | 'cons' | 'pricing'>;
type Category = Tool['category'];

type FeatureLabels = {
  context: string;
  multiFile: string;
  terminal: string;
  uiGeneration: string;
  speed: string;
};

const featureLabels: Record<Locale, FeatureLabels> = {
  en: {
    context: 'Context',
    multiFile: 'Multi-file',
    terminal: 'Terminal',
    uiGeneration: 'UI Gen',
    speed: 'Speed',
  },
  es: {
    context: 'Contexto',
    multiFile: 'Multiarchivo',
    terminal: 'Terminal',
    uiGeneration: 'Gen. UI',
    speed: 'Velocidad',
  },
  pt: {
    context: 'Contexto',
    multiFile: 'Multiarquivo',
    terminal: 'Terminal',
    uiGeneration: 'Geração UI',
    speed: 'Velocidade',
  },
  zh: {
    context: '上下文',
    multiFile: '多文件',
    terminal: '终端',
    uiGeneration: 'UI 生成',
    speed: '速度',
  },
};

const categoryLabels: Record<Locale, Record<Category, string>> = {
  en: {
    ide: 'IDE',
    cli: 'CLI Agent',
    'app-builder': 'App Builder',
  },
  es: {
    ide: 'IDE',
    cli: 'Agente CLI',
    'app-builder': 'Constructor de apps',
  },
  pt: {
    ide: 'IDE',
    cli: 'Agente CLI',
    'app-builder': 'Construtor de apps',
  },
  zh: {
    ide: 'IDE',
    cli: 'CLI 智能体',
    'app-builder': '应用构建器',
  },
};

const categoryOptions: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: 'all', label: 'All Categories' },
    { value: 'ide', label: 'IDEs' },
    { value: 'cli', label: 'CLI Agents' },
    { value: 'app-builder', label: 'App Builders' },
  ],
  es: [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'ide', label: 'IDEs' },
    { value: 'cli', label: 'Agentes CLI' },
    { value: 'app-builder', label: 'Constructores de apps' },
  ],
  pt: [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'ide', label: 'IDEs' },
    { value: 'cli', label: 'Agentes CLI' },
    { value: 'app-builder', label: 'Construtores de apps' },
  ],
  zh: [
    { value: 'all', label: '所有分类' },
    { value: 'ide', label: 'IDEs' },
    { value: 'cli', label: 'CLI 智能体' },
    { value: 'app-builder', label: '应用构建器' },
  ],
};

const toolLocalizations: Record<string, Record<Locale, ToolCopy>> = {
  cursor: {
    en: {
      tagline: 'The AI-native code editor',
      bestFor: 'Full-stack developers working on production codebases',
      pricing: 'Free tier, Pro $20/mo, Business $40/user/mo',
      pros: [
        'Native AI integration (no plugins)',
        'Excellent codebase context awareness',
        'Composer for multi-file edits',
        'Fast and responsive UI',
        'Large community and ecosystem',
      ],
      cons: [
        'VS Code fork (slight delay on updates)',
        'Can be aggressive with auto-suggestions',
        'Requires paid plan for heavy usage',
        'Some features locked behind paywall',
      ],
    },
    es: {
      tagline: 'El editor de código nativo con IA',
      bestFor: 'Desarrolladores full-stack que trabajan en bases de código en producción',
      pricing: 'Plan gratuito, Pro $20/mes, Business $40/usuario/mes',
      pros: [
        'Integración nativa de IA (sin plugins)',
        'Excelente conciencia de contexto del código',
        'Composer para ediciones multiarchivo',
        'UI rápida y responsiva',
        'Gran comunidad y ecosistema',
      ],
      cons: [
        'Fork de VS Code (ligero retraso en actualizaciones)',
        'Puede ser agresivo con sugerencias automáticas',
        'Requiere plan de pago para uso intensivo',
        'Algunas funciones detrás de muro de pago',
      ],
    },
    pt: {
      tagline: 'O editor de código nativo com IA',
      bestFor: 'Desenvolvedores full-stack trabalhando em bases de código em produção',
      pricing: 'Plano gratuito, Pro $20/mês, Business $40/usuário/mês',
      pros: [
        'Integração nativa de IA (sem plugins)',
        'Excelente consciência de contexto do código',
        'Composer para edições multiarquivo',
        'UI rápida e responsiva',
        'Grande comunidade e ecossistema',
      ],
      cons: [
        'Fork do VS Code (pequeno atraso nas atualizações)',
        'Pode ser agressivo com sugestões automáticas',
        'Requer plano pago para uso intensivo',
        'Alguns recursos bloqueados por paywall',
      ],
    },
    zh: {
      tagline: 'AI 原生代码编辑器',
      bestFor: '在生产线代码库中工作的全栈开发者',
      pricing: '免费版，Pro $20/月，Business $40/用户/月',
      pros: [
        '原生 AI 集成（无需插件）',
        '出色的代码库上下文感知',
        'Composer 多文件编辑',
        '快速响应的 UI',
        '庞大的社区和生态',
      ],
      cons: [
        'VS Code 分支（更新略有延迟）',
        '自动补全可能过于激进',
        '重度使用需付费计划',
        '部分功能需付费解锁',
      ],
    },
  },
  'claude-code': {
    en: {
      tagline: 'Terminal-based AI agent from Anthropic',
      bestFor: 'Architecture decisions, complex refactors, CLI workflows',
      pricing: 'Included with Claude Pro ($20/mo)',
      pros: [
        'Exceptional reasoning and planning',
        'Works with any editor or IDE',
        'Can execute commands and tests',
        'Deep context understanding',
        'Excellent for complex architecture',
      ],
      cons: [
        'Terminal-only (no GUI)',
        'Slower than IDE-integrated tools',
        'Higher cost for long sessions',
        'Steep learning curve',
      ],
    },
    es: {
      tagline: 'Agente de IA basado en terminal de Anthropic',
      bestFor: 'Decisiones de arquitectura, refactorizaciones complejas, flujos de CLI',
      pricing: 'Incluido con Claude Pro ($20/mes)',
      pros: [
        'Razonamiento y planificación excepcionales',
        'Funciona con cualquier editor o IDE',
        'Puede ejecutar comandos y pruebas',
        'Comprensión profunda del contexto',
        'Excelente para arquitectura compleja',
      ],
      cons: [
        'Solo terminal (sin GUI)',
        'Más lento que herramientas integradas en IDE',
        'Mayor costo para sesiones largas',
        'Curva de aprendizaje pronunciada',
      ],
    },
    pt: {
      tagline: 'Agente de IA baseado em terminal da Anthropic',
      bestFor: 'Decisões de arquitetura, refatorações complexas, fluxos de CLI',
      pricing: 'Incluído no Claude Pro ($20/mês)',
      pros: [
        'Raciocínio e planejamento excepcionais',
        'Funciona com qualquer editor ou IDE',
        'Pode executar comandos e testes',
        'Compreensão profunda do contexto',
        'Excelente para arquitetura complexa',
      ],
      cons: [
        'Apenas terminal (sem GUI)',
        'Mais lento que ferramentas integradas ao IDE',
        'Custo maior para sessões longas',
        'Curva de aprendizado íngreme',
      ],
    },
    zh: {
      tagline: 'Anthropic 的终端 AI 智能体',
      bestFor: '架构决策、复杂重构、CLI 工作流',
      pricing: '包含在 Claude Pro 中（$20/月）',
      pros: [
        '卓越的推理和规划能力',
        '可与任何编辑器或 IDE 配合使用',
        '可执行命令和测试',
        '深度上下文理解',
        '擅长复杂架构',
      ],
      cons: [
        '仅终端（无 GUI）',
        '比 IDE 集成工具慢',
        '长时间会话成本更高',
        '学习曲线陡峭',
      ],
    },
  },
  windsurf: {
    en: {
      tagline: 'Agentic IDE with cascade workflows',
      bestFor: 'Developers wanting a capable free alternative to Cursor',
      pricing: 'Free tier, Pro $12/mo',
      pros: [
        'Cascade agent plans and executes',
        'Generous free tier',
        'Good context understanding',
        'Competitive pricing',
        'Rapid feature development',
      ],
      cons: [
        'Smaller community than Cursor',
        'Some stability issues',
        'Less mature plugin ecosystem',
        'Documentation gaps',
      ],
    },
    es: {
      tagline: 'IDE agentico con flujos en cascada',
      bestFor: 'Desarrolladores que buscan una alternativa gratuita capaz a Cursor',
      pricing: 'Plan gratuito, Pro $12/mes',
      pros: [
        'El agente Cascade planifica y ejecuta',
        'Plan gratuito generoso',
        'Buena comprensión del contexto',
        'Precios competitivos',
        'Desarrollo rápido de funciones',
      ],
      cons: [
        'Comunidad más pequeña que Cursor',
        'Algunos problemas de estabilidad',
        'Ecosistema de plugins menos maduro',
        'Vacíos en documentación',
      ],
    },
    pt: {
      tagline: 'IDE agentico com fluxos em cascata',
      bestFor: 'Desenvolvedores que querem uma alternativa gratuita capaz ao Cursor',
      pricing: 'Plano gratuito, Pro $12/mês',
      pros: [
        'O agente Cascade planeja e executa',
        'Plano gratuito generoso',
        'Boa compreensão do contexto',
        'Preços competitivos',
        'Desenvolvimento rápido de recursos',
      ],
      cons: [
        'Comunidade menor que a do Cursor',
        'Alguns problemas de estabilidade',
        'Ecossistema de plugins menos maduro',
        'Lacunas na documentação',
      ],
    },
    zh: {
      tagline: '具备级联工作流的智能 IDE',
      bestFor: '想要一个功能强大的 Cursor 免费替代品的开发者',
      pricing: '免费版，Pro $12/月',
      pros: [
        'Cascade 智能体规划并执行',
        '慷慨的免费额度',
        '良好的上下文理解',
        '有竞争力的价格',
        '功能迭代迅速',
      ],
      cons: [
        '社区比 Cursor 小',
        '部分稳定性问题',
        '插件生态不够成熟',
        '文档存在缺口',
      ],
    },
  },
  v0: {
    en: {
      tagline: 'Generate UI with natural language',
      bestFor: 'Rapid UI prototyping, component generation',
      pricing: 'Free tier, Pro $20/mo',
      pros: [
        'Incredible UI generation from prompts',
        'Exports to Next.js + Tailwind',
        'Visual editing capabilities',
        'shadcn/ui integration',
        'Rapid prototyping',
      ],
      cons: [
        'Limited to UI components',
        'Not a full IDE',
        'Requires manual integration',
        'Less control over logic',
      ],
    },
    es: {
      tagline: 'Genera UI con lenguaje natural',
      bestFor: 'Prototipado rápido de UI, generación de componentes',
      pricing: 'Plan gratuito, Pro $20/mes',
      pros: [
        'Increíble generación de UI desde prompts',
        'Exporta a Next.js + Tailwind',
        'Capacidades de edición visual',
        'Integración con shadcn/ui',
        'Prototipado rápido',
      ],
      cons: [
        'Limitado a componentes UI',
        'No es un IDE completo',
        'Requiere integración manual',
        'Menor control sobre la lógica',
      ],
    },
    pt: {
      tagline: 'Gere UI com linguagem natural',
      bestFor: 'Prototipagem rápida de UI, geração de componentes',
      pricing: 'Plano gratuito, Pro $20/mês',
      pros: [
        'Geração incrível de UI a partir de prompts',
        'Exporta para Next.js + Tailwind',
        'Capacidades de edição visual',
        'Integração com shadcn/ui',
        'Prototipagem rápida',
      ],
      cons: [
        'Limitado a componentes UI',
        'Não é um IDE completo',
        'Requer integração manual',
        'Menor controle sobre a lógica',
      ],
    },
    zh: {
      tagline: '用自然语言生成 UI',
      bestFor: '快速 UI 原型设计、组件生成',
      pricing: '免费版，Pro $20/月',
      pros: [
        '通过提示词生成惊艳的 UI',
        '导出为 Next.js + Tailwind',
        '可视化编辑能力',
        '集成 shadcn/ui',
        '快速原型',
      ],
      cons: [
        '仅限于 UI 组件',
        '不是完整 IDE',
        '需要手动集成',
        '对逻辑控制较少',
      ],
    },
  },
  lovable: {
    en: {
      tagline: 'Full-stack apps with minimal code',
      bestFor: 'Rapid MVP development, prototypes, simple apps',
      pricing: 'Free tier, Pro $20/mo',
      pros: [
        'True full-stack generation',
        'Supabase integration',
        'GitHub sync',
        'One-click deploy',
        'Great for MVPs',
      ],
      cons: [
        'Less control over architecture',
        'Vendor lock-in concerns',
        'Limited customization',
        'Not suitable for complex apps',
      ],
    },
    es: {
      tagline: 'Apps full-stack con mínimo código',
      bestFor: 'Desarrollo rápido de MVP, prototipos, apps simples',
      pricing: 'Plan gratuito, Pro $20/mes',
      pros: [
        'Generación full-stack real',
        'Integración con Supabase',
        'Sincronización con GitHub',
        'Despliegue con un clic',
        'Ideal para MVPs',
      ],
      cons: [
        'Menor control sobre la arquitectura',
        'Preocupaciones de vendor lock-in',
        'Personalización limitada',
        'No apto para apps complejas',
      ],
    },
    pt: {
      tagline: 'Apps full-stack com mínimo de código',
      bestFor: 'Desenvolvimento rápido de MVP, protótipos, apps simples',
      pricing: 'Plano gratuito, Pro $20/mês',
      pros: [
        'Geração full-stack de verdade',
        'Integração com Supabase',
        'Sincronização com GitHub',
        'Deploy com um clique',
        'Ótimo para MVPs',
      ],
      cons: [
        'Menor controle sobre a arquitetura',
        'Preocupações com vendor lock-in',
        'Personalização limitada',
        'Não adequado para apps complexos',
      ],
    },
    zh: {
      tagline: '以最少代码构建全栈应用',
      bestFor: '快速 MVP 开发、原型、简单应用',
      pricing: '免费版，Pro $20/月',
      pros: [
        '真正的全栈生成',
        '集成 Supabase',
        'GitHub 同步',
        '一键部署',
        '非常适合 MVP',
      ],
      cons: [
        '对架构控制较少',
        '存在供应商锁定顾虑',
        '自定义能力有限',
        '不适合复杂应用',
      ],
    },
  },
  zed: {
    en: {
      tagline: 'The fast, collaborative code editor',
      bestFor: 'Speed-focused developers, pair programming',
      pricing: 'Free (open source)',
      pros: [
        'Extremely fast (Rust-native)',
        'Real-time collaboration',
        'Open source',
        'Growing AI features',
        'Minimal resource usage',
      ],
      cons: [
        'Smaller ecosystem than VS Code',
        'AI features less mature',
        'Limited extension library',
        'Mac-only (for now)',
      ],
    },
    es: {
      tagline: 'El editor de código rápido y colaborativo',
      bestFor: 'Desarrolladores enfocados en velocidad, pair programming',
      pricing: 'Gratuito (código abierto)',
      pros: [
        'Extremadamente rápido (nativo en Rust)',
        'Colaboración en tiempo real',
        'Código abierto',
        'Funciones de IA en crecimiento',
        'Uso mínimo de recursos',
      ],
      cons: [
        'Ecosistema menor que VS Code',
        'Funciones de IA menos maduras',
        'Biblioteca de extensiones limitada',
        'Solo Mac (por ahora)',
      ],
    },
    pt: {
      tagline: 'O editor de código rápido e colaborativo',
      bestFor: 'Desenvolvedores focados em velocidade, pair programming',
      pricing: 'Gratuito (código aberto)',
      pros: [
        'Extremamente rápido (nativo em Rust)',
        'Colaboração em tempo real',
        'Código aberto',
        'Recursos de IA em crescimento',
        'Uso mínimo de recursos',
      ],
      cons: [
        'Ecossistema menor que o VS Code',
        'Recursos de IA menos maduros',
        'Biblioteca de extensões limitada',
        'Apenas Mac (por enquanto)',
      ],
    },
    zh: {
      tagline: '快速、协作的代码编辑器',
      bestFor: '注重速度的开发者、结对编程',
      pricing: '免费（开源）',
      pros: [
        '极速（Rust 原生）',
        '实时协作',
        '开源',
        'AI 功能不断成长',
        '资源占用极低',
      ],
      cons: [
        '生态比 VS Code 小',
        'AI 功能尚不成熟',
        '扩展库有限',
        '目前仅支持 Mac',
      ],
    },
  },
};

export function getLocalizedTools(locale: Locale): Tool[] {
  return tools.map((tool) => {
    const localization = toolLocalizations[tool.id]?.[locale];
    return localization ? { ...tool, ...localization } : tool;
  });
}

export function getCategories(locale: Locale): { value: string; label: string }[] {
  return categoryOptions[locale];
}

export function getFeatureLabels(locale: Locale): FeatureLabels {
  return featureLabels[locale];
}

export function getCategoryLabels(locale: Locale): Record<Category, string> {
  return categoryLabels[locale];
}
