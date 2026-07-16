import type { Namespace } from '../types';

const templatesPage: Namespace<{
  backToHome: string;
  badge: string;
  title: string;
  subtitle: string;
  submitTemplate: string;
  official: string;
  copy: string;
  copied: string;
  download: string;
  upvote: string;
  upvoted: string;
  byAuthor: string;
  howToTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  categoryAll: string;
  categoryContext: string;
  categoryRules: string;
  categoryChecklist: string;
  categoryStarter: string;
}> = {
  en: {
    backToHome: 'Back to home',
    badge: 'Marketplace',
    title: 'Template Marketplace',
    subtitle:
      'Official templates plus community submissions for your vibe coding workflow. Copy to clipboard, download as files, or upvote the ones you love.',
    submitTemplate: 'Submit a template',
    official: 'Official',
    copy: 'Copy',
    copied: 'Copied!',
    download: 'Download',
    upvote: 'Upvote',
    upvoted: 'Upvoted',
    byAuthor: 'by {author}',
    howToTitle: 'How to Use These Templates',
    step1Title: 'Download',
    step1Desc: 'Download the template or copy it to your clipboard.',
    step2Title: 'Customize',
    step2Desc: 'Replace the bracketed placeholders with your project details.',
    step3Title: 'Deploy',
    step3Desc: 'Place the file in your project root and start coding with AI.',
    categoryAll: 'All',
    categoryContext: 'Context Files',
    categoryRules: 'IDE Rules',
    categoryChecklist: 'Checklists',
    categoryStarter: 'Starters',
  },
  es: {
    backToHome: 'Volver al inicio',
    badge: 'Marketplace',
    title: 'Mercado de plantillas',
    subtitle:
      'Plantillas oficiales y aportes de la comunidad para tu flujo de trabajo vibe coding. Copia al portapapeles, descarga como archivos o vota las que más te gusten.',
    submitTemplate: 'Enviar una plantilla',
    official: 'Oficial',
    copy: 'Copiar',
    copied: '¡Copiado!',
    download: 'Descargar',
    upvote: 'Votar',
    upvoted: 'Votado',
    byAuthor: 'por {author}',
    howToTitle: 'Cómo usar estas plantillas',
    step1Title: 'Descargar',
    step1Desc: 'Descarga la plantilla o cópiala al portapapeles.',
    step2Title: 'Personalizar',
    step2Desc:
      'Reemplaza los marcadores entre corchetes con los detalles de tu proyecto.',
    step3Title: 'Implementar',
    step3Desc:
      'Coloca el archivo en la raíz de tu proyecto y empieza a programar con IA.',
    categoryAll: 'Todas',
    categoryContext: 'Archivos de contexto',
    categoryRules: 'Reglas del IDE',
    categoryChecklist: 'Listas de verificación',
    categoryStarter: 'Inicios',
  },
  pt: {
    backToHome: 'Voltar ao início',
    badge: 'Marketplace',
    title: 'Mercado de modelos',
    subtitle:
      'Modelos oficiais e envios da comunidade para o seu fluxo de vibe coding. Copie para a área de transferência, baixe como arquivos ou vote nos que você mais gosta.',
    submitTemplate: 'Enviar um modelo',
    official: 'Oficial',
    copy: 'Copiar',
    copied: 'Copiado!',
    download: 'Baixar',
    upvote: 'Votar',
    upvoted: 'Votado',
    byAuthor: 'por {author}',
    howToTitle: 'Como usar estes modelos',
    step1Title: 'Baixar',
    step1Desc: 'Baixe o modelo ou copie-o para a área de transferência.',
    step2Title: 'Personalizar',
    step2Desc:
      'Substitua os espaços reservados entre colchetes pelos detalhes do seu projeto.',
    step3Title: 'Implantar',
    step3Desc:
      'Coloque o arquivo na raiz do seu projeto e comece a programar com IA.',
    categoryAll: 'Todos',
    categoryContext: 'Arquivos de contexto',
    categoryRules: 'Regras do IDE',
    categoryChecklist: 'Checklists',
    categoryStarter: 'Iniciais',
  },
  zh: {
    backToHome: '返回首页',
    badge: '模板市场',
    title: '模板市场',
    subtitle:
      '官方模板和社区投稿，助力你的 vibe coding 工作流。可复制到剪贴板、下载为文件，或给喜欢的模板点赞。',
    submitTemplate: '提交模板',
    official: '官方',
    copy: '复制',
    copied: '已复制',
    download: '下载',
    upvote: '点赞',
    upvoted: '已点赞',
    byAuthor: '作者：{author}',
    howToTitle: '如何使用这些模板',
    step1Title: '下载',
    step1Desc: '下载模板或复制到剪贴板。',
    step2Title: '自定义',
    step2Desc: '将方括号中的占位符替换为你的项目详情。',
    step3Title: '部署',
    step3Desc: '将文件放到项目根目录，然后开始用 AI 编码。',
    categoryAll: '全部',
    categoryContext: '上下文文件',
    categoryRules: 'IDE 规则',
    categoryChecklist: '检查清单',
    categoryStarter: '启动模板',
  },
};

export default templatesPage;
