import type { Namespace } from '../types';

const cli: Namespace<{
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  installLabel: string;
  command: string;
  viewSource: string;
  terminalTitle: string;
  scanning: string;
  detected: string;
  auth: string;
  db: string;
  payments: string;
  tests: string;
  updatedAgents: string;
  updatedIdeRules: string;
  agentUnderstands: string;
  score: string;
  resultSummary: string;
  chatDetected: string;
  question1: string;
  question2: string;
  planSaved: string;
  promptSaved: string;
  pasteInstruction: string;
}> = {
  en: {
    badge: 'Command Line Tool',
    titleLine1: 'Take It To',
    titleLine2: 'Your Terminal',
    description: '7 commands that scan your actual codebase — not templates — to generate intelligent context. Your AI agent will write dramatically better code when it truly understands your project.',
    installLabel: 'Install globally',
    command: 'npm install -g @vibecoding/cli',
    viewSource: 'View CLI source on GitHub',
    terminalTitle: 'vibe — terminal',
    scanning: 'Scanning your codebase...',
    detected: 'Detected',
    auth: 'Auth',
    db: 'DB',
    payments: 'Payments',
    tests: 'Tests',
    updatedAgents: 'Updated AGENTS.md (142 lines)',
    updatedIdeRules: 'Updated .iderules',
    agentUnderstands: 'Your AI agent now understands your project.',
    score: 'Score',
    resultSummary: '5 passed · 2 warnings · 0 errors',
    chatDetected: 'Detected: Feature',
    question1: 'What do you want to do?',
    question2: 'Which components affected?',
    planSaved: 'Plan saved to vibe-plan.md',
    promptSaved: 'Prompt saved to vibe-prompt.md',
    pasteInstruction: 'Paste into Cursor, ChatGPT, or Claude.',
  },
  es: {
    badge: 'Herramienta de línea de comandos',
    titleLine1: 'Llévalo a',
    titleLine2: 'tu terminal',
    description: '7 comandos que escanean tu código real — no plantillas — para generar contexto inteligente. Tu agente de IA escribirá código mucho mejor cuando realmente entienda tu proyecto.',
    installLabel: 'Instalar globalmente',
    command: 'npm install -g @vibecoding/cli',
    viewSource: 'Ver código fuente del CLI en GitHub',
    terminalTitle: 'vibe — terminal',
    scanning: 'Escaneando tu código...',
    detected: 'Detectado',
    auth: 'Auth',
    db: 'BD',
    payments: 'Pagos',
    tests: 'Pruebas',
    updatedAgents: 'AGENTS.md actualizado (142 líneas)',
    updatedIdeRules: '.iderules actualizado',
    agentUnderstands: 'Tu agente de IA ahora entiende tu proyecto.',
    score: 'Puntuación',
    resultSummary: '5 aprobados · 2 advertencias · 0 errores',
    chatDetected: 'Detectado: Feature',
    question1: '¿Qué quieres hacer?',
    question2: '¿Qué componentes se ven afectados?',
    planSaved: 'Plan guardado en vibe-plan.md',
    promptSaved: 'Prompt guardado en vibe-prompt.md',
    pasteInstruction: 'Pega en Cursor, ChatGPT o Claude.',
  },
  pt: {
    badge: 'Ferramenta de linha de comando',
    titleLine1: 'Leve para',
    titleLine2: 'o seu terminal',
    description: '7 comandos que escaneiam seu código real — não templates — para gerar contexto inteligente. Seu agente de IA escreverá código muito melhor quando realmente entender seu projeto.',
    installLabel: 'Instalar globalmente',
    command: 'npm install -g @vibecoding/cli',
    viewSource: 'Ver código fonte da CLI no GitHub',
    terminalTitle: 'vibe — terminal',
    scanning: 'Escaneando seu código...',
    detected: 'Detectado',
    auth: 'Auth',
    db: 'BD',
    payments: 'Pagamentos',
    tests: 'Testes',
    updatedAgents: 'AGENTS.md atualizado (142 linhas)',
    updatedIdeRules: '.iderules atualizado',
    agentUnderstands: 'Seu agente de IA agora entende seu projeto.',
    score: 'Pontuação',
    resultSummary: '5 aprovados · 2 avisos · 0 erros',
    chatDetected: 'Detectado: Feature',
    question1: 'O que você quer fazer?',
    question2: 'Quais componentes são afetados?',
    planSaved: 'Plano salvo em vibe-plan.md',
    promptSaved: 'Prompt salvo em vibe-prompt.md',
    pasteInstruction: 'Cole no Cursor, ChatGPT ou Claude.',
  },
  zh: {
    badge: '命令行工具',
    titleLine1: '把它带到',
    titleLine2: '你的终端',
    description: '7 个命令扫描你的实际代码库——而非模板——以生成智能上下文。当 AI 智能体真正理解你的项目时，它会写出好得多的代码。',
    installLabel: '全局安装',
    command: 'npm install -g @vibecoding/cli',
    viewSource: '在 GitHub 上查看 CLI 源码',
    terminalTitle: 'vibe — terminal',
    scanning: '正在扫描你的代码库...',
    detected: '检测到',
    auth: '认证',
    db: '数据库',
    payments: '支付',
    tests: '测试',
    updatedAgents: '已更新 AGENTS.md（142 行）',
    updatedIdeRules: '已更新 .iderules',
    agentUnderstands: '你的 AI 智能体现在理解了你的项目。',
    score: '得分',
    resultSummary: '5 通过 · 2 警告 · 0 错误',
    chatDetected: '检测到：功能',
    question1: '你想做什么？',
    question2: '涉及哪些组件？',
    planSaved: '计划已保存至 vibe-plan.md',
    promptSaved: 'Prompt 已保存至 vibe-prompt.md',
    pasteInstruction: '粘贴到 Cursor、ChatGPT 或 Claude。',
  },
};

export default cli;
