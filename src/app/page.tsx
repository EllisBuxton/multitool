'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
    // Handle the dropped files here
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Selected files:', files);
    // Handle the selected files here
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center justify-center p-8">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">
          <span className="text-zinc-100">File</span>{" "}
          <span className="text-purple-400">Converter</span>
        </h1>
        <p className="text-zinc-400 text-lg font-light">
          Drop your files to get started
        </p>
      </div>

      {/* Drag and Drop Area */}
      <div className="w-full max-w-2xl">
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer group ${
            isDragOver 
              ? 'border-purple-400 bg-purple-500/10 scale-[1.02]' 
              : 'border-zinc-700 hover:border-purple-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl transition-opacity duration-300 ${
            isDragOver 
              ? 'from-purple-500/20 to-purple-600/10 opacity-100' 
              : 'from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100'
          }`}></div>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="*/*"
          />
          
          {/* Content */}
          <div className="relative z-10">
            {/* Upload Icon */}
            <div className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDragOver 
                ? 'bg-purple-600 scale-110' 
                : 'bg-zinc-800 group-hover:bg-zinc-700'
            }`}>
              <svg 
                className={`w-8 h-8 transition-all duration-300 ${
                  isDragOver 
                    ? 'text-white scale-110' 
                    : 'text-zinc-400 group-hover:text-purple-400'
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
            
            {/* Text */}
            <h3 className={`text-xl font-medium mb-2 transition-colors duration-300 ${
              isDragOver ? 'text-purple-200' : 'text-zinc-200'
            }`}>
              {isDragOver ? 'Drop files now!' : 'Drop files here'}
            </h3>
            <p className={`mb-4 transition-colors duration-300 ${
              isDragOver ? 'text-purple-300' : 'text-zinc-500'
            }`}>
              or click to browse
            </p>
            
            {/* Supported formats */}
            <div className={`text-xs transition-colors duration-300 ${
              isDragOver ? 'text-purple-400' : 'text-zinc-600'
            }`}>
              Supports images, documents, videos, and more
            </div>
          </div>
        </div>
      </div>

      {/* Subtle footer */}
      <div className="mt-16 text-center">
        <p className="text-zinc-600 text-sm font-light">
          Secure • Fast • Free
        </p>
      </div>
    </div>
  );
}
