import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/services/dataService';
import { User } from '@/types';

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
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 409 }
        );
      }
      // 添加新用户
      data.users.push(user);
    }
    
    data.lastUpdated = new Date().toISOString();
    await writeData(data);
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
} 