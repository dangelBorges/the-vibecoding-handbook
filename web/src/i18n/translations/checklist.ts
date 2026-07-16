import type { Namespace } from '../types';

const checklist: Namespace<{
  titleLine1: string;
  titleLine2: string;
  intro: string;
  progressLabel: string;
  readyToShip: string;
  checked: string;
  item1Title: string;
  item1Description: string;
  item2Title: string;
  item2Description: string;
  item3Title: string;
  item3Description: string;
  item4Title: string;
  item4Description: string;
  item5Title: string;
  item5Description: string;
  item6Title: string;
  item6Description: string;
}> = {
  en: {
    titleLine1: 'Ship With',
    titleLine2: 'Confidence',
    intro: 'Before merging AI-generated code, run through this production checklist. Each item represents a critical security or quality gate.',
    progressLabel: 'Checklist Progress',
    readyToShip: 'Ready to ship!',
    checked: '{checked}/{total} checked',
    item1Title: 'Secrets Detection',
    item1Description: 'Scan for API keys, tokens, and credentials in generated code',
    item2Title: 'Dependency Audit',
    item2Description: 'Review all new packages for known vulnerabilities',
    item3Title: 'Human-in-the-loop',
    item3Description: 'Manual review for auth, payments, and PII handling',
    item4Title: 'OWASP Compliance',
    item4Description: 'Verify against top 10 web application security risks',
    item5Title: 'Test Coverage',
    item5Description: 'Ensure generated code has adequate unit and integration tests',
    item6Title: 'Architecture Review',
    item6Description: 'Verify consistency with existing patterns and conventions',
  },
  es: {
    titleLine1: 'Envía con',
    titleLine2: 'confianza',
    intro: 'Antes de mergear código generado por IA, revisa esta checklist de producción. Cada elemento representa una barrera crítica de seguridad o calidad.',
    progressLabel: 'Progreso de la checklist',
    readyToShip: '¡Listo para enviar!',
    checked: '{checked}/{total} marcados',
    item1Title: 'Detección de secretos',
    item1Description: 'Escanea claves API, tokens y credenciales en el código generado',
    item2Title: 'Auditoría de dependencias',
    item2Description: 'Revisa todos los paquetes nuevos en busca de vulnerabilidades conocidas',
    item3Title: 'Humano en el circuito',
    item3Description: 'Revisión manual para autenticación, pagos y manejo de PII',
    item4Title: 'Cumplimiento OWASP',
    item4Description: 'Verifica contra los 10 principales riesgos de seguridad web',
    item5Title: 'Cobertura de pruebas',
    item5Description: 'Asegura que el código generado tenga pruebas unitarias e de integración adecuadas',
    item6Title: 'Revisión de arquitectura',
    item6Description: 'Verifica la consistencia con patrones y convenciones existentes',
  },
  pt: {
    titleLine1: 'Envie com',
    titleLine2: 'confiança',
    intro: 'Antes de fazer merge de código gerado por IA, execute esta checklist de produção. Cada item representa uma barreira crítica de segurança ou qualidade.',
    progressLabel: 'Progresso da checklist',
    readyToShip: 'Pronto para enviar!',
    checked: '{checked}/{total} marcados',
    item1Title: 'Detecção de segredos',
    item1Description: 'Escaneie chaves API, tokens e credenciais no código gerado',
    item2Title: 'Auditoria de dependências',
    item2Description: 'Revise todos os novos pacotes em busca de vulnerabilidades conhecidas',
    item3Title: 'Humano no circuito',
    item3Description: 'Revisão manual para auth, pagamentos e manuseio de PII',
    item4Title: 'Conformidade OWASP',
    item4Description: 'Verifique contra os 10 principais riscos de segurança de aplicações web',
    item5Title: 'Cobertura de testes',
    item5Description: 'Garanta que o código gerado tenha testes unitários e de integração adequados',
    item6Title: 'Revisão de arquitetura',
    item6Description: 'Verifique a consistência com padrões e convenções existentes',
  },
  zh: {
    titleLine1: '自信地',
    titleLine2: '发布',
    intro: '在合并 AI 生成的代码之前，请运行这份生产检查清单。每一项都代表一道关键的安全或质量门禁。',
    progressLabel: '检查清单进度',
    readyToShip: '可以发布了！',
    checked: '已检查 {checked}/{total}',
    item1Title: '机密检测',
    item1Description: '扫描生成代码中的 API 密钥、令牌和凭据',
    item2Title: '依赖审计',
    item2Description: '审查所有新包是否存在已知漏洞',
    item3Title: '人工介入',
    item3Description: '对认证、支付和 PII 处理进行人工审查',
    item4Title: 'OWASP 合规',
    item4Description: '对照十大 Web 应用安全风险进行验证',
    item5Title: '测试覆盖',
    item5Description: '确保生成代码具有足够的单元测试和集成测试',
    item6Title: '架构审查',
    item6Description: '验证与现有模式和规范的一致性',
  },
};

export default checklist;
