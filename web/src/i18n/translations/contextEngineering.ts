import type { Namespace } from '../types';

const contextEngineering: Namespace<{
  title: string;
  subtitle: string;
  description: string;
  strategy1Title: string;
  strategy1Description: string;
  strategy1Tag: string;
  strategy2Title: string;
  strategy2Description: string;
  strategy2Tag: string;
  strategy3Title: string;
  strategy3Description: string;
  strategy3Tag: string;
  strategy4Title: string;
  strategy4Description: string;
  strategy4Tag: string;
  strategy5Title: string;
  strategy5Description: string;
  strategy5Tag: string;
  cta: string;
}> = {
  en: {
    title: 'Context Engineering',
    subtitle: 'The secret to multi-file precision',
    description: 'Master the art of giving your AI the right context. Well-engineered context is the difference between generic code and production-quality output.',
    strategy1Title: 'AGENTS.md',
    strategy1Description: 'A project-level context file that defines your architecture, patterns, and constraints. The AI reads this first before any code generation.',
    strategy1Tag: 'Template included',
    strategy2Title: '.iderules',
    strategy2Description: 'IDE-specific rules that guide the AI agent in real-time. Define coding standards, file organization, and technology preferences.',
    strategy2Tag: 'Cursor / Windsurf',
    strategy3Title: 'Memory & Skills',
    strategy3Description: 'Persistent memory patterns that help AI agents remember your preferences across sessions and projects.',
    strategy3Tag: 'Advanced',
    strategy4Title: 'Multi-repo Context',
    strategy4Description: 'How to share context across multiple repositories when working with microservices or monorepos.',
    strategy4Tag: 'Monorepo',
    strategy5Title: 'Anti-patterns',
    strategy5Description: 'Common mistakes: inflated context, contradictory rules, over-specification. Learn what NOT to do.',
    strategy5Tag: 'Avoid these',
    cta: 'Read the Context Engineering Guide',
  },
  es: {
    title: 'Ingeniería de contexto',
    subtitle: 'El secreto de la precisión multiarchivo',
    description: 'Domina el arte de darle a tu IA el contexto adecuado. Un contexto bien diseñado marca la diferencia entre código genérico y código de calidad de producción.',
    strategy1Title: 'AGENTS.md',
    strategy1Description: 'Un archivo de contexto a nivel de proyecto que define tu arquitectura, patrones y restricciones. La IA lo lee primero antes de generar código.',
    strategy1Tag: 'Plantilla incluida',
    strategy2Title: '.iderules',
    strategy2Description: 'Reglas específicas del IDE que guían al agente de IA en tiempo real. Define estándares de código, organización de archivos y preferencias tecnológicas.',
    strategy2Tag: 'Cursor / Windsurf',
    strategy3Title: 'Memoria y habilidades',
    strategy3Description: 'Patrones de memoria persistente que ayudan a los agentes de IA a recordar tus preferencias entre sesiones y proyectos.',
    strategy3Tag: 'Avanzado',
    strategy4Title: 'Contexto multi-repo',
    strategy4Description: 'Cómo compartir contexto entre varios repositorios al trabajar con microservicios o monorepos.',
    strategy4Tag: 'Monorepo',
    strategy5Title: 'Anti-patrones',
    strategy5Description: 'Errores comunes: contexto inflado, reglas contradictorias, sobre-especificación. Aprende qué NO hacer.',
    strategy5Tag: 'Evita esto',
    cta: 'Lee la guía de ingeniería de contexto',
  },
  pt: {
    title: 'Engenharia de contexto',
    subtitle: 'O segredo da precisão multiarquivo',
    description: 'Domine a arte de dar à sua IA o contexto certo. Um contexto bem projetado faz a diferença entre código genérico e código de qualidade de produção.',
    strategy1Title: 'AGENTS.md',
    strategy1Description: 'Um arquivo de contexto em nível de projeto que define sua arquitetura, padrões e restrições. A IA lê isso primeiro antes de gerar código.',
    strategy1Tag: 'Modelo incluído',
    strategy2Title: '.iderules',
    strategy2Description: 'Regras específicas do IDE que guiam o agente de IA em tempo real. Defina padrões de código, organização de arquivos e preferências tecnológicas.',
    strategy2Tag: 'Cursor / Windsurf',
    strategy3Title: 'Memória e habilidades',
    strategy3Description: 'Padrões de memória persistente que ajudam os agentes de IA a lembrar suas preferências entre sessões e projetos.',
    strategy3Tag: 'Avançado',
    strategy4Title: 'Contexto multi-repo',
    strategy4Description: 'Como compartilhar contexto entre vários repositórios ao trabalhar com microsserviços ou monorepos.',
    strategy4Tag: 'Monorepo',
    strategy5Title: 'Anti-padrões',
    strategy5Description: 'Erros comuns: contexto inflado, regras contraditórias, super-especificação. Aprenda o que NÃO fazer.',
    strategy5Tag: 'Evite isso',
    cta: 'Leia o guia de engenharia de contexto',
  },
  zh: {
    title: '上下文工程',
    subtitle: '多文件精度的秘诀',
    description: '掌握为 AI 提供正确上下文的艺术。精心设计的上下文是通用代码与生产级代码之间的分水岭。',
    strategy1Title: 'AGENTS.md',
    strategy1Description: '项目级上下文文件，定义架构、模式和约束。AI 在生成代码之前会先读取它。',
    strategy1Tag: '包含模板',
    strategy2Title: '.iderules',
    strategy2Description: 'IDE 专用规则，实时指导 AI 智能体。定义编码标准、文件组织和技术偏好。',
    strategy2Tag: 'Cursor / Windsurf',
    strategy3Title: '记忆与技能',
    strategy3Description: '持久记忆模式，帮助 AI 智能体跨会话和项目记住你的偏好。',
    strategy3Tag: '高级',
    strategy4Title: '多仓库上下文',
    strategy4Description: '在使用微服务或 monorepo 时，如何在多个仓库之间共享上下文。',
    strategy4Tag: 'Monorepo',
    strategy5Title: '反模式',
    strategy5Description: '常见错误：上下文膨胀、相互矛盾的规则、过度规范。学习哪些事不要做。',
    strategy5Tag: '避免这些',
    cta: '阅读上下文工程指南',
  },
};

export default contextEngineering;
