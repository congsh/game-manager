'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { GamePlan } from '@/types';
import { generateId, formatDate, formatTime, isExpired } from '@/utils';
import { 
  Calendar,
  Clock,
  GamepadIcon,
  Plus,
  Edit,
  Trash2,
  Users,
  Check,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function WeekendPlanPage() {
  const { games, currentUser, weekendPlans, addWeekendPlan, updateWeekendPlan, setWeekendPlans } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<GamePlan | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    targetGameId: '',
    willingToJoinOthers: false
  });

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

  // 获取用户的周末计划
  const myPlans = weekendPlans
    .filter(p => p.userId === currentUser?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // 未过期的计划
  const activePlans = myPlans.filter(p => !isExpired(p.endTime));

  const handleSubmit = () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.targetGameId) {
      toast.error('请填写所有必填项');
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      toast.error('结束时间必须晚于开始时间');
      return;
    }

    const game = games.find(g => g.id === formData.targetGameId);
    if (!game) {
      toast.error('请选择有效的游戏');
      return;
    }

    if (editingPlan) {
      // 更新计划
      const updatedPlan: GamePlan = {
        ...editingPlan,
        date: new Date(formData.date),
        startTime: startDateTime,
        endTime: endDateTime,
        targetGameId: formData.targetGameId,
        targetGameName: game.name,
        willingToJoinOthers: formData.willingToJoinOthers
      };
      
      updateWeekendPlan(editingPlan.id, updatedPlan);
      toast.success('计划更新成功！');
    } else {
      // 创建新计划
      const newPlan: GamePlan = {
        id: generateId(),
        userId: currentUser?.id || '',
        userName: currentUser?.name,
        targetGameId: formData.targetGameId,
        targetGameName: game.name,
        startTime: startDateTime,
        endTime: endDateTime,
        date: new Date(formData.date),
        willingToJoinOthers: formData.willingToJoinOthers
      };

      addWeekendPlan(newPlan);
      toast.success('计划创建成功！');
    }

    setShowAddModal(false);
    setEditingPlan(null);
    resetForm();
  };

  const handleEdit = (plan: GamePlan) => {
    setEditingPlan(plan);
    setFormData({
      date: plan.date.toString().split('T')[0],
      startTime: formatTime(plan.startTime),
      endTime: formatTime(plan.endTime),
      targetGameId: plan.targetGameId,
      willingToJoinOthers: plan.willingToJoinOthers
    });
    setShowAddModal(true);
  };

  const handleDelete = (planId: string) => {
    if (confirm('确定要删除这个计划吗？')) {
      setWeekendPlans(weekendPlans.filter(p => p.id !== planId));
      toast.success('计划删除成功！');
    }
  };

  const resetForm = () => {
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      targetGameId: '',
      willingToJoinOthers: false
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">周末游戏计划</h1>
            <p className="text-gray-600 mt-1">安排你的周末游戏时间</p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            添加计划
          </button>
        </div>

        {/* 周末日期提示 */}
        <div className="mt-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>本周六：{formatDate(saturday)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>本周日：{formatDate(sunday)}</span>
          </div>
        </div>
      </div>

      {/* 我的计划列表 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">我的游戏计划</h2>
        
        {activePlans.length > 0 ? (
          <div className="space-y-4">
            {activePlans.map((plan) => {
              const game = games.find(g => g.id === plan.targetGameId);
              const isPast = isExpired(plan.endTime);
              
              return (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 ${
                    isPast ? 'bg-gray-50 border-gray-300' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{plan.targetGameName || game?.name}</h3>
                        {plan.willingToJoinOthers && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            愿意加入其他小组
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(plan.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(plan.startTime)} - {formatTime(plan.endTime)}</span>
                        </div>
                        {game && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{game.minPlayers}-{game.maxPlayers} 人</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isPast && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(plan)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="编辑计划"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="删除计划"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <GamepadIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">还没有周末游戏计划</p>
            <p className="text-sm text-gray-400 mt-1">点击上方"添加计划"按钮创建你的第一个计划</p>
          </div>
        )}
      </div>

      {/* 添加/编辑计划模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPlan ? '编辑游戏计划' : '添加游戏计划'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPlan(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
                title="关闭"
                aria-label="关闭模态框"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 日期选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  游戏日期 *
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, date: saturday })}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      formData.date === saturday
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    周六 ({formatDate(saturday).slice(5)})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, date: sunday })}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-colors ${
                      formData.date === sunday
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    周日 ({formatDate(sunday).slice(5)})
                  </button>
                </div>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  title="选择游戏日期"
                  aria-label="选择游戏日期"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 时间选择 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    开始时间 *
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    title="开始时间"
                    aria-label="开始时间"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    结束时间 *
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    title="结束时间"
                    aria-label="结束时间"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 游戏选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  目标游戏 *
                </label>
                <select
                  value={formData.targetGameId}
                  onChange={(e) => setFormData({ ...formData, targetGameId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="选择目标游戏"
                  aria-label="选择目标游戏"
                >
                  <option value="">请选择游戏</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id}>
                      {game.name} ({game.minPlayers}-{game.maxPlayers}人)
                    </option>
                  ))}
                </select>
              </div>

              {/* 愿意加入其他小组 */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="willingToJoinOthers"
                  checked={formData.willingToJoinOthers}
                  onChange={(e) => setFormData({ ...formData, willingToJoinOthers: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="willingToJoinOthers" className="text-sm text-gray-700">
                  如果有其他游戏小组缺人，我愿意参加
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPlan(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check className="h-5 w-5" />
                {editingPlan ? '更新' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 