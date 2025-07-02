'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  GamepadIcon, 
  BarChart, 
  Users, 
  TrendingUp,
  Clock,
  UserPlus,
  ArrowRight
} from 'lucide-react';
import { useStore } from '@/store';
import { formatDate } from '@/utils';

export default function HomePage() {
  const { 
    currentUser, 
    setCurrentUser, 
    dailySignups, 
    weekendPlans, 
    gameGroups,
    games,
    loadAllData,
    isLoading
  } = useStore();

  useEffect(() => {
    // 首次加载数据
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    // 未登录用户跳转到登录页
    if (!currentUser && !isLoading) {
      window.location.href = '/login';
    }
  }, [currentUser, isLoading]);

  // 统计数据
  const todaySignups = dailySignups.filter(
    s => formatDate(s.signupDate) === formatDate(new Date())
  ).length;
  
  const activeGroups = gameGroups.filter(g => g.isRecruiting).length;
  const totalGames = games.length;

  const quickActions = [
    {
      title: '每日游戏报名',
      description: '报名今天想玩的游戏',
      icon: Calendar,
      href: '/daily-signup',
      color: 'bg-blue-500'
    },
    {
      title: '周末游戏计划',
      description: '安排周末游戏时间',
      icon: Clock,
      href: '/weekend-plan',
      color: 'bg-green-500'
    },
    {
      title: '查看小组',
      description: '加入或创建游戏小组',
      icon: Users,
      href: '/group-report',
      color: 'bg-purple-500'
    },
    {
      title: '游戏库',
      description: '管理可选游戏列表',
      icon: GamepadIcon,
      href: '/games',
      color: 'bg-orange-500'
    }
  ];

  const stats = [
    {
      label: '今日报名',
      value: todaySignups,
      icon: UserPlus,
      trend: '+12%',
      color: 'text-blue-600'
    },
    {
      label: '活跃小组',
      value: activeGroups,
      icon: Users,
      trend: '+5%',
      color: 'text-green-600'
    },
    {
      label: '游戏总数',
      value: totalGames,
      icon: GamepadIcon,
      trend: '+3',
      color: 'text-purple-600'
    },
    {
      label: '本周活跃',
      value: '85%',
      icon: TrendingUp,
      trend: '+8%',
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 欢迎标题 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          欢迎回来，{currentUser?.name || '游客'}！
        </h1>
        <p className="mt-2 text-gray-600">
          今天是 {formatDate(new Date())}，让我们一起安排游戏时间吧！
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-gray-50 ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 font-medium">{stat.trend}</span>
                <span className="text-gray-500 ml-2">较上周</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {action.description}
                </p>
                <div className="flex items-center text-sm text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>立即前往</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 最近活动 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">最近活动</h2>
          <Link
            href="/daily-report"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部
          </Link>
        </div>
        
        <div className="space-y-4">
          {dailySignups.slice(0, 3).length > 0 ? (
            dailySignups.slice(0, 3).map((signup) => (
              <div
                key={signup.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {signup.userName} 报名了 {signup.gameName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(signup.signupDate)}
                  </p>
                </div>
                <div className="text-sm text-gray-600">
                  倾向度: {signup.preference}/5
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              暂无最近活动，快去报名吧！
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
