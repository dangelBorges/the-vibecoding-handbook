import type { Namespace } from '../types';

const hero: Namespace<{
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  launchWizard: string;
  installVsCodeExtension: string;
  installCli: string;
  chapters: string;
  prompts: string;
  pages: string;
  scroll: string;
}> = {
  en: {
    badge: 'Open Source · 2026 Edition',
    titleLine1: 'The Vibe',
    titleLine2: 'Coding',
    titleLine3: 'Handbook',
    subtitle: 'From vibes to production — the structured guide to AI-first development. The complete open-source handbook for coding with AI agents.',
    launchWizard: 'Launch Wizard',
    installVsCodeExtension: 'Install VS Code Extension',
    installCli: 'Install CLI',
    chapters: 'Chapters',
    prompts: 'Prompts',
    pages: 'Pages',
    scroll: 'Scroll',
  },
  es: {
    badge: 'Código abierto · Edición 2026',
    titleLine1: 'El Manual',
    titleLine2: 'de Vibe',
    titleLine3: 'Coding',
    subtitle: 'De las vibras a producción: la guía estructurada para el desarrollo con IA primero. El manual completo de código abierto para programar con agentes de IA.',
    launchWizard: 'Iniciar asistente',
    installVsCodeExtension: 'Instalar extensión de VS Code',
    installCli: 'Instalar CLI',
    chapters: 'Capítulos',
    prompts: 'Prompts',
    pages: 'Páginas',
    scroll: 'Desplazar',
  },
  pt: {
    badge: 'Código aberto · Edição 2026',
    titleLine1: 'O Manual',
    titleLine2: 'de Vibe',
    titleLine3: 'Coding',
    subtitle: 'Das vibrações à produção: o guia estruturado para desenvolvimento com IA primeiro. O manual completo de código aberto para programar com agentes de IA.',
    launchWizard: 'Iniciar assistente',
    installVsCodeExtension: 'Instalar extensão do VS Code',
    installCli: 'Instalar CLI',
    chapters: 'Capítulos',
    prompts: 'Prompts',
    pages: 'Páginas',
    scroll: 'Rolar',
  },
  zh: {
    badge: '开源 · 2026 版',
    titleLine1: 'Vibe',
    titleLine2: 'Coding',
    titleLine3: '手册',
    subtitle: '从灵感到生产——AI 优先开发的结构化指南。一本关于使用 AI 智能体编程的完整开源手册。',
    launchWizard: '启动向导',
    installVsCodeExtension: '安装 VS Code 扩展',
    installCli: '安装 CLI',
    chapters: '章节',
    prompts: 'Prompts',
    pages: '页面',
    scroll: '滚动',
  },
};

export default hero;
