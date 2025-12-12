'use client';

import { Navigation } from './Navigation';

export function WritingPage() {
  return (
    <div 
      className="w-full min-h-screen bg-white text-black relative overflow-hidden" 
      style={{ fontFamily: 'Times New Roman, serif' }}
    >
      {/* Navigation */}
      <Navigation />

      <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-20">
        <div className="max-w-2xl w-full text-left leading-relaxed space-y-4 text-sm">
          <h1 className="text-4xl font-normal mb-8">writing</h1>
          
          <p className="text-gray-600">
            essays and reflections will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

