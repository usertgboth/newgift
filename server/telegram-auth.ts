
import crypto from 'crypto';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8240745182:AAE5sF_HosDMHafZbWgF5cgTPx4Oq_wh-_c";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

/**
 * Verify Telegram WebApp initData signature
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export function verifyTelegramWebAppData(initData: string): TelegramUser | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      console.error('❌ No hash in initData');
      return null;
    }

    // Remove hash from params for verification
    urlParams.delete('hash');
    
    // Sort params alphabetically and create data-check-string
    const dataCheckArr: string[] = [];
    urlParams.forEach((value, key) => {
      dataCheckArr.push(`${key}=${value}`);
    });
    dataCheckArr.sort();
    const dataCheckString = dataCheckArr.join('\n');

    // Create secret key using bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();

    // Calculate hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Verify hash
    if (calculatedHash !== hash) {
      console.error('❌ Hash verification failed');
      return null;
    }

    // Check auth_date (must be within 24 hours)
    const authDate = parseInt(urlParams.get('auth_date') || '0');
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 86400) {
      console.error('❌ Auth data expired (>24h)');
      return null;
    }

    // Parse user data
    const userJson = urlParams.get('user');
    if (!userJson) {
      console.error('❌ No user data in initData');
      return null;
    }

    const user = JSON.parse(userJson);
    return {
      ...user,
      auth_date: authDate,
      hash
    };
  } catch (error) {
    console.error('❌ Error verifying Telegram data:', error);
    return null;
  }
}

/**
 * Extract and verify Telegram user from request
 */
export function getTelegramUserFromRequest(req: any): TelegramUser | null {
  // Try to get from session first (already verified)
  if (req.session?.telegramUser) {
    return req.session.telegramUser;
  }

  // Get initData from Authorization header or query
  const initData = req.headers.authorization?.replace('tma ', '') || req.query.initData;
  
  if (!initData) {
    console.error('❌ No initData found in request');
    return null;
  }

  // Verify and return user
  const user = verifyTelegramWebAppData(initData);
  
  // Store in session if valid
  if (user && req.session) {
    req.session.telegramUser = user;
  }
  
  return user;
}
