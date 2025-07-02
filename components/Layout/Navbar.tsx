'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  GamepadIcon, 
  BarChart, 
  Users, 
  User,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/daily-signup', label: '每日报名', icon: Calendar },
  { href: '/weekend-plan', label: '周末计划', icon: Calendar },
  { href: '/games', label: '游戏库', icon: GamepadIcon },
  { href: '/daily-report', label: '报名统计', icon: BarChart },
  { href: '/group-report', label: '小组报表', icon: Users },
  { href: '/profile', label: '个人中心', icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, setCurrentUser } = useStore();

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo和标题 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GamepadIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">游戏组队管理</span>
            </Link>
          </div>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* 用户信息 */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  title="退出登录"
                >
                  <LogOut className="h-4 w-4" />
                  <span>退出</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                登录
              </Link>
            )}
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            {/* 移动端用户信息 */}
            <div className="pt-4 border-t">
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700">
                    <User className="h-5 w-5" />
                    <span>{currentUser.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>退出登录</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 text-blue-600"
                >
                  <User className="h-5 w-5" />
                  <span>登录</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}