'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { checkAuth, clearAuth } from '@/utils/telegramAuth';
import './ProtectedRoute.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  telegramReady?: boolean;
}

function ProtectedRoute({ children, telegramReady }: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'telegram' | 'email' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (telegramReady === false) return;
    const checkAuthorization = () => {
      console.log('ProtectedRoute: Checking authorization...');
      const { isAuthorized: authorized, method } = checkAuth();
      console.log('ProtectedRoute: Auth result:', { authorized, method });
      
      if (authorized) {
        console.log('ProtectedRoute: User authorized, setting state...');
        setIsAuthorized(true);
        setAuthMethod(method);
        setIsLoading(false);
      } else {
        console.log('ProtectedRoute: User not authorized, redirecting to login...');
        setIsAuthorized(false);
        setIsLoading(false);
        router.push('/login');
      }
    };
    checkAuthorization();
  }, [router, telegramReady]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="protected-route-fullscreen">
        <div className="protected-route-center">
          <div className="protected-route-spinner"></div>
          <p className="protected-route-message">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="protected-route-fullscreen">
        <div className="protected-route-center">
          <div className="protected-route-card">
            <h2 className="protected-route-title">
              Доступ запрещён
            </h2>
            <p className="protected-route-message">
              {authMethod === 'telegram' 
                ? 'Ваш никнейм не разрешён для доступа к приложению.'
                : 'Необходима авторизация для доступа к этой странице.'
              }
            </p>
            <button onClick={() => router.push('/login')} className="protected-route-login-btn">
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;