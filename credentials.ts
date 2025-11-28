
import { AssessmentType } from './types';

export interface UserCredential {
  cardNo: string;
  password: string;
  type: AssessmentType;
  isAdmin?: boolean; // Added admin flag
}

const STORAGE_KEY = 'used_accounts_log';
const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Generate credentials deterministically so they stay the same on reload
const generateUsers = (): Record<string, UserCredential> => {
  const users: Record<string, UserCredential> = {};

  // 0. Add Admin Account
  users['admin'] = {
    cardNo: 'admin',
    password: 'gtdd001',
    type: AssessmentType.ADHD, // Default type, but will have admin privileges
    isAdmin: true
  };

  // 1. Generate 100 Sensory Accounts (GT0001 - GT0100)
  for (let i = 1; i <= 100; i++) {
    const numStr = i.toString().padStart(4, '0');
    const cardNo = `GT${numStr}`;
    // Generate a pseudo-random 6-digit password based on the ID to be consistent
    const passNum = ((i * 997 + 12345) % 900000) + 100000; 
    const password = passNum.toString();
    
    users[cardNo] = {
      cardNo,
      password,
      type: AssessmentType.SENSORY
    };
  }

  // 2. Generate 100 ADHD Accounts (DD0001 - DD0100)
  for (let i = 1; i <= 100; i++) {
    const numStr = i.toString().padStart(4, '0');
    const cardNo = `DD${numStr}`;
    // Different seed for DD
    const passNum = ((i * 883 + 54321) % 900000) + 100000;
    const password = passNum.toString();

    users[cardNo] = {
      cardNo,
      password,
      type: AssessmentType.ADHD
    };
  }

  return users;
};

export const MOCK_USERS = generateUsers();

export const checkCredentials = (cardNo: string, password: string): { isValid: boolean; userType?: AssessmentType; isAdmin?: boolean; error?: string } => {
  const user = MOCK_USERS[cardNo];

  // 1. Basic Validation
  if (!user) {
    return { isValid: false, error: '卡号不存在，请检查输入' };
  }

  if (user.password !== password) {
    return { isValid: false, error: '密码错误，请重新输入' };
  }

  // 2. Admin Check (Admins skip expiration check)
  if (user.isAdmin) {
    return { isValid: true, userType: user.type, isAdmin: true };
  }

  // 3. Expiration Check (24 Hours Logic)
  try {
    const usedLogRaw = localStorage.getItem(STORAGE_KEY);
    const usedLog: Record<string, number> = usedLogRaw ? JSON.parse(usedLogRaw) : {};
    
    const lastUsedTime = usedLog[cardNo];
    
    if (lastUsedTime) {
      const now = Date.now();
      const timeDiff = now - lastUsedTime;
      
      if (timeDiff < EXPIRATION_MS) {
        const hoursLeft = Math.ceil((EXPIRATION_MS - timeDiff) / (60 * 60 * 1000));
        return { 
          isValid: false, 
          error: `此账号已使用且失效。失效期剩余约 ${hoursLeft} 小时。` 
        };
      }
    }
  } catch (e) {
    console.error("Error reading storage", e);
  }

  return { isValid: true, userType: user.type, isAdmin: false };
};

// Call this function when login is successful to lock the account for 24h
export const markAccountAsUsed = (cardNo: string) => {
  const user = MOCK_USERS[cardNo];
  if (user?.isAdmin) return; // Don't expire admin accounts

  try {
    const usedLogRaw = localStorage.getItem(STORAGE_KEY);
    const usedLog: Record<string, number> = usedLogRaw ? JSON.parse(usedLogRaw) : {};
    
    usedLog[cardNo] = Date.now();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usedLog));
  } catch (e) {
    console.error("Error saving usage log", e);
  }
};
