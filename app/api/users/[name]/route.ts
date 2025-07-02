import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { AppData } from '@/services/dataService';

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

// GET - 根据用户名获取用户
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const userName = decodeURIComponent(name);
    const data = await readData();
    
    const user = data.users.find(u => u.name === userName);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
} 