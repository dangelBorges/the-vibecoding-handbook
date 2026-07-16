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
    description: 'Qué es el vibe coding, de dónde viene y cuándo usarlo.',
    sections: [
      {
        id: 'what-is-vibe-coding',
        title: '¿Qué es Vibe Coding?',
        content: `El vibe coding es un enfoque de desarrollo AI-first en el que describes lo que quieres en lenguaje natural y los agentes de IA generan el código. El término fue acuñado por Andrej Karpathy a principios de 2025 y desde entonces ha evolucionado hasta convertirse en una disciplina estructurada.

**La Idea Central**
En lugar de escribir cada línea de código manualmente, tú:
1. Describes la funcionalidad o corrección que necesitas
2. Proporcionas contexto (tu codebase, patrones, restricciones)
3. Revisas el resultado generado por la IA
4. Iteras con prompts de seguimiento precisos

**Evolución: 2025 → 2026**
- **2025 (El Salvaje Oeste)**: Early adopters experimentando con ChatGPT y Copilot. Mucho "vibe", poca estructura.
- **2026 (La Disciplina)**: Herramientas especializadas (Cursor, Claude Code), patrones de ingeniería de contexto, checklists de producción y gates de seguridad. El vibe coding se convirtió en conscious vibe coding.

**Vibe Coding vs No-Code vs Desarrollo Tradicional**

| Aspecto | Vibe Coding | No-Code | Tradicional |
|---------|-------------|---------|-------------|
| Propiedad del código | Total | Limitada | Total |
| Flexibilidad | Alta | Baja | Alta |
| Velocidad | Muy alta | Alta | Baja |
| Curva de aprendizaje | Media | Baja | Alta |
| Listo para producción | Sí (con gates) | Sí | Sí |

**El Espectro: Casual → Consciente → Listo para Producción**
- **Casual**: "Hazme una app de tareas" — prototipos rápidos, experimentos
- **Consciente**: Prompts estructurados, archivos de contexto, checklists de revisión
- **Listo para Producción**: Gates de seguridad, tests, integración CI/CD`,
      },
      {
        id: 'when-to-use',
        title: 'Cuándo Usar Vibe Coding',
        content: `**Cuándo decir SÍ:**
- Prototipado y MVPs
- Boilerplate y scaffolding
- Refactorización de código repetitivo
- Escribir tests (especialmente casos límite)
- Documentación y comentarios
- Aprender nuevos patrones o APIs

**Cuándo decir NO:**
- Código de seguridad crítico (auth, cifrado)
- Transacciones financieras y procesamiento de pagos
- Código que maneja PII (Información de Identificación Personal)
- Lógica algorítmica compleja que requiera conocimiento profundo del dominio
- Cuando no entiendas lo que generó la IA

**La Regla de Oro**
> Si no puedes explicar qué hace el código, no deberías enviarlo a producción. El vibe coding amplifica tus habilidades: no reemplaza tu comprensión.`,
      },
    ],
  },
  {
    slug: 'workflow',
    title: '2. El Flujo de Trabajo de 4 Fases',
    description: 'Prompt → Generar → Revisar → Refinar. El flujo de trabajo estructurado para resultados consistentes.',
    sections: [
      {
        id: 'phase-1-prompt',
        title: 'Fase 1: Prompt',
        content: `El prompt es tu especificación. Un buen prompt incluye:

**1. Definición de Rol**
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

**3. Descripción de la Tarea**
\`\`\`
Implement a user settings page that allows users to:
- Update their profile (name, avatar, bio)
- Change notification preferences
- Manage connected accounts (GitHub, Google)
- Delete their account with confirmation
\`\`\`

**4. Restricciones y Patrones**
\`\`\`
- Follow the existing component structure in /src/components
- Use React Server Components where possible
- All forms must use react-hook-form with zod validation
- API routes must be protected with our auth middleware
\`\`\`

**5. Ejemplos (Opcional pero poderoso)**
\`\`\`
Here's how we handle similar forms: [link to existing code]
The UI should match this design system: [link to Storybook]
\`\`\`

**Anti-patrones a evitar:**
- "Hazme un sitio web" (demasiado vago)
- "Arregla esto" sin especificar qué está roto
- "Hazlo mejor" (subjetivo)`,
      },
      {
        id: 'phase-2-generate',
        title: 'Fase 2: Generar',
        content: `**Elegir el Modelo Correcto**

| Modelo | Mejor Para | Costo | Velocidad |
|--------|------------|-------|-----------|
| Claude 4 Sonnet | La mayoría de tareas de código | $$ | Rápido |
| Claude 4 Opus | Arquitectura compleja | $$$ | Medio |
| GPT-4o | Tareas rápidas, explicaciones | $$ | Rápido |
| o3-mini | Razonamiento profundo | $$ | Medio |

**Configurar el Contexto**
Antes de generar, asegúrate de que tus archivos de contexto estén en su lugar:
1. **AGENTS.md** en la raíz del proyecto
2. **.iderules** en tu IDE
3. **Skills/Memories** configurados (si tu herramienta los soporta)

**Control de Alcance**
Dile al agente exactamente qué tocar:
\`\`\`
Only modify files in /src/app/settings/. 
Do not change the auth system or database schema.
Use the existing UI components from /src/components/ui.
\`\`\``,
      },
      {
        id: 'phase-3-review',
        title: 'Fase 3: Revisar',
        content: `**El Checklist de Revisión**

Cada cambio generado debe pasar estos gates:

□ **¿Compila?** Ejecuta la comprobación de tipos antes que nada.
\`\`\`
npm run typecheck
\`\`\`

□ **¿Pasan los tests?**
\`\`\`
npm test
\`\`\`

□ **Escaneo de seguridad**: busca:
- Secretos o API keys hardcodeadas
- Vulnerabilidades de inyección SQL
- Riesgos de XSS en salidas orientadas al usuario
- Uso inseguro de eval() o Function()

□ **Consistencia de arquitectura**: ¿sigue los patrones existentes?

□ **Sin dependencias innecesarias**: ¿instaló paquetes que no necesitas?

□ **Casos límite manejados**: ¿estados vacíos, errores, estados de carga?

□ **Accesibilidad**: ¿etiquetas ARIA correctas, navegación por teclado?

**Banderas Rojas — Rechazar Inmediatamente:**
- Comentarios como "// Generated by AI"
- Sentencias console.log dejadas en código de producción
- Cualquier cambio en archivos .env o configuración
- Dependencias de paquetes npm desconocidos`,
      },
      {
        id: 'phase-4-refine',
        title: 'Fase 4: Refinar',
        content: `**Cómo Iterar Eficazmente**

Refinamiento malo:
\`\`\`
"This doesn't work. Fix it."
\`\`\`

Refinamiento bueno:
\`\`\`
"The form submission is failing with a 422 error. 
The issue is in the zod schema— the 'bio' field has a max length 
of 100 but the database column allows 500. Update the schema 
to match the database constraint and add proper error messaging 
that shows remaining characters as the user types."
\`\`\`

**El Método STAR para Refinar:**
- **S**ituación: ¿cuál es el estado actual?
- **T**arget: ¿qué debería ser?
- **A**cción: ¿qué específicamente necesita cambiar?
- **R**estricciones: ¿qué NO debería cambiar?

**Cuándo Empezar de Nuevo**
A veces iterar empeora las cosas. Empieza de nuevo cuando:
- Has refinado más de 3 veces
- El código sigue volviéndose más complejo
- El agente parece atascado en un bucle
- No entiendes la mitad de lo generado`,
      },
    ],
  },
  {
    slug: 'context-engineering',
    title: '3. Ingeniería de Contexto',
    description: 'El diferenciador. Cómo estructurar el contexto para precisión multiarchivo.',
    sections: [
      {
        id: 'agents-md',
        title: 'Plantilla AGENTS.md',
        content: `El archivo AGENTS.md vive en la raíz de tu proyecto y sirve como la "fuente de verdad" para los agentes de IA que trabajan en tu codebase.

**Plantilla:**
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
        content: `El archivo .iderules proporciona orientación en tiempo real al agente de IA en cualquier IDE que lo lea (Cursor, Windsurf, Claude Code, etc.).

**Ejemplo de .iderules:**
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
        title: 'Anti-patrones de Contexto',
        content: `**1. Contexto Inflado**
Volcar tu codebase completa en la ventana de contexto. Esto confunde al agente y desperdicia tokens.

*Solución*: Sé selectivo. Incluye solo archivos y patrones relevantes.

**2. Reglas Contradictorias**
Tener instrucciones contradictorias en AGENTS.md y .iderules.

*Solución*: Mantén una única fuente de verdad. AGENTS.md para el nivel de proyecto, .iderules para el estilo específico del IDE.

**3. Sobreespecificación**
Escribir 500 líneas de reglas que nadie leerá ni mantendrá.

*Solución*: Manténlo bajo 100 líneas. Enfócate en el 20% de reglas que previenen el 80% de problemas.

**4. Contexto Obsoleto**
Archivos de contexto que no se han actualizado en meses.

*Solución*: Actualiza los archivos de contexto cuando cambies tu stack o patrones. Añádelo a tu checklist de PR.`,
      },
    ],
  },
  {
    slug: 'tools',
    title: '4. Herramientas 2026',
    description: 'Guía comparativa de las principales herramientas de código con IA de 2026.',
    sections: [
      {
        id: 'cursor',
        title: 'Cursor',
        content: `**Cursor** — El IDE creado para programar con IA.

**Ventajas:**
- Integración nativa de IA (sin plugin necesario)
- Excelente conciencia de contexto (lee tu codebase completa)
- Modo Composer para ediciones multiarchivo
- Rápido y responsivo

**Contras:**
- Fork de VS Code (ligeramente rezagado en actualizaciones)
- Puede ser agresivo con las auto-sugerencias
- Planes de pago requeridos para uso intensivo

**Ideal para:** Desarrolladores full-stack, codebases en producción
**Precios:** Nivel gratuito, Pro $20/mes, Business $40/usuario/mes`,
      },
      {
        id: 'claude-code',
        title: 'Claude Code',
        content: `**Claude Code** — Agente de IA basado en terminal de Anthropic.

**Ventajas:**
- Potente para tareas arquitectónicas complejas
- Excelente razonamiento y planificación
- Funciona con cualquier editor
- Puede ejecutar comandos y tests directamente

**Contras:**
- Solo terminal (sin GUI)
- Más lento que herramientas integradas en el IDE
- Mayor costo para sesiones extendidas

**Ideal para:** Decisiones de arquitectura, refactors complejos, flujos de trabajo CLI
**Precios:** Incluido con Claude Pro ($20/mes)`,
      },
      {
        id: 'windsurf',
        title: 'Windsurf',
        content: `**Windsurf** (anteriormente Codeium) — IDE agentico con flujos de trabajo en cascada.

**Ventajas:**
- El agente Cascade puede planificar y ejecutar tareas de varios pasos
- El nivel gratuito es generoso
- Buena comprensión de contexto

**Contras:**
- Comunidad más pequeña que Cursor
- Algunos problemas de estabilidad
- Ecosistema menos maduro

**Ideal para:** Desarrolladores que quieren una alternativa gratuita y capaz a Cursor
**Precios:** Nivel gratuito, Pro $12/mes`,
      },
      {
        id: 'others',
        title: 'Otras Herramientas',
        content: `**v0** (Vercel)
- Ideal para: Generación de UI a partir de prompts
- Tipo: Constructor de apps
- Precios: Nivel gratuito, Pro $20/mes

**Lovable**
- Ideal para: Apps full-stack con mínimo código
- Tipo: Constructor de apps
- Precios: Nivel gratuito, Pro $20/mes

**Replit Agent**
- Ideal para: Educación, prototipos rápidos
- Tipo: Cloud IDE + Agente
- Precios: Nivel gratuito, Core $7/mes

**Zed**
- Ideal para: Desarrolladores enfocados en velocidad
- Tipo: IDE nativo (Rust)
- Precios: Gratuito (open source)

**Aider**
- Ideal para: Amantes de la terminal, flujos de trabajo nativos de Git
- Tipo: Herramienta CLI
- Precios: Gratuito (open source)`,
      },
    ],
  },
  {
    slug: 'prompting',
    title: '5. Prompting para Desarrolladores',
    description: 'Técnicas de prompt engineering específicas para tareas de código.',
    sections: [
      {
        id: 'prompt-patterns',
        title: 'Patrones de Prompt',
        content: `**El Patrón RICE**
- **R**ol: Define quién debe ser la IA
- **I**nstrucción: Qué hacer
- **C**ontexto: Información de fondo
- **E**xpectativa: Formato de salida deseado

**El Patrón Chain-of-Thought**
Pídele a la IA que piense paso a paso:
\`\`\`
"Before writing any code, plan the implementation:
1. What components will you need?
2. What API endpoints?
3. What database changes?
4. Share your plan, then implement."
\`\`\`

**El Patrón Few-Shot**
Proporciona ejemplos de la salida deseada:
\`\`\`
"Here are examples of how we write API routes:
[example 1]
[example 2]

Now write a route for user preferences following the same pattern."
\`\`\``,
      },
      {
        id: 'prompt-library',
        title: 'Librería de Prompts',
        content: `Visita nuestra **Librería de Prompts** interactiva en /prompts con más de 50 prompts listos para usar organizados por:

- **Tipo de tarea**: Feature, bugfix, refactor, test, docs
- **Herramienta**: Cursor, Claude Code, Windsurf
- **Stack**: Next.js, Python, Rust, etc.

Cada prompt incluye:
- El texto completo del prompt (copia con un clic)
- Cuándo usarlo
- Salida esperada
- Prompts de seguimiento comunes`,
      },
    ],
  },
  {
    slug: 'stack-patterns',
    title: '6. Patrones de Stack',
    description: 'Combinaciones de stack probadas en batalla para desarrollo AI-first.',
    sections: [
      {
        id: 'nextjs-stack',
        title: 'Next.js + TypeScript + Tailwind',
        content: `**El Stack Recomendado**

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

**¿Por qué este stack para vibe coding?**
- TypeScript detecta errores de tipo generados por IA
- Tailwind es fácil de generar correctamente por la IA
- shadcn/ui proporciona patrones de componentes consistentes
- El esquema de Prisma es auto-documentado
- App Router da límites claros para los agentes de IA`,
      },
      {
        id: 'project-structure',
        title: 'Estructura del Proyecto',
        content: `**Estructura de carpetas amigable para la IA:**

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
    title: '7. Seguridad y Producción',
    description: 'Gates de seguridad y mejores prácticas para código generado por IA.',
    sections: [
      {
        id: 'security-mindset',
        title: 'La Mentalidad de Seguridad',
        content: `**Trata la Salida de la IA como Código No Confiable**

Cada línea generada por IA debe pasar por el mismo escrutinio que un PR de un desarrollador junior al que nunca has conocido.

**La Defensa de 3 Capas:**
1. **Pre-generación**: Restricciones claras en tus archivos de contexto
2. **Post-generación**: Escaneo de seguridad automatizado
3. **Pre-despliegue**: Revisión humana para rutas críticas

**Rutas Críticas (Siempre Revisión Humana):**
- Autenticación y autorización
- Procesamiento de pagos
- Cifrado de datos
- Manejo de PII
- Rate limiting de API`,
      },
      {
        id: 'security-tools',
        title: 'Herramientas de Seguridad',
        content: `**Stack Esencial de Seguridad:**

| Herramienta | Propósito |
|-------------|-----------|
| GitLeaks | Detección de secretos en commits |
| npm audit | Escaneo de vulnerabilidades en dependencias |
| Snyk | Monitoreo continuo de dependencias |
| ESLint security plugin | Análisis estático de seguridad |
| OWASP ZAP | Pruebas dinámicas de seguridad de aplicaciones |

**Hooks Pre-commit:**
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
    title: '8. Flujos de Trabajo Multi-Agente',
    description: 'Patrones avanzados usando múltiples agentes de IA en conjunto.',
    sections: [
      {
        id: 'agent-roles',
        title: 'Roles de Agentes',
        content: `**La Orquesta de Agentes**

El vibe coding moderno usa agentes especializados:

1. **Planificador**: Analiza requisitos y crea planes de implementación
2. **Implementador**: Escribe el código real
3. **Revisor**: Revisa calidad de código, seguridad y consistencia
4. **Tester**: Genera y ejecuta tests

**Flujo de Trabajo Ejemplo:**
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
        title: 'Cuándo Usar Subagentes',
        content: `**Usa subagentes cuando:**
- La tarea abarca varios dominios (frontend + backend + database)
- Necesitas exploración paralela de diferentes enfoques
- La codebase es grande y necesitas conocimiento especializado

**No uses subagentes cuando:**
- La tarea es simple y bien definida
- Compartir contexto entre agentes es difícil
- Todavía estás aprendiendo lo básico de vibe coding`,
      },
    ],
  },
  {
    slug: 'anti-patterns',
    title: '9. Anti-patrones y Depuración',
    description: 'Errores comunes y cómo recuperarse de ellos.',
    sections: [
      {
        id: 'common-mistakes',
        title: 'Errores Comunes',
        content: `**"Aceptar Todo" Sin Revisar**
El error #1. La IA genera código que parece plausible y compila pero tiene bugs sutiles.

*Solución*: Siempre revisa. Usa el checklist de revisión del Capítulo 2.

**Deuda Técnica Invisible**
La IA tiende a:
- Duplicar código en lugar de abstraer
- Añadir dependencias innecesarias
- Omitir el manejo de errores
- Escribir soluciones demasiado complejas

*Solución*: Sesiones regulares de refactorización. Pídele a la IA que "simplifique esto" periódicamente.

**Pérdida de Contexto**
Conversaciones largas donde la IA olvida decisiones anteriores.

*Solución*: Inicia hilos nuevos para nuevas funcionalidades. Referencia tu AGENTS.md frecuentemente.`,
      },
      {
        id: 'recovery',
        title: 'Recuperar un Proyecto Caótico',
        content: `**El Plan de Recuperación para el Caos Vibe Coded:**

1. **Deja de generar** — Respira y evalúa
2. **Documenta la arquitectura deseada** — Escribe cómo debería ser el sistema
3. **Crea una rama limpia** — No pierdas tu progreso
4. **Empieza con tests** — Escribe tests para el comportamiento que quieres
5. **Genera contra los tests** — Usa la IA para hacer pasar los tests
6. **Refactoriza sin piedad** — Elimina código muerto, consolida duplicados
7. **Actualiza archivos de contexto** — Previene el caos futuro

**Prevenir es Mejor que Curar:**
- Configura CI/CD temprano
- Escribe tests desde el día uno
- Revisa cada PR (incluso los de IA)
- Mantén tus archivos de contexto actualizados`,
      },
    ],
  },
  {
    slug: 'resources',
    title: '10. Recursos',
    description: 'Listas awesome, comunidades y cuentas a seguir.',
    sections: [
      {
        id: 'awesome-list',
        title: 'Awesome Vibe Coding',
        content: `**Recursos Curados:**

**Comunidades:**
- r/cursor — Discusiones específicas de Cursor
- r/vibecoding — Comunidad general de vibe coding
- Discord: Vibe Coder Collective

**Newsletters:**
- Vibe Check Weekly
- AI-Assisted Dev Monthly

**Personas a Seguir:**
- @karpathy — Andrej Karpathy (acuñó "vibe coding")
- @mengto — Diseño + IA
- @shadcn — Mago de componentes UI

**Herramientas a Vigilar:**
- Mantén un ojo en nuestra página /tools para las últimas actualizaciones`,
      },
      {
        id: 'changelog',
        title: 'Changelog',
        content: `**The Vibe Coding Handbook — Changelog**

**v1.0 (2026-01)**
- Lanzamiento inicial
- 10 capítulos
- Más de 50 prompts
- Matriz de comparación de herramientas

**Roadmap:**
- v1.1: Traducción al español, guías en video
- v1.2: Patrones multi-agente avanzados
- v2.0: Casos de estudio aportados por la comunidad`,
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
