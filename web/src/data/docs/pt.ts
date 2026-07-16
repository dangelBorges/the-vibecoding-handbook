export interface DocChapter {
  slug: string;
  title: string;
  description: string;
  sections: DocSection[];
}

export interface DocSection {
  id: string;
  title: string;
  content: string;
}

export const chapters: DocChapter[] = [
  {
    slug: 'fundamentals',
    title: '1. Fundamentos',
    description: 'O que é vibe coding, de onde veio e quando usá-lo.',
    sections: [
      {
        id: 'what-is-vibe-coding',
        title: 'O que é Vibe Coding?',
        content: `O vibe coding é uma abordagem de desenvolvimento AI-first na qual você descreve o que deseja em linguagem natural e agentes de IA geram o código. O termo foi criado por Andrej Karpathy no início de 2025 e desde então evoluiu para uma disciplina estruturada.

**A Ideia Central**
Em vez de escrever cada linha de código manualmente, você:
1. Descreve o recurso ou correção de que precisa
2. Fornece contexto (seu codebase, padrões, restrições)
3. Revisa a saída gerada pela IA
4. Itera com prompts de acompanhamento precisos

**Evolução: 2025 → 2026**
- **2025 (O Velho Oeste)**: Early adopters experimentando com ChatGPT e Copilot. Muito "vibe", pouca estrutura.
- **2026 (A Disciplina)**: Ferramentas especializadas (Cursor, Claude Code), padrões de engenharia de contexto, checklists de produção e gates de segurança. O vibe coding tornou-se conscious vibe coding.

**Vibe Coding vs No-Code vs Desenvolvimento Tradicional**

| Aspecto | Vibe Coding | No-Code | Tradicional |
|---------|-------------|---------|-------------|
| Propriedade do código | Total | Limitada | Total |
| Flexibilidade | Alta | Baixa | Alta |
| Velocidade | Muito alta | Alta | Baixa |
| Curva de aprendizado | Média | Baixa | Alta |
| Pronto para produção | Sim (com gates) | Sim | Sim |

**O Espectro: Casual → Consciente → Pronto para Produção**
- **Casual**: "Faça um app de tarefas para mim" — protótipos rápidos, experimentos
- **Consciente**: Prompts estruturados, arquivos de contexto, checklists de revisão
- **Pronto para Produção**: Gates de segurança, tests, integração CI/CD`,
      },
      {
        id: 'when-to-use',
        title: 'Quando Usar Vibe Coding',
        content: `**Quando dizer SIM:**
- Prototipagem e MVPs
- Boilerplate e scaffolding
- Refatoração de código repetitivo
- Escrever tests (especialmente casos de borda)
- Documentação e comentários
- Aprender novos padrões ou APIs

**Quando dizer NÃO:**
- Código de segurança crítico (auth, criptografia)
- Transações financeiras e processamento de pagamentos
- Código que lida com PII (Informação de Identificação Pessoal)
- Lógica algorítmica complexa que exige conhecimento profundo do domínio
- Quando você não entende o que a IA gerou

**A Regra de Ouro**
> Se você não consegue explicar o que o código faz, não deveria enviá-lo para produção. O vibe coding amplifica suas habilidades — não substitui sua compreensão.`,
      },
    ],
  },
  {
    slug: 'workflow',
    title: '2. O Fluxo de Trabalho de 4 Fases',
    description: 'Prompt → Gerar → Revisar → Refinar. O fluxo de trabalho estruturado para resultados consistentes.',
    sections: [
      {
        id: 'phase-1-prompt',
        title: 'Fase 1: Prompt',
        content: `O prompt é sua especificação. Um bom prompt inclui:

**1. Definição de Papel**
\`\`\`
You are an expert senior TypeScript developer specializing in 
Next.js applications with 10+ years of experience.
\`\`\`

**2. Contexto**
\`\`\`
We are working on a SaaS dashboard application. The tech stack is:
- Next.js 15 (App Router)
- TypeScript with strict mode
- Tailwind CSS
- Prisma ORM with PostgreSQL
- tRPC for API routes
\`\`\`

**3. Descrição da Tarefa**
\`\`\`
Implement a user settings page that allows users to:
- Update their profile (name, avatar, bio)
- Change notification preferences
- Manage connected accounts (GitHub, Google)
- Delete their account with confirmation
\`\`\`

**4. Restrições e Padrões**
\`\`\`
- Follow the existing component structure in /src/components
- Use React Server Components where possible
- All forms must use react-hook-form with zod validation
- API routes must be protected with our auth middleware
\`\`\`

**5. Exemplos (Opcional mas poderoso)**
\`\`\`
Here's how we handle similar forms: [link to existing code]
The UI should match this design system: [link to Storybook]
\`\`\`

**Anti-padrões a evitar:**
- "Crie um site para mim" (muito vago)
- "Conserte isso" sem especificar o que está quebrado
- "Deixe melhor" (subjetivo)`,
      },
      {
        id: 'phase-2-generate',
        title: 'Fase 2: Gerar',
        content: `**Escolhendo o Modelo Certo**

| Modelo | Melhor Para | Custo | Velocidade |
|--------|-------------|-------|------------|
| Claude 4 Sonnet | A maioria das tarefas de código | $$ | Rápido |
| Claude 4 Opus | Arquitetura complexa | $$$ | Médio |
| GPT-4o | Tarefas rápidas, explicações | $$ | Rápido |
| o3-mini | Raciocínio profundo | $$ | Médio |

**Configurando o Contexto**
Antes de gerar, certifique-se de que seus arquivos de contexto estejam no lugar:
1. **AGENTS.md** na raiz do projeto
2. **.iderules** no seu IDE
3. **Skills/Memories** configurados (se sua ferramenta os suporta)

**Controle de Escopo**
Diga ao agente exatamente o que tocar:
\`\`\`
Only modify files in /src/app/settings/. 
Do not change the auth system or database schema.
Use the existing UI components from /src/components/ui.
\`\`\``,
      },
      {
        id: 'phase-3-review',
        title: 'Fase 3: Revisar',
        content: `**A Checklist de Revisão**

Cada alteração gerada deve passar por estes gates:

□ **Compila?** Execute a verificação de tipos antes de tudo.
\`\`\`
npm run typecheck
\`\`\`

□ **Os tests passam?**
\`\`\`
npm test
\`\`\`

□ **Varredura de segurança**: verifique:
- Segredos ou API keys hardcoded
- Vulnerabilidades de injeção SQL
- Riscos de XSS em saída voltada ao usuário
- Uso inseguro de eval() ou Function()

□ **Consistência arquitetural**: segue os padrões existentes?

□ **Sem dependências desnecessárias**: instalou pacotes que você não precisa?

□ **Casos de borda tratados**: estados vazios, erros, estados de carregamento?

□ **Acessibilidade**: rótulos ARIA adequados, navegação por teclado?

**Banderas Vermelhas — Rejeite Imediatamente:**
- Comentários como "// Generated by AI"
- Declarações console.log deixadas em código de produção
- Qualquer alteração em arquivos .env ou configuração
- Dependências de pacotes npm desconhecidos`,
      },
      {
        id: 'phase-4-refine',
        title: 'Fase 4: Refinar',
        content: `**Como Iterar Efetivamente**

Refinamento ruim:
\`\`\`
"This doesn't work. Fix it."
\`\`\`

Refinamento bom:
\`\`\`
"The form submission is failing with a 422 error. 
The issue is in the zod schema— the 'bio' field has a max length 
of 100 but the database column allows 500. Update the schema 
to match the database constraint and add proper error messaging 
that shows remaining characters as the user types."
\`\`\`

**O Método STAR para Refinamento:**
- **S**ituação: Qual é o estado atual?
- **T**arget: Qual deveria ser?
- **A**ção: O que especificamente precisa mudar?
- **R**estrições: O que NÃO deve mudar?

**Quando Recomeçar**
A iteração às vezes piora as coisas. Comece de novo quando:
- Você refinou mais de 3 vezes
- O código continua ficando mais complexo
- O agente parece preso em um loop
- Você não entende metade do que foi gerado`,
      },
    ],
  },
  {
    slug: 'context-engineering',
    title: '3. Engenharia de Contexto',
    description: 'O diferenciador. Como estruturar contexto para precisão multiarquivo.',
    sections: [
      {
        id: 'agents-md',
        title: 'Template AGENTS.md',
        content: `O arquivo AGENTS.md fica na raiz do seu projeto e serve como a "fonte da verdade" para agentes de IA que trabalham no seu codebase.

**Template:**
\`\`\`markdown
# Project Context

## Overview
[Brief description of what this project does]

## Tech Stack
- Framework: [e.g., Next.js 15]
- Language: [e.g., TypeScript 5.7]
- Styling: [e.g., Tailwind CSS v4]
- Database: [e.g., PostgreSQL via Prisma]
- Auth: [e.g., NextAuth.js v5]

## Architecture
- App Router structure in /src/app
- Shared components in /src/components
- Database schema in /prisma/schema.prisma
- API routes via tRPC in /src/server

## Coding Standards
- Use React Server Components by default
- Client components only when needed ("use client")
- All forms use react-hook-form + zod
- API responses follow { success: boolean, data?: T, error?: string }

## Patterns
[Link to or describe key patterns the agent should follow]

## Constraints
- Never expose database connection strings
- Always validate user input server-side
- Use our logger utility, not console.log
\`\`\``,
      },
      {
        id: 'ide-rules',
        title: '.iderules',
        content: `O arquivo .iderules fornece orientação em tempo real ao agente de IA em qualquer IDE que o leia (Cursor, Windsurf, Claude Code, etc.).

**Exemplo de .iderules:**
\`\`\`
# Global rules
- Always use TypeScript strict mode
- Prefer Server Components unless interactivity is needed
- Use the existing UI component library
- Follow the established file naming conventions

# Code style
- Use named exports, not default exports
- Props interfaces should be named {ComponentName}Props
- Use async/await, not .then()
- Error handling: always use try/catch with our error utilities

# Forbidden
- No any types
- No console.log in production code
- No inline styles (use Tailwind)
- No direct database queries from components
\`\`\``,
      },
      {
        id: 'anti-patterns',
        title: 'Anti-padrões de Contexto',
        content: `**1. Contexto Inflado**
Despejar seu codebase inteiro na janela de contexto. Isso confunde o agente e desperdiça tokens.

*Correção*: Seja seletivo. Inclua apenas arquivos e padrões relevantes.

**2. Regras Contraditórias**
Ter instruções conflitantes em AGENTS.md e .iderules.

*Correção*: Mantenha uma única fonte da verdade. AGENTS.md para nível de projeto, .iderules para estilo específico do IDE.

**3. Sobreespecificação**
Escrever 500 linhas de regras que ninguém lerá ou manterá.

*Correção*: Mantenha abaixo de 100 linhas. Foque nos 20% de regras que previnem 80% dos problemas.

**4. Contexto Obsoleto**
Arquivos de contexto que não são atualizados há meses.

*Correção*: Atualize os arquivos de contexto quando mudar seu stack ou padrões. Adicione isso à sua checklist de PR.`,
      },
    ],
  },
  {
    slug: 'tools',
    title: '4. Ferramentas 2026',
    description: 'Guia comparativo das principais ferramentas de codificação com IA de 2026.',
    sections: [
      {
        id: 'cursor',
        title: 'Cursor',
        content: `**Cursor** — O IDE construído para codificação com IA.

**Prós:**
- Integração nativa de IA (nenhum plugin necessário)
- Excelente consciência de contexto (lê seu codebase inteiro)
- Modo Composer para edições multiarquivo
- Rápido e responsivo

**Contras:**
- Fork do VS Code (ligeiramente atrás nas atualizações)
- Pode ser agressivo com auto-sugestões
- Planos pagos necessários para uso intenso

**Ideal para:** Desenvolvedores full-stack, codebases em produção
**Preços:** Nível gratuito, Pro $20/mês, Business $40/usuário/mês`,
      },
      {
        id: 'claude-code',
        title: 'Claude Code',
        content: `**Claude Code** — Agente de IA baseado em terminal da Anthropic.

**Prós:**
- Poderoso para tarefas arquiteturais complexas
- Excelente raciocínio e planejamento
- Funciona com qualquer editor
- Pode executar comandos e tests diretamente

**Contras:**
- Apenas terminal (sem GUI)
- Mais lento que ferramentas integradas ao IDE
- Custo mais alto para sessões estendidas

**Ideal para:** Decisões de arquitetura, refactors complexos, fluxos de trabalho CLI
**Preços:** Incluído com Claude Pro ($20/mês)`,
      },
      {
        id: 'windsurf',
        title: 'Windsurf',
        content: `**Windsurf** (anteriormente Codeium) — IDE agentico com fluxos de trabalho em cascata.

**Prós:**
- O agente Cascade pode planejar e executar tarefas de várias etapas
- O nível gratuito é generoso
- Boa compreensão de contexto

**Contras:**
- Comunidade menor que a do Cursor
- Alguns problemas de estabilidade
- Ecossistema menos maduro

**Ideal para:** Desenvolvedores que querem uma alternativa gratuita e capaz ao Cursor
**Preços:** Nível gratuito, Pro $12/mês`,
      },
      {
        id: 'others',
        title: 'Outras Ferramentas',
        content: `**v0** (Vercel)
- Ideal para: Geração de UI a partir de prompts
- Tipo: Construtor de apps
- Preços: Nível gratuito, Pro $20/mês

**Lovable**
- Ideal para: Apps full-stack com mínimo de código
- Tipo: Construtor de apps
- Preços: Nível gratuito, Pro $20/mês

**Replit Agent**
- Ideal para: Educação, protótipos rápidos
- Tipo: Cloud IDE + Agente
- Preços: Nível gratuito, Core $7/mês

**Zed**
- Ideal para: Desenvolvedores focados em velocidade
- Tipo: IDE nativo (Rust)
- Preços: Gratuito (open source)

**Aider**
- Ideal para: Amantes de terminal, fluxos de trabalho nativos do Git
- Tipo: Ferramenta CLI
- Preços: Gratuito (open source)`,
      },
    ],
  },
  {
    slug: 'prompting',
    title: '5. Prompting para Desenvolvedores',
    description: 'Técnicas de prompt engineering especificamente para tarefas de código.',
    sections: [
      {
        id: 'prompt-patterns',
        title: 'Padrões de Prompt',
        content: `**O Padrão RICE**
- **R**ole: Defina quem a IA deve ser
- **I**nstruction: O que fazer
- **C**ontext: Informações de background
- **E**xpectation: Formato de saída desejado

**O Padrão Chain-of-Thought**
Peça à IA para pensar passo a passo:
\`\`\`
"Before writing any code, plan the implementation:
1. What components will you need?
2. What API endpoints?
3. What database changes?
4. Share your plan, then implement."
\`\`\`

**O Padrão Few-Shot**
Forneça exemplos da saída desejada:
\`\`\`
"Here are examples of how we write API routes:
[example 1]
[example 2]

Now write a route for user preferences following the same pattern."
\`\`\``,
      },
      {
        id: 'prompt-library',
        title: 'Biblioteca de Prompts',
        content: `Visite nossa **Biblioteca de Prompts** interativa em /prompts com mais de 50 prompts prontos para uso organizados por:

- **Tipo de tarefa**: Feature, bugfix, refactor, test, docs
- **Ferramenta**: Cursor, Claude Code, Windsurf
- **Stack**: Next.js, Python, Rust, etc.

Cada prompt inclui:
- O texto completo do prompt (copie com um clique)
- Quando usá-lo
- Saída esperada
- Prompts de acompanhamento comuns`,
      },
    ],
  },
  {
    slug: 'stack-patterns',
    title: '6. Padrões de Stack',
    description: 'Combinações de stack testadas em batalha para desenvolvimento AI-first.',
    sections: [
      {
        id: 'nextjs-stack',
        title: 'Next.js + TypeScript + Tailwind',
        content: `**O Stack Recomendado**

\`\`\`
Next.js 15 (App Router)
├── TypeScript 5.7 (strict)
├── Tailwind CSS v4
├── shadcn/ui components
├── Prisma ORM
├── PostgreSQL
├── tRPC or Server Actions
├── NextAuth.js v5
└── Vercel (deploy)
\`\`\`

**Por que este stack para vibe coding?**
- TypeScript detecta erros de tipo gerados por IA
- Tailwind é fácil para a IA gerar corretamente
- shadcn/ui fornece padrões de componentes consistentes
- O esquema do Prisma é auto-documentado
- App Router dá limites claros para agentes de IA`,
      },
      {
        id: 'project-structure',
        title: 'Estrutura do Projeto',
        content: `**Estrutura de pastas amigável para IA:**

\`\`\`
my-app/
├── AGENTS.md              # Project context
├── .iderules              # IDE rules
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── (auth)/        # Route groups
│   │   ├── api/           # API routes
│   │   └── layout.tsx
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── [features]/    # Feature components
│   ├── lib/               # Utilities
│   ├── hooks/             # Custom hooks
│   ├── types/             # Shared types
│   └── server/            # Server-only code
├── prisma/
│   └── schema.prisma
└── tests/
\`\`\``,
      },
    ],
  },
  {
    slug: 'security',
    title: '7. Segurança e Produção',
    description: 'Gates de segurança e melhores práticas para código gerado por IA.',
    sections: [
      {
        id: 'security-mindset',
        title: 'A Mentalidade de Segurança',
        content: `**Trate a Saída da IA como Código Não Confiável**

Cada linha gerada por IA deve passar pelo mesmo escrutínio de um PR de um desenvolvedor júnior que você nunca conheceu.

**A Defesa de 3 Camadas:**
1. **Pré-geração**: Restrições claras em seus arquivos de contexto
2. **Pós-geração**: Varredura de segurança automatizada
3. **Pré-implantação**: Revisão humana para caminhos críticos

**Caminhos Críticos (Sempre Revisão Humana):**
- Autenticação e autorização
- Processamento de pagamentos
- Criptografia de dados
- Manuseio de PII
- Rate limiting de API`,
      },
      {
        id: 'security-tools',
        title: 'Ferramentas de Segurança',
        content: `**Stack Essencial de Segurança:**

| Ferramenta | Propósito |
|------------|-----------|
| GitLeaks | Detecção de segredos em commits |
| npm audit | Varredura de vulnerabilidades em dependências |
| Snyk | Monitoramento contínuo de dependências |
| ESLint security plugin | Análise estática para segurança |
| OWASP ZAP | Testes dinâmicos de segurança de aplicações |

**Hooks Pré-commit:**
\`\`\`json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run security:check"
    }
  }
}
\`\`\``,
      },
    ],
  },
  {
    slug: 'multi-agent',
    title: '8. Fluxos de Trabalho Multi-Agente',
    description: 'Padrões avançados usando múltiplos agentes de IA em conjunto.',
    sections: [
      {
        id: 'agent-roles',
        title: 'Papéis dos Agentes',
        content: `**A Orquestra de Agentes**

O vibe coding moderno usa agentes especializados:

1. **Planejador**: Analisa requisitos e cria planos de implementação
2. **Implementador**: Escreve o código real
3. **Revisor**: Verifica qualidade de código, segurança e consistência
4. **Tester**: Gera e executa tests

**Fluxo de Trabalho Exemplo:**
\`\`\`
[Planner] "Break down this feature into tasks"
    ↓
[Implementer] "Write the code for task 1"
    ↓
[Reviewer] "Review this code against our standards"
    ↓
[Tester] "Write tests for this implementation"
    ↓
[Human] Final review and merge
\`\`\``,
      },
      {
        id: 'subagents',
        title: 'Quando Usar Subagentes',
        content: `**Use subagentes quando:**
- A tarefa abrange vários domínios (frontend + backend + database)
- Você precisa de exploração paralela de diferentes abordagens
- O codebase é grande e você precisa de conhecimento especializado

**Não use subagentes quando:**
- A tarefa é simples e bem definida
- Compartilhar contexto entre agentes é difícil
- Você ainda está aprendendo o básico de vibe coding`,
      },
    ],
  },
  {
    slug: 'anti-patterns',
    title: '9. Anti-padrões e Debug',
    description: 'Erros comuns e como se recuperar deles.',
    sections: [
      {
        id: 'common-mistakes',
        title: 'Erros Comuns',
        content: `**"Aceitar Tudo" Sem Revisar**
O erro #1. A IA gera código que parece plausível e compila, mas tem bugs sutis.

*Correção*: Sempre revise. Use a checklist de revisão do Capítulo 2.

**Dívida Técnica Invisível**
A IA tende a:
- Duplicar código em vez de abstrair
- Adicionar dependências desnecessárias
- Ignorar tratamento de erros
- Escrever soluções excessivamente complexas

*Correção*: Sessões regulares de refatoração. Peça à IA para "simplificar isso" periodicamente.

**Perda de Contexto**
Conversas longas onde a IA esquece decisões anteriores.

*Correção*: Inicie threads novas para novos recursos. Consulte seu AGENTS.md frequentemente.`,
      },
      {
        id: 'recovery',
        title: 'Recuperando um Projeto Caótico',
        content: `**O Plano de Recuperação para a Bagunça Vibe Coded:**

1. **Pare de gerar** — Respire e avalie
2. **Documente a arquitetura pretendida** — Escreva como o sistema deveria ser
3. **Crie um branch limpo** — Não perca seu progresso
4. **Comece com tests** — Escreva tests para o comportamento desejado
5. **Gere contra os tests** — Use a IA para fazer os tests passarem
6. **Refatore sem piedade** — Delete código morto, consolide duplicatas
7. **Atualize arquivos de contexto** — Prevenha caos futuro

**Prevenção é Melhor que Cura:**
- Configure CI/CD cedo
- Escreva tests desde o primeiro dia
- Revise cada PR (mesmo os de IA)
- Mantenha seus arquivos de contexto atualizados`,
      },
    ],
  },
  {
    slug: 'resources',
    title: '10. Recursos',
    description: 'Listas awesome, comunidades e contas para seguir.',
    sections: [
      {
        id: 'awesome-list',
        title: 'Awesome Vibe Coding',
        content: `**Recursos Curados:**

**Comunidades:**
- r/cursor — Discussões específicas do Cursor
- r/vibecoding — Comunidade geral de vibe coding
- Discord: Vibe Coder Collective

**Newsletters:**
- Vibe Check Weekly
- AI-Assisted Dev Monthly

**Pessoas para Seguir:**
- @karpathy — Andrej Karpathy (criou o termo "vibe coding")
- @mengto — Design + IA
- @shadcn — Mago de componentes UI

**Ferramentas para Observar:**
- Fique de olho na nossa página /tools para as últimas atualizações`,
      },
      {
        id: 'changelog',
        title: 'Changelog',
        content: `**The Vibe Coding Handbook — Changelog**

**v1.0 (2026-01)**
- Lançamento inicial
- 10 capítulos
- Mais de 50 prompts
- Matriz de comparação de ferramentas

**Roadmap:**
- v1.1: Tradução para o espanhol, guias em vídeo
- v1.2: Padrões multi-agente avançados
- v2.0: Estudos de caso contribuídos pela comunidade`,
      },
    ],
  },
];

export function getChapterBySlug(slug: string): DocChapter | undefined {
  return chapters.find((c) => c.slug === slug);
}

export function getAllSlugs(): string[] {
  return chapters.map((c) => c.slug);
}
