'use client';

import { useEffect, useState } from 'react';
import { isTelegramWebApp, getTelegramUser, isUserAllowed, saveTelegramUser } from '@/utils/telegramAuth';
import './TelegramWebApp.css';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          onClick: (callback: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
        };
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            is_bot?: boolean;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
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
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        platform: string;
        version: string;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: string) => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: { text?: string }, callback?: (data: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback?: (data: string) => void) => void;
        requestWriteAccess: (callback?: (access: boolean) => void) => void;
        requestContact: (callback?: (contact: boolean) => void) => void;
        invokeCustomMethod: (method: string, params?: Record<string, unknown>, callback?: (result: unknown) => void) => void;
        isVersionAtLeast: (version: string) => boolean;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onEvent: (eventType: string, eventHandler: () => void) => void;
        offEvent: (eventType: string, eventHandler: () => void) => void;
      };
    };
  }
}

interface TelegramWebAppProps {
  children: React.ReactNode;
  onReady?: () => void;
}

export default function TelegramWebApp({ children, onReady }: TelegramWebAppProps) {
  const [isTelegramApp, setIsTelegramApp] = useState(false);
  const [userData, setUserData] = useState<{
    id: number;
    is_bot?: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  } | null>(null);

  useEffect(() => {
    if (isTelegramWebApp()) {
      try {
        setIsTelegramApp(true);
        
        const webApp = window.Telegram!.WebApp;
        
        if (webApp.ready) {
          webApp.ready();
        }
        
        if (webApp.setHeaderColor) {
          webApp.setHeaderColor('#6366f1');
        }
        if (webApp.setBackgroundColor) {
          webApp.setBackgroundColor('#f9fafb');
        }
        
        const telegramUser = getTelegramUser();
        if (telegramUser && isUserAllowed(telegramUser)) {
          setUserData(telegramUser);
          saveTelegramUser(telegramUser);
        }
        
        if (webApp.MainButton) {
          webApp.MainButton.text = 'Статистика';
          webApp.MainButton.color = '#6366f1';
          webApp.MainButton.textColor = '#ffffff';
          
          if (webApp.MainButton.show) {
            webApp.MainButton.show();
          }
          
          if (webApp.MainButton.onClick) {
            webApp.MainButton.onClick(() => {
              const statisticsSection = document.getElementById('statistics');
              if (statisticsSection) {
                // Прокручиваем к секции статистики с отступом для header'а
                const headerHeight = 80; // Примерная высота header'а
                const elementPosition = statisticsSection.offsetTop - headerHeight;
                
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth'
                });
              }
            });
          }
        }
        
        if (webApp.BackButton) {
          if (webApp.BackButton.show) {
            webApp.BackButton.show();
          }
          if (webApp.BackButton.onClick) {
            webApp.BackButton.onClick(() => {
              if (webApp.close) {
                webApp.close();
              }
            });
          }
        }
        
        if (webApp.onEvent) {
          webApp.onEvent('viewportChanged', () => {
            console.log('Viewport changed:', webApp.viewportHeight);
          });
          
          webApp.onEvent('closing', () => {
            console.log('Web App is closing');
          });
        }
        
        if (onReady) onReady();
      } catch (error) {
        console.error('Error initializing Telegram Web App:', error);
        setIsTelegramApp(false);
      }
    } else {
      if (onReady) onReady(); // для обычного браузера тоже сигнализируем
    }
  }, [onReady]);

  // Если не в Тг, просто рендерим контент
  if (!isTelegramApp) {
    return <>{children}</>;
  }

  return (
    <div className="telegram-webapp">
      <div className="telegram-content">
        {children}
      </div>
    </div>
  );
} 