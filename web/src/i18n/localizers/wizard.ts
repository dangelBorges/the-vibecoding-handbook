import type { Locale } from '../config';
import {
  questions as sourceQuestions,
  steps as sourceSteps,
  comparisons as sourceComparisons,
  getRecommendedStack as sourceGetRecommendedStack,
  type WizardQuestion,
  type WizardStep,
  type TechComparison,
} from '../../data/wizard';

interface LocalizedStep {
  id: WizardStep;
  label: string;
  description: string;
  icon: string;
}

interface QuestionTranslations {
  question?: string;
  description?: string;
  options: Record<string, { label: string; description?: string }>;
}

const stepTranslations: Record<Locale, Record<WizardStep, { label: string; description: string }>> = {
  en: {
    'project-info': { label: 'Project', description: 'Name, type, description' },
    requirements: { label: 'Requirements', description: 'Features, timeline, team' },
    frontend: { label: 'Frontend', description: 'UI framework' },
    backend: { label: 'Backend', description: 'API & logic' },
    database: { label: 'Database', description: 'Data storage' },
    auth: { label: 'Auth', description: 'Authentication' },
    hosting: { label: 'Hosting', description: 'Deployment' },
    extras: { label: 'Extras', description: 'Payments, email, monitoring' },
    review: { label: 'Review', description: 'Generate files' },
  },
  es: {
    'project-info': { label: 'Proyecto', description: 'Nombre, tipo, descripción' },
    requirements: { label: 'Requisitos', description: 'Funciones, plazo, equipo' },
    frontend: { label: 'Frontend', description: 'Framework de UI' },
    backend: { label: 'Backend', description: 'API y lógica' },
    database: { label: 'Base de datos', description: 'Almacenamiento de datos' },
    auth: { label: 'Autenticación', description: 'Autenticación' },
    hosting: { label: 'Alojamiento', description: 'Despliegue' },
    extras: { label: 'Extras', description: 'Pagos, correo, monitoreo' },
    review: { label: 'Revisar', description: 'Generar archivos' },
  },
  pt: {
    'project-info': { label: 'Projeto', description: 'Nome, tipo, descrição' },
    requirements: { label: 'Requisitos', description: 'Funcionalidades, prazo, equipe' },
    frontend: { label: 'Frontend', description: 'Framework de UI' },
    backend: { label: 'Backend', description: 'API e lógica' },
    database: { label: 'Banco de dados', description: 'Armazenamento de dados' },
    auth: { label: 'Autenticação', description: 'Autenticação' },
    hosting: { label: 'Hospedagem', description: 'Deploy' },
    extras: { label: 'Extras', description: 'Pagamentos, e-mail, monitoramento' },
    review: { label: 'Revisar', description: 'Gerar arquivos' },
  },
  zh: {
    'project-info': { label: '项目', description: '名称、类型、描述' },
    requirements: { label: '需求', description: '功能、时间线、团队' },
    frontend: { label: '前端', description: 'UI 框架' },
    backend: { label: '后端', description: 'API 与逻辑' },
    database: { label: '数据库', description: '数据存储' },
    auth: { label: '认证', description: '身份认证' },
    hosting: { label: '托管', description: '部署' },
    extras: { label: '附加', description: '支付、邮件、监控' },
    review: { label: '回顾', description: '生成文件' },
  },
};

const questionTranslations: Record<Locale, Record<string, QuestionTranslations>> = {
  en: {
    projectName: {
      question: 'What is your project name?',
      options: {},
    },
    projectDescription: {
      question: 'Describe your project in one sentence',
      description: 'Example: "A SaaS invoicing platform for freelancers"',
      options: {},
    },
    projectType: {
      question: 'What type of project is this?',
      options: {
        saas: { label: 'SaaS / Web App', description: 'Multi-tenant web application with auth and payments' },
        ecommerce: { label: 'E-commerce', description: 'Online store with products, cart, and checkout' },
        content: { label: 'Content Platform', description: 'Blog, CMS, or content-heavy site' },
        marketplace: { label: 'Marketplace', description: 'Platform connecting buyers and sellers' },
        api: { label: 'API / Backend Service', description: 'REST/GraphQL API consumed by other clients' },
        dashboard: { label: 'Internal Dashboard', description: 'Admin panel or analytics dashboard' },
        mobile: { label: 'Mobile App', description: 'iOS/Android app (with web fallback)' },
        tool: { label: 'Developer Tool / CLI', description: 'Command-line tool or developer utility' },
        portfolio: { label: 'Portfolio / Landing', description: 'Personal or company website' },
        other: { label: 'Other', description: 'Something unique' },
      },
    },
    features: {
      question: 'What core features do you need?',
      options: {
        auth: { label: 'User Authentication', description: 'Sign up, login, password reset' },
        payments: { label: 'Payments / Subscriptions', description: 'Stripe, PayPal, or similar' },
        realtime: { label: 'Real-time Updates', description: 'WebSockets, live data, notifications' },
        uploads: { label: 'File Uploads', description: 'Images, documents, PDFs' },
        search: { label: 'Search', description: 'Full-text search across content' },
        analytics: { label: 'Analytics', description: 'User behavior tracking, dashboards' },
        email: { label: 'Email Sending', description: 'Transactional emails, newsletters' },
        cms: { label: 'CMS / Content Management', description: 'Admin can create/edit content' },
        'multi-tenant': { label: 'Multi-tenancy', description: 'Organizations, teams, workspaces' },
        notifications: { label: 'Push Notifications', description: 'Browser or mobile push' },
        api: { label: 'Public API', description: 'REST/GraphQL API for third parties' },
        ai: { label: 'AI Integration', description: 'LLM features, chatbots, agents' },
      },
    },
    timeline: {
      question: 'What is your timeline?',
      options: {
        week: { label: '1-2 weeks', description: 'Quick MVP or prototype' },
        month: { label: '1 month', description: 'Focused MVP with core features' },
        quarter: { label: '1-3 months', description: 'Full-featured product' },
        long: { label: '3+ months', description: 'Complex platform' },
      },
    },
    teamSize: {
      question: 'How many developers?',
      options: {
        solo: { label: 'Just me', description: 'Solo developer' },
        small: { label: '2-3 people', description: 'Small team' },
        medium: { label: '4-10 people', description: 'Growing team' },
        large: { label: '10+ people', description: 'Large organization' },
      },
    },
    frontend: {
      question: 'Choose your frontend approach',
      options: {
        'nextjs-app': { label: 'Next.js 15 (App Router)', description: 'Full-stack React with SSR/SSG. Best for SEO, performance, and server components.' },
        'nextjs-pages': { label: 'Next.js 15 (Pages Router)', description: 'Classic Next.js with pages directory. More mature ecosystem, simpler mental model.' },
        'react-spa': { label: 'React SPA + Vite', description: 'Single-page application. Best for dashboards and apps where SEO is not critical.' },
        astro: { label: 'Astro', description: 'Content-focused sites. Islands architecture, minimal JavaScript. Great for blogs/docs.' },
        vue: { label: 'Vue 3 + Nuxt', description: 'Progressive framework. Gentler learning curve, excellent DX.' },
        svelte: { label: 'SvelteKit', description: 'Compiler-based, minimal runtime. Fastest performance, smaller bundles.' },
      },
    },
    backend: {
      question: 'Choose your backend approach',
      options: {
        'nextjs-fullstack': { label: 'Next.js Fullstack (Server Actions + tRPC)', description: 'Everything in one codebase. Best for rapid development and solo/small teams.' },
        'nextjs-external': { label: 'Next.js Frontend + External API', description: 'Decoupled architecture. Better for complex backends or mobile apps.' },
        serverless: { label: 'Serverless Functions (Vercel / Netlify / Cloudflare)', description: 'Pay-per-request. Zero infrastructure management. Great for variable traffic.' },
        fastapi: { label: 'Python FastAPI', description: 'Modern Python. Best for ML integrations, data processing, or Python-heavy teams.' },
        express: { label: 'Node.js Express / NestJS', description: 'Traditional Node.js backend. Full control, mature ecosystem.' },
        rails: { label: 'Ruby on Rails', description: 'Convention over configuration. Rapid CRUD development.' },
      },
    },
    database: {
      question: 'Choose your database',
      options: {
        'supabase-postgres': { label: 'Supabase (PostgreSQL)', description: 'Open-source Firebase alternative. Realtime subscriptions, auth built-in, generous free tier.' },
        'vercel-postgres': { label: 'Vercel Postgres (Neon)', description: 'Serverless PostgreSQL. Deep Vercel integration, auto-scaling, pay-for-usage.' },
        firebase: { label: 'Firebase (Firestore + Realtime DB)', description: 'Google-managed. Best for rapid prototyping, real-time apps, mobile-first projects.' },
        'prisma-postgres': { label: 'Self-hosted PostgreSQL + Prisma', description: 'Maximum control. Use with Railway, DigitalOcean, or AWS RDS.' },
        mongodb: { label: 'MongoDB Atlas', description: 'Document database. Flexible schema, great for unstructured data.' },
        turso: { label: 'Turso (SQLite at the Edge)', description: 'Edge-hosted SQLite. Extremely fast reads, global replication, free tier generous.' },
      },
    },
    auth: {
      question: 'Choose your authentication',
      options: {
        'supabase-auth': { label: 'Supabase Auth', description: 'Free, open-source, works with any frontend. OAuth providers, email/password, magic links.' },
        nextauth: { label: 'NextAuth.js (Auth.js) v5', description: 'Best-in-class for Next.js. Multiple providers, JWT sessions, database sessions.' },
        clerk: { label: 'Clerk', description: 'Premium DX. Pre-built UI components, organizations, MFA, user management dashboard.' },
        'firebase-auth': { label: 'Firebase Authentication', description: 'Works best with Firebase stack. Phone auth, anonymous auth, social providers.' },
        auth0: { label: 'Auth0', description: 'Enterprise-grade. Complex auth flows, rules engine, but higher cost.' },
        custom: { label: 'Custom Auth (JWT + bcrypt)', description: 'Full control. Only if you have specific security requirements or want to learn.' },
      },
    },
    hosting: {
      question: 'Choose your hosting platform',
      options: {
        vercel: { label: 'Vercel', description: 'Best for Next.js. Edge network, preview deployments, analytics, zero config.' },
        netlify: { label: 'Netlify', description: 'Great for JAMstack. Git-based deploys, edge functions, forms, identity.' },
        railway: { label: 'Railway', description: 'Fullstack deployment. Docker support, databases, cron jobs, networking.' },
        cloudflare: { label: 'Cloudflare Pages + Workers', description: 'Edge-first. D1 database, KV storage, extremely fast global deployment.' },
        aws: { label: 'AWS (Amplify / ECS / Lambda)', description: 'Maximum control and scale. Steeper learning curve, more configuration.' },
      },
    },
    payments: {
      question: 'Payment provider (if needed)',
      options: {
        none: { label: 'No payments', description: 'Free tool or internal app' },
        stripe: { label: 'Stripe', description: 'Best for SaaS, subscriptions, global payments' },
        'lemon-squeezy': { label: 'LemonSqueezy', description: 'Best for indie makers, EU VAT handling' },
        paypal: { label: 'PayPal', description: 'Alternative payment method' },
      },
    },
    email: {
      question: 'Email service (if needed)',
      options: {
        none: { label: 'No email', description: 'No transactional emails needed' },
        resend: { label: 'Resend', description: 'Modern email for developers. Great DX, good free tier.' },
        sendgrid: { label: 'SendGrid (Twilio)', description: 'Mature, reliable, good deliverability' },
        'aws-ses': { label: 'AWS SES', description: 'Cheapest at scale. Requires AWS setup.' },
      },
    },
    storage: {
      question: 'File storage (if needed)',
      options: {
        none: { label: 'No file storage', description: 'No uploads needed' },
        'supabase-storage': { label: 'Supabase Storage', description: 'Integrated with Supabase, policies with RLS' },
        'cloudflare-r2': { label: 'Cloudflare R2', description: 'S3-compatible, zero egress fees, cheap' },
        'aws-s3': { label: 'AWS S3', description: 'Industry standard, maximum features' },
        'firebase-storage': { label: 'Firebase Storage', description: 'Works with Firebase, client-side uploads' },
      },
    },
    testing: {
      question: 'Testing strategy',
      options: {
        'vitest-playwright': { label: 'Vitest (unit) + Playwright (E2E)', description: 'Modern, fast, recommended' },
        'jest-rtl': { label: 'Jest + React Testing Library', description: 'Classic combo, mature ecosystem' },
        minimal: { label: 'Minimal (type checking only)', description: 'For quick prototypes' },
        full: { label: 'Full (unit + integration + E2E + visual)', description: 'For production-grade apps' },
      },
    },
    monitoring: {
      question: 'Monitoring & error tracking',
      options: {
        sentry: { label: 'Sentry', description: 'Error tracking + performance monitoring. Industry standard.' },
        logrocket: { label: 'LogRocket', description: 'Session replay + error tracking. See what users saw.' },
        'vercel-analytics': { label: 'Vercel Analytics', description: 'Built into Vercel. Web Vitals, visitor insights.' },
        none: { label: 'None for now', description: 'Add later when needed' },
      },
    },
  },
  es: {
    projectName: {
      question: '¿Cuál es el nombre de tu proyecto?',
      options: {},
    },
    projectDescription: {
      question: 'Describe tu proyecto en una oración',
      description: 'Ejemplo: "Una plataforma de facturación SaaS para autónomos"',
      options: {},
    },
    projectType: {
      question: '¿Qué tipo de proyecto es este?',
      options: {
        saas: { label: 'SaaS / Web App', description: 'Aplicación web multiinquilino con autenticación y pagos' },
        ecommerce: { label: 'E-commerce', description: 'Tienda online con productos, carrito y checkout' },
        content: { label: 'Plataforma de contenidos', description: 'Blog, CMS o sitio con mucho contenido' },
        marketplace: { label: 'Marketplace', description: 'Plataforma que conecta compradores y vendedores' },
        api: { label: 'API / Servicio Backend', description: 'API REST/GraphQL consumida por otros clientes' },
        dashboard: { label: 'Dashboard interno', description: 'Panel de administración o dashboard de analíticas' },
        mobile: { label: 'App móvil', description: 'App iOS/Android (con fallback web)' },
        tool: { label: 'Herramienta para desarrolladores / CLI', description: 'Herramienta de línea de comandos o utilidad para desarrolladores' },
        portfolio: { label: 'Portafolio / Landing', description: 'Sitio personal o de empresa' },
        other: { label: 'Otro', description: 'Algo único' },
      },
    },
    features: {
      question: '¿Qué funciones principales necesitas?',
      options: {
        auth: { label: 'Autenticación de usuarios', description: 'Registro, inicio de sesión, restablecimiento de contraseña' },
        payments: { label: 'Pagos / Suscripciones', description: 'Stripe, PayPal o similar' },
        realtime: { label: 'Actualizaciones en tiempo real', description: 'WebSockets, datos en vivo, notificaciones' },
        uploads: { label: 'Subida de archivos', description: 'Imágenes, documentos, PDFs' },
        search: { label: 'Búsqueda', description: 'Búsqueda de texto completo en el contenido' },
        analytics: { label: 'Analíticas', description: 'Seguimiento de comportamiento de usuarios, dashboards' },
        email: { label: 'Envío de correos', description: 'Correos transaccionales, newsletters' },
        cms: { label: 'CMS / Gestión de contenidos', description: 'El administrador puede crear/editar contenido' },
        'multi-tenant': { label: 'Multi-tenencia', description: 'Organizaciones, equipos, espacios de trabajo' },
        notifications: { label: 'Notificaciones push', description: 'Push en navegador o móvil' },
        api: { label: 'API pública', description: 'API REST/GraphQL para terceros' },
        ai: { label: 'Integración con IA', description: 'Funciones con LLM, chatbots, agentes' },
      },
    },
    timeline: {
      question: '¿Cuál es tu plazo?',
      options: {
        week: { label: '1-2 semanas', description: 'MVP o prototipo rápido' },
        month: { label: '1 mes', description: 'MVP enfocado con funciones principales' },
        quarter: { label: '1-3 meses', description: 'Producto con funciones completas' },
        long: { label: '3+ meses', description: 'Plataforma compleja' },
      },
    },
    teamSize: {
      question: '¿Cuántos desarrolladores?',
      options: {
        solo: { label: 'Solo yo', description: 'Desarrollador individual' },
        small: { label: '2-3 personas', description: 'Equipo pequeño' },
        medium: { label: '4-10 personas', description: 'Equipo en crecimiento' },
        large: { label: '10+ personas', description: 'Organización grande' },
      },
    },
    frontend: {
      question: 'Elige tu enfoque de frontend',
      options: {
        'nextjs-app': { label: 'Next.js 15 (App Router)', description: 'React full-stack con SSR/SSG. Ideal para SEO, rendimiento y server components.' },
        'nextjs-pages': { label: 'Next.js 15 (Pages Router)', description: 'Next.js clásico con directorio pages. Ecosistema más maduro, modelo mental más simple.' },
        'react-spa': { label: 'React SPA + Vite', description: 'Aplicación de una sola página. Ideal para dashboards y apps donde el SEO no es crítico.' },
        astro: { label: 'Astro', description: 'Sitios enfocados en contenido. Arquitectura de islas, JavaScript mínimo. Ideal para blogs/docs.' },
        vue: { label: 'Vue 3 + Nuxt', description: 'Framework progresivo. Curva de aprendizaje más suave, excelente DX.' },
        svelte: { label: 'SvelteKit', description: 'Basado en compilador, runtime mínimo. Mayor rendimiento, bundles más pequeños.' },
      },
    },
    backend: {
      question: 'Elige tu enfoque de backend',
      options: {
        'nextjs-fullstack': { label: 'Next.js Fullstack (Server Actions + tRPC)', description: 'Todo en una sola base de código. Ideal para desarrollo rápido y equipos pequeños.' },
        'nextjs-external': { label: 'Next.js Frontend + API externa', description: 'Arquitectura desacoplada. Mejor para backends complejos o apps móviles.' },
        serverless: { label: 'Serverless Functions (Vercel / Netlify / Cloudflare)', description: 'Pago por petición. Cero gestión de infraestructura. Ideal para tráfico variable.' },
        fastapi: { label: 'Python FastAPI', description: 'Python moderno. Ideal para integraciones de ML, procesamiento de datos o equipos con mucho Python.' },
        express: { label: 'Node.js Express / NestJS', description: 'Backend tradicional de Node.js. Control total, ecosistema maduro.' },
        rails: { label: 'Ruby on Rails', description: 'Convención sobre configuración. Desarrollo rápido de CRUD.' },
      },
    },
    database: {
      question: 'Elige tu base de datos',
      options: {
        'supabase-postgres': { label: 'Supabase (PostgreSQL)', description: 'Alternativa open-source a Firebase. Suscripciones en tiempo real, auth integrado, plan gratuito generoso.' },
        'vercel-postgres': { label: 'Vercel Postgres (Neon)', description: 'PostgreSQL serverless. Integración profunda con Vercel, autoescalado, pago por uso.' },
        firebase: { label: 'Firebase (Firestore + Realtime DB)', description: 'Gestionado por Google. Ideal para prototipado rápido, apps en tiempo real y proyectos mobile-first.' },
        'prisma-postgres': { label: 'PostgreSQL autoalojado + Prisma', description: 'Control máximo. Usar con Railway, DigitalOcean o AWS RDS.' },
        mongodb: { label: 'MongoDB Atlas', description: 'Base de datos documental. Esquema flexible, ideal para datos no estructurados.' },
        turso: { label: 'Turso (SQLite en el Edge)', description: 'SQLite alojado en el edge. Lecturas extremadamente rápidas, replicación global, plan gratuito generoso.' },
      },
    },
    auth: {
      question: 'Elige tu autenticación',
      options: {
        'supabase-auth': { label: 'Supabase Auth', description: 'Gratuito, open-source, funciona con cualquier frontend. Proveedores OAuth, email/contraseña, magic links.' },
        nextauth: { label: 'NextAuth.js (Auth.js) v5', description: 'El mejor para Next.js. Múltiples proveedores, sesiones JWT o en base de datos.' },
        clerk: { label: 'Clerk', description: 'DX premium. Componentes UI listos, organizaciones, MFA, dashboard de gestión de usuarios.' },
        'firebase-auth': { label: 'Firebase Authentication', description: 'Funciona mejor con el stack de Firebase. Auth por teléfono, anónimo, proveedores sociales.' },
        auth0: { label: 'Auth0', description: 'Nivel empresarial. Flujos complejos, motor de reglas, pero mayor costo.' },
        custom: { label: 'Auth personalizada (JWT + bcrypt)', description: 'Control total. Solo si tienes requisitos de seguridad específicos o quieres aprender.' },
      },
    },
    hosting: {
      question: 'Elige tu plataforma de alojamiento',
      options: {
        vercel: { label: 'Vercel', description: 'El mejor para Next.js. Red edge, preview deployments, analíticas, cero configuración.' },
        netlify: { label: 'Netlify', description: 'Ideal para JAMstack. Deploys basados en Git, edge functions, forms, identity.' },
        railway: { label: 'Railway', description: 'Despliegue fullstack. Soporte Docker, bases de datos, cron jobs, networking.' },
        cloudflare: { label: 'Cloudflare Pages + Workers', description: 'Edge-first. Base de datos D1, almacenamiento KV, despliegue global extremadamente rápido.' },
        aws: { label: 'AWS (Amplify / ECS / Lambda)', description: 'Control y escala máximos. Curva de aprendizaje más pronunciada, más configuración.' },
      },
    },
    payments: {
      question: 'Proveedor de pagos (si aplica)',
      options: {
        none: { label: 'Sin pagos', description: 'Herramienta gratuita o app interna' },
        stripe: { label: 'Stripe', description: 'El mejor para SaaS, suscripciones, pagos globales' },
        'lemon-squeezy': { label: 'LemonSqueezy', description: 'Ideal para makers indie, manejo de IVA de la UE' },
        paypal: { label: 'PayPal', description: 'Método de pago alternativo' },
      },
    },
    email: {
      question: 'Servicio de correo (si aplica)',
      options: {
        none: { label: 'Sin correo', description: 'No se necesitan correos transaccionales' },
        resend: { label: 'Resend', description: 'Correo moderno para desarrolladores. Gran DX, buen plan gratuito.' },
        sendgrid: { label: 'SendGrid (Twilio)', description: 'Maduro, confiable, buena entregabilidad' },
        'aws-ses': { label: 'AWS SES', description: 'El más barato a escala. Requiere configuración de AWS.' },
      },
    },
    storage: {
      question: 'Almacenamiento de archivos (si aplica)',
      options: {
        none: { label: 'Sin almacenamiento de archivos', description: 'No se necesitan subidas' },
        'supabase-storage': { label: 'Supabase Storage', description: 'Integrado con Supabase, políticas con RLS' },
        'cloudflare-r2': { label: 'Cloudflare R2', description: 'Compatible con S3, cero tarifas de salida, barato' },
        'aws-s3': { label: 'AWS S3', description: 'Estándar de la industria, máximas funciones' },
        'firebase-storage': { label: 'Firebase Storage', description: 'Funciona con Firebase, subidas desde el cliente' },
      },
    },
    testing: {
      question: 'Estrategia de pruebas',
      options: {
        'vitest-playwright': { label: 'Vitest (unit) + Playwright (E2E)', description: 'Moderno, rápido, recomendado' },
        'jest-rtl': { label: 'Jest + React Testing Library', description: 'Combo clásico, ecosistema maduro' },
        minimal: { label: 'Mínimo (solo verificación de tipos)', description: 'Para prototipos rápidos' },
        full: { label: 'Completo (unit + integración + E2E + visual)', description: 'Para apps de nivel producción' },
      },
    },
    monitoring: {
      question: 'Monitoreo y seguimiento de errores',
      options: {
        sentry: { label: 'Sentry', description: 'Seguimiento de errores + monitoreo de rendimiento. Estándar de la industria.' },
        logrocket: { label: 'LogRocket', description: 'Reproducción de sesiones + seguimiento de errores. Ve lo que vieron los usuarios.' },
        'vercel-analytics': { label: 'Vercel Analytics', description: 'Integrado en Vercel. Web Vitals, información de visitantes.' },
        none: { label: 'Ninguno por ahora', description: 'Agregar más tarde cuando sea necesario' },
      },
    },
  },
  pt: {
    projectName: {
      question: 'Qual é o nome do seu projeto?',
      options: {},
    },
    projectDescription: {
      question: 'Descreva seu projeto em uma frase',
      description: 'Exemplo: "Uma plataforma SaaS de faturamento para freelancers"',
      options: {},
    },
    projectType: {
      question: 'Que tipo de projeto é este?',
      options: {
        saas: { label: 'SaaS / Web App', description: 'Aplicação web multi-inquilino com autenticação e pagamentos' },
        ecommerce: { label: 'E-commerce', description: 'Loja online com produtos, carrinho e checkout' },
        content: { label: 'Plataforma de conteúdo', description: 'Blog, CMS ou site com muito conteúdo' },
        marketplace: { label: 'Marketplace', description: 'Plataforma conectando compradores e vendedores' },
        api: { label: 'API / Serviço Backend', description: 'API REST/GraphQL consumida por outros clientes' },
        dashboard: { label: 'Dashboard interno', description: 'Painel administrativo ou dashboard de analytics' },
        mobile: { label: 'App móvel', description: 'App iOS/Android (com fallback web)' },
        tool: { label: 'Ferramenta para desenvolvedores / CLI', description: 'Ferramenta de linha de comando ou utilitário para desenvolvedores' },
        portfolio: { label: 'Portfólio / Landing', description: 'Site pessoal ou empresarial' },
        other: { label: 'Outro', description: 'Algo único' },
      },
    },
    features: {
      question: 'Quais funcionalidades principais você precisa?',
      options: {
        auth: { label: 'Autenticação de usuários', description: 'Cadastro, login, redefinição de senha' },
        payments: { label: 'Pagos / Assinaturas', description: 'Stripe, PayPal ou similar' },
        realtime: { label: 'Atualizações em tempo real', description: 'WebSockets, dados ao vivo, notificações' },
        uploads: { label: 'Upload de arquivos', description: 'Imagens, documentos, PDFs' },
        search: { label: 'Busca', description: 'Busca de texto completo no conteúdo' },
        analytics: { label: 'Analytics', description: 'Rastreamento de comportamento do usuário, dashboards' },
        email: { label: 'Envio de e-mail', description: 'E-mails transacionais, newsletters' },
        cms: { label: 'CMS / Gestão de conteúdo', description: 'Admin pode criar/editar conteúdo' },
        'multi-tenant': { label: 'Multi-tenancy', description: 'Organizações, equipes, workspaces' },
        notifications: { label: 'Notificações push', description: 'Push no navegador ou mobile' },
        api: { label: 'API pública', description: 'API REST/GraphQL para terceiros' },
        ai: { label: 'Integração com IA', description: 'Funcionalidades com LLM, chatbots, agentes' },
      },
    },
    timeline: {
      question: 'Qual é o seu prazo?',
      options: {
        week: { label: '1-2 semanas', description: 'MVP ou protótipo rápido' },
        month: { label: '1 mês', description: 'MVP focado com funcionalidades principais' },
        quarter: { label: '1-3 meses', description: 'Produto com funcionalidades completas' },
        long: { label: '3+ meses', description: 'Plataforma complexa' },
      },
    },
    teamSize: {
      question: 'Quantos desenvolvedores?',
      options: {
        solo: { label: 'Só eu', description: 'Desenvolvedor solo' },
        small: { label: '2-3 pessoas', description: 'Equipe pequena' },
        medium: { label: '4-10 pessoas', description: 'Equipe em crescimento' },
        large: { label: '10+ pessoas', description: 'Grande organização' },
      },
    },
    frontend: {
      question: 'Escolha sua abordagem de frontend',
      options: {
        'nextjs-app': { label: 'Next.js 15 (App Router)', description: 'React full-stack com SSR/SSG. Melhor para SEO, performance e server components.' },
        'nextjs-pages': { label: 'Next.js 15 (Pages Router)', description: 'Next.js clássico com diretório pages. Ecossistema mais maduro, modelo mental mais simples.' },
        'react-spa': { label: 'React SPA + Vite', description: 'Single-page application. Melhor para dashboards e apps onde SEO não é crítico.' },
        astro: { label: 'Astro', description: 'Sites focados em conteúdo. Arquitetura de ilhas, JavaScript mínimo. Ótimo para blogs/docs.' },
        vue: { label: 'Vue 3 + Nuxt', description: 'Framework progressivo. Curva de aprendizado mais suave, excelente DX.' },
        svelte: { label: 'SvelteKit', description: 'Baseado em compilador, runtime mínimo. Performance máxima, bundles menores.' },
      },
    },
    backend: {
      question: 'Escolha sua abordagem de backend',
      options: {
        'nextjs-fullstack': { label: 'Next.js Fullstack (Server Actions + tRPC)', description: 'Tudo em um único código. Melhor para desenvolvimento rápido e equipes pequenas.' },
        'nextjs-external': { label: 'Next.js Frontend + API externa', description: 'Arquitetura desacoplada. Melhor para backends complexos ou apps mobile.' },
        serverless: { label: 'Serverless Functions (Vercel / Netlify / Cloudflare)', description: 'Pague por requisição. Zero gestão de infraestrutura. Ótimo para tráfego variável.' },
        fastapi: { label: 'Python FastAPI', description: 'Python moderno. Melhor para integrações de ML, processamento de dados ou equipes com muito Python.' },
        express: { label: 'Node.js Express / NestJS', description: 'Backend tradicional Node.js. Controle total, ecossistema maduro.' },
        rails: { label: 'Ruby on Rails', description: 'Convenção sobre configuração. Desenvolvimento rápido de CRUD.' },
      },
    },
    database: {
      question: 'Escolha seu banco de dados',
      options: {
        'supabase-postgres': { label: 'Supabase (PostgreSQL)', description: 'Alternativa open-source ao Firebase. Subscrições em tempo real, auth integrado, plano gratuito generoso.' },
        'vercel-postgres': { label: 'Vercel Postgres (Neon)', description: 'PostgreSQL serverless. Integração profunda com Vercel, autoescala, pague pelo uso.' },
        firebase: { label: 'Firebase (Firestore + Realtime DB)', description: 'Gerenciado pelo Google. Melhor para prototipagem rápida, apps em tempo real e projetos mobile-first.' },
        'prisma-postgres': { label: 'PostgreSQL auto-hospedado + Prisma', description: 'Controle máximo. Use com Railway, DigitalOcean ou AWS RDS.' },
        mongodb: { label: 'MongoDB Atlas', description: 'Banco de dados documental. Esquema flexível, ótimo para dados não estruturados.' },
        turso: { label: 'Turso (SQLite no Edge)', description: 'SQLite hospedado no edge. Leituras extremamente rápidas, replicação global, plano gratuito generoso.' },
      },
    },
    auth: {
      question: 'Escolha sua autenticação',
      options: {
        'supabase-auth': { label: 'Supabase Auth', description: 'Gratuito, open-source, funciona com qualquer frontend. Provedores OAuth, e-mail/senha, magic links.' },
        nextauth: { label: 'NextAuth.js (Auth.js) v5', description: 'Melhor para Next.js. Múltiplos provedores, sessões JWT ou em banco de dados.' },
        clerk: { label: 'Clerk', description: 'DX premium. Componentes UI prontos, organizações, MFA, dashboard de gestão de usuários.' },
        'firebase-auth': { label: 'Firebase Authentication', description: 'Funciona melhor com a stack Firebase. Auth por telefone, anônimo, provedores sociais.' },
        auth0: { label: 'Auth0', description: 'Nível empresarial. Fluxos complexos, motor de regras, mas custo maior.' },
        custom: { label: 'Auth personalizada (JWT + bcrypt)', description: 'Controle total. Apenas se você tem requisitos de segurança específicos ou quer aprender.' },
      },
    },
    hosting: {
      question: 'Escolha sua plataforma de hospedagem',
      options: {
        vercel: { label: 'Vercel', description: 'Melhor para Next.js. Rede edge, preview deployments, analytics, zero configuração.' },
        netlify: { label: 'Netlify', description: 'Ótimo para JAMstack. Deploys baseados em Git, edge functions, forms, identity.' },
        railway: { label: 'Railway', description: 'Deploy fullstack. Suporte a Docker, bancos de dados, cron jobs, networking.' },
        cloudflare: { label: 'Cloudflare Pages + Workers', description: 'Edge-first. Banco de dados D1, armazenamento KV, deploy global extremamente rápido.' },
        aws: { label: 'AWS (Amplify / ECS / Lambda)', description: 'Controle e escala máximos. Curva de aprendizado mais íngreme, mais configuração.' },
      },
    },
    payments: {
      question: 'Provedor de pagamentos (se necessário)',
      options: {
        none: { label: 'Sem pagamentos', description: 'Ferramenta gratuita ou app interno' },
        stripe: { label: 'Stripe', description: 'Melhor para SaaS, assinaturas, pagamentos globais' },
        'lemon-squeezy': { label: 'LemonSqueezy', description: 'Melhor para makers indie, gestão de VAT da UE' },
        paypal: { label: 'PayPal', description: 'Método de pagamento alternativo' },
      },
    },
    email: {
      question: 'Serviço de e-mail (se necessário)',
      options: {
        none: { label: 'Sem e-mail', description: 'Não são necessários e-mails transacionais' },
        resend: { label: 'Resend', description: 'E-mail moderno para desenvolvedores. Ótima DX, bom plano gratuito.' },
        sendgrid: { label: 'SendGrid (Twilio)', description: 'Maduro, confiável, boa entregabilidade' },
        'aws-ses': { label: 'AWS SES', description: 'Mais barato em escala. Requer configuração da AWS.' },
      },
    },
    storage: {
      question: 'Armazenamento de arquivos (se necessário)',
      options: {
        none: { label: 'Sem armazenamento de arquivos', description: 'Não são necessários uploads' },
        'supabase-storage': { label: 'Supabase Storage', description: 'Integrado ao Supabase, políticas com RLS' },
        'cloudflare-r2': { label: 'Cloudflare R2', description: 'Compatível com S3, zero taxas de egress, barato' },
        'aws-s3': { label: 'AWS S3', description: 'Padrão da indústria, máximo de recursos' },
        'firebase-storage': { label: 'Firebase Storage', description: 'Funciona com Firebase, uploads do lado do cliente' },
      },
    },
    testing: {
      question: 'Estratégia de testes',
      options: {
        'vitest-playwright': { label: 'Vitest (unit) + Playwright (E2E)', description: 'Moderno, rápido, recomendado' },
        'jest-rtl': { label: 'Jest + React Testing Library', description: 'Combo clássico, ecossistema maduro' },
        minimal: { label: 'Mínimo (apenas verificação de tipos)', description: 'Para protótipos rápidos' },
        full: { label: 'Completo (unit + integração + E2E + visual)', description: 'Para apps de nível produção' },
      },
    },
    monitoring: {
      question: 'Monitoramento e rastreamento de erros',
      options: {
        sentry: { label: 'Sentry', description: 'Rastreamento de erros + monitoramento de performance. Padrão da indústria.' },
        logrocket: { label: 'LogRocket', description: 'Replay de sessões + rastreamento de erros. Veja o que os usuários viram.' },
        'vercel-analytics': { label: 'Vercel Analytics', description: 'Integrado ao Vercel. Web Vitals, insights de visitantes.' },
        none: { label: 'Nenhum por enquanto', description: 'Adicionar mais tarde quando necessário' },
      },
    },
  },
  zh: {
    projectName: {
      question: '你的项目名称是什么？',
      options: {},
    },
    projectDescription: {
      question: '用一句话描述你的项目',
      description: '示例：“一个面向自由职业者的 SaaS 发票平台”',
      options: {},
    },
    projectType: {
      question: '这是什么类型的项目？',
      options: {
        saas: { label: 'SaaS / Web 应用', description: '带认证和支付的多租户 Web 应用' },
        ecommerce: { label: '电子商务', description: '带商品、购物车和结账的在线商店' },
        content: { label: '内容平台', description: '博客、CMS 或内容丰富的网站' },
        marketplace: { label: '市场平台', description: '连接买家和卖家的平台' },
        api: { label: 'API / 后端服务', description: '供其他客户端调用的 REST/GraphQL API' },
        dashboard: { label: '内部仪表盘', description: '管理后台或数据分析仪表盘' },
        mobile: { label: '移动应用', description: 'iOS/Android 应用（含 Web 降级方案）' },
        tool: { label: '开发者工具 / CLI', description: '命令行工具或开发者实用程序' },
        portfolio: { label: '作品集 / 落地页', description: '个人或公司网站' },
        other: { label: '其他', description: '某种独特项目' },
      },
    },
    features: {
      question: '你需要哪些核心功能？',
      options: {
        auth: { label: '用户认证', description: '注册、登录、重置密码' },
        payments: { label: '支付 / 订阅', description: 'Stripe、PayPal 或类似服务' },
        realtime: { label: '实时更新', description: 'WebSocket、实时数据、通知' },
        uploads: { label: '文件上传', description: '图片、文档、PDF' },
        search: { label: '搜索', description: '全站全文搜索' },
        analytics: { label: '分析', description: '用户行为追踪、数据仪表盘' },
        email: { label: '邮件发送', description: '事务邮件、邮件订阅' },
        cms: { label: 'CMS / 内容管理', description: '管理员可创建/编辑内容' },
        'multi-tenant': { label: '多租户', description: '组织、团队、工作区' },
        notifications: { label: '推送通知', description: '浏览器或移动端推送' },
        api: { label: '公共 API', description: '面向第三方的 REST/GraphQL API' },
        ai: { label: 'AI 集成', description: 'LLM 功能、聊天机器人、智能体' },
      },
    },
    timeline: {
      question: '你的时间规划是？',
      options: {
        week: { label: '1-2 周', description: '快速 MVP 或原型' },
        month: { label: '1 个月', description: '包含核心功能的聚焦型 MVP' },
        quarter: { label: '1-3 个月', description: '功能完整的产品' },
        long: { label: '3 个月以上', description: '复杂平台' },
      },
    },
    teamSize: {
      question: '有多少开发者？',
      options: {
        solo: { label: '只有我', description: '独立开发者' },
        small: { label: '2-3 人', description: '小团队' },
        medium: { label: '4-10 人', description: '成长中的团队' },
        large: { label: '10 人以上', description: '大型组织' },
      },
    },
    frontend: {
      question: '选择你的前端方案',
      options: {
        'nextjs-app': { label: 'Next.js 15（App Router）', description: '全栈 React，支持 SSR/SSG。最适合 SEO、性能和 Server Components。' },
        'nextjs-pages': { label: 'Next.js 15（Pages Router）', description: '经典 Next.js，使用 pages 目录。生态更成熟，心智模型更简单。' },
        'react-spa': { label: 'React SPA + Vite', description: '单页应用。最适合仪表盘和 SEO 不关键的应用。' },
        astro: { label: 'Astro', description: '内容导向网站。群岛架构，JavaScript 最少。非常适合博客/文档。' },
        vue: { label: 'Vue 3 + Nuxt', description: '渐进式框架。学习曲线更平缓，开发体验优秀。' },
        svelte: { label: 'SvelteKit', description: '基于编译器，运行时极小。性能最快，打包体积更小。' },
      },
    },
    backend: {
      question: '选择你的后端方案',
      options: {
        'nextjs-fullstack': { label: 'Next.js 全栈（Server Actions + tRPC）', description: '所有代码在一个仓库。最适合快速开发和个体/小团队。' },
        'nextjs-external': { label: 'Next.js 前端 + 外部 API', description: '解耦架构。更适合复杂后端或移动应用。' },
        serverless: { label: 'Serverless Functions（Vercel / Netlify / Cloudflare）', description: '按请求付费。零基础设施管理。非常适合流量波动场景。' },
        fastapi: { label: 'Python FastAPI', description: '现代 Python。最适合 ML 集成、数据处理或 Python -heavy 团队。' },
        express: { label: 'Node.js Express / NestJS', description: '传统 Node.js 后端。完全可控，生态成熟。' },
        rails: { label: 'Ruby on Rails', description: '约定优于配置。快速 CRUD 开发。' },
      },
    },
    database: {
      question: '选择你的数据库',
      options: {
        'supabase-postgres': { label: 'Supabase（PostgreSQL）', description: '开源 Firebase 替代品。实时订阅、内置认证、慷慨的免费额度。' },
        'vercel-postgres': { label: 'Vercel Postgres（Neon）', description: 'Serverless PostgreSQL。与 Vercel 深度集成、自动扩缩容、按量付费。' },
        firebase: { label: 'Firebase（Firestore + Realtime DB）', description: 'Google 托管。最适合快速原型、实时应用、移动优先项目。' },
        'prisma-postgres': { label: '自托管 PostgreSQL + Prisma', description: '最大控制权。可与 Railway、DigitalOcean 或 AWS RDS 配合使用。' },
        mongodb: { label: 'MongoDB Atlas', description: '文档型数据库。 schema 灵活，非常适合非结构化数据。' },
        turso: { label: 'Turso（Edge 上的 SQLite）', description: 'Edge 托管 SQLite。读取极快、全球复制、免费额度慷慨。' },
      },
    },
    auth: {
      question: '选择你的认证方案',
      options: {
        'supabase-auth': { label: 'Supabase Auth', description: '免费、开源、可与任何前端配合。OAuth 提供商、邮箱/密码、魔法链接。' },
        nextauth: { label: 'NextAuth.js（Auth.js）v5', description: 'Next.js 最佳选择。多提供商、JWT 会话、数据库存储会话。' },
        clerk: { label: 'Clerk', description: '优质 DX。预构建 UI 组件、组织、MFA、用户管理后台。' },
        'firebase-auth': { label: 'Firebase Authentication', description: '与 Firebase 技术栈配合最佳。电话认证、匿名认证、社交登录。' },
        auth0: { label: 'Auth0', description: '企业级。复杂认证流程、规则引擎，但成本更高。' },
        custom: { label: '自定义认证（JWT + bcrypt）', description: '完全可控。仅当你有特定安全需求或想学习时使用。' },
      },
    },
    hosting: {
      question: '选择你的托管平台',
      options: {
        vercel: { label: 'Vercel', description: 'Next.js 最佳选择。Edge 网络、预览部署、分析、零配置。' },
        netlify: { label: 'Netlify', description: '非常适合 JAMstack。基于 Git 的部署、Edge Functions、表单、Identity。' },
        railway: { label: 'Railway', description: '全栈部署。支持 Docker、数据库、定时任务、网络。' },
        cloudflare: { label: 'Cloudflare Pages + Workers', description: 'Edge 优先。D1 数据库、KV 存储、全球部署极快。' },
        aws: { label: 'AWS（Amplify / ECS / Lambda）', description: '最大控制和扩展性。学习曲线更陡，配置更多。' },
      },
    },
    payments: {
      question: '支付提供商（如需要）',
      options: {
        none: { label: '无需支付', description: '免费工具或内部应用' },
        stripe: { label: 'Stripe', description: '最适合 SaaS、订阅、全球支付' },
        'lemon-squeezy': { label: 'LemonSqueezy', description: '最适合独立开发者，处理欧盟增值税' },
        paypal: { label: 'PayPal', description: '替代支付方式' },
      },
    },
    email: {
      question: '邮件服务（如需要）',
      options: {
        none: { label: '无需邮件', description: '不需要事务邮件' },
        resend: { label: 'Resend', description: '面向开发者的现代邮件服务。出色的 DX，不错的免费额度。' },
        sendgrid: { label: 'SendGrid（Twilio）', description: '成熟、可靠、送达率高' },
        'aws-ses': { label: 'AWS SES', description: '大规模最便宜。需要 AWS 配置。' },
      },
    },
    storage: {
      question: '文件存储（如需要）',
      options: {
        none: { label: '无需文件存储', description: '不需要上传' },
        'supabase-storage': { label: 'Supabase Storage', description: '与 Supabase 集成，策略配合 RLS' },
        'cloudflare-r2': { label: 'Cloudflare R2', description: '兼容 S3，零出网费用，便宜' },
        'aws-s3': { label: 'AWS S3', description: '行业标准，功能最丰富' },
        'firebase-storage': { label: 'Firebase Storage', description: '与 Firebase 配合，客户端上传' },
      },
    },
    testing: {
      question: '测试策略',
      options: {
        'vitest-playwright': { label: 'Vitest（单元）+ Playwright（E2E）', description: '现代、快速、推荐' },
        'jest-rtl': { label: 'Jest + React Testing Library', description: '经典组合，生态成熟' },
        minimal: { label: '最小化（仅类型检查）', description: '用于快速原型' },
        full: { label: '完整（单元 + 集成 + E2E + 视觉）', description: '用于生产级应用' },
      },
    },
    monitoring: {
      question: '监控与错误追踪',
      options: {
        sentry: { label: 'Sentry', description: '错误追踪 + 性能监控。行业标准。' },
        logrocket: { label: 'LogRocket', description: '会话回放 + 错误追踪。看到用户所见。' },
        'vercel-analytics': { label: 'Vercel Analytics', description: 'Vercel 内置。Web Vitals、访客洞察。' },
        none: { label: '暂不需要', description: '需要时再加' },
      },
    },
  },
};

interface TechFieldTranslations {
  bestFor: string;
  pros: string[];
  cons: string[];
  pricing: string;
}

interface ComparisonTranslations {
  category: string;
  technologies: Record<string, TechFieldTranslations>;
}

const comparisonTranslations: Record<Locale, Record<string, ComparisonTranslations>> = {
  en: {
    database: {
      category: 'Database: Supabase vs Firebase',
      technologies: {
        Supabase: {
          bestFor: 'Developers who want PostgreSQL with realtime',
          pros: ['Open source', 'PostgreSQL (full SQL power)', 'Generous free tier', 'RLS policies', 'Edge functions'],
          cons: ['Newer ecosystem', 'Smaller community than Firebase', 'Self-hosting requires ops knowledge'],
          pricing: 'Free: 500MB DB, 1GB storage. Pro: $25/mo',
        },
        Firebase: {
          bestFor: 'Rapid prototyping, mobile apps, real-time',
          pros: ['Mature ecosystem', 'Excellent real-time', 'Great mobile SDKs', 'Analytics built-in', 'Google scale'],
          cons: ['Vendor lock-in', 'Firestore is NoSQL (limited queries)', 'Can get expensive', 'Cold starts'],
          pricing: 'Spark: free (limits). Blaze: pay-as-you-go',
        },
      },
    },
    hosting: {
      category: 'Hosting: Vercel vs Netlify vs Railway',
      technologies: {
        Vercel: {
          bestFor: 'Next.js projects, frontend-first apps',
          pros: ['Zero-config Next.js', 'Preview deployments', 'Edge network', 'Analytics', 'Image optimization'],
          cons: ['Function timeout limits', 'Can get expensive', 'Serverless constraints'],
          pricing: 'Hobby: free. Pro: $20/mo',
        },
        Netlify: {
          bestFor: 'JAMstack, static sites, form handling',
          pros: ['Great for static sites', 'Edge functions', 'Forms handling', 'Split testing', 'Large free tier'],
          cons: ['Less optimized for Next.js', 'Fewer features than Vercel for React'],
          pricing: 'Starter: free. Pro: $19/mo',
        },
        Railway: {
          bestFor: 'Fullstack apps, Docker, databases',
          pros: ['Docker support', 'Private networking', 'Cron jobs', 'Any framework', 'Easy databases'],
          cons: ['Less edge-optimized', 'Smaller community'],
          pricing: 'Starter: $5/mo + usage. Pay-as-you-go',
        },
      },
    },
    auth: {
      category: 'Auth: Supabase Auth vs NextAuth vs Clerk',
      technologies: {
        'Supabase Auth': {
          bestFor: 'Any frontend, OAuth, row-level security',
          pros: ['Free', 'Works with any frontend', 'OAuth providers', 'Magic links', 'Phone auth', 'RLS integration'],
          cons: ['UI components are basic', 'Less polished than Clerk'],
          pricing: 'Free: 50,000 users/month',
        },
        'NextAuth.js v5': {
          bestFor: 'Next.js apps, maximum flexibility',
          pros: ['Best Next.js integration', 'Multiple auth strategies', 'JWT or database sessions', 'Type-safe', 'Open source'],
          cons: ['Requires more setup', 'No built-in UI', 'Next.js only'],
          pricing: 'Free (open source)',
        },
        Clerk: {
          bestFor: 'SaaS apps, organizations, premium UX',
          pros: ['Beautiful UI components', 'Organizations/teams', 'MFA', 'User impersonation', 'Webhooks', 'Dashboard'],
          cons: ['Paid for most features', 'Vendor lock-in', 'Less customizable'],
          pricing: 'Free: 10,000 MAU. Pro: $25/mo',
        },
      },
    },
  },
  es: {
    database: {
      category: 'Base de datos: Supabase vs Firebase',
      technologies: {
        Supabase: {
          bestFor: 'Desarrolladores que quieren PostgreSQL con tiempo real',
          pros: ['Código abierto', 'PostgreSQL (poder SQL completo)', 'Plan gratuito generoso', 'Políticas RLS', 'Edge functions'],
          cons: ['Ecosistema más nuevo', 'Comunidad más pequeña que Firebase', 'Auto-hospedar requiere conocimientos de ops'],
          pricing: 'Gratis: 500 MB de BD, 1 GB de almacenamiento. Pro: $25/mes',
        },
        Firebase: {
          bestFor: 'Prototipado rápido, apps móviles, tiempo real',
          pros: ['Ecosistema maduro', 'Tiempo real excelente', 'Grandes SDKs móviles', 'Analytics integrado', 'Escala de Google'],
          cons: ['Vendor lock-in', 'Firestore es NoSQL (consultas limitadas)', 'Puede volverse caro', 'Cold starts'],
          pricing: 'Spark: gratis (límites). Blaze: pago por uso',
        },
      },
    },
    hosting: {
      category: 'Alojamiento: Vercel vs Netlify vs Railway',
      technologies: {
        Vercel: {
          bestFor: 'Proyectos Next.js, apps frontend-first',
          pros: ['Next.js sin configuración', 'Preview deployments', 'Red edge', 'Analytics', 'Optimización de imágenes'],
          cons: ['Límites de timeout de funciones', 'Puede volverse caro', 'Restricciones serverless'],
          pricing: 'Hobby: gratis. Pro: $20/mes',
        },
        Netlify: {
          bestFor: 'JAMstack, sitios estáticos, manejo de formularios',
          pros: ['Ideal para sitios estáticos', 'Edge functions', 'Manejo de formularios', 'Split testing', 'Gran plan gratuito'],
          cons: ['Menos optimizado para Next.js', 'Menos funciones que Vercel para React'],
          pricing: 'Starter: gratis. Pro: $19/mes',
        },
        Railway: {
          bestFor: 'Apps fullstack, Docker, bases de datos',
          pros: ['Soporte Docker', 'Red privada', 'Cron jobs', 'Cualquier framework', 'Bases de datos fáciles'],
          cons: ['Menos optimizado para el edge', 'Comunidad más pequeña'],
          pricing: 'Starter: $5/mes + uso. Pago por uso',
        },
      },
    },
    auth: {
      category: 'Autenticación: Supabase Auth vs NextAuth vs Clerk',
      technologies: {
        'Supabase Auth': {
          bestFor: 'Cualquier frontend, OAuth, seguridad a nivel de fila',
          pros: ['Gratis', 'Funciona con cualquier frontend', 'Proveedores OAuth', 'Magic links', 'Auth por teléfono', 'Integración RLS'],
          cons: ['Componentes UI básicos', 'Menos pulido que Clerk'],
          pricing: 'Gratis: 50,000 usuarios/mes',
        },
        'NextAuth.js v5': {
          bestFor: 'Apps Next.js, máxima flexibilidad',
          pros: ['Mejor integración con Next.js', 'Múltiples estrategias de auth', 'Sesiones JWT o en BD', 'Type-safe', 'Código abierto'],
          cons: ['Requiere más configuración', 'Sin UI integrado', 'Solo Next.js'],
          pricing: 'Gratis (código abierto)',
        },
        Clerk: {
          bestFor: 'Apps SaaS, organizaciones, UX premium',
          pros: ['Componentes UI hermosos', 'Organizaciones/equipos', 'MFA', 'Suplantación de usuarios', 'Webhooks', 'Dashboard'],
          cons: ['De pago para la mayoría de funciones', 'Vendor lock-in', 'Menos personalizable'],
          pricing: 'Gratis: 10,000 MAU. Pro: $25/mes',
        },
      },
    },
  },
  pt: {
    database: {
      category: 'Banco de dados: Supabase vs Firebase',
      technologies: {
        Supabase: {
          bestFor: 'Desenvolvedores que querem PostgreSQL com tempo real',
          pros: ['Código aberto', 'PostgreSQL (poder SQL completo)', 'Plano gratuito generoso', 'Políticas RLS', 'Edge functions'],
          cons: ['Ecossistema mais novo', 'Comunidade menor que Firebase', 'Auto-hospedar requer conhecimento de ops'],
          pricing: 'Grátis: 500 MB de BD, 1 GB de armazenamento. Pro: $25/mês',
        },
        Firebase: {
          bestFor: 'Prototipagem rápida, apps móveis, tempo real',
          pros: ['Ecossistema maduro', 'Tempo real excelente', 'Ótimos SDKs mobile', 'Analytics integrado', 'Escala do Google'],
          cons: ['Vendor lock-in', 'Firestore é NoSQL (consultas limitadas)', 'Pode ficar caro', 'Cold starts'],
          pricing: 'Spark: grátis (limites). Blaze: pague pelo uso',
        },
      },
    },
    hosting: {
      category: 'Hospedagem: Vercel vs Netlify vs Railway',
      technologies: {
        Vercel: {
          bestFor: 'Projetos Next.js, apps frontend-first',
          pros: ['Next.js sem configuração', 'Preview deployments', 'Rede edge', 'Analytics', 'Otimização de imagens'],
          cons: ['Limites de timeout de funções', 'Pode ficar caro', 'Restrições serverless'],
          pricing: 'Hobby: grátis. Pro: $20/mês',
        },
        Netlify: {
          bestFor: 'JAMstack, sites estáticos, manipulação de formulários',
          pros: ['Ótimo para sites estáticos', 'Edge functions', 'Manipulação de formulários', 'Split testing', 'Grande plano gratuito'],
          cons: ['Menos otimizado para Next.js', 'Menos recursos que Vercel para React'],
          pricing: 'Starter: grátis. Pro: $19/mês',
        },
        Railway: {
          bestFor: 'Apps fullstack, Docker, bancos de dados',
          pros: ['Suporte a Docker', 'Rede privada', 'Cron jobs', 'Qualquer framework', 'Bancos de dados fáceis'],
          cons: ['Menos otimizado para edge', 'Comunidade menor'],
          pricing: 'Starter: $5/mês + uso. Pague pelo uso',
        },
      },
    },
    auth: {
      category: 'Autenticação: Supabase Auth vs NextAuth vs Clerk',
      technologies: {
        'Supabase Auth': {
          bestFor: 'Qualquer frontend, OAuth, segurança a nível de linha',
          pros: ['Grátis', 'Funciona com qualquer frontend', 'Provedores OAuth', 'Magic links', 'Auth por telefone', 'Integração RLS'],
          cons: ['Componentes UI básicos', 'Menos polido que Clerk'],
          pricing: 'Grátis: 50.000 usuários/mês',
        },
        'NextAuth.js v5': {
          bestFor: 'Apps Next.js, máxima flexibilidade',
          pros: ['Melhor integração com Next.js', 'Múltiplas estratégias de auth', 'Sessões JWT ou em BD', 'Type-safe', 'Código aberto'],
          cons: ['Requer mais configuração', 'Sem UI integrado', 'Apenas Next.js'],
          pricing: 'Grátis (código aberto)',
        },
        Clerk: {
          bestFor: 'Apps SaaS, organizações, UX premium',
          pros: ['Componentes UI bonitos', 'Organizações/equipes', 'MFA', 'Personificação de usuários', 'Webhooks', 'Dashboard'],
          cons: ['Pago para a maioria dos recursos', 'Vendor lock-in', 'Menos personalizável'],
          pricing: 'Grátis: 10.000 MAU. Pro: $25/mês',
        },
      },
    },
  },
  zh: {
    database: {
      category: '数据库：Supabase vs Firebase',
      technologies: {
        Supabase: {
          bestFor: '需要 PostgreSQL 与实时功能的开发者',
          pros: ['开源', 'PostgreSQL（完整 SQL 能力）', '慷慨的免费额度', 'RLS 策略', 'Edge Functions'],
          cons: ['较新的生态', '社区比 Firebase 小', '自托管需要运维知识'],
          pricing: '免费：500 MB 数据库、1 GB 存储。Pro：$25/月',
        },
        Firebase: {
          bestFor: '快速原型、移动应用、实时场景',
          pros: ['成熟的生态', '出色的实时能力', '优秀的移动端 SDK', '内置分析', 'Google 规模'],
          cons: ['供应商锁定', 'Firestore 是 NoSQL（查询受限）', '可能变贵', '冷启动'],
          pricing: 'Spark：免费（有限额）。Blaze：按量付费',
        },
      },
    },
    hosting: {
      category: '托管：Vercel vs Netlify vs Railway',
      technologies: {
        Vercel: {
          bestFor: 'Next.js 项目、前端优先应用',
          pros: ['零配置 Next.js', '预览部署', 'Edge 网络', '分析', '图片优化'],
          cons: ['函数超时限制', '可能变贵', 'Serverless 限制'],
          pricing: 'Hobby：免费。Pro：$20/月',
        },
        Netlify: {
          bestFor: 'JAMstack、静态站点、表单处理',
          pros: ['适合静态站点', 'Edge Functions', '表单处理', '拆分测试', '大额免费额度'],
          cons: ['对 Next.js 优化较少', 'React 功能比 Vercel 少'],
          pricing: 'Starter：免费。Pro：$19/月',
        },
        Railway: {
          bestFor: '全栈应用、Docker、数据库',
          pros: ['支持 Docker', '私有网络', '定时任务', '任意框架', '数据库便捷'],
          cons: ['Edge 优化较少', '社区较小'],
          pricing: 'Starter：$5/月 + 用量。按量付费',
        },
      },
    },
    auth: {
      category: '认证：Supabase Auth vs NextAuth vs Clerk',
      technologies: {
        'Supabase Auth': {
          bestFor: '任意前端、OAuth、行级安全',
          pros: ['免费', '可与任意前端配合', 'OAuth 提供商', '魔法链接', '电话认证', 'RLS 集成'],
          cons: ['UI 组件较基础', '不如 Clerk 精致'],
          pricing: '免费：50,000 用户/月',
        },
        'NextAuth.js v5': {
          bestFor: 'Next.js 应用、最大灵活性',
          pros: ['最佳的 Next.js 集成', '多种认证策略', 'JWT 或数据库存储会话', '类型安全', '开源'],
          cons: ['需要更多配置', '无内置 UI', '仅 Next.js'],
          pricing: '免费（开源）',
        },
        Clerk: {
          bestFor: 'SaaS 应用、组织、优质 UX',
          pros: ['精美的 UI 组件', '组织/团队', 'MFA', '用户模拟', 'Webhooks', 'Dashboard'],
          cons: ['大多功能收费', '供应商锁定', '可定制性较低'],
          pricing: '免费：10,000 MAU。Pro：$25/月',
        },
      },
    },
  },
};

const comparisonKeys = ['database', 'hosting', 'auth'] as const;

function localizeQuestions(locale: Locale): WizardQuestion[] {
  const translations = questionTranslations[locale];

  return sourceQuestions.map((q) => {
    const t = translations[q.id];
    const localizedOptions = q.options.map((option) => {
      const optionT = t?.options[option.value];
      return {
        value: option.value,
        label: optionT?.label ?? option.label,
        description: optionT?.description ?? option.description,
      };
    });

    return {
      ...q,
      question: t?.question ?? q.question,
      description: t?.description ?? q.description,
      options: localizedOptions,
    };
  });
}

function localizeSteps(locale: Locale): LocalizedStep[] {
  const translations = stepTranslations[locale];

  return sourceSteps.map((step) => ({
    ...step,
    label: translations[step.id].label,
    description: translations[step.id].description,
  }));
}

function localizeComparisons(locale: Locale): TechComparison[] {
  const translations = comparisonTranslations[locale];

  return sourceComparisons.map((comparison, index) => {
    const key = comparisonKeys[index];
    const t = translations[key];

    return {
      ...comparison,
      category: t.category,
      technologies: comparison.technologies.map((tech) => {
        const techT = t.technologies[tech.name];
        return {
          ...tech,
          name: techT ? tech.name : tech.name,
          bestFor: techT?.bestFor ?? tech.bestFor,
          pros: techT?.pros ?? tech.pros,
          cons: techT?.cons ?? tech.cons,
          pricing: techT?.pricing ?? tech.pricing,
        };
      }),
    };
  });
}

export function getWizardData(locale: Locale) {
  return {
    questions: localizeQuestions(locale),
    steps: localizeSteps(locale),
    comparisons: localizeComparisons(locale),
    getRecommendedStack: sourceGetRecommendedStack,
  };
}
