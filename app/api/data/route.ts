import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/services/dataService';

const DATA_FILE = path.join(process.cwd(), 'data', 'app-data.json');

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// 读取数据
async function readData(): Promise<AppData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 如果文件不存在，返回默认数据
    const defaultData: AppData = {
      users: [],
      games: [
        {
          id: 'game-1',
          name: 'CS:GO',
          category: 'FPS',
          minPlayers: 1,
          maxPlayers: 10,
          platform: ['Steam'],
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: 'game-2',
          name: '王者荣耀',
          category: 'MOBA',
          minPlayers: 1,
          maxPlayers: 5,
          platform: ['手机'],
          createdBy: 'system',
          createdAt: new Date()
        },
        {
          id: 'game-3',
          name: '原神',
          category: 'RPG',
          minPlayers: 1,
          maxPlayers: 4,
          platform: ['PC', '手机', 'PS'],
          createdBy: 'system',
          createdAt: new Date()
        }
      ],
      dailySignups: [],
      weekendPlans: [],
      gameGroups: [],
      lastUpdated: new Date().toISOString()
    };
    
    // 创建默认数据文件
    await writeData(defaultData);
    return defaultData;
  }
}

// 写入数据
async function writeData(data: AppData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// GET - 获取所有数据
export async function GET() {
  try {
    const data = await readData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json(
      { error: 'Failed to read data' },
      { status: 500 }
    );
  }
}

// POST - 保存所有数据
export async function POST(request: NextRequest) {
  try {
    const data: AppData = await request.json();
    await writeData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing data:', error);
    return NextResponse.json(
      { error: 'Failed to write data' },
      { status: 500 }
    );
  }
} 