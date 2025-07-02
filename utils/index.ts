import { TimeSlot } from '@/types';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 生成唯一ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 根据时间判断时间段
export const getTimeSlot = (date: Date): TimeSlot => {
  const hours = date.getHours();
  if (hours >= 9 && hours < 12) {
    return TimeSlot.MORNING;
  } else if (hours >= 12 && hours < 18) {
    return TimeSlot.AFTERNOON;
  } else {
    return TimeSlot.EVENING;
  }
};

// 时间段显示文本
export const getTimeSlotLabel = (slot: TimeSlot): string => {
  switch (slot) {
    case TimeSlot.MORNING:
      return '上午 (9:00-12:00)';
    case TimeSlot.AFTERNOON:
      return '下午 (12:00-18:00)';
    case TimeSlot.EVENING:
      return '晚上 (18:00-24:00)';
    default:
      return '';
  }
};

// 格式化日期
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy年MM月dd日', { locale: zhCN });
};

// 格式化时间
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm');
};

// 格式化日期时间
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
};

// 检查时间是否已过期
export const isExpired = (date: Date | string): boolean => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return d < new Date();
};

// 获取游戏倾向度标签
export const getPreferenceLabel = (preference: number): string => {
  switch (preference) {
    case 1:
      return '不太想玩';
    case 2:
      return '一般';
    case 3:
      return '可以玩';
    case 4:
      return '想玩';
    case 5:
      return '非常想玩';
    default:
      return '';
  }
};

// 获取游戏倾向度颜色
export const getPreferenceColor = (preference: number): string => {
  switch (preference) {
    case 1:
      return 'text-gray-500';
    case 2:
      return 'text-blue-500';
    case 3:
      return 'text-green-500';
    case 4:
      return 'text-orange-500';
    case 5:
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}; 