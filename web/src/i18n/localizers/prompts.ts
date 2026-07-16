import type { Locale } from '../config';
import {
  prompts as curatedPrompts,
  categories,
  tools,
  stacks,
} from '../../data/prompts';
import type { Prompt } from '../../data/prompts';

type LocalizedPromptFields = {
  title: string;
  description: string;
  whenToUse: string;
};

const categoryLabels: Record<Locale, Record<string, string>> = {
  en: {
    all: 'All',
    feature: 'Feature',
    bugfix: 'Bugfix',
    refactor: 'Refactor',
    test: 'Test',
    docs: 'Docs',
  },
  es: {
    all: 'Todas',
    feature: 'Funcionalidad',
    bugfix: 'Bugfix',
    refactor: 'Refactor',
    test: 'Test',
    docs: 'Docs',
  },
  pt: {
    all: 'Todas',
    feature: 'Funcionalidade',
    bugfix: 'Bugfix',
    refactor: 'Refatoração',
    test: 'Teste',
    docs: 'Docs',
  },
  zh: {
    all: '全部',
    feature: '功能',
    bugfix: 'Bug 修复',
    refactor: '重构',
    test: '测试',
    docs: '文档',
  },
};

const toolLabels: Record<Locale, Record<string, string>> = {
  en: {
    all: 'All Tools',
    cursor: 'Cursor',
    'claude-code': 'Claude Code',
    windsurf: 'Windsurf',
    universal: 'Universal',
  },
  es: {
    all: 'Todas las herramientas',
    cursor: 'Cursor',
    'claude-code': 'Claude Code',
    windsurf: 'Windsurf',
    universal: 'Universal',
  },
  pt: {
    all: 'Todas as ferramentas',
    cursor: 'Cursor',
    'claude-code': 'Claude Code',
    windsurf: 'Windsurf',
    universal: 'Universal',
  },
  zh: {
    all: '全部工具',
    cursor: 'Cursor',
    'claude-code': 'Claude Code',
    windsurf: 'Windsurf',
    universal: '通用',
  },
};

const stackLabels: Record<Locale, Record<string, string>> = {
  en: {
    all: 'All Stacks',
    nextjs: 'Next.js',
    python: 'Python',
    rust: 'Rust',
    universal: 'Universal',
  },
  es: {
    all: 'Todos los stacks',
    nextjs: 'Next.js',
    python: 'Python',
    rust: 'Rust',
    universal: 'Universal',
  },
  pt: {
    all: 'Todos os stacks',
    nextjs: 'Next.js',
    python: 'Python',
    rust: 'Rust',
    universal: 'Universal',
  },
  zh: {
    all: '全部技术栈',
    nextjs: 'Next.js',
    python: 'Python',
    rust: 'Rust',
    universal: '通用',
  },
};

const promptTranslations: Record<
  Prompt['id'],
  Record<Locale, LocalizedPromptFields>
> = {
  'nextjs-feature': {
    en: {
      title: 'Next.js Feature Implementation',
      description: 'Complete feature implementation prompt for Next.js apps with full-stack context.',
      whenToUse: 'When building new pages or features in a Next.js application.',
    },
    es: {
      title: 'Implementación de funcionalidad en Next.js',
      description: 'Prompt completo para implementar funcionalidades en aplicaciones Next.js con contexto full-stack.',
      whenToUse: 'Cuando construyas páginas o funcionalidades nuevas en una aplicación Next.js.',
    },
    pt: {
      title: 'Implementação de funcionalidade em Next.js',
      description: 'Prompt completo para implementar funcionalidades em aplicações Next.js com contexto full-stack.',
      whenToUse: 'Ao construir páginas ou funcionalidades novas em uma aplicação Next.js.',
    },
    zh: {
      title: 'Next.js 功能实现',
      description: '为 Next.js 应用实现功能的完整 Prompt，包含全栈上下文。',
      whenToUse: '在 Next.js 应用中构建新页面或功能时使用。',
    },
  },
  'api-endpoint': {
    en: {
      title: 'tRPC API Endpoint',
      description: 'Generates a complete CRUD tRPC router with validation and auth.',
      whenToUse: 'When creating new API endpoints in a tRPC + Prisma stack.',
    },
    es: {
      title: 'Endpoint de API con tRPC',
      description: 'Genera un router CRUD completo de tRPC con validación y autenticación.',
      whenToUse: 'Al crear nuevos endpoints de API en un stack de tRPC + Prisma.',
    },
    pt: {
      title: 'Endpoint de API com tRPC',
      description: 'Gera um router CRUD completo de tRPC com validação e autenticação.',
      whenToUse: 'Ao criar novos endpoints de API em uma stack tRPC + Prisma.',
    },
    zh: {
      title: 'tRPC API 端点',
      description: '生成包含验证和认证的完整 tRPC CRUD 路由。',
      whenToUse: '在 tRPC + Prisma 技术栈中创建新 API 端点时使用。',
    },
  },
  'bug-investigation': {
    en: {
      title: 'Bug Investigation & Fix',
      description: 'Structured approach to debugging with root cause analysis first.',
      whenToUse: 'When you have an error and need help understanding and fixing it.',
    },
    es: {
      title: 'Investigación y corrección de bugs',
      description: 'Enfoque estructurado para depurar, priorizando el análisis de causa raíz.',
      whenToUse: 'Cuando tengas un error y necesites ayuda para entenderlo y corregirlo.',
    },
    pt: {
      title: 'Investigação e correção de bugs',
      description: 'Abordagem estruturada para depuração, priorizando a análise da causa raiz.',
      whenToUse: 'Quando você tem um erro e precisa de ajuda para entendê-lo e corrigi-lo.',
    },
    zh: {
      title: 'Bug 调查与修复',
      description: '以根因分析优先的结构化调试方法。',
      whenToUse: '当你遇到错误并需要理解和修复它时使用。',
    },
  },
  'component-extraction': {
    en: {
      title: 'Component Extraction & Refactor',
      description: 'Extract and refactor large components into smaller, focused ones.',
      whenToUse: 'When a component is too large or handles too many responsibilities.',
    },
    es: {
      title: 'Extracción y refactor de componentes',
      description: 'Extrae y refactoriza componentes grandes en otros más pequeños y enfocados.',
      whenToUse: 'Cuando un componente sea demasiado grande o maneje demasiadas responsabilidades.',
    },
    pt: {
      title: 'Extração e refatoração de componentes',
      description: 'Extraia e refatore componentes grandes em outros menores e focados.',
      whenToUse: 'Quando um componente é grande demais ou lida com responsabilidades demais.',
    },
    zh: {
      title: '组件提取与重构',
      description: '将大型组件提取并重构为更小、更聚焦的组件。',
      whenToUse: '当组件过大或处理过多职责时使用。',
    },
  },
  'test-generation': {
    en: {
      title: 'Test Suite Generation',
      description: 'Complete test suite with edge cases and error handling.',
      whenToUse: 'When you need tests for a function, hook, or component.',
    },
    es: {
      title: 'Generación de suite de tests',
      description: 'Suite de tests completa con casos límite y manejo de errores.',
      whenToUse: 'Cuando necesites tests para una función, hook o componente.',
    },
    pt: {
      title: 'Geração de suite de testes',
      description: 'Suite de testes completa com casos de borda e tratamento de erros.',
      whenToUse: 'Quando você precisa de testes para uma função, hook ou componente.',
    },
    zh: {
      title: '测试套件生成',
      description: '包含边界情况和错误处理的完整测试套件。',
      whenToUse: '当你需要为函数、Hook 或组件编写测试时使用。',
    },
  },
  'python-api': {
    en: {
      title: 'Python FastAPI Endpoint',
      description: 'Complete FastAPI CRUD router with async SQLAlchemy.',
      whenToUse: 'Building Python backend APIs with FastAPI.',
    },
    es: {
      title: 'Endpoint de FastAPI en Python',
      description: 'Router CRUD completo de FastAPI con SQLAlchemy asíncrono.',
      whenToUse: 'Para construir APIs backend en Python con FastAPI.',
    },
    pt: {
      title: 'Endpoint de FastAPI em Python',
      description: 'Router CRUD completo do FastAPI com SQLAlchemy assíncrono.',
      whenToUse: 'Para construir APIs backend em Python com FastAPI.',
    },
    zh: {
      title: 'Python FastAPI 端点',
      description: '使用异步 SQLAlchemy 的完整 FastAPI CRUD 路由。',
      whenToUse: '使用 FastAPI 构建 Python 后端 API 时。',
    },
  },
  'docs-generation': {
    en: {
      title: 'Documentation Generation',
      description: 'Generate complete documentation for any code module.',
      whenToUse: 'When you need to document functions, components, or APIs.',
    },
    es: {
      title: 'Generación de documentación',
      description: 'Genera documentación completa para cualquier módulo de código.',
      whenToUse: 'Cuando necesites documentar funciones, componentes o APIs.',
    },
    pt: {
      title: 'Geração de documentação',
      description: 'Gera documentação completa para qualquer módulo de código.',
      whenToUse: 'Quando você precisa documentar funções, componentes ou APIs.',
    },
    zh: {
      title: '文档生成',
      description: '为任意代码模块生成完整文档。',
      whenToUse: '当你需要为函数、组件或 API 编写文档时使用。',
    },
  },
  'database-migration': {
    en: {
      title: 'Database Schema Migration',
      description: 'Safe database migration with rollback and validation.',
      whenToUse: 'When modifying database schemas in production.',
    },
    es: {
      title: 'Migración de esquema de base de datos',
      description: 'Migración segura de bases de datos con rollback y validación.',
      whenToUse: 'Al modificar esquemas de base de datos en producción.',
    },
    pt: {
      title: 'Migração de esquema de banco de dados',
      description: 'Migração segura de banco de dados com rollback e validação.',
      whenToUse: 'Ao modificar esquemas de banco de dados em produção.',
    },
    zh: {
      title: '数据库结构迁移',
      description: '包含回滚和验证的安全数据库迁移。',
      whenToUse: '在生产环境中修改数据库结构时使用。',
    },
  },
  'rust-cli': {
    en: {
      title: 'Rust CLI Tool',
      description: 'Complete Rust CLI project with testing and CI.',
      whenToUse: 'Building command-line tools in Rust.',
    },
    es: {
      title: 'Herramienta CLI en Rust',
      description: 'Proyecto CLI completo en Rust con tests e integración continua.',
      whenToUse: 'Para construir herramientas de línea de comandos en Rust.',
    },
    pt: {
      title: 'Ferramenta CLI em Rust',
      description: 'Projeto CLI completo em Rust com testes e integração contínua.',
      whenToUse: 'Para construir ferramentas de linha de comando em Rust.',
    },
    zh: {
      title: 'Rust CLI 工具',
      description: '包含测试和 CI 的完整 Rust CLI 项目。',
      whenToUse: '使用 Rust 构建命令行工具时。',
    },
  },
  'code-review': {
    en: {
      title: 'AI Code Review',
      description: 'Comprehensive AI code review with severity levels.',
      whenToUse: 'Before submitting a PR or when reviewing AI-generated code.',
    },
    es: {
      title: 'Revisión de código con IA',
      description: 'Revisión exhaustiva de código con IA por niveles de severidad.',
      whenToUse: 'Antes de enviar un PR o al revisar código generado por IA.',
    },
    pt: {
      title: 'Revisão de código com IA',
      description: 'Revisão completa de código com IA por níveis de severidade.',
      whenToUse: 'Antes de enviar um PR ou ao revisar código gerado por IA.',
    },
    zh: {
      title: 'AI 代码审查',
      description: '带有严重程度分级的全面 AI 代码审查。',
      whenToUse: '在提交 PR 或审查 AI 生成代码时使用。',
    },
  },
  'jwt-auth': {
    en: {
      title: 'JWT Authentication Flow',
      description: 'Full JWT auth with refresh rotation, reuse detection, and secure storage.',
      whenToUse: 'When adding authentication to an app that does not use a hosted auth provider.',
    },
    es: {
      title: 'Flujo de autenticación JWT',
      description: 'Autenticación JWT completa con rotación de refresh, detección de reutilización y almacenamiento seguro.',
      whenToUse: 'Al añadir autenticación a una app que no use un proveedor de auth gestionado.',
    },
    pt: {
      title: 'Fluxo de autenticação JWT',
      description: 'Autenticação JWT completa com rotação de refresh, detecção de reutilização e armazenamento seguro.',
      whenToUse: 'Ao adicionar autenticação a um app que não use um provedor de auth gerenciado.',
    },
    zh: {
      title: 'JWT 认证流程',
      description: '包含刷新令牌轮换、复用检测和安全存储的完整 JWT 认证。',
      whenToUse: '为不使用托管认证提供者的应用添加认证时使用。',
    },
  },
  'infinite-pagination': {
    en: {
      title: 'Infinite Scroll Pagination',
      description: 'Cursor-based infinite scroll with proper loading and error states.',
      whenToUse: 'When building feeds or long lists that must stay fast at scale.',
    },
    es: {
      title: 'Paginación con scroll infinito',
      description: 'Scroll infinito basado en cursor con estados de carga y error adecuados.',
      whenToUse: 'Al construir feeds o listas largas que deban mantenerse rápidas a escala.',
    },
    pt: {
      title: 'Paginação com scroll infinito',
      description: 'Scroll infinito baseado em cursor com estados de carregamento e erro adequados.',
      whenToUse: 'Ao construir feeds ou listas longas que precisam permanecer rápidas em escala.',
    },
    zh: {
      title: '无限滚动分页',
      description: '基于游标的无限滚动，包含恰当的加载和错误状态。',
      whenToUse: '构建需要在大规模下保持快速的 Feed 或长列表时使用。',
    },
  },
  'file-upload': {
    en: {
      title: 'File Upload with Validation',
      description: 'Complete upload flow with dual validation and progress feedback.',
      whenToUse: 'When adding avatar, attachment, or document uploads to a Next.js app.',
    },
    es: {
      title: 'Subida de archivos con validación',
      description: 'Flujo completo de subida con validación dual y retroalimentación de progreso.',
      whenToUse: 'Al añadir subidas de avatar, adjuntos o documentos a una app de Next.js.',
    },
    pt: {
      title: 'Upload de arquivos com validação',
      description: 'Fluxo completo de upload com validação dupla e feedback de progresso.',
      whenToUse: 'Ao adicionar uploads de avatar, anexos ou documentos a um app Next.js.',
    },
    zh: {
      title: '文件上传与验证',
      description: '包含双重验证和进度反馈的完整上传流程。',
      whenToUse: '在 Next.js 应用中添加头像、附件或文档上传时使用。',
    },
  },
  'websocket-realtime': {
    en: {
      title: 'Real-Time Updates with WebSockets',
      description: 'Production-ready WebSocket layer with reconnection and auth.',
      whenToUse: 'When building live dashboards, chat, or collaborative features.',
    },
    es: {
      title: 'Actualizaciones en tiempo real con WebSockets',
      description: 'Capa de WebSockets lista para producción con reconexión y autenticación.',
      whenToUse: 'Al construir dashboards en vivo, chat o funciones colaborativas.',
    },
    pt: {
      title: 'Atualizações em tempo real com WebSockets',
      description: 'Camada de WebSockets pronta para produção com reconexão e autenticação.',
      whenToUse: 'Ao construir dashboards ao vivo, chat ou funcionalidades colaborativas.',
    },
    zh: {
      title: '使用 WebSocket 的实时更新',
      description: '包含重连和认证的生产级 WebSocket 层。',
      whenToUse: '构建实时仪表板、聊天或协作功能时使用。',
    },
  },
  'feature-flags': {
    en: {
      title: 'Feature Flag System',
      description: 'Typed feature flags with gradual rollout and a cleanup path.',
      whenToUse: 'When shipping risky changes that need gradual rollout or instant rollback.',
    },
    es: {
      title: 'Sistema de feature flags',
      description: 'Feature flags tipadas con despliegue gradual y ruta de limpieza.',
      whenToUse: 'Al lanzar cambios riesgosos que requieran despliegue gradual o rollback inmediato.',
    },
    pt: {
      title: 'Sistema de feature flags',
      description: 'Feature flags tipadas com rollout gradual e caminho de limpeza.',
      whenToUse: 'Ao lançar mudanças arriscadas que precisam de rollout gradual ou rollback instantâneo.',
    },
    zh: {
      title: '功能开关系统',
      description: '带有渐进式发布和清理路径的类型化功能开关。',
      whenToUse: '发布需要渐进式推出或即时回滚的风险变更时使用。',
    },
  },
  'memory-leak': {
    en: {
      title: 'Memory Leak Investigation',
      description: 'Systematic heap analysis to find and fix memory leaks.',
      whenToUse: 'When memory climbs monotonically and restarts are masking the problem.',
    },
    es: {
      title: 'Investigación de fugas de memoria',
      description: 'Análisis sistemático del heap para encontrar y corregir fugas de memoria.',
      whenToUse: 'Cuando la memoria crece monotónicamente y los reinicios ocultan el problema.',
    },
    pt: {
      title: 'Investigação de vazamentos de memória',
      description: 'Análise sistemática do heap para encontrar e corrigir vazamentos de memória.',
      whenToUse: 'Quando a memória sobe monotonicamente e reinicializações mascaram o problema.',
    },
    zh: {
      title: '内存泄漏调查',
      description: '系统化的堆分析，用于发现和修复内存泄漏。',
      whenToUse: '当内存单调增长且重启掩盖问题时使用。',
    },
  },
  'race-condition': {
    en: {
      title: 'Race Condition Diagnosis',
      description: 'Find the interleaving, fix it with the right concurrency primitive.',
      whenToUse: 'When you see duplicates, lost updates, or heisenbugs under load.',
    },
    es: {
      title: 'Diagnóstico de race conditions',
      description: 'Encuentra la intercalación y corrígela con la primitiva de concurrencia adecuada.',
      whenToUse: 'Cuando observes duplicados, actualizaciones perdidas o heisenbugs bajo carga.',
    },
    pt: {
      title: 'Diagnóstico de race conditions',
      description: 'Encontre a intercalação e corrija com a primitiva de concorrência correta.',
      whenToUse: 'Quando você vê duplicatas, atualizações perdidas ou heisenbugs sob carga.',
    },
    zh: {
      title: '竞态条件诊断',
      description: '找到交错执行路径，并使用正确的并发原语修复。',
      whenToUse: '在负载下出现重复、更新丢失或海森堡 Bug 时使用。',
    },
  },
  'cors-error': {
    en: {
      title: 'CORS Error Resolution',
      description: 'Understand and fix CORS properly instead of wildcarding everything.',
      whenToUse: 'When the browser blocks cross-origin requests to your API.',
    },
    es: {
      title: 'Resolución de errores CORS',
      description: 'Entiende y corrige CORS correctamente en lugar de usar comodines.',
      whenToUse: 'Cuando el navegador bloquea solicitudes cross-origin a tu API.',
    },
    pt: {
      title: 'Resolução de erros CORS',
      description: 'Entenda e corrija o CORS corretamente em vez de usar curingas.',
      whenToUse: 'Quando o navegador bloqueia requisições cross-origin para sua API.',
    },
    zh: {
      title: 'CORS 错误解决',
      description: '正确理解和修复 CORS，而不是对所有内容使用通配符。',
      whenToUse: '当浏览器阻止对你 API 的跨源请求时使用。',
    },
  },
  'n-plus-one-queries': {
    en: {
      title: 'N+1 Query Elimination',
      description: 'Detect, confirm, and eliminate N+1 queries in SQLAlchemy.',
      whenToUse: 'When an endpoint gets slower as related data grows.',
    },
    es: {
      title: 'Eliminación de consultas N+1',
      description: 'Detecta, confirma y elimina consultas N+1 en SQLAlchemy.',
      whenToUse: 'Cuando un endpoint se vuelve más lento a medida que crecen los datos relacionados.',
    },
    pt: {
      title: 'Eliminação de consultas N+1',
      description: 'Detecte, confirme e elimine consultas N+1 no SQLAlchemy.',
      whenToUse: 'Quando um endpoint fica mais lento à medida que os dados relacionados crescem.',
    },
    zh: {
      title: '消除 N+1 查询',
      description: '在 SQLAlchemy 中检测、确认并消除 N+1 查询。',
      whenToUse: '当端点因相关数据增长而变慢时使用。',
    },
  },
  'slow-query-indexes': {
    en: {
      title: 'Slow Query & Index Tuning',
      description: 'EXPLAIN-driven index and query optimization with verification.',
      whenToUse: 'When a query that was fine in development is slow in production.',
    },
    es: {
      title: 'Consultas lentas y ajuste de índices',
      description: 'Optimización de índices y consultas guiada por EXPLAIN, con verificación.',
      whenToUse: 'Cuando una consulta que funcionaba bien en desarrollo es lenta en producción.',
    },
    pt: {
      title: 'Consultas lentas e ajuste de índices',
      description: 'Otimização de índices e consultas guiada por EXPLAIN, com verificação.',
      whenToUse: 'Quando uma consulta que estava boa em desenvolvimento fica lenta em produção.',
    },
    zh: {
      title: '慢查询与索引调优',
      description: '基于 EXPLAIN 的索引和查询优化，并包含验证。',
      whenToUse: '当开发环境正常的查询在生产环境变慢时使用。',
    },
  },
  'cache-invalidation': {
    en: {
      title: 'Stale Cache / Invalidation Bug',
      description: 'Fix stale-data bugs with a deliberate invalidation strategy.',
      whenToUse: 'When users must refresh or wait to see their own changes.',
    },
    es: {
      title: 'Caché obsoleto / bug de invalidación',
      description: 'Corrige bugs de datos obsoletos con una estrategia deliberada de invalidación.',
      whenToUse: 'Cuando los usuarios deban refrescar o esperar para ver sus propios cambios.',
    },
    pt: {
      title: 'Cache obsoleto / bug de invalidação',
      description: 'Corrija bugs de dados obsoletos com uma estratégia deliberada de invalidação.',
      whenToUse: 'Quando os usuários precisam atualizar ou esperar para ver suas próprias alterações.',
    },
    zh: {
      title: '缓存失效 / 过期 Bug',
      description: '使用有意识的失效策略修复过期数据 Bug。',
      whenToUse: '当用户必须刷新或等待才能看到自己更改时使用。',
    },
  },
  'timezone-bug': {
    en: {
      title: 'Timezone & Date Bug',
      description: 'Trace date values across boundaries and enforce UTC-at-rest.',
      whenToUse: 'When times shift by hours or dates flip depending on user location.',
    },
    es: {
      title: 'Bug de zona horaria y fechas',
      description: 'Rastrea valores de fecha a través de límites y aplica UTC en reposo.',
      whenToUse: 'Cuando las horas cambien o las fechas salten dependiendo de la ubicación del usuario.',
    },
    pt: {
      title: 'Bug de fuso horário e datas',
      description: 'Rastreie valores de data através de limites e aplique UTC em repouso.',
      whenToUse: 'Quando os horários mudam ou as datas invertem dependendo da localização do usuário.',
    },
    zh: {
      title: '时区与日期 Bug',
      description: '追踪日期值跨边界传递，并强制静止时使用 UTC。',
      whenToUse: '当时间偏移几小时或日期因用户位置而变化时使用。',
    },
  },
  'flaky-test': {
    en: {
      title: 'Flaky Test Stabilization',
      description: 'Root-cause flaky tests instead of retrying them into passing.',
      whenToUse: 'When CI failures disappear on re-run and erode trust in the suite.',
    },
    es: {
      title: 'Estabilización de tests flaky',
      description: 'Investiga la causa raíz de tests flaky en lugar de repeticiones hasta que pasen.',
      whenToUse: 'Cuando fallos en CI desaparecen al reejecutar y erosionan la confianza en la suite.',
    },
    pt: {
      title: 'Estabilização de testes flaky',
      description: 'Encontre a causa raiz de testes flaky em vez de repeti-los até passarem.',
      whenToUse: 'Quando falhas no CI desaparecem ao reexecutar e erosionam a confiança na suite.',
    },
    zh: {
      title: '不稳定测试修复',
      description: '对不稳定测试进行根因分析，而不是通过重试让它们通过。',
      whenToUse: '当 CI 失败在重新运行后消失并侵蚀对测试套件信任时使用。',
    },
  },
  'incident-triage': {
    en: {
      title: 'Production Incident Triage',
      description: 'Structured incident response: mitigate first, root-cause second.',
      whenToUse: 'During or right after a production incident with unclear cause.',
    },
    es: {
      title: 'Triage de incidentes en producción',
      description: 'Respuesta estructurada a incidentes: mitiga primero, causa raíz después.',
      whenToUse: 'Durante o justo después de un incidente en producción con causa poco clara.',
    },
    pt: {
      title: 'Triagem de incidentes em produção',
      description: 'Resposta estruturada a incidentes: mitigue primeiro, causa raiz depois.',
      whenToUse: 'Durante ou logo após um incidente em produção com causa pouco clara.',
    },
    zh: {
      title: '生产事故分诊',
      description: '结构化事故响应：先缓解，后根因分析。',
      whenToUse: '在原因不明的生产事故期间或刚结束时使用。',
    },
  },
  'class-to-hooks': {
    en: {
      title: 'Class Component to Hooks',
      description: 'Faithful class-to-function conversion with correct effect semantics.',
      whenToUse: 'When modernizing legacy React class components.',
    },
    es: {
      title: 'De componente de clase a hooks',
      description: 'Conversión fiel de clase a función con semántica de efectos correcta.',
      whenToUse: 'Al modernizar componentes de clase heredados de React.',
    },
    pt: {
      title: 'De componente de classe para hooks',
      description: 'Conversão fiel de classe para função com semântica de efeitos correta.',
      whenToUse: 'Ao modernizar componentes de classe legados do React.',
    },
    zh: {
      title: '类组件转 Hooks',
      description: '忠实的类组件转函数组件转换，具备正确的 Effect 语义。',
      whenToUse: '现代化遗留 React 类组件时使用。',
    },
  },
  'js-to-ts-migration': {
    en: {
      title: 'JavaScript to TypeScript Migration',
      description: 'Strict, behavior-preserving JS to TS conversion.',
      whenToUse: 'When migrating a codebase to TypeScript incrementally.',
    },
    es: {
      title: 'Migración de JavaScript a TypeScript',
      description: 'Conversión estricta de JS a TS que preserva el comportamiento.',
      whenToUse: 'Al migrar una base de código a TypeScript de forma incremental.',
    },
    pt: {
      title: 'Migração de JavaScript para TypeScript',
      description: 'Conversão estrita de JS para TS que preserva o comportamento.',
      whenToUse: 'Ao migrar uma base de código para TypeScript de forma incremental.',
    },
    zh: {
      title: 'JavaScript 迁移到 TypeScript',
      description: '严格、保持行为的 JS 转 TS 转换。',
      whenToUse: '逐步将代码库迁移到 TypeScript 时使用。',
    },
  },
  'tech-debt-paydown': {
    en: {
      title: 'Technical Debt Paydown Plan',
      description: 'Incremental, releasable debt reduction with characterization tests.',
      whenToUse: 'When debt slows every change but a rewrite is not an option.',
    },
    es: {
      title: 'Plan de pago de deuda técnica',
      description: 'Reducción incremental y liberable de deuda técnica con tests de caracterización.',
      whenToUse: 'Cuando la deuda ralentiza cada cambio pero una reescritura no es opción.',
    },
    pt: {
      title: 'Plano de pagamento de dívida técnica',
      description: 'Redução incremental e liberável de dívida técnica com testes de caracterização.',
      whenToUse: 'Quando a dívida técnica atrasa cada mudança mas uma reescrita não é opção.',
    },
    zh: {
      title: '技术债务偿还计划',
      description: '通过特征测试进行增量、可发布的债务削减。',
      whenToUse: '当债务拖慢每次变更但重写又不可行时使用。',
    },
  },
  'performance-review': {
    en: {
      title: 'Performance Review & Optimization',
      description: 'Measure-first performance review with prioritized fixes.',
      whenToUse: 'When something is slow and you need evidence before optimizing.',
    },
    es: {
      title: 'Revisión y optimización de rendimiento',
      description: 'Revisión de rendimiento con medición primero y correcciones priorizadas.',
      whenToUse: 'Cuando algo sea lento y necesites evidencia antes de optimizar.',
    },
    pt: {
      title: 'Revisão e otimização de performance',
      description: 'Revisão de performance com medição primeiro e correções priorizadas.',
      whenToUse: 'Quando algo está lento e você precisa de evidências antes de otimizar.',
    },
    zh: {
      title: '性能审查与优化',
      description: '先测量后优化的性能审查，包含优先级排序的修复方案。',
      whenToUse: '当某些东西很慢且你需要在优化前获取证据时使用。',
    },
  },
  'security-review': {
    en: {
      title: 'Security-Focused Code Review',
      description: 'OWASP-aligned security audit with exploit scenarios and fixes.',
      whenToUse: 'Before shipping auth, payment, or user-data handling code.',
    },
    es: {
      title: 'Revisión de código enfocada en seguridad',
      description: 'Auditoría de seguridad alineada con OWASP con escenarios de explotación y correcciones.',
      whenToUse: 'Antes de enviar código de autenticación, pagos o manejo de datos de usuarios.',
    },
    pt: {
      title: 'Revisão de código focada em segurança',
      description: 'Auditoria de segurança alinhada com OWASP com cenários de exploração e correções.',
      whenToUse: 'Antes de enviar código de autenticação, pagamentos ou manipulação de dados de usuários.',
    },
    zh: {
      title: '安全导向代码审查',
      description: '符合 OWASP 的安全审计，包含利用场景和修复方案。',
      whenToUse: '在发布认证、支付或用户数据处理代码之前使用。',
    },
  },
  'dead-code-elimination': {
    en: {
      title: 'Dead Code Elimination',
      description: 'Confidence-graded dead code removal in Rust projects.',
      whenToUse: 'When warnings and unused code accumulate after refactors.',
    },
    es: {
      title: 'Eliminación de código muerto',
      description: 'Eliminación de código muerto en proyectos Rust con niveles de confianza.',
      whenToUse: 'Cuando se acumulan advertencias y código no usado tras refactorizaciones.',
    },
    pt: {
      title: 'Eliminação de código morto',
      description: 'Eliminação de código morto em projetos Rust com níveis de confiança.',
      whenToUse: 'Quando acumulam avisos e código não usado após refatorações.',
    },
    zh: {
      title: '死代码消除',
      description: '在 Rust 项目中按置信度分级消除死代码。',
      whenToUse: '重构后警告和未使用代码累积时使用。',
    },
  },
  'error-handling-standardization': {
    en: {
      title: 'Error Handling Standardization',
      description: 'Consistent Result-based error handling with proper context.',
      whenToUse: 'When every module handles errors differently and debugging suffers.',
    },
    es: {
      title: 'Estandarización de manejo de errores',
      description: 'Manejo de errores consistente basado en Result con contexto adecuado.',
      whenToUse: 'Cuando cada módulo maneje errores de forma distinta y la depuración sufre.',
    },
    pt: {
      title: 'Padronização de tratamento de erros',
      description: 'Tratamento de erros consistente baseado em Result com contexto adequado.',
      whenToUse: 'Quando cada módulo lida com erros de forma diferente e a depuração sofre.',
    },
    zh: {
      title: '错误处理标准化',
      description: '基于 Result 的一致错误处理，附带恰当的上下文。',
      whenToUse: '当每个模块错误处理方式不同且调试困难时使用。',
    },
  },
  'structured-logging': {
    en: {
      title: 'Structured Logging Migration',
      description: 'JSON logs with request correlation and secret redaction.',
      whenToUse: 'When grepping unstructured logs during incidents wastes hours.',
    },
    es: {
      title: 'Migración a logs estructurados',
      description: 'Logs JSON con correlación de solicitudes y redacción de secretos.',
      whenToUse: 'Cuando hacer grep de logs no estructurados durante incidentes haga perder horas.',
    },
    pt: {
      title: 'Migração para logs estruturados',
      description: 'Logs JSON com correlação de requisições e redação de segredos.',
      whenToUse: 'Quando fazer grep de logs não estruturados durante incidentes faz perder horas.',
    },
    zh: {
      title: '结构化日志迁移',
      description: '带有请求关联和机密脱敏的 JSON 日志。',
      whenToUse: '当在事故期间对非结构化日志进行 grep 耗费数小时时使用。',
    },
  },
  'e2e-playwright': {
    en: {
      title: 'Playwright E2E Tests',
      description: 'Maintainable E2E suite with page objects and CI tiers.',
      whenToUse: 'When critical flows break in production despite unit tests.',
    },
    es: {
      title: 'Tests E2E con Playwright',
      description: 'Suite E2E mantenible con page objects y niveles de CI.',
      whenToUse: 'Cuando flujos críticos fallan en producción a pesar de los tests unitarios.',
    },
    pt: {
      title: 'Testes E2E com Playwright',
      description: 'Suite E2E mantenível com page objects e níveis de CI.',
      whenToUse: 'Quando fluxos críticos quebram em produção apesar dos testes unitários.',
    },
    zh: {
      title: 'Playwright 端到端测试',
      description: '使用页面对象和 CI 分层的可维护端到端测试套件。',
      whenToUse: '当关键流程尽管在单元测试后仍在生产环境失败时使用。',
    },
  },
  'api-integration-tests': {
    en: {
      title: 'API Integration Tests',
      description: 'Full-stack API tests with real DB and per-test isolation.',
      whenToUse: 'When unit tests with mocked DBs let contract bugs through.',
    },
    es: {
      title: 'Tests de integración de API',
      description: 'Tests de API full-stack con base de datos real y aislamiento por test.',
      whenToUse: 'Cuando tests unitarios con DBs mockeadas dejan pasar bugs de contrato.',
    },
    pt: {
      title: 'Testes de integração de API',
      description: 'Testes de API full-stack com banco de dados real e isolamento por teste.',
      whenToUse: 'Quando testes unitários com DBs mockados deixam passar bugs de contrato.',
    },
    zh: {
      title: 'API 集成测试',
      description: '使用真实数据库和每个测试隔离的全栈 API 测试。',
      whenToUse: '当使用模拟数据库的单元测试让契约 Bug 溜过时使用。',
    },
  },
  'third-party-mocks': {
    en: {
      title: 'Mocking Third-Party APIs',
      description: 'Adapter-based mocking with a sandbox contract test.',
      whenToUse: 'When external APIs make tests slow, flaky, or impossible offline.',
    },
    es: {
      title: 'Mocks de APIs de terceros',
      description: 'Mocks basados en adaptadores con un test de contrato en sandbox.',
      whenToUse: 'Cuando APIs externas hacen los tests lentos, flaky o imposibles offline.',
    },
    pt: {
      title: 'Mocking de APIs de terceiros',
      description: 'Mocking baseado em adaptadores com um teste de contrato em sandbox.',
      whenToUse: 'Quando APIs externas tornam os testes lentos, flaky ou impossíveis offline.',
    },
    zh: {
      title: '第三方 API 模拟',
      description: '基于适配器的模拟，附带沙盒契约测试。',
      whenToUse: '当外部 API 使测试变慢、不稳定或无法离线运行时使用。',
    },
  },
  'edge-case-coverage': {
    en: {
      title: 'Edge Case Test Coverage',
      description: 'Systematic edge-case audit with property-based testing.',
      whenToUse: 'When coverage looks high but bugs keep slipping through.',
    },
    es: {
      title: 'Cobertura de casos límite',
      description: 'Auditoría sistemática de casos límite con property-based testing.',
      whenToUse: 'Cuando la cobertura parece alta pero los bugs siguen escapando.',
    },
    pt: {
      title: 'Cobertura de casos de borda',
      description: 'Auditoria sistemática de casos de borda com property-based testing.',
      whenToUse: 'Quando a cobertura parece alta mas os bugs continuam passando.',
    },
    zh: {
      title: '边界情况测试覆盖',
      description: '使用基于属性的测试进行系统化边界情况审计。',
      whenToUse: '当覆盖率看起来很高但 Bug 仍然漏网时使用。',
    },
  },
  'a11y-tests': {
    en: {
      title: 'Accessibility (a11y) Testing',
      description: 'WCAG AA testing: axe, keyboard nav, and screen-reader semantics.',
      whenToUse: 'When shipping user-facing UI that must be accessible.',
    },
    es: {
      title: 'Tests de accesibilidad (a11y)',
      description: 'Tests WCAG AA: axe, navegación por teclado y semántica para lectores de pantalla.',
      whenToUse: 'Al lanzar UI orientada a usuarios que debe ser accesible.',
    },
    pt: {
      title: 'Testes de acessibilidade (a11y)',
      description: 'Testes WCAG AA: axe, navegação por teclado e semântica para leitores de tela.',
      whenToUse: 'Ao lançar UI voltada para usuários que deve ser acessível.',
    },
    zh: {
      title: '无障碍（a11y）测试',
      description: 'WCAG AA 测试：axe、键盘导航和屏幕阅读器语义。',
      whenToUse: '发布必须可访问的用户界面时使用。',
    },
  },
  'test-data-factories': {
    en: {
      title: 'Test Data Factories',
      description: 'Composable factories and traits replacing static fixtures.',
      whenToUse: 'When fixture maintenance costs more than the tests are worth.',
    },
    es: {
      title: 'Factories de datos de test',
      description: 'Factories componibles y traits que reemplazan fixtures estáticas.',
      whenToUse: 'Cuando el mantenimiento de fixtures cuesta más que el valor de los tests.',
    },
    pt: {
      title: 'Factories de dados de teste',
      description: 'Factories combináveis e traits que substituem fixtures estáticas.',
      whenToUse: 'Quando a manutenção de fixtures custa mais do que o valor dos testes.',
    },
    zh: {
      title: '测试数据工厂',
      description: '可组合的工厂和特征（traits）替代静态测试夹具。',
      whenToUse: '当测试夹具的维护成本超过测试本身价值时使用。',
    },
  },
  'load-testing-k6': {
    en: {
      title: 'Load Testing with k6',
      description: 'SLA-driven load tests with realistic scenarios and CI gates.',
      whenToUse: 'Before launches, sales events, or after scaling complaints.',
    },
    es: {
      title: 'Tests de carga con k6',
      description: 'Tests de carga guiados por SLA con escenarios realistas y gates de CI.',
      whenToUse: 'Antes de lanzamientos, eventos de ventas o tras quejas de escalado.',
    },
    pt: {
      title: 'Testes de carga com k6',
      description: 'Testes de carga guiados por SLA com cenários realistas e gates de CI.',
      whenToUse: 'Antes de lançamentos, eventos de vendas ou após reclamações de escalabilidade.',
    },
    zh: {
      title: '使用 k6 进行负载测试',
      description: '基于 SLA 的负载测试，包含真实场景和 CI 门禁。',
      whenToUse: '在发布、销售活动或收到扩展性投诉之前使用。',
    },
  },
  'pytest-suite': {
    en: {
      title: 'Professional pytest Suite',
      description: 'Idiomatic pytest suite with parametrize, fixtures, and markers.',
      whenToUse: 'When a Python project has ad-hoc or copy-pasted tests.',
    },
    es: {
      title: 'Suite profesional de pytest',
      description: 'Suite idiomática de pytest con parametrize, fixtures y markers.',
      whenToUse: 'Cuando un proyecto Python tenga tests ad-hoc o copiados y pegados.',
    },
    pt: {
      title: 'Suite profissional de pytest',
      description: 'Suite idiomática de pytest com parametrize, fixtures e markers.',
      whenToUse: 'Quando um projeto Python tem testes ad-hoc ou copiados e colados.',
    },
    zh: {
      title: '专业的 pytest 测试套件',
      description: '使用 parametrize、fixtures 和 markers 的惯用 pytest 套件。',
      whenToUse: '当 Python 项目存在临时或复制粘贴的测试时使用。',
    },
  },
  'webhook-contract-tests': {
    en: {
      title: 'Webhook Contract Tests',
      description: 'Contract tests for inbound and outbound webhooks.',
      whenToUse: 'When webhook integrations break silently on provider or schema changes.',
    },
    es: {
      title: 'Tests de contrato de webhooks',
      description: 'Tests de contrato para webhooks entrantes y salientes.',
      whenToUse: 'Cuando las integraciones de webhooks se rompen silenciosamente por cambios de proveedor o esquema.',
    },
    pt: {
      title: 'Testes de contrato de webhooks',
      description: 'Testes de contrato para webhooks de entrada e saída.',
      whenToUse: 'Quando integrações de webhooks quebram silenciosamente por mudanças de provedor ou schema.',
    },
    zh: {
      title: 'Webhook 契约测试',
      description: '针对入站和出站 Webhook 的契约测试。',
      whenToUse: '当 Webhook 集成在提供商或 schema 变更时静默损坏时使用。',
    },
  },
  'openapi-spec': {
    en: {
      title: 'OpenAPI Specification',
      description: 'Complete OpenAPI 3.1 spec with shared schemas and examples.',
      whenToUse: 'When consumers need API docs that stay trustworthy.',
    },
    es: {
      title: 'Especificación OpenAPI',
      description: 'Especificación OpenAPI 3.1 completa con schemas compartidos y ejemplos.',
      whenToUse: 'Cuando los consumidores necesiten documentación de API confiable.',
    },
    pt: {
      title: 'Especificação OpenAPI',
      description: 'Especificação OpenAPI 3.1 completa com schemas compartilhados e exemplos.',
      whenToUse: 'Quando os consumidores precisam de documentação de API confiável.',
    },
    zh: {
      title: 'OpenAPI 规范',
      description: '包含共享 Schema 和示例的完整 OpenAPI 3.1 规范。',
      whenToUse: '当消费者需要保持可信的 API 文档时使用。',
    },
  },
  'project-readme': {
    en: {
      title: 'Project README',
      description: 'Developer-first README with a working five-command quickstart.',
      whenToUse: 'When open-sourcing a project or onboarding new contributors.',
    },
    es: {
      title: 'README del proyecto',
      description: 'README pensado para desarrolladores, con un quickstart funcional de cinco comandos.',
      whenToUse: 'Al liberar un proyecto como open source o incorporar nuevos contribuidores.',
    },
    pt: {
      title: 'README do projeto',
      description: 'README pensado para desenvolvedores, com um quickstart funcional de cinco comandos.',
      whenToUse: 'Ao tornar um projeto open source ou integrar novos contribuidores.',
    },
    zh: {
      title: '项目 README',
      description: '面向开发者的 README，包含可运行的五步快速开始。',
      whenToUse: '开源项目或引入新贡献者时使用。',
    },
  },
  'docstrings': {
    en: {
      title: 'Docstrings & API Comments',
      description: 'Contract-focused docstrings with runnable examples.',
      whenToUse: 'When public APIs lack documentation before a release.',
    },
    es: {
      title: 'Docstrings y comentarios de API',
      description: 'Docstrings centradas en contratos con ejemplos ejecutables.',
      whenToUse: 'Cuando las APIs públicas carecen de documentación antes de un release.',
    },
    pt: {
      title: 'Docstrings e comentários de API',
      description: 'Docstrings focadas em contratos com exemplos executáveis.',
      whenToUse: 'Quando as APIs públicas carecem de documentação antes de um release.',
    },
    zh: {
      title: '文档字符串与 API 注释',
      description: '以契约为重点的文档字符串，包含可运行示例。',
      whenToUse: '当公共 API 在发布前缺少文档时使用。',
    },
  },
  'changelog-generation': {
    en: {
      title: 'Changelog Generation',
      description: 'Keep-a-Changelog release notes written for users, not devs.',
      whenToUse: 'When cutting a release from a pile of raw commits.',
    },
    es: {
      title: 'Generación de changelog',
      description: 'Notas de release siguiendo Keep-a-Changelog escritas para usuarios, no solo desarrolladores.',
      whenToUse: 'Al preparar un release a partir de un conjunto de commits en bruto.',
    },
    pt: {
      title: 'Geração de changelog',
      description: 'Notas de release seguindo Keep-a-Changelog escritas para usuários, não só desenvolvedores.',
      whenToUse: 'Ao preparar um release a partir de um conjunto de commits brutos.',
    },
    zh: {
      title: '更新日志生成',
      description: '遵循 Keep-a-Changelog 格式、为用户而非开发者编写的发布说明。',
      whenToUse: '从一堆原始提交中整理发布时使用。',
    },
  },
  'contributing-guide': {
    en: {
      title: 'Contributing Guide',
      description: 'One-page contributing guide from clone to merged PR.',
      whenToUse: 'When preparing a repo for external contributors.',
    },
    es: {
      title: 'Guía de contribución',
      description: 'Guía de contribución de una página, desde el clon hasta el PR mergeado.',
      whenToUse: 'Al preparar un repositorio para contribuidores externos.',
    },
    pt: {
      title: 'Guia de contribuição',
      description: 'Guia de contribuição de uma página, do clone ao PR mergeado.',
      whenToUse: 'Ao preparar um repositório para contribuidores externos.',
    },
    zh: {
      title: '贡献指南',
      description: '从克隆到合并 PR 的单页贡献指南。',
      whenToUse: '为外部贡献者准备仓库时使用。',
    },
  },
  'docker-guide': {
    en: {
      title: 'Docker Packaging & Guide',
      description: 'Multi-stage Dockerfile, compose for dev, and security notes.',
      whenToUse: 'When containerizing a service for the first time or hardening it.',
    },
    es: {
      title: 'Empaquetado y guía de Docker',
      description: 'Dockerfile multi-stage, compose para desarrollo y notas de seguridad.',
      whenToUse: 'Al contenerizar un servicio por primera vez o reforzar su seguridad.',
    },
    pt: {
      title: 'Empacotamento e guia do Docker',
      description: 'Dockerfile multi-stage, compose para desenvolvimento e notas de segurança.',
      whenToUse: 'Ao containerizar um serviço pela primeira vez ou reforçar sua segurança.',
    },
    zh: {
      title: 'Docker 打包与指南',
      description: '多阶段 Dockerfile、开发用 compose 和安全注意事项。',
      whenToUse: '首次容器化服务或加固现有服务时使用。',
    },
  },
  'ci-pipeline': {
    en: {
      title: 'CI Pipeline Setup',
      description: 'Fast, cached GitHub Actions pipeline with branch protection.',
      whenToUse: 'When setting up CI for a new repo or fixing a slow one.',
    },
    es: {
      title: 'Configuración de pipeline de CI',
      description: 'Pipeline rápida de GitHub Actions con caché y protección de ramas.',
      whenToUse: 'Al configurar CI para un repo nuevo o arreglar uno lento.',
    },
    pt: {
      title: 'Configuração de pipeline de CI',
      description: 'Pipeline rápida do GitHub Actions com cache e proteção de branches.',
      whenToUse: 'Ao configurar CI para um repo novo ou consertar um lento.',
    },
    zh: {
      title: 'CI 流水线配置',
      description: '快速、带缓存的 GitHub Actions 流水线，包含分支保护。',
      whenToUse: '为新仓库设置 CI 或修复缓慢的 CI 时使用。',
    },
  },
  'env-vars-doc': {
    en: {
      title: 'Environment Variables Audit',
      description: 'Full env var inventory with validation and .env.example.',
      whenToUse: 'When new developers cannot start the app without tribal knowledge.',
    },
    es: {
      title: 'Auditoría de variables de entorno',
      description: 'Inventario completo de variables de entorno con validación y .env.example.',
      whenToUse: 'Cuando nuevos desarrolladores no puedan iniciar la app sin conocimiento tribal.',
    },
    pt: {
      title: 'Auditoria de variáveis de ambiente',
      description: 'Inventário completo de variáveis de ambiente com validação e .env.example.',
      whenToUse: 'Quando novos desenvolvedores não conseguem iniciar o app sem conhecimento tribal.',
    },
    zh: {
      title: '环境变量审计',
      description: '包含验证和 .env.example 的完整环境变量清单。',
      whenToUse: '当新开发者没有隐性知识就无法启动应用时使用。',
    },
  },
  'adr': {
    en: {
      title: 'Architecture Decision Record',
      description: 'ADR template that captures context, alternatives, and consequences.',
      whenToUse: 'When making architectural choices the team must remember later.',
    },
    es: {
      title: 'Registro de decisiones de arquitectura',
      description: 'Plantilla de ADR que captura contexto, alternativas y consecuencias.',
      whenToUse: 'Al tomar decisiones de arquitectura que el equipo deba recordar después.',
    },
    pt: {
      title: 'Registro de decisões de arquitetura',
      description: 'Template de ADR que captura contexto, alternativas e consequências.',
      whenToUse: 'Ao tomar decisões de arquitetura que a equipe precise lembrar depois.',
    },
    zh: {
      title: '架构决策记录',
      description: '捕捉背景、备选方案和后效影响的 ADR 模板。',
      whenToUse: '当做出团队日后需要回顾的架构选择时使用。',
    },
  },
};

export function getLocalizedPrompts(locale: Locale): Prompt[] {
  return curatedPrompts.map((prompt) => {
    const localized = promptTranslations[prompt.id]?.[locale];
    return localized ? { ...prompt, ...localized } : prompt;
  });
}

export function getCategories(locale: Locale): { value: string; label: string }[] {
  return categories.map((category) => ({
    value: category.value,
    label: categoryLabels[locale][category.value] ?? category.label,
  }));
}

export function getTools(locale: Locale): { value: string; label: string }[] {
  return tools.map((tool) => ({
    value: tool.value,
    label: toolLabels[locale][tool.value] ?? tool.label,
  }));
}

export function getStacks(locale: Locale): { value: string; label: string }[] {
  return stacks.map((stack) => ({
    value: stack.value,
    label: stackLabels[locale][stack.value] ?? stack.label,
  }));
}
