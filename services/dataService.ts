import { User, Game, GameSignup, GamePlan, GameGroup } from '@/types';
import { API_CONFIG } from '@/config/api';

export interface AppData {
  users: User[];
  games: Game[];
  dailySignups: GameSignup[];
  weekendPlans: GamePlan[];
  gameGroups: GameGroup[];
  lastUpdated: string;
}

class DataService {
  private get baseUrl() {
    // 动态获取 API 基础地址
    const apiBase = API_CONFIG.getApiBaseUrl();
    return `${apiBase}/api`;
  }

  // 获取所有数据
  async getAllData(): Promise<AppData> {
    try {
      const response = await fetch(`${this.baseUrl}/data`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      return this.getDefaultData();
    }
  }

  // 保存所有数据
  async saveAllData(data: AppData): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          lastUpdated: new Date().toISOString()
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  // 根据用户名获取用户数据
  async getUserByName(userName: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${encodeURIComponent(userName)}`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  // 创建或更新用户
  async saveUser(user: User): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  }

  // 添加游戏报名
  async addGameSignup(signup: GameSignup): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signup),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding signup:', error);
      return false;
    }
  }

  // 添加周末计划
  async addWeekendPlan(plan: GamePlan): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(plan),
      });
      return response.ok;
    } catch (error) {
      console.error('Error adding plan:', error);
      return false;
    }
  }

  // 加入游戏小组
  async joinGameGroup(groupId: string, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  }

  // 获取默认数据结构
  private getDefaultData(): AppData {
    return {
      users: [],
      games: [],
      dailySignups: [],
      weekendPlans: [],
      gameGroups: [],
      lastUpdated: new Date().toISOString()
    };
  }
}

export const dataService = new DataService(); 