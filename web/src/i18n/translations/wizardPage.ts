import type { Namespace } from '../types';

const wizardPage: Namespace<{
  // Wizard header
  backToHome: string;
  title: string;
  badge: string;
  intro: string;
  alertTitle: string;
  alertDescription: string;

  // Progress and navigation
  stepOf: string;
  percent: string;
  previous: string;
  next: string;
  generateSetup: string;

  // Sidebar recommendations
  smartRecommendation: string;
  basedOnProjectType: string;
  showRecommendations: string;
  applyAll: string;
  applyAllRecommendations: string;

  // Current setup summary
  currentSetup: string;
  summaryProject: string;
  summaryType: string;
  summaryFrontend: string;
  summaryBackend: string;
  summaryDatabase: string;
  summaryAuth: string;
  summaryHosting: string;

  // Project info step
  projectNameLabel: string;
  projectNamePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  projectTypeLabel: string;

  // Comparison card
  comparisonPros: string;
  comparisonCons: string;

  // AI recommendation
  aiRecommend: string;
  aiRationale: string;
  aiApply: string;
  aiLoading: string;

  // Generator header
  backToWizard: string;
  generatedBadge: string;
  generatorTitle: string;
  generatorSubtitle: string;
  generatorInfo: string;
  downloadAllZip: string;

  // Generator structure
  generatedStructure: string;

  // Generator tabs
  tabAgents: string;
  tabIderules: string;
  tabGit: string;
  tabSecurity: string;
  tabTesting: string;
  tabDeployment: string;
  tabAdr: string;

  // Generator stack
  yourStack: string;
  stackFrontend: string;
  stackBackend: string;
  stackDatabase: string;
  stackAuth: string;
  stackHosting: string;
  stackPayments: string;
  stackEmail: string;

  // Generator code actions
  copy: string;
  copied: string;
  download: string;

  // Next steps
  whatsNext: string;
  next1Title: string;
  next1Desc: string;
  next2Title: string;
  next2Desc: string;
  next3Title: string;
  next3Desc: string;
  readFullGuide: string;
  browsePromptLibrary: string;
  downloadMoreTemplates: string;
}> = {
  en: {
    backToHome: 'Back to home',
    title: 'Project Wizard',
    badge: 'Beta',
    intro: "Answer a few questions and we'll generate your complete project governance setup.",
    alertTitle: 'Generated from your answers, not your repo',
    alertDescription:
      "This wizard doesn't analyze your code — it builds governance from what you tell it. Answer for the project you actually have (or plan), and review the generated files before committing them: they're a starting point to adapt, not gospel.",
    stepOf: 'Step {current} of {total}',
    percent: '{progress}%',
    previous: 'Previous',
    next: 'Next',
    generateSetup: 'Generate Setup',
    smartRecommendation: 'Smart Recommendation',
    basedOnProjectType: 'Based on your project type ({projectType}), we recommend:',
    showRecommendations: 'Show Recommendations',
    applyAll: 'Apply All',
    applyAllRecommendations: 'Apply All Recommendations',
    aiRecommend: 'AI Recommendation',
    aiRationale: 'Get a tailored stack recommendation from an AI model based on your answers.',
    aiApply: 'Apply AI recommendation',
    aiLoading: 'Thinking...',
    currentSetup: 'Current Setup',
    summaryProject: 'Project',
    summaryType: 'Type',
    summaryFrontend: 'Frontend',
    summaryBackend: 'Backend',
    summaryDatabase: 'Database',
    summaryAuth: 'Auth',
    summaryHosting: 'Hosting',
    projectNameLabel: 'Project Name',
    projectNamePlaceholder: 'My Awesome SaaS',
    descriptionLabel: 'Description',
    descriptionPlaceholder: 'A SaaS invoicing platform for freelancers',
    projectTypeLabel: 'Project Type',
    comparisonPros: 'Pros',
    comparisonCons: 'Cons',
    backToWizard: 'Back to wizard',
    generatedBadge: 'Generated',
    generatorTitle: 'Your Project Setup',
    generatorSubtitle: 'Complete governance package generated.',
    generatorInfo:
      'Generated from your wizard answers, not an analysis of your repo — review and adapt before committing.',
    downloadAllZip: 'Download All as ZIP',
    generatedStructure: 'Generated Structure',
    tabAgents: 'AGENTS.md',
    tabIderules: '.iderules',
    tabGit: 'Git Policy',
    tabSecurity: 'Security',
    tabTesting: 'Testing',
    tabDeployment: 'Deployment',
    tabAdr: 'ADR-001',
    yourStack: 'Your Stack',
    stackFrontend: 'Frontend',
    stackBackend: 'Backend',
    stackDatabase: 'Database',
    stackAuth: 'Auth',
    stackHosting: 'Hosting',
    stackPayments: 'Payments',
    stackEmail: 'Email',
    copy: 'Copy',
    copied: 'Copied',
    download: 'Download',
    whatsNext: "What's Next?",
    next1Title: 'Download & Extract',
    next1Desc: 'Download the ZIP and extract it at your project root.',
    next2Title: 'Customize',
    next2Desc: 'Edit AGENTS.md with your project-specific details and patterns.',
    next3Title: 'Start Coding',
    next3Desc: 'Your AI agent now has full context. Start prompting with confidence.',
    readFullGuide: 'Read the full guide',
    browsePromptLibrary: 'Browse prompt library',
    downloadMoreTemplates: 'Download more templates',
  },
  es: {
    backToHome: 'Volver al inicio',
    title: 'Asistente de Proyecto',
    badge: 'Beta',
    intro:
      'Responde unas pocas preguntas y generaremos la configuración completa de gobernanza de tu proyecto.',
    alertTitle: 'Generado a partir de tus respuestas, no de tu repositorio',
    alertDescription:
      'Este asistente no analiza tu código: construye la gobernanza a partir de lo que le cuentas. Responde según el proyecto que realmente tienes (o planeas) y revisa los archivos generados antes de confirmarlos: son un punto de partida para adaptar, no una verdad absoluta.',
    stepOf: 'Paso {current} de {total}',
    percent: '{progress}%',
    previous: 'Anterior',
    next: 'Siguiente',
    generateSetup: 'Generar configuración',
    smartRecommendation: 'Recomendación inteligente',
    basedOnProjectType:
      'Basado en tu tipo de proyecto ({projectType}), recomendamos:',
    showRecommendations: 'Mostrar recomendaciones',
    applyAll: 'Aplicar todo',
    applyAllRecommendations: 'Aplicar todas las recomendaciones',
    aiRecommend: 'Recomendación con IA',
    aiRationale: 'Obtén una recomendación de stack personalizada por un modelo de IA basada en tus respuestas.',
    aiApply: 'Aplicar recomendación de IA',
    aiLoading: 'Pensando...',
    currentSetup: 'Configuración actual',
    summaryProject: 'Proyecto',
    summaryType: 'Tipo',
    summaryFrontend: 'Frontend',
    summaryBackend: 'Backend',
    summaryDatabase: 'Base de datos',
    summaryAuth: 'Autenticación',
    summaryHosting: 'Alojamiento',
    projectNameLabel: 'Nombre del proyecto',
    projectNamePlaceholder: 'Mi increíble SaaS',
    descriptionLabel: 'Descripción',
    descriptionPlaceholder: 'Una plataforma de facturación SaaS para autónomos',
    projectTypeLabel: 'Tipo de proyecto',
    comparisonPros: 'Ventajas',
    comparisonCons: 'Desventajas',
    backToWizard: 'Volver al asistente',
    generatedBadge: 'Generado',
    generatorTitle: 'Configuración de tu proyecto',
    generatorSubtitle: 'Paquete de gobernanza completo generado.',
    generatorInfo:
      'Generado a partir de tus respuestas del asistente, no de un análisis de tu repositorio: revísalo y adáptalo antes de confirmarlo.',
    downloadAllZip: 'Descargar todo como ZIP',
    generatedStructure: 'Estructura generada',
    tabAgents: 'AGENTS.md',
    tabIderules: '.iderules',
    tabGit: 'Política de Git',
    tabSecurity: 'Seguridad',
    tabTesting: 'Pruebas',
    tabDeployment: 'Despliegue',
    tabAdr: 'ADR-001',
    yourStack: 'Tu stack',
    stackFrontend: 'Frontend',
    stackBackend: 'Backend',
    stackDatabase: 'Base de datos',
    stackAuth: 'Autenticación',
    stackHosting: 'Alojamiento',
    stackPayments: 'Pagos',
    stackEmail: 'Correo',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Descargar',
    whatsNext: '¿Qué sigue?',
    next1Title: 'Descargar y extraer',
    next1Desc: 'Descarga el ZIP y extráelo en la raíz de tu proyecto.',
    next2Title: 'Personalizar',
    next2Desc:
      'Edita AGENTS.md con los detalles y patrones específicos de tu proyecto.',
    next3Title: 'Empezar a programar',
    next3Desc:
      'Tu agente de IA ahora tiene el contexto completo. Empieza a pedirle cosas con confianza.',
    readFullGuide: 'Leer la guía completa',
    browsePromptLibrary: 'Explorar biblioteca de prompts',
    downloadMoreTemplates: 'Descargar más plantillas',
  },
  pt: {
    backToHome: 'Voltar ao início',
    title: 'Assistente de Projeto',
    badge: 'Beta',
    intro:
      'Responda algumas perguntas e geraremos a configuração completa de governança do seu projeto.',
    alertTitle: 'Gerado a partir das suas respostas, não do seu repositório',
    alertDescription:
      'Este assistente não analisa seu código — ele constrói a governança a partir do que você conta. Responda pelo projeto que você realmente tem (ou planeja) e revise os arquivos gerados antes de confirmá-los: eles são um ponto de partida para adaptar, não uma verdade absoluta.',
    stepOf: 'Passo {current} de {total}',
    percent: '{progress}%',
    previous: 'Anterior',
    next: 'Próximo',
    generateSetup: 'Gerar configuração',
    smartRecommendation: 'Recomendação inteligente',
    basedOnProjectType:
      'Com base no tipo do seu projeto ({projectType}), recomendamos:',
    showRecommendations: 'Mostrar recomendações',
    applyAll: 'Aplicar tudo',
    applyAllRecommendations: 'Aplicar todas as recomendações',
    aiRecommend: 'Recomendação com IA',
    aiRationale: 'Obtenha uma recomendação de stack personalizada por um modelo de IA com base nas suas respostas.',
    aiApply: 'Aplicar recomendação de IA',
    aiLoading: 'Pensando...',
    currentSetup: 'Configuração atual',
    summaryProject: 'Projeto',
    summaryType: 'Tipo',
    summaryFrontend: 'Frontend',
    summaryBackend: 'Backend',
    summaryDatabase: 'Banco de dados',
    summaryAuth: 'Autenticação',
    summaryHosting: 'Hospedagem',
    projectNameLabel: 'Nome do projeto',
    projectNamePlaceholder: 'Meu incrível SaaS',
    descriptionLabel: 'Descrição',
    descriptionPlaceholder: 'Uma plataforma SaaS de faturamento para freelancers',
    projectTypeLabel: 'Tipo de projeto',
    comparisonPros: 'Prós',
    comparisonCons: 'Contras',
    backToWizard: 'Voltar ao assistente',
    generatedBadge: 'Gerado',
    generatorTitle: 'Configuração do seu projeto',
    generatorSubtitle: 'Pacote completo de governança gerado.',
    generatorInfo:
      'Gerado a partir das suas respostas no assistente, não de uma análise do seu repositório — revise e adapte antes de confirmar.',
    downloadAllZip: 'Baixar tudo como ZIP',
    generatedStructure: 'Estrutura gerada',
    tabAgents: 'AGENTS.md',
    tabIderules: '.iderules',
    tabGit: 'Política de Git',
    tabSecurity: 'Segurança',
    tabTesting: 'Testes',
    tabDeployment: 'Deploy',
    tabAdr: 'ADR-001',
    yourStack: 'Seu stack',
    stackFrontend: 'Frontend',
    stackBackend: 'Backend',
    stackDatabase: 'Banco de dados',
    stackAuth: 'Autenticação',
    stackHosting: 'Hospedagem',
    stackPayments: 'Pagamentos',
    stackEmail: 'E-mail',
    copy: 'Copiar',
    copied: 'Copiado',
    download: 'Baixar',
    whatsNext: 'E agora?',
    next1Title: 'Baixar e extrair',
    next1Desc: 'Baixe o ZIP e extraia-o na raiz do seu projeto.',
    next2Title: 'Personalizar',
    next2Desc:
      'Edite o AGENTS.md com os detalhes e padrões específicos do seu projeto.',
    next3Title: 'Começar a codar',
    next3Desc:
      'Seu agente de IA agora tem o contexto completo. Comece a pedir com confiança.',
    readFullGuide: 'Ler o guia completo',
    browsePromptLibrary: 'Navegar na biblioteca de prompts',
    downloadMoreTemplates: 'Baixar mais modelos',
  },
  zh: {
    backToHome: '返回首页',
    title: '项目向导',
    badge: 'Beta',
    intro: '回答几个问题，我们将生成完整的项目治理配置。',
    alertTitle: '根据你的回答生成，而非分析你的仓库',
    alertDescription:
      '此向导不会分析你的代码——它根据你提供的信息构建治理配置。请根据你实际拥有（或计划）的项目作答，并在提交前查看生成的文件：它们只是起点，请按需调整。',
    stepOf: '第 {current} 步，共 {total} 步',
    percent: '{progress}%',
    previous: '上一步',
    next: '下一步',
    generateSetup: '生成配置',
    smartRecommendation: '智能推荐',
    basedOnProjectType: '根据你的项目类型（{projectType}），我们推荐：',
    showRecommendations: '显示推荐',
    applyAll: '应用全部',
    applyAllRecommendations: '应用全部推荐',
    aiRecommend: 'AI 推荐',
    aiRationale: '根据你的回答，从 AI 模型获取量身定制的技术栈推荐。',
    aiApply: '应用 AI 推荐',
    aiLoading: '思考中……',
    currentSetup: '当前配置',
    summaryProject: '项目',
    summaryType: '类型',
    summaryFrontend: '前端',
    summaryBackend: '后端',
    summaryDatabase: '数据库',
    summaryAuth: '认证',
    summaryHosting: '托管',
    projectNameLabel: '项目名称',
    projectNamePlaceholder: '我的超棒 SaaS',
    descriptionLabel: '描述',
    descriptionPlaceholder: '一个面向自由职业者的 SaaS 发票平台',
    projectTypeLabel: '项目类型',
    comparisonPros: '优点',
    comparisonCons: '缺点',
    backToWizard: '返回向导',
    generatedBadge: '已生成',
    generatorTitle: '你的项目配置',
    generatorSubtitle: '已生成完整的治理方案。',
    generatorInfo:
      '根据向导回答生成，而非分析你的仓库——请在提交前查看并调整。',
    downloadAllZip: '下载全部为 ZIP',
    generatedStructure: '生成的结构',
    tabAgents: 'AGENTS.md',
    tabIderules: '.iderules',
    tabGit: 'Git 策略',
    tabSecurity: '安全',
    tabTesting: '测试',
    tabDeployment: '部署',
    tabAdr: 'ADR-001',
    yourStack: '你的技术栈',
    stackFrontend: '前端',
    stackBackend: '后端',
    stackDatabase: '数据库',
    stackAuth: '认证',
    stackHosting: '托管',
    stackPayments: '支付',
    stackEmail: '邮件',
    copy: '复制',
    copied: '已复制',
    download: '下载',
    whatsNext: '下一步？',
    next1Title: '下载并解压',
    next1Desc: '下载 ZIP 并解压到项目根目录。',
    next2Title: '自定义',
    next2Desc: '根据项目具体情况编辑 AGENTS.md。',
    next3Title: '开始编码',
    next3Desc: '你的 AI 智能体现在已掌握完整上下文。放心开始提问吧。',
    readFullGuide: '阅读完整指南',
    browsePromptLibrary: '浏览提示词库',
    downloadMoreTemplates: '下载更多模板',
  },
};

export default wizardPage;
