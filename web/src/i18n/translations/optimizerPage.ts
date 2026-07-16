import type { Namespace } from '../types';

const optimizerPage: Namespace<{
  backToHome: string;
  badge: string;
  title: string;
  subtitle: string;
  detectedLabel: string;
  detectedFrom: string;
  yourPromptLabel: string;
  yourPromptPlaceholder: string;
  chars: string;
  tokens: string;
  clear: string;
  advancedOptions: string;
  additionalContextLabel: string;
  additionalContextHint: string;
  additionalContextPlaceholder: string;
  uploadAgentsLabel: string;
  uploadAgentsHint: string;
  uploadAgentsClick: string;
  uploadAgentsDrag: string;
  agentsLoaded: string;
  optimizeButton: string;
  emptyStateTitle: string;
  emptyStateHighlight: string;
  example1: string;
  example2: string;
  example3: string;
  improvementsCount_one: string;
  improvementsCount_other: string;
  estimatedTokens: string;
  optimizedPromptLabel: string;
  copy: string;
  copied: string;
  improvementsApplied: string;
  beforeVsAfter: string;
  originalLabel: string;
  optimizedLabel: string;
  moreContext: string;
  structure: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  step4Title: string;
  step4Description: string;
}> = {
  en: {
    backToHome: 'Back to home',
    badge: 'AI-Powered',
    title: 'Prompt Optimizer',
    subtitle:
      'Transform your vague ideas into structured, optimized prompts that AI agents can execute with precision. Detects intent, applies patterns, enriches with context.',
    detectedLabel: 'Detected:',
    detectedFrom: 'from:',
    yourPromptLabel: 'Your Prompt',
    yourPromptPlaceholder:
      "Describe what you need... e.g., 'Create a login page with email and Google auth'",
    chars: '{count} chars',
    tokens: '~{count} tokens',
    clear: 'Clear',
    advancedOptions: 'Advanced Options',
    additionalContextLabel: 'Additional Context (optional)',
    additionalContextHint:
      'Paste any relevant context about your project, stack, or patterns.',
    additionalContextPlaceholder:
      'We use Next.js 15 with Supabase, shadcn/ui components...',
    uploadAgentsLabel: 'Upload AGENTS.md',
    uploadAgentsHint:
      "We'll extract your project context and include it in the optimized prompt.",
    uploadAgentsClick: 'Click to upload AGENTS.md',
    uploadAgentsDrag: 'or drag and drop',
    agentsLoaded: 'AGENTS.md loaded',
    optimizeButton: 'Optimize Prompt',
    emptyStateTitle: 'Enter a prompt and click {highlight} to see the magic.',
    emptyStateHighlight: 'Optimize',
    example1: 'Try: "Create a user dashboard with analytics"',
    example2: 'Try: "Fix the login error when password is wrong"',
    example3: 'Try: "Add tests for the payment flow"',
    improvementsCount_one: '{count} improvement',
    improvementsCount_other: '{count} improvements',
    estimatedTokens: '~{count} tokens',
    optimizedPromptLabel: 'Optimized Prompt',
    copy: 'Copy',
    copied: 'Copied!',
    improvementsApplied: 'Improvements Applied',
    beforeVsAfter: 'Before vs After',
    originalLabel: 'Original',
    optimizedLabel: 'Optimized',
    moreContext: '(+{percent}%)',
    structure: 'Structure',
    howItWorksTitle: 'How the Optimizer Works',
    step1Title: 'Intent Detection',
    step1Description:
      "Analyzes your prompt to identify if it's a feature, bugfix, refactor, test, or docs task.",
    step2Title: 'Pattern Matching',
    step2Description:
      'Selects the best prompting pattern: RICE, STAR, Chain-of-Thought, Few-Shot, or Structured.',
    step3Title: 'Context Enrichment',
    step3Description:
      'Adds your project context from AGENTS.md to ground the AI in your specific stack and conventions.',
    step4Title: 'Optimization',
    step4Description:
      'Generates a structured prompt with roles, constraints, acceptance criteria, and planning steps.',
  },
  es: {
    backToHome: 'Volver al inicio',
    badge: 'Potenciado por IA',
    title: 'Optimizador de prompts',
    subtitle:
      'Transforma tus ideas vagas en prompts estructurados y optimizados que los agentes de IA puedan ejecutar con precisión. Detecta intención, aplica patrones y enriquece con contexto.',
    detectedLabel: 'Detectado:',
    detectedFrom: 'de:',
    yourPromptLabel: 'Tu prompt',
    yourPromptPlaceholder:
      "Describe lo que necesitas... p. ej., 'Crea una página de inicio de sesión con email y Google'",
    chars: '{count} caracteres',
    tokens: '~{count} tokens',
    clear: 'Borrar',
    advancedOptions: 'Opciones avanzadas',
    additionalContextLabel: 'Contexto adicional (opcional)',
    additionalContextHint:
      'Pega cualquier contexto relevante sobre tu proyecto, stack o patrones.',
    additionalContextPlaceholder:
      'Usamos Next.js 15 con Supabase, componentes shadcn/ui...',
    uploadAgentsLabel: 'Subir AGENTS.md',
    uploadAgentsHint:
      'Extraeremos el contexto de tu proyecto y lo incluiremos en el prompt optimizado.',
    uploadAgentsClick: 'Haz clic para subir AGENTS.md',
    uploadAgentsDrag: 'o arrastra y suelta',
    agentsLoaded: 'AGENTS.md cargado',
    optimizeButton: 'Optimizar prompt',
    emptyStateTitle: 'Escribe un prompt y haz clic en {highlight} para ver la magia.',
    emptyStateHighlight: 'Optimizar',
    example1: 'Prueba: "Crea un dashboard de usuario con analíticas"',
    example2: 'Prueba: "Corrige el error de inicio de sesión cuando la contraseña es incorrecta"',
    example3: 'Prueba: "Añade tests para el flujo de pago"',
    improvementsCount_one: '{count} mejora',
    improvementsCount_other: '{count} mejoras',
    estimatedTokens: '~{count} tokens',
    optimizedPromptLabel: 'Prompt optimizado',
    copy: 'Copiar',
    copied: '¡Copiado!',
    improvementsApplied: 'Mejoras aplicadas',
    beforeVsAfter: 'Antes y después',
    originalLabel: 'Original',
    optimizedLabel: 'Optimizado',
    moreContext: '(+{percent}%)',
    structure: 'Estructura',
    howItWorksTitle: 'Cómo funciona el optimizador',
    step1Title: 'Detección de intención',
    step1Description:
      'Analiza tu prompt para identificar si es una tarea de feature, bugfix, refactor, test o documentación.',
    step2Title: 'Coincidencia de patrones',
    step2Description:
      'Selecciona el mejor patrón de prompting: RICE, STAR, Chain-of-Thought, Few-Shot o Structured.',
    step3Title: 'Enriquecimiento de contexto',
    step3Description:
      'Añade el contexto de tu proyecto desde AGENTS.md para situar a la IA en tu stack y convenciones específicas.',
    step4Title: 'Optimización',
    step4Description:
      'Genera un prompt estructurado con roles, restricciones, criterios de aceptación y pasos de planificación.',
  },
  pt: {
    backToHome: 'Voltar ao início',
    badge: 'Potenciado por IA',
    title: 'Otimizador de prompts',
    subtitle:
      'Transforme suas ideias vagas em prompts estruturados e otimizados que os agentes de IA possam executar com precisão. Detecta intenção, aplica padrões e enriquece com contexto.',
    detectedLabel: 'Detectado:',
    detectedFrom: 'de:',
    yourPromptLabel: 'Seu prompt',
    yourPromptPlaceholder:
      "Descreva o que você precisa... ex.: 'Crie uma página de login com email e Google'",
    chars: '{count} caracteres',
    tokens: '~{count} tokens',
    clear: 'Limpar',
    advancedOptions: 'Opções avançadas',
    additionalContextLabel: 'Contexto adicional (opcional)',
    additionalContextHint:
      'Cole qualquer contexto relevante sobre seu projeto, stack ou padrões.',
    additionalContextPlaceholder:
      'Usamos Next.js 15 com Supabase, componentes shadcn/ui...',
    uploadAgentsLabel: 'Enviar AGENTS.md',
    uploadAgentsHint:
      'Extrairemos o contexto do seu projeto e o incluiremos no prompt otimizado.',
    uploadAgentsClick: 'Clique para enviar AGENTS.md',
    uploadAgentsDrag: 'ou arraste e solte',
    agentsLoaded: 'AGENTS.md carregado',
    optimizeButton: 'Otimizar prompt',
    emptyStateTitle: 'Digite um prompt e clique em {highlight} para ver a mágica.',
    emptyStateHighlight: 'Otimizar',
    example1: 'Tente: "Crie um dashboard de usuário com analytics"',
    example2: 'Tente: "Corrija o erro de login quando a senha estiver errada"',
    example3: 'Tente: "Adicione tests para o fluxo de pagamento"',
    improvementsCount_one: '{count} melhoria',
    improvementsCount_other: '{count} melhorias',
    estimatedTokens: '~{count} tokens',
    optimizedPromptLabel: 'Prompt otimizado',
    copy: 'Copiar',
    copied: 'Copiado!',
    improvementsApplied: 'Melhorias aplicadas',
    beforeVsAfter: 'Antes e depois',
    originalLabel: 'Original',
    optimizedLabel: 'Otimizado',
    moreContext: '(+{percent}%)',
    structure: 'Estrutura',
    howItWorksTitle: 'Como funciona o otimizador',
    step1Title: 'Detecção de intenção',
    step1Description:
      'Analisa seu prompt para identificar se é uma tarefa de feature, bugfix, refactor, test ou documentação.',
    step2Title: 'Correspondência de padrões',
    step2Description:
      'Seleciona o melhor padrão de prompting: RICE, STAR, Chain-of-Thought, Few-Shot ou Structured.',
    step3Title: 'Enriquecimento de contexto',
    step3Description:
      'Adiciona o contexto do seu projeto a partir do AGENTS.md para situar a IA na sua stack e convenções específicas.',
    step4Title: 'Otimização',
    step4Description:
      'Gera um prompt estruturado com roles, restrições, critérios de aceitação e passos de planejamento.',
  },
  zh: {
    backToHome: '返回首页',
    badge: 'AI 驱动',
    title: 'Prompt 优化器',
    subtitle:
      '将模糊的想法转化为结构化、优化的提示词，让 AI 智能体精准执行。检测意图、应用模式、丰富上下文。',
    detectedLabel: '检测到：',
    detectedFrom: '来源：',
    yourPromptLabel: '你的提示词',
    yourPromptPlaceholder:
      "描述你的需求……例如：'创建一个支持邮箱和 Google 登录的登录页'",
    chars: '{count} 字符',
    tokens: '~{count} tokens',
    clear: '清空',
    advancedOptions: '高级选项',
    additionalContextLabel: '附加上下文（可选）',
    additionalContextHint: '粘贴与项目、技术栈或模式相关的任何上下文。',
    additionalContextPlaceholder: '我们使用 Next.js 15 + Supabase、shadcn/ui 组件……',
    uploadAgentsLabel: '上传 AGENTS.md',
    uploadAgentsHint: '我们将提取你的项目上下文，并将其包含在优化后的提示词中。',
    uploadAgentsClick: '点击上传 AGENTS.md',
    uploadAgentsDrag: '或拖拽至此',
    agentsLoaded: 'AGENTS.md 已加载',
    optimizeButton: '优化提示词',
    emptyStateTitle: '输入提示词并点击 {highlight}，见证魔法。',
    emptyStateHighlight: '优化',
    example1: '试试："创建一个带数据分析的用户仪表盘"',
    example2: '试试："修复密码错误时的登录报错"',
    example3: '试试："为支付流程添加测试"',
    improvementsCount_one: '{count} 项改进',
    improvementsCount_other: '{count} 项改进',
    estimatedTokens: '~{count} tokens',
    optimizedPromptLabel: '优化后的提示词',
    copy: '复制',
    copied: '已复制！',
    improvementsApplied: '已应用的改进',
    beforeVsAfter: '优化前后对比',
    originalLabel: '原始',
    optimizedLabel: '优化后',
    moreContext: '(+{percent}%)',
    structure: '结构',
    howItWorksTitle: '优化器如何工作',
    step1Title: '意图检测',
    step1Description: '分析你的提示词，识别它是功能、缺陷修复、重构、测试还是文档任务。',
    step2Title: '模式匹配',
    step2Description:
      '选择最佳提示词模式：RICE、STAR、Chain-of-Thought、Few-Shot 或 Structured。',
    step3Title: '上下文增强',
    step3Description: '从 AGENTS.md 添加项目上下文，让 AI 基于你的具体技术栈和规范展开工作。',
    step4Title: '优化',
    step4Description: '生成包含角色、约束、验收标准和规划步骤的结构化提示词。',
  },
};

export default optimizerPage;
