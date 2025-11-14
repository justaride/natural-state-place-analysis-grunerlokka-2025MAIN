'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';

interface Screenshot {
  id: string;
  filnavn: string;
  path: string;
  beskrivelse: string;
  kategori: string;
}

interface TabbedImageViewerProps {
  screenshots: Screenshot[];
  title?: string;
}

export default function TabbedImageViewer({
  screenshots,
  title = "Plaace Analytics"
}: TabbedImageViewerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (e.changedTouches[0]) {
      touchEndX.current = e.changedTouches[0].clientX;
      handleSwipe();
    }
  };

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setActiveTab(Math.min(screenshots.length - 1, activeTab + 1));
      } else {
        setActiveTab(Math.max(0, activeTab - 1));
      }
    }
  };

  return (
    <div className="mb-12 md:mb-20">
      {/* Section Header */}
      <div className="mb-6 md:mb-8">
        <h2 className="mb-2 text-2xl font-bold text-natural-forest md:mb-4 md:text-3xl">
          {title}
        </h2>
        <p className="text-xs text-gray-600 md:text-sm">
          Detaljert stedsanalyse med demografi, besøksmønstre og markedsdata
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-4 overflow-x-auto md:mb-6">
        <div className="flex gap-2 border-b border-gray-200/50 pb-2">
          {screenshots.map((screenshot, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-medium transition-all md:px-6 md:py-3 md:text-sm ${
                activeTab === index
                  ? 'bg-natural-forest text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {screenshot.filnavn}
            </button>
          ))}
        </div>
      </div>

      {/* Image Display */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {screenshots.map((screenshot, index) => (
          <div
            key={index}
            className={`transition-opacity duration-300 ${
              activeTab === index ? 'opacity-100' : 'absolute inset-0 opacity-0 pointer-events-none'
            }`}
          >
            <div className="group relative w-full overflow-hidden rounded-2xl shadow-lg transition-all duration-500 ease-out hover:shadow-xl">
              <Image
                src={screenshot.path}
                alt={screenshot.filnavn}
                width={2480}
                height={3508}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                quality={85}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            </div>
            {screenshot.beskrivelse && (
              <p className="mt-4 text-sm text-gray-600 text-center">
                {screenshot.beskrivelse}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="mt-4 flex items-center justify-between md:mt-6">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-natural-forest transition-all hover:bg-natural-sage/20 disabled:cursor-not-allowed disabled:opacity-30 md:gap-2 md:px-4 md:text-sm"
        >
          <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden md:inline">Forrige</span>
        </button>

        <div className="text-xs text-gray-600 md:text-sm">
          {activeTab + 1} av {screenshots.length}
        </div>

        <button
          onClick={() => setActiveTab(Math.min(screenshots.length - 1, activeTab + 1))}
          disabled={activeTab === screenshots.length - 1}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-natural-forest transition-all hover:bg-natural-sage/20 disabled:cursor-not-allowed disabled:opacity-30 md:gap-2 md:px-4 md:text-sm"
        >
          <span className="hidden md:inline">Neste</span>
          <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
