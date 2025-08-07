'use client';

import { useState, useRef } from 'react';

interface UploadedFile {
  file: File;
  id: string;
  targetFormat: string;
  converting: boolean;
  converted: boolean;
  downloadUrl?: string;
}

export default function FileConverter() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      return ['jpg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'svg'];
    } else if (type.startsWith('video/')) {
      return ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    } else if (type.startsWith('audio/')) {
      return ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma'];
    } else if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
      return ['pdf', 'docx', 'txt', 'rtf', 'html', 'md'];
    }
    
    return ['txt', 'pdf', 'html'];
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

  const convertFile = async (fileId: string) => {
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { ...f, converting: true } : f)
    );
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setUploadedFiles(prev => 
      prev.map(f => f.id === fileId ? { 
        ...f, 
        converting: false, 
        converted: true,
        downloadUrl: URL.createObjectURL(f.file) // Placeholder
      } : f)
    );
  };

  const convertAllFiles = async () => {
    const filesToConvert = uploadedFiles.filter(f => !f.converted && !f.converting);
    
    for (const file of filesToConvert) {
      await convertFile(file.id);
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
                          <span className="text-sm text-zinc-400">Converting...</span>
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
                      
                      {!uploadedFile.converting && !uploadedFile.converted && (
                        <button
                          onClick={() => convertFile(uploadedFile.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors duration-200"
                        >
                          Convert
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