'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useRouter } from 'next/navigation';
import { Game, GamePreference } from '@/types';
import { 
  User,
  GamepadIcon,
  Star,
  Settings,
  Check,
  X,
  Save,
  LogOut
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { 
    currentUser, 
    setCurrentUser, 
    games, 
    users,
    setUsers,
    dailySignups,
    weekendPlans
  } = useStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    willingToJoinOthers: currentUser?.willingToJoinOthers || false,
    ownedGames: currentUser?.ownedGames || [],
    gamePreferences: currentUser?.gamePreferences || []
  });

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        willingToJoinOthers: currentUser.willingToJoinOthers,
        ownedGames: currentUser.ownedGames,
        gamePreferences: currentUser.gamePreferences
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    if (!currentUser) return;

    const trimmedName = formData.name.trim();
    
    if (!trimmedName) {
      toast.error('用户名不能为空');
      return;
    }

    if (trimmedName.length < 2) {
      toast.error('用户名至少需要2个字符');
      return;
    }

    if (trimmedName.length > 20) {
      toast.error('用户名不能超过20个字符');
      return;
    }

    // 检查用户名是否被其他人使用
    const isDuplicate = users.some(u => 
      u.id !== currentUser.id && u.name === trimmedName
    );

    if (isDuplicate) {
      toast.error('用户名已被使用');
      return;
    }

    // 更新当前用户
    const updatedUser = {
      ...currentUser,
      name: trimmedName,
      willingToJoinOthers: formData.willingToJoinOthers,
      ownedGames: formData.ownedGames,
      gamePreferences: formData.gamePreferences
    };

    setCurrentUser(updatedUser);
    
    // 更新用户列表
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));

    toast.success('个人信息更新成功！');
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        willingToJoinOthers: currentUser.willingToJoinOthers,
        ownedGames: currentUser.ownedGames,
        gamePreferences: currentUser.gamePreferences
      });
    }
    setIsEditing(false);
  };

  const toggleOwnedGame = (gameId: string) => {
    setFormData(prev => ({
      ...prev,
      ownedGames: prev.ownedGames.includes(gameId)
        ? prev.ownedGames.filter(id => id !== gameId)
        : [...prev.ownedGames, gameId]
    }));
  };

  const updateGamePreference = (gameId: string, preference: number) => {
    setFormData(prev => {
      const existingPref = prev.gamePreferences.find(p => p.gameId === gameId);
      
      if (existingPref) {
        return {
          ...prev,
          gamePreferences: prev.gamePreferences.map(p =>
            p.gameId === gameId ? { ...p, preference } : p
          )
        };
      } else {
        return {
          ...prev,
          gamePreferences: [...prev.gamePreferences, { gameId, preference }]
        };
      }
    });
  };

  const getGamePreference = (gameId: string): number => {
    const pref = formData.gamePreferences.find(p => p.gameId === gameId);
    return pref?.preference || 3;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/login');
  };

  if (!currentUser) {
    return null;
  }

  // 统计数据
  const totalSignups = dailySignups.filter(s => s.userId === currentUser.id).length;
  const totalPlans = weekendPlans.filter(p => p.userId === currentUser.id).length;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
            <p className="text-gray-600 mt-1">管理你的个人信息和游戏偏好</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              编辑信息
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X className="h-5 w-5" />
                取消
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-5 w-5" />
                保存
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="h-5 w-5" />
          基本信息
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入用户名"
              />
            ) : (
              <p className="text-gray-900">{currentUser.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              游戏偏好设置
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="willingToJoinOthers"
                checked={formData.willingToJoinOthers}
                onChange={(e) => setFormData({ ...formData, willingToJoinOthers: e.target.checked })}
                disabled={!isEditing}
                className="h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="willingToJoinOthers" className="text-sm text-gray-700">
                如果有其他游戏小组缺人，我愿意参加
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">累计报名次数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalSignups}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">周末计划数</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalPlans}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 拥有的游戏 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <GamepadIcon className="h-5 w-5" />
          拥有的游戏
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {games.map((game) => {
            const isOwned = formData.ownedGames.includes(game.id);
            
            return (
              <button
                key={game.id}
                onClick={() => isEditing && toggleOwnedGame(game.id)}
                disabled={!isEditing}
                className={`relative p-3 rounded-lg border text-left transition-all ${
                  isOwned
                    ? 'bg-blue-50 border-blue-500'
                    : 'bg-white border-gray-300'
                } ${isEditing ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
              >
                {isOwned && (
                  <Check className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
                )}
                <h3 className="font-medium text-gray-900 pr-6">{game.name}</h3>
                <p className="text-xs text-gray-600 mt-1">{game.category}</p>
                <p className="text-xs text-gray-500">{game.platform.join(', ')}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 游戏偏好度 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5" />
          游戏偏好度设置
        </h2>
        
        <div className="space-y-4">
          {games.map((game) => {
            const preference = getGamePreference(game.id);
            
            return (
              <div key={game.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h3 className="font-medium text-gray-900">{game.name}</h3>
                  <p className="text-sm text-gray-600">{game.category}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => isEditing && updateGamePreference(game.id, value)}
                      disabled={!isEditing}
                      className={`p-1 ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                      title={`设置偏好度为 ${value} 星`}
                      aria-label={`设置 ${game.name} 的偏好度为 ${value} 星`}
                    >
                      <Star
                        className={`h-5 w-5 ${
                          value <= preference
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 退出登录 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="h-5 w-5" />
          退出登录
        </button>
      </div>
    </div>
  );
} 