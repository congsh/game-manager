'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { formatDate, getPreferenceColor, getPreferenceLabel } from '@/utils';
import { 
  Calendar,
  TrendingUp,
  Users,
  Star,
  BarChart3,
  GamepadIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DailyReportPage() {
  const { dailySignups, games, users } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // 获取选定日期的报名数据
  const selectedDateStr = formatDate(selectedDate);
  const todaySignups = dailySignups.filter(
    s => formatDate(s.signupDate) === selectedDateStr
  );

  // 获取过去7天的数据
  const getLast7DaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const signups = dailySignups.filter(s => formatDate(s.signupDate) === dateStr);
      data.push({
        date: dateStr,
        count: signups.length,
        dayLabel: date.toLocaleDateString('zh-CN', { weekday: 'short' })
      });
    }
    return data;
  };

  // 游戏统计数据
  const getGameStats = () => {
    const stats = new Map();
    
    todaySignups.forEach(signup => {
      const gameId = signup.gameId;
      if (!stats.has(gameId)) {
        const game = games.find(g => g.id === gameId);
        stats.set(gameId, {
          game: game,
          count: 0,
          totalPreference: 0,
          users: []
        });
      }
      
      const stat = stats.get(gameId);
      stat.count++;
      stat.totalPreference += signup.preference;
      stat.users.push({
        name: signup.userName || users.find(u => u.id === signup.userId)?.name || '未知用户',
        preference: signup.preference,
        notes: signup.notes
      });
    });

    return Array.from(stats.values())
      .map(stat => ({
        ...stat,
        avgPreference: stat.totalPreference / stat.count
      }))
      .sort((a, b) => b.count - a.count);
  };

  // 用户活跃度统计
  const getUserActivityStats = () => {
    const stats = new Map();
    
    // 统计每个用户的报名次数
    dailySignups.forEach(signup => {
      const userId = signup.userId;
      if (!stats.has(userId)) {
        const user = users.find(u => u.id === userId);
        stats.set(userId, {
          userId: userId,
          userName: user?.name || signup.userName || '未知用户',
          signupCount: 0,
          lastSignup: null,
          favoriteGames: new Map()
        });
      }
      
      const stat = stats.get(userId);
      stat.signupCount++;
      
      // 更新最后报名时间
      if (!stat.lastSignup || new Date(signup.signupDate) > new Date(stat.lastSignup)) {
        stat.lastSignup = signup.signupDate;
      }
      
      // 统计最爱游戏
      const gameCount = stat.favoriteGames.get(signup.gameId) || 0;
      stat.favoriteGames.set(signup.gameId, gameCount + 1);
    });

    return Array.from(stats.values())
      .map(stat => {
        // 找出最喜欢的游戏
        let favoriteGame = null;
        let maxCount = 0;
        stat.favoriteGames.forEach((count: number, gameId: string) => {
          if (count > maxCount) {
            maxCount = count;
            favoriteGame = games.find(g => g.id === gameId);
          }
        });
        
        return {
          ...stat,
          favoriteGame: (favoriteGame as any)?.name || '无'
        };
      })
      .sort((a, b) => b.signupCount - a.signupCount);
  };

  const last7DaysData = getLast7DaysData();
  const gameStats = getGameStats();
  const userActivityStats = getUserActivityStats();

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和日期选择 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">每日报名报表</h1>
            <p className="text-gray-600 mt-1">查看每日游戏报名统计和趋势</p>
          </div>
          
          {/* 日期选择器 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="前一天"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-600" />
              <span className="font-medium">{selectedDateStr}</span>
            </div>
            <button
              onClick={() => changeDate(1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              title="后一天"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="ml-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              今天
            </button>
          </div>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">今日报名人次</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{todaySignups.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">参与游戏数</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{gameStats.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <GamepadIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">平均倾向度</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {todaySignups.length > 0
                  ? (todaySignups.reduce((sum, s) => sum + s.preference, 0) / todaySignups.length).toFixed(1)
                  : '0'}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 7天趋势图 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          最近7天报名趋势
        </h2>
        <div className="h-64 flex items-end justify-between gap-2">
          {last7DaysData.map((day, index) => {
            const maxCount = Math.max(...last7DaysData.map(d => d.count), 1);
            const height = (day.count / maxCount) * 100;
            const isToday = day.date === formatDate(new Date());
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '200px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t transition-all ${
                      isToday ? 'bg-blue-600' : 'bg-blue-400'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                      {day.count}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  <div>{day.dayLabel}</div>
                  <div>{day.date.slice(5)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 游戏热度排行 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          游戏热度排行
        </h2>
        
        {gameStats.length > 0 ? (
          <div className="space-y-4">
            {gameStats.map((stat, index) => (
              <div key={stat.game?.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-lg">#{index + 1}</span>
                      {stat.game?.name || '未知游戏'}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{stat.count} 人报名</span>
                      <span className="flex items-center gap-1">
                        平均倾向度：
                        <span className={`font-medium ${getPreferenceColor(Math.round(stat.avgPreference))}`}>
                          {stat.avgPreference.toFixed(1)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Star
                        key={value}
                        className={`h-4 w-4 ${
                          value <= Math.round(stat.avgPreference)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* 报名用户列表 */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {stat.users.map((user: any, idx: number) => (
                    <div key={idx} className="text-sm bg-gray-50 rounded px-3 py-2">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className={`text-xs ${getPreferenceColor(user.preference)}`}>
                        {getPreferenceLabel(user.preference)}
                      </div>
                      {user.notes && (
                        <div className="text-xs text-gray-500 mt-1 truncate" title={user.notes}>
                          {user.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <GamepadIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">当天暂无报名数据</p>
          </div>
        )}
      </div>

      {/* 用户活跃度排行 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          用户活跃度排行（全部时间）
        </h2>
        
        <div className="space-y-3">
          {userActivityStats.slice(0, 10).map((stat, index) => (
            <div key={stat.userId} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500 w-8">#{index + 1}</span>
                <div>
                  <div className="font-medium text-gray-900">{stat.userName}</div>
                  <div className="text-sm text-gray-600">
                    最爱游戏：{stat.favoriteGame}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">{stat.signupCount} 次</div>
                <div className="text-xs text-gray-500">
                  最近：{stat.lastSignup ? formatDate(stat.lastSignup) : '无'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 