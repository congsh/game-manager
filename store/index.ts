import { create } from 'zustand';
import { User, Game, GameSignup, GamePlan, GameGroup } from '@/types';
import { dataService, AppData } from '@/services/dataService';

interface AppState {
  // 数据加载状态
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // 当前用户
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  loginUser: (userName: string) => Promise<User | null>;
  
  // 所有用户
  users: User[];
  setUsers: (users: User[]) => void;
  
  // 游戏库
  games: Game[];
  setGames: (games: Game[]) => void;
  addGame: (game: Game) => void;
  deleteGame: (gameId: string) => void;
  
  // 每日报名
  dailySignups: GameSignup[];
  setDailySignups: (signups: GameSignup[]) => void;
  addDailySignup: (signup: GameSignup) => Promise<boolean>;
  
  // 周末计划
  weekendPlans: GamePlan[];
  setWeekendPlans: (plans: GamePlan[]) => void;
  addWeekendPlan: (plan: GamePlan) => Promise<boolean>;
  updateWeekendPlan: (planId: string, plan: GamePlan) => void;
  
  // 游戏小组
  gameGroups: GameGroup[];
  setGameGroups: (groups: GameGroup[]) => void;
  addGameGroup: (group: GameGroup) => void;
  joinGameGroup: (groupId: string, userId: string) => Promise<boolean>;
  
  // 数据持久化
  loadAllData: () => Promise<void>;
  saveAllData: () => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // 数据加载状态
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // 当前用户
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  loginUser: async (userName: string) => {
    try {
      set({ isLoading: true });
      
      // 先加载所有数据
      await get().loadAllData();
      
      // 查找现有用户
      let user = get().users.find(u => u.name === userName);
      
      if (!user) {
        // 创建新用户
        const newUser: User = {
          id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: userName,
          dailySignups: [],
          weekendPlans: [],
          ownedGames: [],
          gamePreferences: [],
          willingToJoinOthers: true
        };
        
        // 保存到服务器
        const success = await dataService.saveUser(newUser);
        if (success) {
          set((state) => ({ 
            users: [...state.users, newUser],
            currentUser: newUser 
          }));
          await get().saveAllData();
          user = newUser;
        }
      } else {
        set({ currentUser: user });
      }
      
      return user || null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  
  // 所有用户
  users: [],
  setUsers: (users) => set({ users }),
  
  // 游戏库
  games: [],
  setGames: (games) => set({ games }),
  addGame: (game) => set((state) => ({ games: [...state.games, game] })),
  deleteGame: (gameId) => set((state) => ({ 
    games: state.games.filter(g => g.id !== gameId) 
  })),
  
  // 每日报名
  dailySignups: [],
  setDailySignups: (signups) => set({ dailySignups: signups }),
  
  addDailySignup: async (signup: GameSignup) => {
    try {
      set((state) => ({ 
        dailySignups: [...state.dailySignups, signup] 
      }));
      return await get().saveAllData();
    } catch (error) {
      console.error('Error adding signup:', error);
      return false;
    }
  },
  
  // 周末计划
  weekendPlans: [],
  setWeekendPlans: (plans) => set({ weekendPlans: plans }),
  
  addWeekendPlan: async (plan: GamePlan) => {
    try {
      set((state) => ({ 
        weekendPlans: [...state.weekendPlans, plan] 
      }));
      return await get().saveAllData();
    } catch (error) {
      console.error('Error adding plan:', error);
      return false;
    }
  },
  
  updateWeekendPlan: (planId, plan) => set((state) => ({
    weekendPlans: state.weekendPlans.map(p => p.id === planId ? plan : p)
  })),
  
  // 游戏小组
  gameGroups: [],
  setGameGroups: (groups) => set({ gameGroups: groups }),
  addGameGroup: (group) => set((state) => ({ 
    gameGroups: [...state.gameGroups, group] 
  })),
  
  joinGameGroup: async (groupId: string, userId: string) => {
    try {
      set((state) => ({
        gameGroups: state.gameGroups.map(g => 
          g.id === groupId ? { ...g, members: [...g.members, userId] } : g
        )
      }));
      return await get().saveAllData();
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  },
  
  // 数据持久化
  loadAllData: async () => {
    try {
      set({ isLoading: true });
      const data = await dataService.getAllData();
      set({
        users: data.users,
        games: data.games,
        dailySignups: data.dailySignups,
        weekendPlans: data.weekendPlans,
        gameGroups: data.gameGroups
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveAllData: async () => {
    try {
      const state = get();
      const data: AppData = {
        users: state.users,
        games: state.games,
        dailySignups: state.dailySignups,
        weekendPlans: state.weekendPlans,
        gameGroups: state.gameGroups,
        lastUpdated: new Date().toISOString()
      };
      return await dataService.saveAllData(data);
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  },
  
  refreshData: async () => {
    await get().loadAllData();
  },
})); 