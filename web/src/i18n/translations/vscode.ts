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
    description: 'The Vibe Coding extension brings project governance directly into VS Code. Browse policies, detect your stack, validate setup, and optimize prompts — without leaving your editor.',
    feature1Label: 'Policy Sidebar',
    feature1Desc: 'Browse policies in activity bar',
    feature2Label: 'Project Check',
    feature2Desc: '12 validation checks',
    feature3Label: 'Stack Detection',
    feature3Desc: 'Auto-detect framework',
    feature4Label: 'Refresh Context',
    feature4Desc: 'Update AGENTS.md',
    feature5Label: 'Optimize Prompt',
    feature5Desc: 'Transform vague → precise',
    feature6Label: 'Context Panel',
    feature6Desc: 'Rich project overview',
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
    description: 'La extensión Vibe Coding lleva la gobernanza del proyecto directamente a VS Code. Explora políticas, detecta tu stack, valida la configuración y optimiza prompts sin salir de tu editor.',
    feature1Label: 'Barra lateral de políticas',
    feature1Desc: 'Navega políticas en la barra de actividades',
    feature2Label: 'Revisión de proyecto',
    feature2Desc: '12 validaciones',
    feature3Label: 'Detección de stack',
    feature3Desc: 'Auto-detecta el framework',
    feature4Label: 'Actualizar contexto',
    feature4Desc: 'Actualiza AGENTS.md',
    feature5Label: 'Optimizar prompt',
    feature5Desc: 'De vago a preciso',
    feature6Label: 'Panel de contexto',
    feature6Desc: 'Vista general rica del proyecto',
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
    description: 'A extensão Vibe Coding traz a governança do projeto diretamente para o VS Code. Navegue políticas, detecte seu stack, valide a configuração e otimize prompts sem sair do editor.',
    feature1Label: 'Barra lateral de políticas',
    feature1Desc: 'Navegue políticas na barra de atividades',
    feature2Label: 'Verificação de projeto',
    feature2Desc: '12 validações',
    feature3Label: 'Detecção de stack',
    feature3Desc: 'Auto-detecta o framework',
    feature4Label: 'Atualizar contexto',
    feature4Desc: 'Atualiza AGENTS.md',
    feature5Label: 'Otimizar prompt',
    feature5Desc: 'De vago a preciso',
    feature6Label: 'Painel de contexto',
    feature6Desc: 'Visão geral rica do projeto',
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
    description: 'Vibe Coding 扩展将项目治理能力直接带入 VS Code。无需离开编辑器即可浏览策略、检测技术栈、验证配置并优化提示。',
    feature1Label: '策略侧边栏',
    feature1Desc: '在活动栏浏览策略',
    feature2Label: '项目检查',
    feature2Desc: '12 项验证',
    feature3Label: '栈检测',
    feature3Desc: '自动检测框架',
    feature4Label: '刷新上下文',
    feature4Desc: '更新 AGENTS.md',
    feature5Label: '优化 Prompt',
    feature5Desc: '从模糊到精确',
    feature6Label: '上下文面板',
    feature6Desc: '丰富的项目概览',
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
