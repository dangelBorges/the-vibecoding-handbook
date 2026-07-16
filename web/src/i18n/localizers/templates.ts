import { templates as curatedTemplates, type Template } from '../../data/templates';
import type { Locale } from '../config';
import templatesPage from '../translations/templatesPage';

type TemplatesPageKey = keyof typeof templatesPage.en;

const categoryLabelKeys: Record<Template['category'], TemplatesPageKey> = {
  context: 'categoryContext',
  rules: 'categoryRules',
  checklist: 'categoryChecklist',
  starter: 'categoryStarter',
};

const names: Record<Locale, Partial<Record<string, string>>> = {
  en: {},
  es: {
    'agents-md': 'AGENTS.md',
    iderules: '.iderules',
    'production-checklist': 'Lista de verificación de producción',
    'pr-review-template': 'Plantilla de revisión de PR',
    'project-starter-nextjs': 'Prompt de inicio para Next.js',
  },
  pt: {
    'agents-md': 'AGENTS.md',
    iderules: '.iderules',
    'production-checklist': 'Lista de verificação de produção',
    'pr-review-template': 'Modelo de revisão de PR',
    'project-starter-nextjs': 'Prompt inicial para Next.js',
  },
  zh: {
    'agents-md': 'AGENTS.md',
    iderules: '.iderules',
    'production-checklist': '生产检查清单',
    'pr-review-template': 'PR 审查模板',
    'project-starter-nextjs': 'Next.js 启动 Prompt',
  },
};

const descriptions: Record<Locale, Partial<Record<string, string>>> = {
  en: {},
  es: {
    'agents-md':
      'Archivo de contexto del proyecto que define la arquitectura, patrones y restricciones para agentes de IA.',
    iderules:
      'Reglas específicas del IDE que guían al agente de IA en tiempo real en los editores.',
    'production-checklist':
      'Lista de verificación previa al despliegue para código generado por IA. Imprímela y úsala en cada PR.',
    'pr-review-template':
      'Plantilla para revisar pull requests generadas por IA.',
    'project-starter-nextjs':
      'Prompt inicial para crear un proyecto Next.js con buenas prácticas.',
  },
  pt: {
    'agents-md':
      'Arquivo de contexto do projeto que define a arquitetura, padrões e restrições para agentes de IA.',
    iderules:
      'Regras específicas do IDE que orientam o agente de IA em tempo real nos editores.',
    'production-checklist':
      'Lista de verificação pré-implantação para código gerado por IA. Imprima e use em cada PR.',
    'pr-review-template':
      'Modelo para revisar pull requests geradas por IA.',
    'project-starter-nextjs':
      'Prompt inicial para criar um projeto Next.js com boas práticas.',
  },
  zh: {
    'agents-md':
      '定义 AI 智能体架构、模式和约束的项目上下文文件。',
    iderules:
      '在编辑器中实时指导 AI 智能体的 IDE 专用规则。',
    'production-checklist':
      'AI 生成代码的上线前检查清单。打印并在每次 PR 中使用。',
    'pr-review-template':
      '审查 AI 生成拉取请求的模板。',
    'project-starter-nextjs':
      '用最佳实践搭建 Next.js 项目的初始 prompt。',
  },
};

export type LocalizedTemplate = Template & {
  categoryLabel: string;
};

export function getLocalizedTemplates(locale: Locale): LocalizedTemplate[] {
  const strings = templatesPage[locale];
  const localeNames = names[locale];
  const localeDescriptions = descriptions[locale];

  return curatedTemplates.map((template) => ({
    ...template,
    name: localeNames[template.id] ?? template.name,
    description: localeDescriptions[template.id] ?? template.description,
    categoryLabel: strings[categoryLabelKeys[template.category]],
  }));
}

export function getCategoryLabel(
  locale: Locale,
  category: Template['category']
): string {
  const strings = templatesPage[locale];
  return strings[categoryLabelKeys[category]];
}

export function getCategories(
  locale: Locale
): { value: 'all' | Template['category']; label: string }[] {
  const strings = templatesPage[locale];
  const order: Template['category'][] = ['context', 'rules', 'checklist', 'starter'];

  return [
    { value: 'all', label: strings.categoryAll },
    ...order.map((category) => ({
      value: category,
      label: strings[categoryLabelKeys[category]],
    })),
  ];
}
