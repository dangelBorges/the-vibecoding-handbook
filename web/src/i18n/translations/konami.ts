import type { Namespace } from '../types';

const konami: Namespace<{
  title: string;
  subtitle: string;
  rankLabel: string;
  rankValue: string;
  starOnGitHub: string;
  close: string;
}> = {
  en: {
    title: 'You Found The Secret!',
    subtitle: 'Konami code unlocked. You are a true vibe coder. Welcome to the inner circle.',
    rankLabel: 'Your vibe coder rank:',
    rankValue: 'LEVEL 99 ARCHITECT',
    starOnGitHub: 'Star on GitHub',
    close: 'Close and keep exploring',
  },
  es: {
    title: '¡Encontraste el secreto!',
    subtitle: 'Código Konami desbloqueado. Eres un verdadero vibe coder. Bienvenido al círculo interno.',
    rankLabel: 'Tu rango de vibe coder:',
    rankValue: 'NIVEL 99 ARQUITECTO',
    starOnGitHub: 'Star en GitHub',
    close: 'Cerrar y seguir explorando',
  },
  pt: {
    title: 'Você encontrou o segredo!',
    subtitle: 'Código Konami desbloqueado. Você é um verdadeiro vibe coder. Bem-vindo ao círculo interno.',
    rankLabel: 'Seu rank de vibe coder:',
    rankValue: 'NÍVEL 99 ARQUITETO',
    starOnGitHub: 'Star no GitHub',
    close: 'Fechar e continuar explorando',
  },
  zh: {
    title: '你发现了秘密！',
    subtitle: 'Konami 代码已解锁。你是真正的 vibe coder。欢迎加入核心圈。',
    rankLabel: '你的 vibe coder 等级：',
    rankValue: '99 级架构师',
    starOnGitHub: '在 GitHub 上点星',
    close: '关闭并继续探索',
  },
};

export default konami;
