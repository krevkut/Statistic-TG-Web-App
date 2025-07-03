'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-spinner"></div>
        <p className="home-text">Перенаправление...</p>
      </div>
    </div>
  );
}
