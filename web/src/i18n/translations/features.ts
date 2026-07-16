import type { Namespace } from '../types';

const features: Namespace<{
  badge: string;
  title: string;
  subtitle: string;
  explore: string;
  cliTitle: string;
  cliDescription: string;
  wizardTitle: string;
  wizardDescription: string;
  chaptersTitle: string;
  chaptersDescription: string;
  promptsTitle: string;
  promptsDescription: string;
  toolsTitle: string;
  toolsDescription: string;
  templatesTitle: string;
  templatesDescription: string;
  checklistsTitle: string;
  checklistsDescription: string;
  i18nTitle: string;
  i18nDescription: string;
}> = {
  en: {
    badge: "What's Inside",
    title: 'Everything You Need',
    subtitle: 'A complete toolkit for AI-first development. From your first prompt to production deployment.',
    explore: 'Explore',
    cliTitle: 'CLI Tool',
    cliDescription: 'npm install -g @vibecoding/cli. Run vibe init, vibe check, vibe context, and vibe optimize from your terminal.',
    wizardTitle: 'Project Wizard',
    wizardDescription: 'Answer a few questions and get a complete governance setup: AGENTS.md, .iderules, Git policy, Security policy, and more.',
    chaptersTitle: '10+ Chapters',
    chaptersDescription: 'From fundamentals to advanced multi-agent workflows. Structured guides covering every aspect of vibe coding.',
    promptsTitle: '50+ Prompts',
    promptsDescription: 'Copy-paste prompts for features, bugfixes, refactors, tests, and documentation. Filtered by tool and stack.',
    toolsTitle: 'Tool Comparisons',
    toolsDescription: 'Honest, detailed comparisons of Cursor, Claude Code, Windsurf, v0, and more. Matched to your skill level.',
    templatesTitle: 'Templates',
    templatesDescription: 'Download AGENTS.md, .iderules, project starters, and checklists. Ready to drop into your repo.',
    checklistsTitle: 'Production Checklists',
    checklistsDescription: 'Security gates, review checklists, and deployment guides. Ship AI-generated code with confidence.',
    i18nTitle: 'English · Español · Português · 中文',
    i18nDescription: 'Full i18n support from day one. The guide is available in English, Spanish, Portuguese, and Simplified Chinese.',
  },
  es: {
    badge: 'Qué incluye',
    title: 'Todo lo que necesitas',
    subtitle: 'Un kit completo para el desarrollo con IA primero. Desde tu primer prompt hasta el despliegue en producción.',
    explore: 'Explorar',
    cliTitle: 'Herramienta CLI',
    cliDescription: 'npm install -g @vibecoding/cli. Ejecuta vibe init, vibe check, vibe context y vibe optimize desde tu terminal.',
    wizardTitle: 'Asistente de proyecto',
    wizardDescription: 'Responde algunas preguntas y obtén una configuración de gobernanza completa: AGENTS.md, .iderules, política de Git, política de seguridad y más.',
    chaptersTitle: '10+ capítulos',
    chaptersDescription: 'Desde fundamentos hasta flujos avanzados multi-agente. Guías estructuradas que cubren cada aspecto del vibe coding.',
    promptsTitle: '50+ prompts',
    promptsDescription: 'Prompts listos para copiar sobre funcionalidades, corrección de errores, refactorizaciones, pruebas y documentación. Filtrados por herramienta y stack.',
    toolsTitle: 'Comparación de herramientas',
    toolsDescription: 'Comparaciones honestas y detalladas de Cursor, Claude Code, Windsurf, v0 y más. Adaptadas a tu nivel.',
    templatesTitle: 'Plantillas',
    templatesDescription: 'Descarga AGENTS.md, .iderules, starters de proyectos y checklists. Listos para usar en tu repo.',
    checklistsTitle: 'Checklists de producción',
    checklistsDescription: 'Controles de seguridad, checklists de revisión y guías de despliegue. Envía código generado por IA con confianza.',
    i18nTitle: 'English · Español · Português · 中文',
    i18nDescription: 'Soporte i18n completo desde el día uno. La guía está disponible en inglés, español, portugués y chino simplificado.',
  },
  pt: {
    badge: 'O que inclui',
    title: 'Tudo que você precisa',
    subtitle: 'Um kit completo para desenvolvimento com IA primeiro. Do seu primeiro prompt à implantação em produção.',
    explore: 'Explorar',
    cliTitle: 'Ferramenta CLI',
    cliDescription: 'npm install -g @vibecoding/cli. Execute vibe init, vibe check, vibe context e vibe optimize no seu terminal.',
    wizardTitle: 'Assistente de projeto',
    wizardDescription: 'Responda algumas perguntas e obtenha uma configuração completa de governança: AGENTS.md, .iderules, política de Git, política de segurança e mais.',
    chaptersTitle: '10+ capítulos',
    chaptersDescription: 'Dos fundamentos aos fluxos avançados multi-agente. Guias estruturados cobrindo cada aspecto do vibe coding.',
    promptsTitle: '50+ prompts',
    promptsDescription: 'Prompts prontos para copiar sobre recursos, correções de bugs, refatorações, testes e documentação. Filtrados por ferramenta e stack.',
    toolsTitle: 'Comparação de ferramentas',
    toolsDescription: 'Comparações honestas e detalhadas de Cursor, Claude Code, Windsurf, v0 e mais. Adequadas ao seu nível.',
    templatesTitle: 'Modelos',
    templatesDescription: 'Baixe AGENTS.md, .iderules, iniciadores de projeto e checklists. Prontos para colocar no seu repo.',
    checklistsTitle: 'Checklists de produção',
    checklistsDescription: 'Controles de segurança, checklists de revisão e guias de implantação. Envie código gerado por IA com confiança.',
    i18nTitle: 'English · Español · Português · 中文',
    i18nDescription: 'Suporte i18n completo desde o primeiro dia. O guia está disponível em inglês, espanhol, português e chinês simplificado.',
  },
  zh: {
    badge: '内容一览',
    title: '应有尽有',
    subtitle: '一套完整的 AI 优先开发工具包。从第一个提示到生产部署。',
    explore: '探索',
    cliTitle: 'CLI 工具',
    cliDescription: 'npm install -g @vibecoding/cli。在终端运行 vibe init、vibe check、vibe context 和 vibe optimize。',
    wizardTitle: '项目向导',
    wizardDescription: '回答几个问题，获得完整的项目治理配置：AGENTS.md、.iderules、Git 策略、安全策略等。',
    chaptersTitle: '10+ 章节',
    chaptersDescription: '从基础到高级多智能体工作流。结构化的指南涵盖 vibe coding 的方方面面。',
    promptsTitle: '50+ Prompts',
    promptsDescription: '可复制粘贴的提示，覆盖功能、Bug 修复、重构、测试和文档。可按工具和栈筛选。',
    toolsTitle: '工具对比',
    toolsDescription: 'Cursor、Claude Code、Windsurf、v0 等工具的诚实详细对比。匹配你的技能水平。',
    templatesTitle: '模板',
    templatesDescription: '下载 AGENTS.md、.iderules、项目启动模板和检查清单。直接放入你的仓库。',
    checklistsTitle: '生产检查清单',
    checklistsDescription: '安全门禁、审查检查清单和部署指南。放心发布 AI 生成的代码。',
    i18nTitle: 'English · Español · Português · 中文',
    i18nDescription: '从一开始就支持完整 i18n。指南提供英语、西班牙语、葡萄牙语和简体中文版本。',
  },
};

export default features;
