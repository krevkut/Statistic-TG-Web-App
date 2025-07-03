'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import TelegramWebApp from '@/components/TelegramWebApp';
import { getCurrentUser, clearAuth } from '@/utils/telegramAuth';
import './dashboard.css';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [authMethod, setAuthMethod] = useState<'telegram' | 'email' | null>(null);
  const [telegramReady, setTelegramReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserEmail(currentUser.email);
      setAuthMethod(currentUser.method);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  const employeeStats = [
    {
      id: 1,
      name: "Анна Петрова",
      position: "Frontend Developer",
      avatar: "👩‍💻",
      tasksCompleted: 24,
      hoursWorked: 156,
      efficiency: 94,
      status: "online"
    },
    {
      id: 2,
      name: "Михаил Сидоров",
      position: "Backend Developer",
      avatar: "👨‍💻",
      tasksCompleted: 31,
      hoursWorked: 168,
      efficiency: 87,
      status: "online"
    },
    {
      id: 3,
      name: "Елена Козлова",
      position: "UI/UX Designer",
      avatar: "👩‍🎨",
      tasksCompleted: 18,
      hoursWorked: 142,
      efficiency: 92,
      status: "offline"
    },
    {
      id: 4,
      name: "Дмитрий Волков",
      position: "Project Manager",
      avatar: "👨‍💼",
      tasksCompleted: 42,
      hoursWorked: 180,
      efficiency: 96,
      status: "online"
    },
    {
      id: 5,
      name: "Ольга Морозова",
      position: "QA Engineer",
      avatar: "👩‍🔬",
      tasksCompleted: 28,
      hoursWorked: 155,
      efficiency: 89,
      status: "online"
    },
    {
      id: 6,
      name: "Сергей Новиков",
      position: "DevOps Engineer",
      avatar: "👨‍🔧",
      tasksCompleted: 35,
      hoursWorked: 172,
      efficiency: 91,
      status: "offline"
    }
  ];

  const totalStats = {
    totalEmployees: employeeStats.length,
    onlineEmployees: employeeStats.filter(emp => emp.status === 'online').length,
    totalTasksCompleted: employeeStats.reduce((sum, emp) => sum + emp.tasksCompleted, 0),
    averageEfficiency: Math.round(employeeStats.reduce((sum, emp) => sum + emp.efficiency, 0) / employeeStats.length)
  };

  return (
    <TelegramWebApp onReady={() => setTelegramReady(true)}>
      <ProtectedRoute telegramReady={telegramReady}>
        <div className="dashboard-container">
          <nav className="dashboard-nav">
            <div className="dashboard-nav-content">
              <div className="dashboard-nav-inner">
                <div className="dashboard-nav-title">
                  Статистика
                </div>
                <div className="dashboard-nav-user">
                  <span className="dashboard-user-email">
                    Привет, <span className="dashboard-user-email-bold">{userEmail}</span>
                    {authMethod === 'telegram' && (
                      <span className="dashboard-auth-badge">📱 Telegram</span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="dashboard-logout-button"
                  >
                    Выйти
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <section className="dashboard-section" id="statistics">
            <div className="dashboard-section-content">
              <div className="dashboard-section-header">
                <h2 className="dashboard-section-title">
                  Статистика сотрудников
                </h2>
                <p className="dashboard-section-subtitle">
                  Отслеживаем производительность и эффективность нашей команды
                </p>
              </div>

              <div className="dashboard-stats-grid">
                <div className="dashboard-stats-card">
                  <div className="dashboard-stats-card-content">
                    <div className="dashboard-stats-icon dashboard-stats-icon-blue">
                      <svg className="dashboard-stats-icon-svg dashboard-stats-icon-svg-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="dashboard-stats-info">
                      <p className="dashboard-stats-label">Всего сотрудников</p>
                      <p className="dashboard-stats-value">{totalStats.totalEmployees}</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-stats-card">
                  <div className="dashboard-stats-card-content">
                    <div className="dashboard-stats-icon dashboard-stats-icon-green">
                      <svg className="dashboard-stats-icon-svg dashboard-stats-icon-svg-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="dashboard-stats-info">
                      <p className="dashboard-stats-label">Онлайн</p>
                      <p className="dashboard-stats-value">{totalStats.onlineEmployees}</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-stats-card">
                  <div className="dashboard-stats-card-content">
                    <div className="dashboard-stats-icon dashboard-stats-icon-purple">
                      <svg className="dashboard-stats-icon-svg dashboard-stats-icon-svg-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="dashboard-stats-info">
                      <p className="dashboard-stats-label">Задач выполнено</p>
                      <p className="dashboard-stats-value">{totalStats.totalTasksCompleted}</p>
                    </div>
                  </div>
                </div>

                <div className="dashboard-stats-card">
                  <div className="dashboard-stats-card-content">
                    <div className="dashboard-stats-icon dashboard-stats-icon-yellow">
                      <svg className="dashboard-stats-icon-svg dashboard-stats-icon-svg-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="dashboard-stats-info">
                      <p className="dashboard-stats-label">Средняя эффективность</p>
                      <p className="dashboard-stats-value">{totalStats.averageEfficiency}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dashboard-employees-grid">
                {employeeStats.map((employee) => (
                  <div key={employee.id} className="dashboard-employee-card">
                    <div className="dashboard-employee-header">
                      <div className="dashboard-employee-info">
                        <div className="dashboard-employee-avatar">{employee.avatar}</div>
                        <div className="dashboard-employee-details">
                          <h3>{employee.name}</h3>
                          <p>{employee.position}</p>
                        </div>
                      </div>
                      <div className={`dashboard-status-indicator ${employee.status === 'online' ? 'dashboard-status-online' : 'dashboard-status-offline'}`}></div>
                    </div>
                    
                    <div className="dashboard-employee-stats">
                      <div className="dashboard-stat-row">
                        <span className="dashboard-stat-label">Задач выполнено:</span>
                        <span className="dashboard-stat-value">{employee.tasksCompleted}</span>
                      </div>
                      <div className="dashboard-stat-row">
                        <span className="dashboard-stat-label">Часов отработано:</span>
                        <span className="dashboard-stat-value">{employee.hoursWorked}</span>
                      </div>
                      <div className="dashboard-stat-row">
                        <span className="dashboard-stat-label">Эффективность:</span>
                        <span className="dashboard-stat-value">{employee.efficiency}%</span>
                      </div>
                    </div>
                    
                    <div className="dashboard-progress-section">
                      <div className="dashboard-progress-header">
                        <span className="dashboard-progress-label">Прогресс</span>
                        <span className="dashboard-progress-value">{employee.efficiency}%</span>
                      </div>
                      <div className="dashboard-progress-bar">
                        <div 
                          className="dashboard-progress-fill dashboard-progress-fill-dynamic"
                          style={{ width: `${employee.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </ProtectedRoute>
    </TelegramWebApp>
  );
} 