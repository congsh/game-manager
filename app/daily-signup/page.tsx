'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { GameSignup } from '@/types';
import { generateId, formatDate, getPreferenceLabel, getPreferenceColor } from '@/utils';
import { 
  Calendar,
  GamepadIcon,
  Star,
  MessageSquare,
  Check
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function DailySignupPage() {
  const { games, currentUser, addDailySignup, dailySignups } = useStore();
  const [selectedGames, setSelectedGames] = useState<{ [gameId: string]: boolean }>({});
  const [preferences, setPreferences] = useState<{ [gameId: string]: number }>({});
  const [notes, setNotes] = useState<{ [gameId: string]: string }>({});

  // 获取今天的报名记录
  const todayDate = formatDate(new Date());
  const todaySignups = dailySignups.filter(
    s => s.userId === currentUser?.id && formatDate(s.signupDate) === todayDate
  );

  const handleToggleGame = (gameId: string) => {
    setSelectedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
    
    // 如果是新选中的游戏，设置默认倾向度为3
    if (!selectedGames[gameId] && !preferences[gameId]) {
      setPreferences(prev => ({
        ...prev,
        [gameId]: 3
      }));
    }
  };

  const handleSubmit = () => {
    const selectedGameIds = Object.keys(selectedGames).filter(id => selectedGames[id]);
    
    if (selectedGameIds.length === 0) {
      toast.error('请至少选择一个游戏');
      return;
    }

    // 创建报名记录
    selectedGameIds.forEach(gameId => {
      const game = games.find(g => g.id === gameId);
      if (!game) return;

      const signup: GameSignup = {
        id: generateId(),
        userId: currentUser?.id || '',
        userName: currentUser?.name,
        gameId: gameId,
        gameName: game.name,
        signupDate: new Date(),
        preference: preferences[gameId] || 3,
        notes: notes[gameId] || '',
        createdAt: new Date()
      };

      addDailySignup(signup);
    });

    toast.success('报名成功！');
    
    // 重置表单
    setSelectedGames({});
    setPreferences({});
    setNotes({});
  };

  // 检查游戏是否已经报名
  const isGameSignedUp = (gameId: string) => {
    return todaySignups.some(s => s.gameId === gameId);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">每日游戏报名</h1>
            <p className="text-gray-600 mt-1">选择今天想玩的游戏并设置倾向度</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{todayDate}</span>
          </div>
        </div>

        {/* 今日已报名提示 */}
        {todaySignups.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              今天已报名 {todaySignups.length} 个游戏
            </p>
          </div>
        )}
      </div>

      {/* 游戏选择列表 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">选择游戏</h2>
        
        <div className="space-y-4">
          {games.map((game) => {
            const isSignedUp = isGameSignedUp(game.id);
            const isSelected = selectedGames[game.id];
            
            return (
              <div
                key={game.id}
                className={`border rounded-lg p-4 transition-colors ${
                  isSignedUp
                    ? 'bg-gray-50 border-gray-300'
                    : isSelected
                    ? 'bg-blue-50 border-blue-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 选择框 */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected || isSignedUp}
                      onChange={() => handleToggleGame(game.id)}
                      disabled={isSignedUp}
                      aria-label={`选择游戏 ${game.name}`}
                      title={`选择游戏 ${game.name}`}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* 游戏信息 */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {game.name}
                        {isSignedUp && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            已报名
                          </span>
                        )}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <GamepadIcon className="h-4 w-4" />
                          {game.category}
                        </span>
                        <span>{game.minPlayers}-{game.maxPlayers} 人</span>
                        <span>{game.platform.join(', ')}</span>
                      </div>
                    </div>

                    {/* 倾向度选择 */}
                    {(isSelected || isSignedUp) && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          游戏倾向度
                        </label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              disabled={isSignedUp}
                              onClick={() => setPreferences({ ...preferences, [game.id]: value })}
                              aria-label={`设置游戏倾向度为 ${value} 星`}
                              title={`设置游戏倾向度为 ${value} 星`}
                              className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition-colors ${
                                (isSignedUp ? todaySignups.find(s => s.gameId === game.id)?.preference : preferences[game.id]) === value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              } ${isSignedUp ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  (isSignedUp ? (todaySignups.find(s => s.gameId === game.id)?.preference ?? 3) : (preferences[game.id] ?? 3)) >= value
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className={`ml-2 text-sm ${getPreferenceColor(
                            isSignedUp ? todaySignups.find(s => s.gameId === game.id)?.preference || 3 : (preferences[game.id] || 3)
                          )}`}>
                            {getPreferenceLabel(
                              isSignedUp ? todaySignups.find(s => s.gameId === game.id)?.preference || 3 : (preferences[game.id] || 3)
                            )}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 备注 */}
                    {(isSelected || isSignedUp) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          备注（可选）
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            value={isSignedUp ? todaySignups.find(s => s.gameId === game.id)?.notes : (notes[game.id] || '')}
                            onChange={(e) => setNotes({ ...notes, [game.id]: e.target.value })}
                            disabled={isSignedUp}
                            placeholder="添加备注信息..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 提交按钮 */}
        {Object.keys(selectedGames).filter(id => selectedGames[id]).length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Check className="h-5 w-5" />
              提交报名
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 