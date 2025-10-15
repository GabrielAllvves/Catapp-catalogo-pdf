export const colors = {
  primary: '#1089ED',
  secondary: '#0F6FCC',
  background: '#F6F9FC',
  card: '#FFFFFF',
  text: '#1F2937',
  mutedText: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B'
} as const;

export type AppColor = keyof typeof colors;
