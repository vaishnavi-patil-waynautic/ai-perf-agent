import React from 'react';
import { Bot } from 'lucide-react';

export interface ModelConfig {
  label     : string;
  bgColor   : string;   // Tailwind class for avatar background
  ringColor : string;   // Tailwind ring class
  textColor : string;   // hex colour for icon fill/stroke
  Icon      : React.FC<{ size?: number; color?: string }>;
}

const OpenAIIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M29.71 13.09A8.1 8.1 0 0 0 20.78 4a8 8 0 0 0-5.65 2.34A8.1 8.1 0 0 0 2.29 18.91 8.08 8.08 0 0 0 5.54 28a8 8 0 0 0 5.65-2.34A8.09 8.09 0 0 0 16 27a8 8 0 0 0 7.62-5.55 8.09 8.09 0 0 0 6.09-8.36ZM16 24.4a6 6 0 0 1-3.84-1.39l.19-.11 6.37-3.68a1 1 0 0 0 .52-.9V13l2.69 1.56a.08.08 0 0 1 .05.07v7.44A6 6 0 0 1 16 24.4Zm-12.9-5.5a6 6 0 0 1-.71-4 5.74 5.74 0 0 0 .19.12l6.37 3.68a1 1 0 0 0 1 0l7.78-4.49v3.12a.1.1 0 0 1 0 .08L11.13 21a6 6 0 0 1-8.03-2.1ZM3.88 10.86a6 6 0 0 1 3.13-2.63v7.56a1 1 0 0 0 .51.89l7.77 4.49-2.7 1.56a.1.1 0 0 1-.09 0L6 18.92a6 6 0 0 1-2.12-8.06Zm22.14 5.15-7.78-4.5L21 10a.1.1 0 0 1 .09 0l6.51 3.76a6 6 0 0 1-.93 10.81v-7.56a1 1 0 0 0-.55-.9Zm2.68-4a5.74 5.74 0 0 0-.19-.12l-6.36-3.67a1 1 0 0 0-1 0l-7.78 4.49V9.58a.08.08 0 0 1 0-.08L19.91 5.8a6 6 0 0 1 8.79 6.2Zm-16.85 5.54-2.7-1.55a.1.1 0 0 1-.05-.08V8.8a6 6 0 0 1 9.84-4.61l-.19.11-6.37 3.67a1 1 0 0 0-.51.89Zm1.46-3.16L16 12.71l2.69 1.55v3.09L16 18.9l-2.69-1.55Z"
      fill={color}
    />
  </svg>
);

const ClaudeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M21.66 7H18.1L12 25h3.73l1.3-3.93h5.88L24.21 25H28L21.66 7Zm-3.57 11.11 1.97-5.94 1.97 5.94h-3.94ZM10.32 7H6.77L4 25h3.56l1.7-11.51L13.35 25h2.58L10.32 7Z"
      fill={color}
    />
  </svg>
);

const GeminiIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 3C16 10.18 10.18 16 3 16c7.18 0 13 5.82 13 13 0-7.18 5.82-13 13-13-7.18 0-13-5.82-13-13Z"
      fill={color}
    />
  </svg>
);

const LlamaIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M4 16c0-3.31 2.24-6 5-6s5 2.69 5 6-2.24 6-5 6-5-2.69-5-6Zm14 0c0-3.31 2.24-6 5-6s5 2.69 5 6-2.24 6-5 6-5-2.69-5-6Z"
      stroke={color} strokeWidth="2.4" fill="none" />
    <path d="M14 16c0-2.21.9-4 2-4s2 1.79 2 4-.9 4-2 4-2-1.79-2-4Z" fill={color} />
  </svg>
);

const MistralIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect x="3"  y="5"  width="5" height="5" rx="1" fill={color} />
    <rect x="13" y="5"  width="5" height="5" rx="1" fill={color} />
    <rect x="23" y="5"  width="5" height="5" rx="1" fill={color} />
    <rect x="3"  y="13" width="5" height="5" rx="1" fill={color} />
    <rect x="13" y="13" width="5" height="5" rx="1" fill={color} />
    <rect x="3"  y="21" width="5" height="5" rx="1" fill={color} />
    <rect x="13" y="21" width="5" height="5" rx="1" fill={color} />
    <rect x="23" y="13" width="5" height="5" rx="1" fill={color} />
  </svg>
);

const CohereIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="10" stroke={color} strokeWidth="2.5" fill="none" />
    <circle cx="16" cy="16" r="4"  fill={color} />
    <circle cx="16" cy="6"  r="2.5" fill={color} />
    <circle cx="26" cy="16" r="2.5" fill={color} />
  </svg>
);

const DeepSeekIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path d="M4 20 C8 8, 14 8, 16 16 C18 24, 24 24, 28 12"
      stroke={color} strokeWidth="2.8" strokeLinecap="round" fill="none" />
    <circle cx="28" cy="12" r="2.5" fill={color} />
    <circle cx="4"  cy="20" r="2.5" fill={color} />
  </svg>
);

const PerplexityIcon: React.FC<{ size?: number; color?: string }> = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="5" fill={color} />
    <line x1="16" y1="3"  x2="16" y2="10" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="16" y1="22" x2="16" y2="29" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="3"  y1="16" x2="10" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="16" x2="29" y2="16" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const DefaultBotIcon: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = '#3b82f6' }) => (
  <Bot size={size} color={color} />
);

/* ── Bucket map ─────────────────────────────────────────────────────────── */
interface Bucket { pattern: RegExp; config: ModelConfig; }

const MODEL_BUCKETS: Bucket[] = [
  {
    pattern: /gpt|openai|o1|o3|o4/,
    config: {
      label: 'OpenAI', bgColor: 'bg-[#10a37f]', ringColor: 'ring-[#10a37f]/30',
      textColor: '#ffffff', Icon: OpenAIIcon,
    },
  },
  {
    pattern: /claude|anthropic|sonnet|opus|haiku/,
    config: {
      label: 'Claude', bgColor: 'bg-[#d97706]', ringColor: 'ring-[#d97706]/30',
      textColor: '#ffffff', Icon: ClaudeIcon,
    },
  },
  {
    pattern: /gemini|bard|google|palm/,
    config: {
      label: 'Gemini', bgColor: 'bg-gradient-to-br from-[#4285f4] to-[#34a853]',
      ringColor: 'ring-blue-400/30', textColor: '#ffffff', Icon: GeminiIcon,
    },
  },
  {
    pattern: /llama|meta|codellama/,
    config: {
      label: 'Llama', bgColor: 'bg-[#0668E1]', ringColor: 'ring-blue-500/30',
      textColor: '#ffffff', Icon: LlamaIcon,
    },
  },
  {
    pattern: /mistral|mixtral|codestral/,
    config: {
      label: 'Mistral', bgColor: 'bg-[#f97316]', ringColor: 'ring-orange-400/30',
      textColor: '#ffffff', Icon: MistralIcon,
    },
  },
  {
    pattern: /cohere|command/,
    config: {
      label: 'Cohere', bgColor: 'bg-[#39594D]', ringColor: 'ring-emerald-800/30',
      textColor: '#ffffff', Icon: CohereIcon,
    },
  },
  {
    pattern: /deepseek/,
    config: {
      label: 'DeepSeek', bgColor: 'bg-[#4f6ef7]', ringColor: 'ring-indigo-400/30',
      textColor: '#ffffff', Icon: DeepSeekIcon,
    },
  },
  {
    pattern: /perplexity|pplx/,
    config: {
      label: 'Perplexity', bgColor: 'bg-[#20808d]', ringColor: 'ring-teal-400/30',
      textColor: '#ffffff', Icon: PerplexityIcon,
    },
  },
];

const DEFAULT_CONFIG: ModelConfig = {
  label: 'Assistant', bgColor: 'bg-blue-100', ringColor: 'ring-blue-300/30',
  textColor: '#3b82f6', Icon: DefaultBotIcon,
};

/* ── Public API ─────────────────────────────────────────────────────────── */

/** Returns the display config for a model string. Falls back to default. */
export function getModelConfig(modelId?: string | null): ModelConfig {
  if (!modelId) return DEFAULT_CONFIG;
  const lower = modelId?.toLowerCase();
  return MODEL_BUCKETS.find(({ pattern }) => pattern.test(lower))?.config ?? DEFAULT_CONFIG;
}

/**
 * Coloured avatar circle that auto-picks the correct brand icon.
 * Used in MessageBubble for bot messages.
 */
export const ModelAvatar: React.FC<{
  modelId  ?: string | null;
  size     ?: number;
  className?: string;
}> = ({ modelId, size = 36, className = '' }) => {
  const { Icon, bgColor, ringColor, textColor } = getModelConfig(modelId);
  return (
    <div
      title={getModelConfig(modelId).label}
      style={{ width: size, height: size }}
      className={`flex-shrink-0 rounded-full flex items-center justify-center ring-2 ${bgColor} ${ringColor} ${className}`}
    >
      <Icon size={Math.round(size * 0.5)} color={textColor} />
    </div>
  );
};