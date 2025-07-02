'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store';
import { User as UserIcon, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { users, loginUser, isLoading } = useStore();

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    
    if (!trimmedUsername) {
      toast.error('请输入用户名');
      return;
    }

    if (trimmedUsername.length < 2) {
      toast.error('用户名至少需要2个字符');
      return;
    }

    if (trimmedUsername.length > 20) {
      toast.error('用户名不能超过20个字符');
      return;
    }

    try {
      const user = await loginUser(trimmedUsername);
      
      if (user) {
        toast.success(`欢迎${users.some(u => u.name === trimmedUsername) ? '回来' : '加入'}，${trimmedUsername}！`);
        router.push('/');
      } else {
        toast.error('登录失败，请重试');
      }
    } catch (error) {
      toast.error('登录失败，请重试');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
            <UserIcon className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">登录 / 注册</h1>
          <p className="text-gray-600 mt-2">输入用户名即可进入系统</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入你的用户名"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              • 用户名长度 2-20 个字符<br />
              • 用户名不能重复<br />
              • 首次登录将自动创建账号
            </p>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>登录中...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>进入系统</span>
              </>
            )}
          </button>
        </div>

        {/* 当前用户列表（开发阶段显示） */}
        {users.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">已注册用户：</h3>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="text-sm text-gray-600 px-3 py-2 bg-gray-50 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setUsername(user.name);
                    toast.success(`已选择用户：${user.name}`);
                  }}
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">点击用户名可快速填充</p>
          </div>
        )}
      </div>
    </div>
  );
} 