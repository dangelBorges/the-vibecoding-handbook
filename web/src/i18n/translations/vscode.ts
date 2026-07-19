import type { Namespace } from '../types';

const vscode: Namespace<{
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  feature1Label: string;
  feature1Desc: string;
  feature2Label: string;
  feature2Desc: string;
  feature3Label: string;
  feature3Desc: string;
  feature4Label: string;
  feature4Desc: string;
  feature5Label: string;
  feature5Desc: string;
  feature6Label: string;
  feature6Desc: string;
  feature7Label: string;
  feature7Desc: string;
  feature8Label: string;
  feature8Desc: string;
  feature9Label: string;
  feature9Desc: string;
  viewSource: string;
  panelTitle: string;
  policies: string;
  gitPolicy: string;
  security: string;
  testing: string;
  decisions: string;
  adr001: string;
  stack: string;
  score: string;
  scoreValue: string;
  fileName: string;
  projectContext: string;
  techStack: string;
  codingStandards: string;
  securityRules: string;
}> = {
  en: {
    badge: 'VS Code Extension',
    titleLine1: 'Governance',
    titleLine2: 'In Your IDE',
    description: 'The Vibe Coding extension brings the full CLI workflow into VS Code. Initialize projects, validate setup, review code, optimize prompts, plan tasks, and sync templates — without leaving your editor.',
    feature1Label: 'Policy Sidebar',
    feature1Desc: 'Browse policies in activity bar',
    feature2Label: 'Project Check',
    feature2Desc: 'Validate governance setup',
    feature3Label: 'Stack Detection',
    feature3Desc: 'Auto-detect framework',
    feature4Label: 'Refresh Context',
    feature4Desc: 'Update AGENTS.md',
    feature5Label: 'Optimize Prompt',
    feature5Desc: 'Transform vague → precise',
    feature6Label: 'Context Panel',
    feature6Desc: 'Rich project overview',
    feature7Label: 'Initialize Project',
    feature7Desc: 'Generate AGENTS.md & policies',
    feature8Label: 'Review Code',
    feature8Desc: 'Active, changed, staged, base',
    feature9Label: 'Chat & Sync',
    feature9Desc: 'Plans, prompts & templates',
    viewSource: 'View extension source',
    panelTitle: 'Vibe Coding',
    policies: 'Policies',
    gitPolicy: 'Git Policy ✓',
    security: 'Security ✓',
    testing: 'Testing ✓',
    decisions: 'Decisions',
    adr001: 'ADR-001 ✓',
    stack: 'Stack',
    score: 'Score:',
    scoreValue: '92%',
    fileName: 'AGENTS.md',
    projectContext: 'Project — Agent Context',
    techStack: 'Tech Stack',
    codingStandards: 'Coding Standards',
    securityRules: 'Security Rules',
  },
  es: {
    badge: 'Extensión de VS Code',
    titleLine1: 'Gobernanza',
    titleLine2: 'en tu IDE',
    description: 'La extensión Vibe Coding lleva el flujo completo del CLI a VS Code: inicializa proyectos, valida la configuración, revisa código, optimiza prompts, planifica tareas y sincroniza plantillas sin salir del editor.',
    feature1Label: 'Barra lateral de políticas',
    feature1Desc: 'Navega políticas en la barra de actividades',
    feature2Label: 'Revisión de proyecto',
    feature2Desc: 'Valida la configuración',
    feature3Label: 'Detección de stack',
    feature3Desc: 'Auto-detecta el framework',
    feature4Label: 'Actualizar contexto',
    feature4Desc: 'Actualiza AGENTS.md',
    feature5Label: 'Optimizar prompt',
    feature5Desc: 'De vago a preciso',
    feature6Label: 'Panel de contexto',
    feature6Desc: 'Vista general rica del proyecto',
    feature7Label: 'Inicializar proyecto',
    feature7Desc: 'Genera AGENTS.md y políticas',
    feature8Label: 'Revisar código',
    feature8Desc: 'Activo, cambiado, staged, base',
    feature9Label: 'Chat y Sync',
    feature9Desc: 'Planes, prompts y plantillas',
    viewSource: 'Ver código fuente de la extensión',
    panelTitle: 'Vibe Coding',
    policies: 'Políticas',
    gitPolicy: 'Política Git ✓',
    security: 'Seguridad ✓',
    testing: 'Pruebas ✓',
    decisions: 'Decisiones',
    adr001: 'ADR-001 ✓',
    stack: 'Stack',
    score: 'Puntuación:',
    scoreValue: '92%',
    fileName: 'AGENTS.md',
    projectContext: 'Proyecto — Contexto del agente',
    techStack: 'Stack tecnológico',
    codingStandards: 'Estándares de código',
    securityRules: 'Reglas de seguridad',
  },
  pt: {
    badge: 'Extensão do VS Code',
    titleLine1: 'Governança',
    titleLine2: 'no seu IDE',
    description: 'A extensão Vibe Coding traz o fluxo completo da CLI para o VS Code: inicialize projetos, valide a configuração, revise código, otimize prompts, planeje tarefas e sincronize modelos sem sair do editor.',
    feature1Label: 'Barra lateral de políticas',
    feature1Desc: 'Navegue políticas na barra de atividades',
    feature2Label: 'Verificação de projeto',
    feature2Desc: 'Valide a configuração',
    feature3Label: 'Detecção de stack',
    feature3Desc: 'Auto-detecta o framework',
    feature4Label: 'Atualizar contexto',
    feature4Desc: 'Atualiza AGENTS.md',
    feature5Label: 'Otimizar prompt',
    feature5Desc: 'De vago a preciso',
    feature6Label: 'Painel de contexto',
    feature6Desc: 'Visão geral rica do projeto',
    feature7Label: 'Inicializar projeto',
    feature7Desc: 'Gera AGENTS.md e políticas',
    feature8Label: 'Revisar código',
    feature8Desc: 'Ativo, alterado, staged, base',
    feature9Label: 'Chat e Sync',
    feature9Desc: 'Planos, prompts e modelos',
    viewSource: 'Ver código fonte da extensão',
    panelTitle: 'Vibe Coding',
    policies: 'Políticas',
    gitPolicy: 'Política Git ✓',
    security: 'Segurança ✓',
    testing: 'Testes ✓',
    decisions: 'Decisões',
    adr001: 'ADR-001 ✓',
    stack: 'Stack',
    score: 'Pontuação:',
    scoreValue: '92%',
    fileName: 'AGENTS.md',
    projectContext: 'Projeto — Contexto do agente',
    techStack: 'Stack tecnológico',
    codingStandards: 'Padrões de código',
    securityRules: 'Regras de segurança',
  },
  zh: {
    badge: 'VS Code 扩展',
    titleLine1: '在你的 IDE 中',
    titleLine2: '实现治理',
    description: 'Vibe Coding 扩展将完整的 CLI 工作流带入 VS Code：初始化项目、验证配置、审查代码、优化提示、规划任务并同步模板，无需离开编辑器。',
    feature1Label: '策略侧边栏',
    feature1Desc: '在活动栏浏览策略',
    feature2Label: '项目检查',
    feature2Desc: '验证治理配置',
    feature3Label: '栈检测',
    feature3Desc: '自动检测框架',
    feature4Label: '刷新上下文',
    feature4Desc: '更新 AGENTS.md',
    feature5Label: '优化 Prompt',
    feature5Desc: '从模糊到精确',
    feature6Label: '上下文面板',
    feature6Desc: '丰富的项目概览',
    feature7Label: '初始化项目',
    feature7Desc: '生成 AGENTS.md 和策略',
    feature8Label: '审查代码',
    feature8Desc: '当前、变更、暂存、基线',
    feature9Label: 'Chat 与 Sync',
    feature9Desc: '计划、提示与模板',
    viewSource: '查看扩展源码',
    panelTitle: 'Vibe Coding',
    policies: '策略',
    gitPolicy: 'Git 策略 ✓',
    security: '安全 ✓',
    testing: '测试 ✓',
    decisions: '决策',
    adr001: 'ADR-001 ✓',
    stack: '栈',
    score: '得分：',
    scoreValue: '92%',
    fileName: 'AGENTS.md',
    projectContext: '项目 — 智能体上下文',
    techStack: '技术栈',
    codingStandards: '编码规范',
    securityRules: '安全规则',
  },
};

export default vscode;
