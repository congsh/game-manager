// 用户数据结构
export interface User {
  id: string;
  name: string;
  dailySignups: GameSignup[];
  weekendPlans: GamePlan[];
  ownedGames: string[]; // 游戏ID数组
  gamePreferences: GamePreference[];
  willingToJoinOthers: boolean;
}

// 游戏数据结构
export interface Game {
  id: string;
  name: string;
  category: string;
  minPlayers: number;
  maxPlayers: number;
  platform: string[];
  createdBy: string;
  createdAt: Date;
}

// 游戏计划数据结构
export interface GamePlan {
  id: string;
  userId: string;
  userName?: string;
  targetGameId: string;
  targetGameName?: string;
  startTime: Date;
  endTime: Date;
  date: Date;
  willingToJoinOthers: boolean;
}

// 游戏小组数据结构
export interface GameGroup {
  id: string;
  gameId: string;
  gameName?: string;
  initiator: string;
  initiatorName?: string;
  startTime: Date;
  endTime: Date;
  members: string[]; // 用户ID数组
  memberNames?: string[];
  maxMembers: number;
  isRecruiting: boolean;
}

// 每日游戏报名数据结构
export interface GameSignup {
  id: string;
  userId: string;
  userName?: string;
  gameId: string;
  gameName?: string;
  signupDate: Date;
  preference: number; // 游戏倾向度 1-5分
  notes: string; // 备注信息
  createdAt: Date;
}

// 游戏偏好数据结构
export interface GamePreference {
  gameId: string;
  preference: number; // 1-5分
}

// 时间段枚举
export enum TimeSlot {
  MORNING = "morning", // 上午 9-12
  AFTERNOON = "afternoon", // 下午 12-18
  EVENING = "evening" // 晚上 18-24
}

// 游戏类型枚举
export enum GameCategory {
  FPS = "FPS",
  RPG = "RPG",
  STRATEGY = "策略",
  CASUAL = "休闲",
  MOBA = "MOBA",
  SPORTS = "体育",
  PUZZLE = "益智",
  OTHER = "其他"
} 