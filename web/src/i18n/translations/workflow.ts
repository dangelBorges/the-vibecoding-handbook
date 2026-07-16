import type { Namespace } from '../types';

const workflow: Namespace<{
  title: string;
  subtitle: string;
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
    title: 'The Workflow',
    subtitle: 'Prompt → Generate → Review → Refine',
    step1Title: 'Prompt',
    step1Description: 'Write specs in natural language. Define constraints, provide examples, and set clear expectations. Good prompts include context, requirements, and acceptance criteria.',
    step2Title: 'Generate',
    step2Description: 'Choose the right model and context scope. Set up your agent with proper context files (AGENTS.md, .iderules) and let it generate the initial implementation.',
    step3Title: 'Review',
    step3Description: 'Never accept blindly. Check for security issues, architecture consistency, code quality, and test coverage. Treat AI output as code from a junior developer.',
    step4Title: 'Refine',
    step4Description: 'Iterate precisely. Use targeted follow-up prompts instead of "fix this." Provide specific feedback on what needs to change and why.',
  },
  es: {
    title: 'El flujo de trabajo',
    subtitle: 'Prompt → Generar → Revisar → Refinar',
    step1Title: 'Prompt',
    step1Description: 'Escribe especificaciones en lenguaje natural. Define restricciones, proporciona ejemplos y establece expectativas claras. Los buenos prompts incluyen contexto, requisitos y criterios de aceptación.',
    step2Title: 'Generar',
    step2Description: 'Elige el modelo y alcance de contexto adecuados. Configura tu agente con archivos de contexto apropiados (AGENTS.md, .iderules) y deja que genere la implementación inicial.',
    step3Title: 'Revisar',
    step3Description: 'Nunca aceptes a ciegas. Revisa problemas de seguridad, consistencia de arquitectura, calidad de código y cobertura de pruebas. Trata la salida de la IA como código de un desarrollador junior.',
    step4Title: 'Refinar',
    step4Description: 'Itera con precisión. Usa prompts de seguimiento específicos en lugar de "arregla esto". Proporciona retroalimentación concreta sobre qué cambiar y por qué.',
  },
  pt: {
    title: 'O fluxo de trabalho',
    subtitle: 'Prompt → Gerar → Revisar → Refinar',
    step1Title: 'Prompt',
    step1Description: 'Escreva especificações em linguagem natural. Defina restrições, forneça exemplos e estabeleça expectativas claras. Bons prompts incluem contexto, requisitos e critérios de aceitação.',
    step2Title: 'Gerar',
    step2Description: 'Escolha o modelo e o escopo de contexto certos. Configure seu agente com arquivos de contexto adequados (AGENTS.md, .iderules) e deixe-o gerar a implementação inicial.',
    step3Title: 'Revisar',
    step3Description: 'Nunca aceite cegamente. Verifique problemas de segurança, consistência de arquitetura, qualidade de código e cobertura de testes. Trate a saída da IA como código de um desenvolvedor júnior.',
    step4Title: 'Refinar',
    step4Description: 'Itere com precisão. Use prompts de acompanhamento direcionados em vez de "conserte isso". Forneça feedback específico sobre o que precisa mudar e por quê.',
  },
  zh: {
    title: '工作流',
    subtitle: '提示 → 生成 → 审查 → 优化',
    step1Title: '提示',
    step1Description: '用自然语言编写规格。定义约束、提供示例并设定明确预期。好的提示应包含上下文、需求和验收标准。',
    step2Title: '生成',
    step2Description: '选择合适的模型和上下文范围。使用恰当的上下文文件（AGENTS.md、.iderules）配置智能体，让它生成初始实现。',
    step3Title: '审查',
    step3Description: '不要盲目接受。检查安全问题、架构一致性、代码质量和测试覆盖率。把 AI 的输出当作初级开发者写的代码。',
    step4Title: '优化',
    step4Description: '精确迭代。使用有针对性的后续提示，而不是“修复这个”。提供具体反馈：需要改什么、为什么改。',
  },
};

export default workflow;
