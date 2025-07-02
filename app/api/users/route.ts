import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/services/dataService';
import { User } from '@/types';
import { corsJsonResponse, handleCorsOptions } from '@/utils/cors';

const DATA_FILE = path.join(process.cwd(), 'data', 'app-data.json');

async function readData(): Promise<AppData> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
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

async function writeData(data: AppData): Promise<void> {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// OPTIONS - 处理预检请求
export async function OPTIONS() {
  return handleCorsOptions();
}

// GET - 获取所有用户
export async function GET() {
  try {
    const data = await readData();
    return corsJsonResponse(data.users);
  } catch (error) {
    console.error('Error reading users:', error);
    return corsJsonResponse(
      { error: 'Failed to read users' },
      { status: 500 }
    );
  }
}

// POST - 创建或更新用户
export async function POST(request: NextRequest) {
  try {
    const user: User = await request.json();
    const data = await readData();
    
    // 查找现有用户
    const existingUserIndex = data.users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // 更新现有用户
      data.users[existingUserIndex] = user;
    } else {
      // 检查用户名是否已存在
      const duplicateName = data.users.find(u => u.name === user.name);
      if (duplicateName) {
        return corsJsonResponse(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
      // 添加新用户
      data.users.push(user);
    }
    
    data.lastUpdated = new Date().toISOString();
    await writeData(data);
    
    return corsJsonResponse({ success: true, user });
  } catch (error) {
    console.error('Error saving user:', error);
    return corsJsonResponse(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
} 