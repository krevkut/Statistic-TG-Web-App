// Утилиты для работы с тг авторизацией
interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: {
    id: number;
    type: string;
  };
  chat?: {
    id: number;
    type: string;
    title?: string;
    username?: string;
  };
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

const ALLOWED_USERNAMES = ['krevkut', 'KostyaChoo'];

// Проверяет, открыт ли сайт в тг
export function isTelegramWebApp(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any)?.Telegram?.WebApp;
}

export function getTelegramUser(): TelegramUser | null {
  if (!isTelegramWebApp()) return null;
  
  const webApp = (window as any)?.Telegram?.WebApp;
  return webApp?.initDataUnsafe?.user || null;
}

// Проверяет, разрешён ли пользователь для доступа
export function isUserAllowed(user: TelegramUser): boolean {
  if (!user?.username) return false;
  return ALLOWED_USERNAMES.includes(user.username);
}


export function saveTelegramUser(user: TelegramUser): void {
  localStorage.setItem('telegramUser', JSON.stringify(user));
  localStorage.setItem('authToken', 'telegram-auth');
  localStorage.setItem('userEmail', user.username || 'telegram_user');
  localStorage.setItem('authMethod', 'telegram');
}

// Проверяет авторизацию пользователя (тг или mail)
export function checkAuth(): { isAuthorized: boolean; method: 'telegram' | 'email' | null } {
  console.log('checkAuth: Starting authentication check...');
  
  // Сначала тг WebApp
  const telegramUser = getTelegramUser();
  console.log('checkAuth: Telegram WebApp user:', telegramUser);
  if (telegramUser && isUserAllowed(telegramUser)) {
    console.log('checkAuth: Telegram WebApp user authorized');
    saveTelegramUser(telegramUser);
    return { isAuthorized: true, method: 'telegram' };
  }

  // Проверяем localStorage для Telegram Login Widget
  const token = localStorage.getItem('authToken');
  const method = localStorage.getItem('authMethod');
  const telegramUserFromStorage = localStorage.getItem('telegramUser');
  
  console.log('checkAuth: localStorage data:', { token, method, telegramUserFromStorage });
  
  if (token && method === 'telegram' && telegramUserFromStorage) {
    try {
      const user = JSON.parse(telegramUserFromStorage);
      console.log('checkAuth: Parsed user from localStorage:', user);
      console.log('checkAuth: Checking if user is allowed:', user.username);
      if (isUserAllowed(user)) {
        console.log('checkAuth: Telegram Login Widget user authorized');
        return { isAuthorized: true, method: 'telegram' };
      } else {
        console.log('checkAuth: Telegram Login Widget user not in allowed list');
      }
    } catch (error) {
      console.error('Error parsing telegramUser from localStorage:', error);
    }
  }

  // Обычная авторизация
  if (token && method === 'email') {
    console.log('checkAuth: Email user authorized');
    return { isAuthorized: true, method: 'email' };
  }

  console.log('checkAuth: No valid authentication found');
  return { isAuthorized: false, method: null };
}

export function clearAuth(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('authMethod');
  localStorage.removeItem('telegramUser');
}

export function getCurrentUser(): { email: string; method: 'telegram' | 'email' } | null {
  const method = localStorage.getItem('authMethod') as 'telegram' | 'email';
  const email = localStorage.getItem('userEmail');
  
  if (!method || !email) return null;
  
  return { email, method };
}
  
// нужно реализовать проверку подписи на сервере
export function validateTelegramSignature(initData: string): boolean {
  // В реальном приложении здесь должна быть проверка подписи
  // Для демонстрации возвращаем true
  console.warn('⚠️ Внимание: Проверка подписи Telegram не реализована!');
  return true;
} 