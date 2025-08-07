import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

class FFmpegConverter {
  private ffmpeg: FFmpeg | null = null;
  private isLoaded = false;
  private isLoading = false;

  async initialize(): Promise<void> {
    if (this.isLoaded || this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      this.ffmpeg = new FFmpeg();
      
      // Load FFmpeg with CDN URLs
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load FFmpeg:', error);
      throw new Error('Failed to initialize FFmpeg');
    } finally {
      this.isLoading = false;
    }
  }

  async convertFile(
    file: File, 
    targetFormat: string, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    // Handle document conversions separately (FFmpeg doesn't support document formats)
    if (this.isDocumentConversion(file.type, targetFormat)) {
      return this.convertDocument(file, targetFormat, onProgress);
    }

    if (!this.isLoaded) {
      await this.initialize();
    }

    if (!this.ffmpeg) {
      throw new Error('FFmpeg not initialized');
    }

    const inputFileName = `input.${this.getFileExtension(file.name)}`;
    const outputFileName = `output.${targetFormat}`;

    try {
      // Set up progress tracking
      if (onProgress) {
        this.ffmpeg.on('progress', ({ progress }) => {
          onProgress(Math.round(progress * 100));
        });
      }

      // Write input file to FFmpeg filesystem
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(file));

      // Get conversion command based on file type and target format
      const command = this.getConversionCommand(file.type, targetFormat, inputFileName, outputFileName);
      
      // Execute conversion
      await this.ffmpeg.exec(command);

      // Read the converted file
      const data = await this.ffmpeg.readFile(outputFileName);
      
      // Clean up files
      await this.ffmpeg.deleteFile(inputFileName);
      await this.ffmpeg.deleteFile(outputFileName);

      // Return as blob
      return new Blob([data], { type: this.getMimeType(targetFormat) });
      
    } catch (error) {
      console.error('Conversion failed:', error);
      throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isDocumentConversion(inputType: string, targetFormat: string): boolean {
    const documentFormats = ['txt', 'html', 'md', 'rtf'];
    return inputType.includes('text') || inputType.includes('pdf') || inputType.includes('document') || 
           documentFormats.includes(targetFormat.toLowerCase());
  }

  private async convertDocument(
    file: File, 
    targetFormat: string, 
    onProgress?: (progress: number) => void
  ): Promise<Blob> {
    try {
      if (onProgress) onProgress(10);

      // Read file content as text
      let content = '';
      
      if (file.type.includes('text') || file.name.endsWith('.txt')) {
        content = await file.text();
      } else {
        // For other document types, try to extract text (basic implementation)
        content = await file.text();
      }

      if (onProgress) onProgress(50);

      // Convert based on target format
      let convertedContent = '';
      const format = targetFormat.toLowerCase();

      switch (format) {
        case 'html':
          convertedContent = this.textToHtml(content);
          break;
        case 'md':
          convertedContent = this.textToMarkdown(content);
          break;
        case 'rtf':
          convertedContent = this.textToRtf(content);
          break;
        case 'txt':
        default:
          convertedContent = content;
          break;
      }

      if (onProgress) onProgress(100);

      return new Blob([convertedContent], { type: this.getMimeType(targetFormat) });
      
    } catch (error) {
      throw new Error(`Document conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private textToHtml(text: string): string {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    
    const paragraphs = escaped.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Converted Document</title>
</head>
<body>
${paragraphs}
</body>
</html>`;
  }

  private textToMarkdown(text: string): string {
    // Basic text to markdown conversion
    const lines = text.split('\n');
    const converted = lines.map(line => {
      if (line.trim() === '') return '';
      
      // Convert lines that look like headers
      if (line.match(/^[A-Z][^.]*$/)) {
        return `# ${line}`;
      }
      
      return line;
    });
    
    return converted.join('\n');
  }

  private textToRtf(text: string): string {
    const escaped = text.replace(/\\/g, '\\\\').replace(/\{/g, '\\{').replace(/\}/g, '\\}');
    const paragraphs = escaped.split('\n\n').map(p => `\\par ${p.replace(/\n/g, '\\line ')}`).join(' ');
    
    return `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${paragraphs}}`;
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  private getConversionCommand(inputType: string, targetFormat: string, inputFile: string, outputFile: string): string[] {
    const format = targetFormat.toLowerCase();
    
    // Basic conversion commands
    const baseCommand = ['-i', inputFile];
    
    // Add format-specific parameters
    switch (format) {
      case 'mp4':
        return [...baseCommand, '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', outputFile];
      
      case 'webm':
        return [...baseCommand, '-c:v', 'libvpx-vp9', '-c:a', 'libopus', outputFile];
      
      case 'mp3':
        return [...baseCommand, '-c:a', 'libmp3lame', '-b:a', '192k', outputFile];
      
      case 'wav':
        return [...baseCommand, '-c:a', 'pcm_s16le', outputFile];
      
      case 'jpg':
      case 'jpeg':
        return [...baseCommand, '-q:v', '2', outputFile];
      
      case 'png':
        return [...baseCommand, '-compression_level', '6', outputFile];
      
      case 'webp':
        return [...baseCommand, '-quality', '80', outputFile];
      
      case 'gif':
        if (inputType.startsWith('video/')) {
          return [...baseCommand, '-vf', 'fps=10,scale=320:-1:flags=lanczos', '-t', '10', outputFile];
        }
        return [...baseCommand, outputFile];
      
      case 'flac':
        return [...baseCommand, '-c:a', 'flac', outputFile];
      
      case 'aac':
        return [...baseCommand, '-c:a', 'aac', '-b:a', '128k', outputFile];
      
      case 'ogg':
        return [...baseCommand, '-c:a', 'libvorbis', '-q:a', '5', outputFile];
      
      default:
        return [...baseCommand, outputFile];
    }
  }

  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      mp4: 'video/mp4',
      webm: 'video/webm',
      avi: 'video/x-msvideo',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      flac: 'audio/flac',
      aac: 'audio/aac',
      ogg: 'audio/ogg',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      bmp: 'image/bmp',
      tiff: 'image/tiff',
      pdf: 'application/pdf',
      txt: 'text/plain',
      html: 'text/html',
      md: 'text/markdown',
    };
    
    return mimeTypes[format.toLowerCase()] || 'application/octet-stream';
  }

  isInitialized(): boolean {
    return this.isLoaded;
  }

  async cleanup(): Promise<void> {
    if (this.ffmpeg) {
      this.ffmpeg.terminate();
      this.ffmpeg = null;
      this.isLoaded = false;
    }
  }
}

// Singleton instance
export const ffmpegConverter = new FFmpegConverter();

// Export utility function
export async function convertFile(
  file: File, 
  targetFormat: string, 
  onProgress?: (progress: number) => void
): Promise<Blob> {
  return ffmpegConverter.convertFile(file, targetFormat, onProgress);
}

export function isFFmpegSupported(): boolean {
  return typeof SharedArrayBuffer !== 'undefined';
}