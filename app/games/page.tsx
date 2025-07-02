'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Game, GameCategory } from '@/types';
import { generateId, formatDateTime } from '@/utils';
import { 
  Plus, 
  Trash2, 
  Edit, 
  GamepadIcon, 
  Users,
  Calendar,
  X,
  Upload,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function GamesPage() {
  const { games, setGames, addGame, deleteGame, currentUser } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: GameCategory.OTHER,
    minPlayers: 1,
    maxPlayers: 4,
    platform: [] as string[]
  });
  const [searchTerm, setSearchTerm] = useState('');

  // 初始化一些示例游戏
  useEffect(() => {
    if (games.length === 0) {
      const sampleGames: Game[] = [
        {
          id: generateId(),
          name: 'CS:GO',
          category: GameCategory.FPS,
          minPlayers: 1,
          maxPlayers: 10,
          platform: ['Steam'],
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: generateId(),
          name: '王者荣耀',
          category: GameCategory.MOBA,
          minPlayers: 1,
          maxPlayers: 5,
          platform: ['手机'],
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: generateId(),
          name: '原神',
          category: GameCategory.RPG,
          minPlayers: 1,
          maxPlayers: 4,
          platform: ['PC', '手机', 'PS'],
          createdBy: 'system',
          createdAt: new Date()
        }
      ];
      setGames(sampleGames);
    }
  }, [games, setGames]);

  const handleAddGame = () => {
    if (!formData.name.trim()) {
      toast.error('请输入游戏名称');
      return;
    }

    if (formData.platform.length === 0) {
      toast.error('请至少选择一个平台');
      return;
    }

    const newGame: Game = {
      id: generateId(),
      name: formData.name.trim(),
      category: formData.category,
      minPlayers: formData.minPlayers,
      maxPlayers: formData.maxPlayers,
      platform: formData.platform,
      createdBy: currentUser?.id || 'unknown',
      createdAt: new Date()
    };

    addGame(newGame);
    toast.success('游戏添加成功！');
    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteGame = (gameId: string, createdBy: string) => {
    if (createdBy === 'system') {
      toast.error('系统预设游戏不能删除');
      return;
    }

    if (createdBy !== currentUser?.id) {
      toast.error('只能删除自己添加的游戏');
      return;
    }

    if (confirm('确定要删除这个游戏吗？')) {
      deleteGame(gameId);
      toast.success('游戏删除成功！');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: GameCategory.OTHER,
      minPlayers: 1,
      maxPlayers: 4,
      platform: []
    });
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  const handleBatchImport = () => {
    if (!importText.trim()) {
      toast.error('请输入要导入的游戏数据');
      return;
    }

    try {
      const lines = importText.trim().split('\n');
      const importedGames: Game[] = [];
      
      lines.forEach((line, index) => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length < 2) {
          throw new Error(`第 ${index + 1} 行格式错误：至少需要游戏名称和平台`);
        }

        const [name, platforms, category, minPlayers, maxPlayers] = parts;
        
        // 检查是否已存在
        if (games.some(g => g.name === name)) {
          throw new Error(`游戏 "${name}" 已存在`);
        }

        const newGame: Game = {
          id: generateId(),
          name: name,
          category: (category as GameCategory) || GameCategory.OTHER,
          minPlayers: parseInt(minPlayers) || 1,
          maxPlayers: parseInt(maxPlayers) || 4,
          platform: platforms.split('|').map(p => p.trim()),
          createdBy: currentUser?.id || 'unknown',
          createdAt: new Date()
        };

        importedGames.push(newGame);
      });

      // 批量添加游戏
      setGames([...games, ...importedGames]);
      toast.success(`成功导入 ${importedGames.length} 个游戏！`);
      setShowImportModal(false);
      setImportText('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '导入失败，请检查格式');
    }
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const platforms = ['Steam', 'Epic', 'PC', 'PS', 'Xbox', 'Switch', '手机'];

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">游戏库管理</h1>
            <p className="text-gray-600 mt-1">管理可选的游戏列表</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              批量导入
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              添加游戏
            </button>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mt-6">
          <input
            type="text"
            placeholder="搜索游戏名称或类型..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 游戏列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{game.name}</h3>
                <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {game.category}
                </span>
              </div>
              {game.createdBy === currentUser?.id && (
                <button
                  onClick={() => handleDeleteGame(game.id, game.createdBy)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="删除游戏"
                  aria-label="删除游戏"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{game.minPlayers}-{game.maxPlayers} 人</span>
              </div>
              <div className="flex items-center gap-2">
                <GamepadIcon className="h-4 w-4" />
                <span>{game.platform.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(game.createdAt)}</span>
              </div>
            </div>

            {game.createdBy === 'system' && (
              <div className="mt-3 text-xs text-gray-500">系统预设</div>
            )}
          </div>
        ))}
      </div>

      {/* 添加游戏模态框 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">添加新游戏</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
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
              {/* 游戏名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  游戏名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入游戏名称"
                />
              </div>

              {/* 游戏类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  游戏类型
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as GameCategory })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  title="游戏类型"
                  aria-label="游戏类型"
                >
                  {Object.values(GameCategory).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* 人数范围 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最少人数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.minPlayers}
                    placeholder="请输入最少人数"
                    title="最少人数"
                    aria-label="最少人数"
                    onChange={(e) => setFormData({ ...formData, minPlayers: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    最多人数
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.maxPlayers}
                    placeholder="请输入最多人数"
                    title="最多人数"
                    aria-label="最多人数"
                    onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) || 4 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 游戏平台 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  游戏平台 *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => togglePlatform(platform)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        formData.platform.includes(platform)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddGame}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 批量导入模态框 */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">批量导入游戏</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="text-gray-500 hover:text-gray-700"
                title="关闭"
                aria-label="关闭模态框"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 导入说明 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  导入格式说明
                </h3>
                <p className="text-sm text-blue-800 mb-2">
                  每行一个游戏，格式：游戏名称, 平台, 类型, 最少人数, 最多人数
                </p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>• 游戏名称和平台为必填项</p>
                  <p>• 平台多个时用 | 分隔，如：Steam|Epic|PC</p>
                  <p>• 类型可选：FPS, RPG, 策略, 休闲, MOBA, 体育, 益智, 其他</p>
                  <p>• 人数默认为 1-4 人</p>
                </div>
                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                  <p className="text-xs font-mono text-gray-600">
                    示例：<br />
                    英雄联盟, PC, MOBA, 5, 5<br />
                    糖豆人, Steam|Epic, 休闲, 1, 60<br />
                    文明6, Steam|Epic, 策略, 1, 12
                  </p>
                </div>
              </div>

              {/* 输入区域 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  游戏数据
                </label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="粘贴或输入游戏数据..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportText('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleBatchImport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Upload className="h-5 w-5" />
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 