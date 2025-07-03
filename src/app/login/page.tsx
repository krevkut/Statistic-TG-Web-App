'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './login.css';

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramUser) => void;
  }
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const telegramWidgetRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email === 'admin@example.com' && password === 'password') {
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('authMethod', 'email');
        router.push('/dashboard');
      } else {
        setError('Неверный email или пароль');
      }
      setIsLoading(false);
    }, 1000);
  };

    useEffect(() => {
    const isInTelegramWebApp = typeof window !== 'undefined'
      && !!window.Telegram
      && !!window.Telegram.WebApp
      && !!window.Telegram.WebApp.initDataUnsafe
      && !!window.Telegram.WebApp.initDataUnsafe.user;
    console.log('Is in Telegram WebApp:', isInTelegramWebApp);

    if (isInTelegramWebApp) {
      console.log('Running in Telegram WebApp - auto-authorizing user');
      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
      console.log('Telegram user data:', telegramUser);
      
      if (telegramUser) {
        // Сохраняем данные пользователя
        localStorage.setItem('authToken', 'telegram-auth');
        localStorage.setItem('userEmail', telegramUser.username || 'telegram_user');
        localStorage.setItem('authMethod', 'telegram');
        localStorage.setItem('telegramUser', JSON.stringify(telegramUser));
        
        console.log('Telegram WebApp user authorized, redirecting to dashboard...');
        router.push('/dashboard');
      }
      return;
    }

    // Создаем Telegram Login Widget только если не в WebApp
    window.onTelegramAuth = function(user: TelegramUser) {
      console.log('=== onTelegramAuth CALLED ===');
      console.log('user object:', user);
      console.log('Username:', user.username);
      console.log('User ID:', user.id);

      localStorage.setItem('authToken', 'telegram-auth');
      localStorage.setItem('userEmail', user.username || 'telegram_user');
      localStorage.setItem('authMethod', 'telegram');
      localStorage.setItem('telegramUser', JSON.stringify(user));
      
      console.log('localStorage set, redirecting to dashboard...');
      window.location.href = '/dashboard';
    };

    if (telegramWidgetRef.current) {
      console.log('Creating Telegram widget...');
      console.log('telegramWidgetRef.current:', telegramWidgetRef.current);
      console.log('window.onTelegramAuth:', window.onTelegramAuth);

      telegramWidgetRef.current.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?7';
      script.setAttribute('data-telegram-login', 'Statsit_bot');
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-radius', '10');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.async = true;
      
      script.onload = () => {
        console.log('Telegram widget script loaded successfully');
      };
      
      script.onerror = (error) => {
        console.error('Error loading Telegram widget script:', error);
      };
      
      telegramWidgetRef.current.appendChild(script);
      console.log('Script appended to DOM');
    }

    return () => {
      delete window.onTelegramAuth;
    };
  }, [router]);

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-header">
            <h1 className="login-title">
              Добро пожаловать
            </h1>
            <p className="login-subtitle">Войдите в свою учетную запись</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="login-options">
              <div className="login-checkbox-wrapper">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="login-checkbox"
                />
                <label htmlFor="remember-me" className="login-checkbox-label">
                  Запомнить меня
                </label>
              </div>
              <a href="#" className="login-forgot-password">
                Забыли пароль?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="login-submit-button"
            >
              {isLoading ? (
                <div className="login-button-content">
                  <div className="login-button-spinner"></div>
                  Вход...
                </div>
              ) : (
                'Войти'
              )}
            </button>
          </form>
          
          <div className="login-telegram-widget" ref={telegramWidgetRef}></div>

          <div className="login-demo-credentials">
            <p className="login-demo-title">Демо данные для входа:</p>
            <p className="login-demo-text">
              Email: <span className="login-demo-code">admin@example.com</span><br />
              Пароль: <span className="login-demo-code">password</span>
            </p>
          </div>

          <div className="login-telegram-info">
            <p className="login-telegram-text">
              {typeof window !== 'undefined'
                && !!window.Telegram
                && !!window.Telegram.WebApp
                && !!window.Telegram.WebApp.initDataUnsafe
                && !!window.Telegram.WebApp.initDataUnsafe.user ? (
                  '✅ Вы уже в Telegram Web App! Авторизация происходит автоматически.'
                ) : (
                  <>
                    💡 <strong>Совет:</strong> Для более удобного входа используйте Telegram Web App
                  </>
                )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 