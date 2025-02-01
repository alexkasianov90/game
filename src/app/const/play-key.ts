export const playKeys = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight'
} as const;

export type PlayKeys = keyof typeof playKeys;
