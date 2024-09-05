'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Shot {
  date: string;
  seriesNumber: number;
  arrowsShot: number;
}

interface GroupedShot {
  date: string;
  shots: Shot[];
  totalShot: number;
  dailyTarget: number;
  remaining: number;
}

const HistoryScreen = () => {
  const [groupedShots, setGroupedShots] = useState<GroupedShot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShots();
  }, []);

  const loadShots = async () => {
    setIsLoading(true);
    try {
      const storedShots = localStorage.getItem('shots');
      if (storedShots !== null) {
        const parsedShots = JSON.parse(storedShots);
        const grouped = groupShotsByDate(parsedShots);
        setGroupedShots(grouped);
      }
    } catch (error) {
      console.log('Atışlar yüklenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupShotsByDate = (shots: Shot[]): GroupedShot[] => {
    const grouped = shots.reduce((acc: { [key: string]: GroupedShot }, shot: Shot) => {
      if (!acc[shot.date]) {
        acc[shot.date] = {
          date: shot.date,
          shots: [],
          totalShot: 0,
          dailyTarget: 300,
          remaining: 300
        };
      }
      acc[shot.date].shots.push(shot);
      acc[shot.date].totalShot += shot.arrowsShot;
      acc[shot.date].remaining = Math.max(0, acc[shot.date].dailyTarget - acc[shot.date].totalShot);
      return acc;
    }, {});
  
    return Object.values(grouped).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const renderDateItem = (item: GroupedShot) => (
    <div key={item.date} className="mb-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-indigo-600 text-white p-4">
        <h2 className="text-xl font-bold">{new Date(item.date).toLocaleDateString('tr-TR')}</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <p className="text-sm text-blue-500">Günlük Hedef</p>
            <p className="text-lg font-semibold text-blue-600">{item.dailyTarget}</p>
          </div>
          <div>
            <p className="text-sm text-green-500">Toplam Atılan</p>
            <p className="text-lg font-semibold text-green-600">{item.totalShot}</p>
          </div>
          <div>
            <p className="text-sm text-red-500">Kalan</p>
            <p className="text-lg font-semibold text-red-600">{item.remaining}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-indigo-600">Atış Detayları</h3>
          <ul className="space-y-2">
            {item.shots.map((shot, index) => (
              <li key={index} className="bg-gray-50 p-2 rounded flex justify-between items-center">
                <span className="text-indigo-500">Seri: {shot.seriesNumber}</span>
                <span className="font-medium text-green-600">Atılan Ok: {shot.arrowsShot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-800">Atış Geçmişi</h1>
          <Link href="/" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-300">
            Ana Sayfa
          </Link>
        </div>
        {isLoading ? (
          <p className="text-center text-indigo-600">Yükleniyor...</p>
        ) : groupedShots.length > 0 ? (
          groupedShots.map(renderDateItem)
        ) : (
          <p className="text-center text-indigo-600">Henüz atış kaydı bulunmamaktadır.</p>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;