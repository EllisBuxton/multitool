'use client';

import { useState, useRef, useEffect } from 'react';
import { convertFile, isFFmpegSupported } from '@/lib/ffmpeg';

interface UploadedFile {
  file: File;
  id: string;
  targetFormat: string;
  converting: boolean;
  converted: boolean;
  downloadUrl?: string;
  error?: string;
  progress?: number;
}

export default function FileConverter() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isFFmpegReady, setIsFFmpegReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if FFmpeg is supported in this environment
    setIsFFmpegReady(isFFmpegSupported());
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const getConversionOptions = (fileType: string) => {
    const type = fileType.toLowerCase();
    
    if (type.startsWith('image/')) {
      return ['jpg', 'png', 'webp', 'gif', 'bmp'];
    } else if (type.startsWith('video/')) {
      return ['mp4', 'webm', 'avi', 'mov', 'gif'];
    } else if (type.startsWith('audio/')) {
      return ['mp3', 'wav', 'flac', 'aac', 'ogg'];
    } else if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return ['txt', 'html', 'md', 'rtf'];
    }
    
    return ['txt'];
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      file,
      id: crypto.randomUUID(),
      targetFormat: getConversionOptions(file.type)[0] || 'txt',
      converting: false,
      converted: false,
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const updateTargetFormat = (fileId: string, format: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, targetFormat: format } : f)
    );
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const convertFileHandler = async (fileId: string) => {
    const uploadedFile = uploadedFiles.find(f => f.id === fileId);
    if (!uploadedFile) return;

    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, converting: true, error: undefined, progress: 0 } : f)
    );

    try {
      const convertedBlob = await convertFile(
        uploadedFile.file, 
        uploadedFile.targetFormat,
        (progress) => {
          setUploadedFiles(prev => 
            prev.map(f => f.id === fileId ? { ...f, progress } : f)
          );
        }
      );

      const downloadUrl = URL.createObjectURL(convertedBlob);
      
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { 
          ...f, 
          converting: false, 
          converted: true,
          downloadUrl,
          progress: 100
        } : f)
      );
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileId ? { 
          ...f, 
          converting: false, 
          error: error instanceof Error ? error.message : 'Conversion failed'
        } : f)
      );
    }
  };

  const convertAllFiles = async () => {
    const filesToConvert = uploadedFiles.filter(f => !f.converted && !f.converting && !f.error);
    
    for (const file of filesToConvert) {
      await convertFileHandler(file.id);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-8">
      {/* Title */}
      <div className="text-center mb-12 pt-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-wider mb-4">
          <span className="text-zinc-100">File</span>{" "}
          <span className="text-red-500">Converter</span>
        </h1>
        <p className="text-zinc-400 text-lg font-light">
          {uploadedFiles.length === 0 ? 'Drop your files to get started' : `${uploadedFiles.length} file${uploadedFiles.length !== 1 ? 's' : ''} ready for conversion`}
        </p>
        {!isFFmpegReady && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ FFmpeg not supported in this environment. Some conversions may not work.
            </p>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Drag and Drop Area */}
        <div className={`w-full transition-all duration-300 ${uploadedFiles.length > 0 ? 'mb-8' : ''}`}>
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer group ${
            isDragOver 
              ? 'border-red-400 bg-red-500/10 scale-[1.02]' 
              : 'border-zinc-700 hover:border-red-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br rounded-2xl transition-opacity duration-300 ${
            isDragOver 
              ? 'from-red-500/20 to-red-600/10 opacity-100' 
              : 'from-red-500/5 to-transparent opacity-0 group-hover:opacity-100'
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
                ? 'bg-red-600 scale-110' 
                : 'bg-zinc-800 group-hover:bg-zinc-700'
            }`}>
              <svg 
                className={`w-8 h-8 transition-all duration-300 ${
                  isDragOver 
                    ? 'text-white scale-110' 
                    : 'text-zinc-400 group-hover:text-red-400'
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
              isDragOver ? 'text-red-200' : 'text-zinc-200'
            }`}>
              {isDragOver ? 'Drop files now!' : 'Drop files here'}
            </h3>
            <p className={`mb-4 transition-colors duration-300 ${
              isDragOver ? 'text-red-300' : 'text-zinc-500'
            }`}>
              or click to browse
            </p>
            
            {/* Supported formats */}
            <div className={`text-xs transition-colors duration-300 ${
              isDragOver ? 'text-red-400' : 'text-zinc-600'
            }`}>
              Supports images, documents, videos, etc.
            </div>
          </div>
        </div>
        </div>

        {/* Supported Conversions Info */}
        {uploadedFiles.length === 0 && (
          <div className="mt-8 mb-8 bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-200 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Supported Conversions
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Video Conversions */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium text-blue-400">Video</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">From:</span>
                    <span className="text-zinc-200 ml-1">MP4, AVI, MOV, MKV, WebM, etc.</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">To:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP4', 'WebM', 'AVI', 'MOV', 'GIF'].map(format => (
                        <span key={format} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Conversions */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <h4 className="font-medium text-green-400">Audio</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">From:</span>
                    <span className="text-zinc-200 ml-1">MP3, WAV, FLAC, AAC, OGG, etc.</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">To:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['MP3', 'WAV', 'FLAC', 'AAC', 'OGG'].map(format => (
                        <span key={format} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Conversions */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h4 className="font-medium text-purple-400">Image</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">From:</span>
                    <span className="text-zinc-200 ml-1">JPG, PNG, WebP, GIF, BMP, etc.</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">To:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['JPG', 'PNG', 'WebP', 'GIF', 'BMP'].map(format => (
                        <span key={format} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Conversions */}
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="font-medium text-yellow-400">Document</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-zinc-400">From:</span>
                    <span className="text-zinc-200 ml-1">TXT, PDF, DOC, RTF, etc.</span>
                  </div>
                  <div>
                    <span className="text-zinc-400">To:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['TXT', 'HTML', 'MD', 'RTF'].map(format => (
                        <span key={format} className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">
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
                    <li>• All conversions happen locally in your browser using FFmpeg.wasm</li>
                    <li>• High-quality output with optimized settings for each format</li>
                    <li>• Supports batch processing and real-time progress tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-zinc-200">
                Uploaded Files ({uploadedFiles.length})
              </h2>
              {uploadedFiles.some(f => !f.converted && !f.converting) && (
                <button
                  onClick={convertAllFiles}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Convert All
                </button>
              )}
            </div>

            <div className="grid gap-4">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* File Icon */}
                      <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      
                      {/* File Info */}
                      <div>
                        <h3 className="font-medium text-zinc-200 truncate max-w-xs">
                          {uploadedFile.file.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          {formatFileSize(uploadedFile.file.size)} • {uploadedFile.file.type || 'Unknown type'}
                        </p>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(uploadedFile.id)}
                      className="p-2 text-zinc-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Conversion Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-zinc-400">Convert to:</span>
                      <select
                        value={uploadedFile.targetFormat}
                        onChange={(e) => updateTargetFormat(uploadedFile.id, e.target.value)}
                        disabled={uploadedFile.converting || uploadedFile.converted}
                        className="bg-zinc-700 border border-zinc-600 text-zinc-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {getConversionOptions(uploadedFile.file.type).map(format => (
                          <option key={format} value={format}>
                            {format.toUpperCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center space-x-3">
                      {uploadedFile.converting && (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          <div className="flex flex-col">
                            <span className="text-sm text-zinc-400">Converting...</span>
                            {uploadedFile.progress !== undefined && (
                              <div className="flex items-center space-x-2 mt-1">
                                <div className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-500 transition-all duration-300"
                                    style={{ width: `${uploadedFile.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500">{uploadedFile.progress}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {uploadedFile.error && (
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex flex-col">
                            <span className="text-sm text-red-500">Failed</span>
                            <span className="text-xs text-red-400 max-w-32 truncate" title={uploadedFile.error}>
                              {uploadedFile.error}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {uploadedFile.converted && (
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-green-500">Converted</span>
                          </div>
                          <a
                            href={uploadedFile.downloadUrl}
                            download={`${uploadedFile.file.name.split('.')[0]}.${uploadedFile.targetFormat}`}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-medium transition-colors duration-200"
                          >
                            Download
                          </a>
                        </div>
                      )}
                      
                      {!uploadedFile.converting && !uploadedFile.converted && !uploadedFile.error && (
                        <button
                          onClick={() => convertFileHandler(uploadedFile.id)}
                          disabled={!isFFmpegReady}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors duration-200"
                        >
                          Convert
                        </button>
                      )}

                      {uploadedFile.error && (
                        <button
                          onClick={() => convertFileHandler(uploadedFile.id)}
                          disabled={!isFFmpegReady}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors duration-200"
                        >
                          Retry
                        </button>
                      )}
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