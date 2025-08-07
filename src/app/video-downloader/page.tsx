'use client';

import { useState } from 'react';

interface DownloadRequest {
  url: string;
  id: string;
  platform?: string;
  format: 'video' | 'audio';
  quality: string;
  downloading: boolean;
  completed: boolean;
  downloadUrl?: string;
  error?: string;
  progress?: number;
}

export default function VideoDownloader() {
  const [url, setUrl] = useState('');
  const [downloadFormat, setDownloadFormat] = useState<'video' | 'audio'>('video');
  const [quality, setQuality] = useState('1080p');
  const [downloads, setDownloads] = useState<DownloadRequest[]>([]);

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'YouTube';
    } else if (url.includes('tiktok.com')) {
      return 'TikTok';
    } else if (url.includes('instagram.com')) {
      return 'Instagram';
    } else if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'Twitter/X';
    } else if (url.includes('facebook.com')) {
      return 'Facebook';
    } else if (url.includes('vimeo.com')) {
      return 'Vimeo';
    }
    return 'Unknown';
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const newDownload: DownloadRequest = {
      url: url.trim(),
      id: Date.now().toString(),
      platform: detectPlatform(url.trim()),
      format: downloadFormat,
      quality: downloadFormat === 'video' ? quality : '320kbps',
      downloading: false,
      completed: false,
    };

    setDownloads(prev => [newDownload, ...prev]);
    setUrl('');
  };

  const handleDownload = (id: string) => {
    // This would handle the actual download process
    setDownloads(prev => prev.map(download => 
      download.id === id 
        ? { ...download, downloading: true, progress: 0 }
        : download
    ));

    // Simulate download progress (replace with actual implementation)
    setTimeout(() => {
      setDownloads(prev => prev.map(download => 
        download.id === id 
          ? { ...download, downloading: false, completed: true, downloadUrl: '#' }
          : download
      ));
    }, 2000);
  };

  const handleRemove = (id: string) => {
    setDownloads(prev => prev.filter(download => download.id !== id));
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'YouTube':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a2.99 2.99 0 0 0-2.108-2.119C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.39.522A2.99 2.99 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.99 2.99 0 0 0 2.108 2.119C4.495 20.455 12 20.455 12 20.455s7.505 0 9.39-.522a2.99 2.99 0 0 0 2.108-2.119C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'TikTok':
        return (
          <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      {/* Title */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">
          <span className="text-zinc-100">Video/Audio</span>{" "}
          <span className="text-red-500">Downloader</span>
        </h1>
        <p className="text-zinc-400 text-lg font-light">
          Download videos and audio from YouTube, TikTok, and other platforms
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* URL Input Form */}
        <div className="bg-zinc-800/50 rounded-2xl p-8 mb-8 border border-zinc-700/30">
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-zinc-300 mb-2">
                Video/Audio URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste YouTube, TikTok, Instagram, or other video URL here..."
                  className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Format and Quality Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">
                  Download Format
                </label>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setDownloadFormat('video')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      downloadFormat === 'video'
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-zinc-600 bg-zinc-900/30 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Video</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDownloadFormat('audio')}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      downloadFormat === 'audio'
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-zinc-600 bg-zinc-900/30 text-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                      <span className="font-medium">Audio Only</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quality Selection */}
              <div>
                <label htmlFor="quality" className="block text-sm font-medium text-zinc-300 mb-3">
                  {downloadFormat === 'video' ? 'Video Quality' : 'Audio Quality'}
                </label>
                <select
                  id="quality"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full py-3 px-4 bg-zinc-900/50 border border-zinc-600 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                >
                  {downloadFormat === 'video' ? (
                    <>
                      <option value="1080p">1080p (Full HD)</option>
                      <option value="720p">720p (HD)</option>
                      <option value="480p">480p (SD)</option>
                      <option value="360p">360p</option>
                    </>
                  ) : (
                    <>
                      <option value="320kbps">320 kbps (High)</option>
                      <option value="256kbps">256 kbps (Good)</option>
                      <option value="128kbps">128 kbps (Standard)</option>
                      <option value="96kbps">96 kbps (Low)</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!url.trim()}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
            >
              Add to Download Queue
            </button>
          </form>
        </div>

        {/* Platform Support Info */}
        {downloads.length === 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-6 text-center">
              Supported Platforms
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* YouTube */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a2.99 2.99 0 0 0-2.108-2.119C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.39.522A2.99 2.99 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.99 2.99 0 0 0 2.108 2.119C4.495 20.455 12 20.455 12 20.455s7.505 0 9.39-.522a2.99 2.99 0 0 0 2.108-2.119C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <h4 className="font-medium text-red-400">YouTube</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Videos, Playlists, Live Streams</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'MP3', 'WebM'].map(format => (
                        <span key={format} className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* TikTok */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <h4 className="font-medium text-pink-400">TikTok</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Videos, Audio</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'MP3'].map(format => (
                        <span key={format} className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instagram */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <h4 className="font-medium text-purple-400">Instagram</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Reels, Videos, Stories</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'MP3'].map(format => (
                        <span key={format} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter/X */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                  <h4 className="font-medium text-blue-400">Twitter/X</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Videos, GIFs</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'GIF'].map(format => (
                        <span key={format} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Facebook */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <h4 className="font-medium text-blue-400">Facebook</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Videos, Live Streams</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'MP3'].map(format => (
                        <span key={format} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vimeo */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-6 h-6 mr-3 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 4.935-4.26C6.762 1.718 8.1.533 9.081.533c1.518-.043 2.447.892 2.785 2.812.382 2.18.646 3.537.795 4.07.445 2.021.937 3.033 1.468 3.033.42 0 1.005-.672 1.731-2.011.731-1.339.112-2.173-.851-2.173-.303 0-.615.07-.937.21 1.632-5.351 4.748-7.954 9.346-7.805 3.402.104 5.009 2.314 4.823 6.622z"/>
                  </svg>
                  <h4 className="font-medium text-cyan-400">Vimeo</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">Supports:</span>
                    <span className="text-zinc-200 ml-1">Videos, Private Videos</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">Formats:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'MP3'].map(format => (
                        <span key={format} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-700/30">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                  <p className="text-zinc-300 font-medium mb-1">How it works:</p>
                  <ul className="text-zinc-400 space-y-1">
                    <li>• Paste any supported video or audio URL from the platforms above</li>
                    <li>• Choose your preferred format (video or audio only) and quality</li>
                    <li>• Downloads are processed securely and delivered directly to your device</li>
                    <li>• Support for playlists, live streams, and private content (where permitted)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Download Queue */}
        {downloads.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-zinc-200">
                Download Queue ({downloads.length})
              </h2>
              {downloads.some(d => !d.completed && !d.downloading) && (
                <button
                  onClick={() => downloads.forEach(d => !d.completed && !d.downloading && handleDownload(d.id))}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Download All
                </button>
              )}
            </div>

            <div className="space-y-3">
              {downloads.map((download) => (
                <div key={download.id} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        {getPlatformIcon(download.platform || 'Unknown')}
                        <span className="text-sm font-medium text-zinc-400">
                          {download.platform}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          download.format === 'video' 
                            ? 'bg-blue-500/20 text-blue-300' 
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {download.format === 'video' ? 'Video' : 'Audio'} • {download.quality}
                        </span>
                      </div>
                      <p className="text-zinc-200 font-medium mb-1 truncate">{download.url}</p>
                      
                      {download.downloading && (
                        <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${download.progress || 0}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {download.error && (
                        <p className="text-red-400 text-sm">{download.error}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {download.completed ? (
                        <a
                          href={download.downloadUrl}
                          download
                          className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Download
                        </a>
                      ) : download.downloading ? (
                        <div className="px-3 py-1.5 bg-zinc-600 text-zinc-300 rounded text-sm font-medium">
                          Downloading...
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDownload(download.id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                        >
                          Download
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleRemove(download.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors"
                        title="Remove"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}