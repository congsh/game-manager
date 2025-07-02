'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { GameGroup, GamePlan, TimeSlot } from '@/types';
import { 
  generateId, 
  formatDate, 
  formatTime, 
  getTimeSlot, 
  getTimeSlotLabel,
  isExpired 
} from '@/utils';
import { 
  Calendar,
  Clock,
  Users,
  UserPlus,
  GamepadIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function GroupReportPage() {
  const { 
    weekendPlans, 
    gameGroups, 
    games, 
    users, 
    currentUser,
    addGameGroup,
    joinGameGroup,
    setGameGroups
  } = useStore();
  
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 获取本周末的日期
  const getWeekendDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysToSaturday = 6 - dayOfWeek;
    const daysToSunday = 7 - dayOfWeek;
    
    const saturday = new Date(today);
    saturday.setDate(today.getDate() + daysToSaturday);
    
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + daysToSunday);
    
    return {
      saturday: saturday.toISOString().split('T')[0],
      sunday: sunday.toISOString().split('T')[0]
    };
  };

  const { saturday, sunday } = getWeekendDates();

  useEffect(() => {
    // 默认选择周六
    if (!selectedDate) {
      setSelectedDate(saturday);
    }
  }, [saturday, selectedDate]);

  // 根据周末计划自动生成游戏小组
  useEffect(() => {
    const generateGroupsFromPlans = () => {
      const existingGroupIds = new Set(gameGroups.map(g => g.id));
      const newGroups: GameGroup[] = [];

      weekendPlans.forEach(plan => {
        // 检查是否已有对应的小组
        const existingGroup = gameGroups.find(g => 
          g.gameId === plan.targetGameId &&
          g.startTime.getTime() === plan.startTime.getTime() &&
          g.endTime.getTime() === plan.endTime.getTime()
        );

        if (!existingGroup) {
          // 创建新小组
          const game = games.find(g => g.id === plan.targetGameId);
          if (game) {
            const newGroup: GameGroup = {
              id: generateId(),
              gameId: plan.targetGameId,
              gameName: game.name,
              initiator: plan.userId,
              initiatorName: plan.userName,
              startTime: plan.startTime,
              endTime: plan.endTime,
              members: [plan.userId],
              memberNames: [plan.userName || ''],
              maxMembers: game.maxPlayers,
              isRecruiting: true
            };
            newGroups.push(newGroup);
          }
        } else if (!existingGroup.members.includes(plan.userId)) {
          // 将用户加入现有小组
          joinGameGroup(existingGroup.id, plan.userId);
        }
      });

      if (newGroups.length > 0) {
        setGameGroups([...gameGroups, ...newGroups]);
      }
    };

    generateGroupsFromPlans();
  }, [weekendPlans, games, gameGroups, setGameGroups, joinGameGroup]);

  // 按时间段分组
  const getGroupsByTimeSlot = () => {
    const groups: Record<TimeSlot, GameGroup[]> = {
      [TimeSlot.MORNING]: [],
      [TimeSlot.AFTERNOON]: [],
      [TimeSlot.EVENING]: []
    };

    const selectedGroups = gameGroups.filter(g => {
      const groupDate = formatDate(g.startTime);
      return groupDate === formatDate(selectedDate) && !isExpired(g.endTime);
    });

    selectedGroups.forEach(group => {
      const slot = getTimeSlot(group.startTime);
      groups[slot].push(group);
    });

    return groups;
  };

  // 获取愿意参加其他小组的用户
  const getAvailableUsers = (timeSlot: TimeSlot) => {
    const slotStart = new Date(selectedDate);
    const slotEnd = new Date(selectedDate);
    
    switch (timeSlot) {
      case TimeSlot.MORNING:
        slotStart.setHours(9, 0);
        slotEnd.setHours(12, 0);
        break;
      case TimeSlot.AFTERNOON:
        slotStart.setHours(12, 0);
        slotEnd.setHours(18, 0);
        break;
      case TimeSlot.EVENING:
        slotStart.setHours(18, 0);
        slotEnd.setHours(24, 0);
        break;
    }

    return weekendPlans.filter(plan => 
      plan.willingToJoinOthers &&
      plan.startTime >= slotStart &&
      plan.endTime <= slotEnd &&
      formatDate(plan.date) === selectedDate
    );
  };

  const handleJoinGroup = (groupId: string) => {
    if (!currentUser) {
      toast.error('请先登录');
      return;
    }

    const group = gameGroups.find(g => g.id === groupId);
    if (!group) {
      toast.error('小组不存在');
      return;
    }

    if (group.members.includes(currentUser.id)) {
      toast.error('你已经在这个小组中了');
      return;
    }

    if (group.members.length >= group.maxMembers) {
      toast.error('小组已满');
      return;
    }

    joinGameGroup(groupId, currentUser.id);
    toast.success('加入小组成功！');
  };

  const groupsByTimeSlot = getGroupsByTimeSlot();

  return (
    <div className="space-y-6">
      {/* 页面标题和日期选择 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">游戏小组报表</h1>
            <p className="text-gray-600 mt-1">查看和加入游戏小组</p>
          </div>
          
          {/* 日期选择 */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate(saturday)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDate === saturday
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              周六 ({formatDate(saturday).slice(5)})
            </button>
            <button
              onClick={() => setSelectedDate(sunday)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDate === sunday
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              周日 ({formatDate(sunday).slice(5)})
            </button>
          </div>
        </div>
      </div>

      {/* 时间段分组展示 */}
      {[TimeSlot.MORNING, TimeSlot.AFTERNOON, TimeSlot.EVENING].map(timeSlot => {
        const groups = groupsByTimeSlot[timeSlot];
        const availableUsers = getAvailableUsers(timeSlot);
        const recruitingGroups = groups.filter(g => g.isRecruiting && g.members.length < g.maxMembers);

        return (
          <div key={timeSlot} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {getTimeSlotLabel(timeSlot)}
            </h2>

            {groups.length > 0 ? (
              <div className="space-y-4">
                {/* 缺人提醒 */}
                {recruitingGroups.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-800 mb-2">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">有 {recruitingGroups.length} 个小组正在招人！</span>
                    </div>
                    {availableUsers.length > 0 && (
                      <p className="text-sm text-orange-700">
                        有 {availableUsers.length} 位玩家愿意加入其他小组
                      </p>
                    )}
                  </div>
                )}

                {/* 小组列表 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {groups.map(group => {
                    const game = games.find(g => g.id === group.gameId);
                    const isFull = group.members.length >= group.maxMembers;
                    const isUserInGroup = currentUser && group.members.includes(currentUser.id);
                    
                    return (
                      <div
                        key={group.id}
                        className={`border rounded-lg p-4 ${
                          isFull ? 'bg-gray-50 border-gray-300' : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <GamepadIcon className="h-5 w-5" />
                              {group.gameName || game?.name}
                            </h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatTime(group.startTime)} - {formatTime(group.endTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {group.members.length}/{group.maxMembers}
                              </span>
                            </div>
                          </div>
                          {isFull ? (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                              已满
                            </span>
                          ) : (
                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                              招人中
                            </span>
                          )}
                        </div>

                        {/* 成员列表 */}
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">小组成员：</p>
                          <div className="flex flex-wrap gap-2">
                            {group.members.map((memberId, index) => {
                              const member = users.find(u => u.id === memberId);
                              const isInitiator = memberId === group.initiator;
                              
                              return (
                                <span
                                  key={memberId}
                                  className={`text-xs px-2 py-1 rounded ${
                                    isInitiator
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {member?.name || group.memberNames?.[index] || '未知用户'}
                                  {isInitiator && ' (发起人)'}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        {!isFull && !isUserInGroup && currentUser && (
                          <button
                            onClick={() => handleJoinGroup(group.id)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <UserPlus className="h-4 w-4" />
                            加入小组
                          </button>
                        )}
                        {isUserInGroup && (
                          <div className="text-center text-sm text-green-600 flex items-center justify-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            你已在此小组中
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 愿意加入的用户列表 */}
                {availableUsers.length > 0 && recruitingGroups.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      以下玩家愿意加入其他小组：
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableUsers.map(plan => (
                        <span
                          key={plan.id}
                          className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200"
                        >
                          {plan.userName} ({plan.targetGameName})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <GamepadIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">该时段暂无游戏小组</p>
                <p className="text-sm text-gray-400 mt-1">
                  可以去"周末计划"页面创建游戏计划
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
} 