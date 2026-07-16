import type { Locale } from '../config';
import type {
  IntentType,
  ImprovementItem,
  PatternType,
} from '../../data/optimizer';

interface IntentLabel {
  label: string;
  color: string;
  bg: string;
}

const intentLabels: Record<Locale, Record<IntentType, IntentLabel>> = {
  en: {
    feature: { label: 'Feature', color: '#58A6B2', bg: 'rgba(88,166,178,0.1)' },
    bugfix: { label: 'Bug Fix', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    refactor: { label: 'Refactor', color: '#C792EA', bg: 'rgba(199,146,234,0.1)' },
    test: { label: 'Test', color: '#C3E88D', bg: 'rgba(195,232,141,0.1)' },
    docs: { label: 'Documentation', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    review: { label: 'Code Review', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
    unknown: { label: 'General', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
  },
  es: {
    feature: { label: 'Feature', color: '#58A6B2', bg: 'rgba(88,166,178,0.1)' },
    bugfix: { label: 'Bug Fix', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    refactor: { label: 'Refactor', color: '#C792EA', bg: 'rgba(199,146,234,0.1)' },
    test: { label: 'Test', color: '#C3E88D', bg: 'rgba(195,232,141,0.1)' },
    docs: { label: 'Documentación', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    review: { label: 'Revisión de código', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
    unknown: { label: 'General', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
  },
  pt: {
    feature: { label: 'Feature', color: '#58A6B2', bg: 'rgba(88,166,178,0.1)' },
    bugfix: { label: 'Bug Fix', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    refactor: { label: 'Refactor', color: '#C792EA', bg: 'rgba(199,146,234,0.1)' },
    test: { label: 'Test', color: '#C3E88D', bg: 'rgba(195,232,141,0.1)' },
    docs: { label: 'Documentação', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    review: { label: 'Revisão de código', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
    unknown: { label: 'Geral', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
  },
  zh: {
    feature: { label: '功能', color: '#58A6B2', bg: 'rgba(88,166,178,0.1)' },
    bugfix: { label: '缺陷修复', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    refactor: { label: '重构', color: '#C792EA', bg: 'rgba(199,146,234,0.1)' },
    test: { label: '测试', color: '#C3E88D', bg: 'rgba(195,232,141,0.1)' },
    docs: { label: '文档', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    review: { label: '代码审查', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
    unknown: { label: '通用', color: '#8B92A8', bg: 'rgba(139,146,168,0.1)' },
  },
};

const patternLabels: Record<Locale, Record<PatternType, string>> = {
  en: {
    rice: 'RICE (Role-Instruction-Constraint-Expectation)',
    star: 'STAR (Situation-Task-Action-Result)',
    'chain-of-thought': 'Chain-of-Thought',
    'few-shot': 'Few-Shot Learning',
    structured: 'Structured Documentation',
  },
  es: {
    rice: 'RICE (Rol-Instrucción-Restricción-Expectativa)',
    star: 'STAR (Situación-Tarea-Acción-Resultado)',
    'chain-of-thought': 'Chain-of-Thought',
    'few-shot': 'Few-Shot Learning',
    structured: 'Documentación estructurada',
  },
  pt: {
    rice: 'RICE (Papel-Instrução-Restrição-Expectativa)',
    star: 'STAR (Situação-Tarefa-Ação-Resultado)',
    'chain-of-thought': 'Chain-of-Thought',
    'few-shot': 'Few-Shot Learning',
    structured: 'Documentação estruturada',
  },
  zh: {
    rice: 'RICE（角色-指令-约束-期望）',
    star: 'STAR（情境-任务-行动-结果）',
    'chain-of-thought': 'Chain-of-Thought（思维链）',
    'few-shot': 'Few-Shot Learning（少样本学习）',
    structured: '结构化文档',
  },
};

interface ImprovementTemplates {
  structuredSections: string;
  roleContext: string;
  testingRequirements: string;
  typescriptConstraints: string;
  edgeCaseHandling: string;
  preImplementationPlanning: string;
  expandedContext: string;
  patternApplied: string;
  optimizedForAI: string;
}

const improvementTemplates: Record<Locale, ImprovementTemplates> = {
  en: {
    structuredSections: 'Added structured sections (Role, Context, Constraints)',
    roleContext: 'Added role definition and context',
    testingRequirements: 'Added testing requirements',
    typescriptConstraints: 'Added TypeScript constraints',
    edgeCaseHandling: 'Added edge case handling instructions',
    preImplementationPlanning: 'Added pre-implementation planning step',
    expandedContext:
      'Expanded from {originalLength} to {optimizedLength} chars ({percent}% more context)',
    patternApplied: 'Applied {pattern} pattern',
    optimizedForAI: 'Optimized for AI agent comprehension',
  },
  es: {
    structuredSections:
      'Se añadieron secciones estructuradas (Rol, Contexto, Restricciones)',
    roleContext: 'Se añadieron definición de rol y contexto',
    testingRequirements: 'Se añadieron requisitos de pruebas',
    typescriptConstraints: 'Se añadieron restricciones de TypeScript',
    edgeCaseHandling: 'Se añadieron instrucciones para manejar casos límite',
    preImplementationPlanning: 'Se añadió paso de planificación previo',
    expandedContext:
      'Expandido de {originalLength} a {optimizedLength} caracteres ({percent}% más de contexto)',
    patternApplied: 'Se aplicó el patrón {pattern}',
    optimizedForAI: 'Optimizado para la comprensión de agentes de IA',
  },
  pt: {
    structuredSections:
      'Seções estruturadas adicionadas (Papel, Contexto, Restrições)',
    roleContext: 'Definição de papel e contexto adicionados',
    testingRequirements: 'Requisitos de testes adicionados',
    typescriptConstraints: 'Restrições de TypeScript adicionadas',
    edgeCaseHandling: 'Instruções de tratamento de casos extremos adicionadas',
    preImplementationPlanning: 'Etapa de planejamento prévio adicionada',
    expandedContext:
      'Expandido de {originalLength} para {optimizedLength} caracteres ({percent}% mais contexto)',
    patternApplied: 'Padrão {pattern} aplicado',
    optimizedForAI: 'Otimizado para compreensão de agentes de IA',
  },
  zh: {
    structuredSections: '添加了结构化章节（角色、上下文、约束）',
    roleContext: '添加了角色定义和上下文',
    testingRequirements: '添加了测试要求',
    typescriptConstraints: '添加了 TypeScript 约束',
    edgeCaseHandling: '添加了边界情况处理说明',
    preImplementationPlanning: '添加了实施前规划步骤',
    expandedContext:
      '从 {originalLength} 扩展到 {optimizedLength} 字符（上下文增加 {percent}%）',
    patternApplied: '应用了 {pattern} 模式',
    optimizedForAI: '针对 AI 智能体理解进行优化',
  },
};

function formatImprovement(locale: Locale, item: ImprovementItem): string {
  const templates = improvementTemplates[locale];
  const data = item.data ?? {};

  switch (item.key) {
    case 'structuredSections':
      return templates.structuredSections;
    case 'roleContext':
      return templates.roleContext;
    case 'testingRequirements':
      return templates.testingRequirements;
    case 'typescriptConstraints':
      return templates.typescriptConstraints;
    case 'edgeCaseHandling':
      return templates.edgeCaseHandling;
    case 'preImplementationPlanning':
      return templates.preImplementationPlanning;
    case 'expandedContext': {
      const template = templates.expandedContext;
      return template
        .replace('{originalLength}', String(data.originalLength ?? ''))
        .replace('{optimizedLength}', String(data.optimizedLength ?? ''))
        .replace('{percent}', String(data.percent ?? ''));
    }
    case 'patternApplied': {
      const pattern = (data.pattern as PatternType) ?? 'rice';
      return templates.patternApplied.replace(
        '{pattern}',
        patternLabels[locale][pattern]
      );
    }
    case 'optimizedForAI':
      return templates.optimizedForAI;
    default:
      return '';
  }
}

const sectionTitles: Record<Locale, Record<string, string>> = {
  en: {
    Context: 'Context',
    Instruction: 'Instruction',
    Constraints: 'Constraints',
    'Expected Output': 'Expected Output',
    'Before you start': 'Before you start',
    Situation: 'Situation',
    Task: 'Task',
    'Action Required': 'Action Required',
    'Thinking Process': 'Thinking Process',
    'Output Format': 'Output Format',
    'Style Guide': 'Style Guide',
    'Examples of our testing style': 'Examples of our testing style',
    Requirements: 'Requirements',
  },
  es: {
    Context: 'Contexto',
    Instruction: 'Instrucción',
    Constraints: 'Restricciones',
    'Expected Output': 'Resultado esperado',
    'Before you start': 'Antes de empezar',
    Situation: 'Situación',
    Task: 'Tarea',
    'Action Required': 'Acción requerida',
    'Thinking Process': 'Proceso de razonamiento',
    'Output Format': 'Formato de salida',
    'Style Guide': 'Guía de estilo',
    'Examples of our testing style': 'Ejemplos de nuestro estilo de pruebas',
    Requirements: 'Requisitos',
  },
  pt: {
    Context: 'Contexto',
    Instruction: 'Instrução',
    Constraints: 'Restrições',
    'Expected Output': 'Resultado esperado',
    'Before you start': 'Antes de começar',
    Situation: 'Situação',
    Task: 'Tarefa',
    'Action Required': 'Ação necessária',
    'Thinking Process': 'Processo de raciocínio',
    'Output Format': 'Formato de saída',
    'Style Guide': 'Guia de estilo',
    'Examples of our testing style': 'Exemplos do nosso estilo de testes',
    Requirements: 'Requisitos',
  },
  zh: {
    Context: '上下文',
    Instruction: '指令',
    Constraints: '约束',
    'Expected Output': '预期输出',
    'Before you start': '开始之前',
    Situation: '情境',
    Task: '任务',
    'Action Required': '所需行动',
    'Thinking Process': '思考过程',
    'Output Format': '输出格式',
    'Style Guide': '风格指南',
    'Examples of our testing style': '测试风格示例',
    Requirements: '要求',
  },
};

export function getIntentLabels(locale: Locale): Record<IntentType, IntentLabel> {
  return intentLabels[locale];
}

export function getImprovements(
  locale: Locale,
  items: ImprovementItem[]
): string[] {
  return items.map((item) => formatImprovement(locale, item));
}

export function getSectionTitles(locale: Locale): Record<string, string> {
  return sectionTitles[locale];
}
