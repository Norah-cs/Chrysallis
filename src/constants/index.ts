import { TechOption, PracticeGoal, YearOption, ButterflyTheme } from '../types';

export const TECH_OPTIONS: TechOption[] = [
  { value: 'software-engineering', label: '💻 Software Engineering' },
  { value: 'data-science', label: '📊 Data Science' },
  { value: 'product-management', label: '📦 Product Management' },
  { value: 'ux-design', label: '🎨 UX Design' },
  { value: 'cybersecurity', label: '🛡️ Cybersecurity' },
  { value: 'ai-ml', label: '🧠 AI / Machine Learning' },
];

export const PRACTICE_GOALS: PracticeGoal[] = [
  { id: 'confidence', label: 'Build confidence', emoji: '💪' },
  { id: 'clarity', label: 'Improve communication', emoji: '💬' },
  { id: 'speed', label: 'Practice under time pressure', emoji: '⚡' },
  { id: 'feedback', label: 'Get constructive feedback', emoji: '📝' },
];

export const YEAR_OPTIONS: YearOption[] = [
  { value: '1st', label: '1st year' },
  { value: '2nd', label: '2nd year' },
  { value: '3rd', label: '3rd year' },
  { value: '4th+', label: '4th year or above' },
];

export const BUTTERFLY_THEMES: ButterflyTheme[] = [
  { name: 'Sunset', colors: ['#FEF3C7', '#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E'] },
  { name: 'Ocean', colors: ['#DBEAFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8'] },
  { name: 'Forest', colors: ['#D1FAE5', '#6EE7B7', '#34D399', '#10B981', '#059669', '#047857'] },
  { name: 'Rose', colors: ['#FCE7F3', '#F9A8D4', '#F472B6', '#EC4899', '#DB2777', '#BE185D'] },
  { name: 'Lavender', colors: ['#F3E8FF', '#C4B5FD', '#A78BFA', '#8B5CF6', '#7C3AED', '#6D28D9'] },
  { name: 'Coral', colors: ['#FEF2F2', '#FECACA', '#FCA5A5', '#F87171', '#EF4444', '#DC2626'] },
];