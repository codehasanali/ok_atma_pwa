'use client';

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';

const HomeScreen = () => {
  const [date, setDate] = useState(new Date());
  const [dailyTargetArrows, setDailyTargetArrows] = useState('');
  const [remainingArrows, setRemainingArrows] = useState(0);
  const [seriesNumber, setSeriesNumber] = useState(1);
  const [seriesArrows, setSeriesArrows] = useState('');
  const [totalShotArrows, setTotalShotArrows] = useState(0);

  useEffect(() => {
    loadDailyData();
  }, [date]);

  useEffect(() => {
    const checkDate = () => {
      const lastSavedDate = localStorage.getItem('lastSavedDate');
      const today = new Date().toISOString().split('T')[0];
      if (lastSavedDate !== today) {
        localStorage.setItem('lastSavedDate', today);
        setDailyTargetArrows('');
        setTotalShotArrows(0);
        setRemainingArrows(0);
        setSeriesNumber(1);
      }
    };
    checkDate();
  }, []);

  const loadDailyData = () => {
    const dateString = date.toISOString().split('T')[0];
    const storedData = localStorage.getItem(dateString);
    if (storedData) {
      const { dailyTarget, totalShot } = JSON.parse(storedData);
      setDailyTargetArrows(dailyTarget.toString());
      setTotalShotArrows(totalShot);
      setRemainingArrows(dailyTarget - totalShot);
    } else {
      setDailyTargetArrows('');
      setTotalShotArrows(0);
      setRemainingArrows(0);
    }
    setSeriesNumber(1);
  };

  const saveDailyTarget = () => {
    const dateString = date.toISOString().split('T')[0];
    const target = parseInt(dailyTargetArrows);
    localStorage.setItem(dateString, JSON.stringify({ dailyTarget: target, totalShot: totalShotArrows }));
    setRemainingArrows(target - totalShotArrows);
  };

  const saveShot = () => {
    const shotArrows = parseInt(seriesArrows);
    if (shotArrows > remainingArrows) {
      alert('Hata: Kalan ok sayısından fazla ok atamazsınız');
      return;
    }

    const dateString = date.toISOString().split('T')[0];
    const shot = {
      date: dateString,
      seriesNumber,
      arrowsShot: shotArrows,
    };

    const existingShots = JSON.parse(localStorage.getItem('shots') || '[]');
    existingShots.push(shot);
    localStorage.setItem('shots', JSON.stringify(existingShots));

    const newTotal = totalShotArrows + shotArrows;
    localStorage.setItem(dateString, JSON.stringify({ 
      dailyTarget: parseInt(dailyTargetArrows), 
      totalShot: newTotal 
    }));

    setTotalShotArrows(newTotal);
    setRemainingArrows(prev => prev - shotArrows);
    setSeriesNumber(prev => prev + 1);
    setSeriesArrows('');

    console.log('Atış başarıyla kaydedildi');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 flex flex-col justify-start">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Okçuluk Takip</h1>
        
        <div className="mb-6">
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="dailyTarget" className="block text-sm font-medium text-gray-700 mb-1">Günlük Hedef Ok Sayısı</label>
          <input
            id="dailyTarget"
            type="number"
            placeholder='Hedef ok sayısı'
            value={dailyTargetArrows}
            onChange={(e) => setDailyTargetArrows(e.target.value)}
            onBlur={saveDailyTarget}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
        </div>

        <div className="mb-6 bg-gray-100 p-4 rounded-lg">
          <p className="text-lg text-gray-700">Toplam Atılan Ok: <span className="font-semibold">{totalShotArrows}</span></p>
          <p className="text-lg text-gray-700">Kalan Ok Sayısı: <span className="font-semibold">{remainingArrows}</span></p>
        </div>

        <div className="mb-6">
          <label htmlFor="seriesArrows" className="block text-sm font-medium text-gray-700 mb-1">Seri Numarası: {seriesNumber}</label>
          <input
            id="seriesArrows"
            type="number"
            placeholder='Bu seride atılan ok sayısı'
            value={seriesArrows}
            onChange={(e) => setSeriesArrows(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          <button 
            onClick={saveShot} 
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Atışı Kaydet
          </button>
        </div>

        <Link href="/history" className="block w-full text-center bg-gradient-to-r from-green-400 to-green-500 text-white p-3 rounded-lg hover:from-green-500 hover:to-green-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
          Geçmişi Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default HomeScreen;