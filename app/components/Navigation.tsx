'use client';

import Link from 'next/link';

export function Navigation() {
  return (
    <div className="absolute top-6 right-6 flex gap-4 z-10" style={{ fontFamily: 'Times New Roman, serif' }}>
      <Link 
        href="/" 
        className="text-sm hover:underline"
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        Home
      </Link>
      <Link 
        href="/writing" 
        className="text-sm hover:underline"
        style={{ fontFamily: 'Times New Roman, serif' }}
      >
        Writing
      </Link>
      
      {/* Hobbies Dropdown */}
      <div className="relative group">
        <span 
          className="text-sm hover:underline cursor-pointer"
          style={{ fontFamily: 'Times New Roman, serif' }}
        >
          Hobbies
        </span>
        
        {/* Dropdown Menu */}
        <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white border border-black shadow-sm min-w-[140px]">
          <Link 
            href="/hobbies/wine" 
            className="text-sm px-4 py-2 hover:bg-black hover:text-white transition-colors block w-full"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Wine
          </Link>
          <Link 
            href="/hobbies/classical-music" 
            className="text-sm px-4 py-2 hover:bg-black hover:text-white transition-colors block w-full"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Classical Music
          </Link>
          <Link 
            href="/hobbies/reading-list" 
            className="text-sm px-4 py-2 hover:bg-black hover:text-white transition-colors block w-full"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Reading List
          </Link>
          <Link 
            href="/hobbies/travel" 
            className="text-sm px-4 py-2 hover:bg-black hover:text-white transition-colors block w-full"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            Travel
          </Link>
        </div>
      </div>
    </div>
  );
}

