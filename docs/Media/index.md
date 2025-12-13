# 📤 ChunkedFileUploader v2.4.0

> A robust, framework-agnostic TypeScript library for uploading large files in chunks with resume capability, automatic retry, and comprehensive event handling.

**Author:** AGBOKOUDJO Franck  
**License:** MIT  
**npm:** `@wlindabla/form_validator`

---

## 🚀 Key Features

- ✅ **Chunked Upload** - Automatically split large files into optimized chunks
- ✅ **Integrity Verification** - SHA-256 hash to guarantee data safety
- ✅ **Automatic Retry** - Configurable exponential backoff
- ✅ **Pause/Resume** - Intelligent interruption and resumption
- ✅ **Real-time Tracking** - Speed, ETA, progress percentage
- ✅ **Rich Events** - 15+ custom events for complete control
- ✅ **Framework-Agnostic** - Works with React, Angular, Vue, Vanilla JS
- ✅ **Robust Error Handling** - Custom exceptions for each scenario
- ✅ **Flexible Caching** - localStorage, IndexedDB, sessionStorage support

---

## 📦 Installation

### NPM
```bash
npm install @wlindabla/form_validator
```

### Yarn
```bash
yarn add @wlindabla/form_validator
```

### PNPM
```bash
pnpm add @wlindabla/form_validator
```

---

## 🎯 Quick Start

```typescript
import { 
  import { 
  ChunkedFileUploader
,DefaultUploadResumeCacheAdapter,
UniversalEventEmitter as EventEmitter
 } from '@wlindabla/form_validator';

} from '@wlindabla/form_validator';

// Initialize dependencies
const cache = new DefaultUploadResumeCacheAdapter();
const eventEmitter = new EventEmitter();

// Create uploader instance
const uploader = new ChunkedFileUploader(
  {
    file: inputFile,
    endpoint: 'https://api.example.com/upload',
    endpointInit: 'https://api.example.com/init',
    endpointFinalize: 'https://api.example.com/finalize',
    onProgress: (progress) => console.log(`${progress.percentage}%`),
    onComplete: (result) => console.log('Success!', result)
  },
  cache,
  eventEmitter
);

// Start upload
await uploader.upload();
```

---

## ⚙️ Configuration Reference

### UploadOptions Interface

```typescript
interface UploadOptions {
  // Required
  file: File;                          // The file to upload
  endpoint: string | URL;              // Endpoint for chunk uploads
  endpointInit: string | URL;          // Initialization endpoint
  endpointFinalize: string | URL;      // Finalization endpoint
  
  // Optional
  chunkSize?: number;                  // Chunk size in bytes (default: auto)
  speedMbps?: number;                  // Connection speed for optimization
  config?: ChunkSizeConfig;            // Advanced chunk configuration
  headers?: HeadersInit;               // Custom HTTP headers
  metadata?: Record<string, any>;      // Additional metadata
  maxRetries?: number;                 // Retry attempts (default: 3)
  timeout?: number;                    // Request timeout in ms (default: 60000)
  autoSave?: boolean;                  // Auto-save progress
  
  // Callbacks
  onProgress?: (progress: UploadProgress) => void;
  onChunkSuccess?: (chunk: ChunkInfo) => void;
  onChunkError?: (error: ChunkError) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}
```

### Advanced Configuration (ChunkSizeConfig)

```typescript
const config = {
  defaultChunkSizeMB: 50,              // Default chunk size in MB
  slowSpeedThresholdMbps: 5,           // Threshold for slow connection
  slowSpeedChunkSizeMB: 2,             // Chunk size for slow connection
  fileSizeThresholds: [
    { maxSizeMB: 200, chunkSizeMB: 50 },
    { maxSizeMB: 1000, chunkSizeMB: 500 },
    { maxSizeMB: Infinity, chunkSizeMB: 700 }
  ]
};
```

---

## 🍦 Vanilla JavaScript

### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .progress-bar {
      width: 100%;
      height: 20px;
      background: #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: #4CAF50;
      transition: width 0.3s ease;
    }
    .controls {
      margin-top: 20px;
    }
    button {
      padding: 10px 15px;
      margin-right: 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>File Upload Manager</h1>
  
  <input type="file" id="fileInput" />
  
  <div class="controls">
    <button id="uploadBtn">Start Upload</button>
    <button id="pauseBtn" disabled>Pause</button>
    <button id="resumeBtn" disabled>Resume</button>
    <button id="cancelBtn" disabled>Cancel</button>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" id="progressFill" style="width: 0%"></div>
  </div>
  <p id="progressText">0%</p>

  <script type="module">
    import { 
      ChunkedFileUploader,
      DefaultUploadResumeCacheAdapter,
      EventEmitter 
    } from '@wlindabla/form_validator';

    let uploader = null;
    const cache = new DefaultUploadResumeCacheAdapter();
    const eventEmitter = new EventEmitter();

    document.getElementById('uploadBtn').addEventListener('click', async () => {
      const file = document.getElementById('fileInput').files[0];
      
      if (!file) {
        alert('Please select a file');
        return;
      }

      uploader = new ChunkedFileUploader(
        {
          file,
          endpoint: 'https://api.example.com/upload',
          endpointInit: 'https://api.example.com/init',
          endpointFinalize: 'https://api.example.com/finalize',
          maxRetries: 3,
          autoSave: true,
          headers: {
            'Authorization': 'Bearer YOUR_TOKEN'
          },
          onProgress: (progress) => {
            document.getElementById('progressFill').style.width = 
              progress.percentage + '%';
            
            const speed = (progress.speed / 1000000).toFixed(2);
            const eta = progress.estimatedTimeRemaining 
              ? formatTime(progress.estimatedTimeRemaining)
              : 'Calculating...';
            
            document.getElementById('progressText').textContent = 
              `${progress.percentage}% | ${speed} MB/s | ETA: ${eta}`;
          },
          onComplete: (result) => {
            console.log('Upload successful!', result);
            alert('File uploaded successfully!');
            document.getElementById('uploadBtn').disabled = false;
          },
          onError: (error) => {
            console.error('Error:', error);
            alert('Upload error occurred');
          }
        },
        cache,
        eventEmitter
      );

      try {
        await uploader.upload();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
      uploader?.pause();
      document.getElementById('pauseBtn').disabled = true;
      document.getElementById('resumeBtn').disabled = false;
    });

    document.getElementById('resumeBtn').addEventListener('click', () => {
      uploader?.resume();
      document.getElementById('resumeBtn').disabled = true;
      document.getElementById('pauseBtn').disabled = false;
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      uploader?.cancel();
      document.getElementById('uploadBtn').disabled = false;
    });

    function formatTime(seconds) {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${hrs}h ${mins}m ${secs}s`;
    }
  </script>
</body>
</html>
```

---

## ⚛️ React

### Custom Hook

```typescript
import { useState, useRef, useCallback } from 'react';
import { 
  ChunkedFileUploader
,DefaultUploadResumeCacheAdapter,
UniversalEventEmitter
 } from '@wlindabla/form_validator';

export const useChunkedUploader = () => {
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const uploaderRef = useRef(null);

  const startUpload = useCallback(async (file, options) => {
    setState('uploading');
    setError(null);

    try {
      const uploader = new ChunkedFileUploader(
        {
          file,
          ...options,
          onProgress: (p) => setProgress(p.percentage),
          onError: (err) => {
            setError(err.message);
            setState('error');
          }
        },
        cache,
        eventEmitter
      );
      
      uploaderRef.current = uploader;
      await uploader.upload();
      setState('completed');
    } catch (err) {
      setError(err.message);
      setState('error');
    }
  }, []);

  return {
    progress,
    state,
    error,
    startUpload,
    pause: () => uploaderRef.current?.pause(),
    resume: () => uploaderRef.current?.resume(),
    cancel: () => uploaderRef.current?.cancel()
  };
};
```

### React Component

```jsx
import { useChunkedUploader } from './useChunkedUploader';

function FileUploadComponent() {
  const { progress, state, error, startUpload, pause, resume, cancel } = 
    useChunkedUploader();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    
    await startUpload(file, {
      endpoint: 'https://api.example.com/upload',
      endpointInit: 'https://api.example.com/init',
      endpointFinalize: 'https://api.example.com/finalize',
      maxRetries: 3
    });
  };

  return (
    <div className="upload-container">
      <input 
        type="file" 
        onChange={handleFileSelect}
        disabled={state === 'uploading'}
      />
      
      {state === 'uploading' && (
        <>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p>Progress: {progress}%</p>
          
          <button onClick={pause}>Pause</button>
          <button onClick={resume}>Resume</button>
          <button onClick={cancel}>Cancel</button>
        </>
      )}
      
      {error && <p className="error">{error}</p>}
      {state === 'completed' && <p className="success">✓ Upload successful!</p>}
    </div>
  );
}

export default FileUploadComponent;
```

---

## 🅰️ Angular

### Upload Service

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChunkedFileUploader,DefaultUploadResumeCacheAdapter } from '@wlindabla/form_validator';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private progressSubject = new BehaviorSubject<number>(0);
  public progress$ = this.progressSubject.asObservable();

  private stateSubject = new BehaviorSubject<string>('idle');
  public state$ = this.stateSubject.asObservable();

  private uploader: ChunkedFileUploader;

  constructor(private cache: DefaultUploadResumeCacheAdapter) {}

  upload(file: File, options: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uploader = new ChunkedFileUploader(
        {
          file,
          ...options,
          onProgress: (p) => this.progressSubject.next(p.percentage),
          onError: (err) => {
            this.stateSubject.next('error');
            reject(err);
          },
          onComplete: () => {
            this.stateSubject.next('completed');
            resolve();
          }
        },
        this.cache,
        new EventEmitter()
      );
      
      this.stateSubject.next('uploading');
      this.uploader.upload();
    });
  }

  pause(): void {
    this.uploader?.pause();
    this.stateSubject.next('paused');
  }

  resume(): void {
    this.uploader?.resume();
    this.stateSubject.next('uploading');
  }

  cancel(): void {
    this.uploader?.cancel();
    this.stateSubject.next('cancelled');
  }
}
```

### Angular Component

```typescript
import { Component } from '@angular/core';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  progress$ = this.uploadService.progress$;
  state$ = this.uploadService.state$;
  selectedFile: File | null = null;

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length) {
      this.selectedFile = files[0];
    }
  }

  async startUpload(): Promise<void> {
    if (!this.selectedFile) return;

    try {
      await this.uploadService.upload(this.selectedFile, {
        endpoint: 'https://api.example.com/upload',
        endpointInit: 'https://api.example.com/init',
        endpointFinalize: 'https://api.example.com/finalize'
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }

  pause(): void {
    this.uploadService.pause();
  }

  resume(): void {
    this.uploadService.resume();
  }

  cancel(): void {
    this.uploadService.cancel();
  }
}
```

### Angular Template

```html
<div class="upload-container">
  <input 
    type="file" 
    (change)="onFileSelected($event)"
  />
  
  <button (click)="startUpload()">Start Upload</button>

  <div class="progress" *ngIf="(state$ | async) as state">
    <div 
      class="progress-bar"
      [style.width.%]="(progress$ | async) || 0"
    ></div>
  </div>
  
  <p>{{ progress$ | async }}%</p>

  <button (click)="pause()" *ngIf="(state$ | async) === 'uploading'">
    Pause
  </button>
  <button (click)="resume()" *ngIf="(state$ | async) === 'paused'">
    Resume
  </button>
  <button (click)="cancel()">Cancel</button>
</div>
```

---

## 🟢 Node.js / Express Backend

### Install Dependencies

```bash
npm install express multer uuid
```

### Initialize Upload

```typescript
import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const router = Router();
const uploads: Record<string, any> = {};

router.post('/api/upload/init', async (req: Request, res: Response) => {
  const { fileName, fileSize, fileHash, metadata } = req.body;

  if (!fileName || !fileSize || !fileHash) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'fileName, fileSize, and fileHash are required'
    });
  }

  try {
    const mediaId = crypto.randomUUID();
    const uploadDir = path.join(process.cwd(), 'uploads', mediaId);

    await fs.mkdir(uploadDir, { recursive: true });

    uploads[mediaId] = {
      mediaId,
      fileName,
      fileSize,
      fileHash,
      metadata,
      uploadDir,
      chunks: {},
      status: 'initialized',
      createdAt: new Date(),
      uploadedChunks: 0,
      totalChunks: 0
    };

    console.log(`[UPLOAD] Session ${mediaId} initialized: ${fileName}`);

    res.status(201).json({
      success: true,
      mediaId,
      message: 'Upload session initialized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Initialization failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

### Upload Chunk

```typescript
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/upload/chunk', upload.single('chunk'), async (req: Request, res: Response) => {
  try {
    const { mediaId, chunkIndex, totalChunks } = req.body;
    const chunkFile = req.file;

    if (!mediaId || chunkIndex === undefined) {
      return res.status(400).json({ 
        error: 'Missing required parameters'
      });
    }

    const session = uploads[mediaId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found' 
      });
    }

    if (!chunkFile) {
      return res.status(400).json({ 
        error: 'No chunk uploaded'
      });
    }

    const chunkPath = path.join(session.uploadDir, `chunk_${chunkIndex}.part`);
    await fs.writeFile(chunkPath, chunkFile.buffer);

    session.chunks[chunkIndex] = {
      index: chunkIndex,
      size: chunkFile.size,
      uploadedAt: new Date()
    };
    session.uploadedChunks = Object.keys(session.chunks).length;
    session.totalChunks = totalChunks;
    session.status = 'uploading';

    const percentage = Math.round((session.uploadedChunks / totalChunks) * 100);

    console.log(`[CHUNK] ${mediaId}: chunk ${chunkIndex}/${totalChunks - 1} (${percentage}%)`);

    res.json({
      success: true,
      chunkIndex,
      uploadedChunks: session.uploadedChunks,
      totalChunks,
      percentage,
      message: `Chunk ${chunkIndex}/${totalChunks - 1} uploaded successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Chunk upload failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

### Finalize Upload

```typescript
import { createWriteStream } from 'fs';

router.post('/api/upload/finalize', async (req: Request, res: Response) => {
  try {
    const { mediaId, mediaHash } = req.body;

    if (!mediaId) {
      return res.status(400).json({ 
        error: 'mediaId is required'
      });
    }

    const session = uploads[mediaId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Session not found'
      });
    }

    const outputPath = path.join(
      process.cwd(), 
      'public/uploads',
      `${mediaId}_${session.fileName}`
    );

    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const outputStream = createWriteStream(outputPath);

    for (let i = 0; i < session.totalChunks; i++) {
      const chunkPath = path.join(session.uploadDir, `chunk_${i}.part`);
      const data = await fs.readFile(chunkPath);
      await new Promise((resolve, reject) => {
        outputStream.write(data, (err) => {
          if (err) reject(err);
          else resolve(null);
        });
      });
    }

    await new Promise((resolve, reject) => {
      outputStream.end((err) => {
        if (err) reject(err);
        else resolve(null);
      });
    });

    const fileContent = await fs.readFile(outputPath);
    const actualHash = crypto
      .createHash('sha256')
      .update(fileContent)
      .digest('hex');

    console.log(`[FINALIZE] ${mediaId}: Upload finalized`);
    console.log(`  File: ${session.fileName}`);
    console.log(`  Size: ${fileContent.length} bytes`);

    await fs.rm(session.uploadDir, { recursive: true, force: true });

    session.status = 'completed';
    session.completedAt = new Date();
    session.filePath = outputPath;

    res.json({
      success: true,
      mediaId,
      fileName: session.fileName,
      filePath: `/uploads/${mediaId}_${session.fileName}`,
      fileSize: fileContent.length,
      message: 'Upload finalized successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Finalization failed',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

---

## 🐘 PHP / Symfony Backend

### Installation

```bash
composer require symfony/http-foundation symfony/routing
```

### Upload Controller

```php
<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

#[Route('/api/upload')]
final class UploadController extends AbstractController
{
    private string $uploadDir;
    private string $chunksDir;
    private string $metadataFile;

    public function __construct(string $projectDir)
    {
        $this->uploadDir = $projectDir . '/public/uploads/complete';
        $this->chunksDir = $projectDir . '/public/uploads/chunks';
        $this->metadataFile = $projectDir . '/var/upload_metadata.json';

        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
        if (!is_dir($this->chunksDir)) {
            mkdir($this->chunksDir, 0777, true);
        }
    }

    #[Route('/init', methods: ['POST'])]
    public function initializeUpload(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!isset($data['fileName'], $data['fileSize'], $data['fileHash'])) {
                return $this->json([
                    'error' => 'Missing required fields',
                    'message' => 'fileName, fileSize, and fileHash are required'
                ], Response::HTTP_BAD_REQUEST);
            }

            $mediaId = uniqid('media_', true);
            $mediaChunkDir = $this->chunksDir . '/' . $mediaId;

            if (!is_dir($mediaChunkDir)) {
                mkdir($mediaChunkDir, 0777, true);
            }

            $metadata = [
                'mediaId' => $mediaId,
                'fileName' => $data['fileName'],
                'fileSize' => $data['fileSize'],
                'fileType' => $data['fileType'] ?? 'application/octet-stream',
                'fileHash' => $data['fileHash'],
                'uploadedChunks' => 0,
                'totalChunks' => 0,
                'status' => 'initialized',
                'createdAt' => date('Y-m-d H:i:s'),
                'chunkDir' => $mediaChunkDir
            ];

            $this->saveMetadata($mediaId, $metadata);

            return $this->json([
                'success' => true,
                'mediaId' => $mediaId,
                'message' => 'Upload session initialized successfully'
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Initialization failed',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/chunk', methods: ['POST'])]
    public function uploadChunk(Request $request): JsonResponse
    {
        try {
            $chunk = $request->files->get('chunk');
            $chunkIndex = (int) $request->request->get('chunkIndex');
            $totalChunks = (int) $request->request->get('totalChunks');
            $mediaId = $request->request->get('mediaId');

            if (!$chunk) {
                return $this->json([
                    'error' => 'No chunk file uploaded'
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!$mediaId) {
                return $this->json([
                    'error' => 'Missing mediaId'
                ], Response::HTTP_BAD_REQUEST);
            }

            $metadata = $this->loadMetadata($mediaId);
            if (!$metadata) {
                return $this->json([
                    'error' => 'Session not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $chunkDir = $metadata['chunkDir'];
            $chunkFileName = sprintf('chunk_%04d.part', $chunkIndex);

            if (!$chunk->move($chunkDir, $chunkFileName)) {
                throw new \RuntimeException('Failed to save chunk file');
            }

            $metadata['uploadedChunks'] = $chunkIndex + 1;
            $metadata['totalChunks'] = $totalChunks;
            $metadata['status'] = 'uploading';
            $metadata['lastChunkAt'] = date('Y-m-d H:i:s');

            $this->saveMetadata($mediaId, $metadata);

            $percentage = round(($metadata['uploadedChunks'] / $totalChunks) * 100);

            return $this->json([
                'success' => true,
                'chunkIndex' => $chunkIndex,
                'uploadedChunks' => $metadata['uploadedChunks'],
                'totalChunks' => $totalChunks,
                'percentage' => $percentage,
                'message' => sprintf('Chunk %d/%d uploaded successfully', $chunkIndex + 1, $totalChunks)
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Chunk upload failed',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/finalize', methods: ['POST'])]
    public function finalizeUpload(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            $mediaId = $data['mediaId'] ?? null;

            if (!$mediaId) {
                return $this->json([
                    'error' => 'Missing mediaId'
                ], Response::HTTP_BAD_REQUEST);
            }

            $metadata = $this->loadMetadata($mediaId);
            if (!$metadata) {
                return $this->json([
                    'error' => 'Session not found'
                ], Response::HTTP_NOT_FOUND);
            }

            $chunkDir = $metadata['chunkDir'];
            $totalChunks = $metadata['totalChunks'];
            $finalFileName = $metadata['fileName'];
            $finalFilePath = $this->uploadDir . '/' . $mediaId . '_' . $finalFileName;

            $finalFile = fopen($finalFilePath, 'wb');
            if (!$finalFile) {
                throw new \RuntimeException('Failed to create final file');
            }

            for ($i = 0; $i < $totalChunks; $i++) {
                $chunkFileName = sprintf('chunk_%04d.part', $i);
                $chunkPath = $chunkDir . '/' . $chunkFileName;

                if (!file_exists($chunkPath)) {
                    fclose($finalFile);
                    throw new \RuntimeException(sprintf('Missing chunk %d', $i));
                }

                $chunkData = file_get_contents($chunkPath);
                fwrite($finalFile, $chunkData);
            }

            fclose($finalFile);

            $this->cleanupChunks($chunkDir);

            $metadata['status'] = 'completed';
            $metadata['filePath'] = $finalFilePath;
            $metadata['completedAt'] = date('Y-m-d H:i:s');
            $this->saveMetadata($mediaId, $metadata);

            $fileSize = filesize($finalFilePath);

            return $this->json([
                'success' => true,
                'mediaId' => $mediaId,
                'fileName' => $finalFileName,
                'filePath' => '/uploads/complete/' . $mediaId . '_' . $finalFileName,
                'fileSize' => $fileSize,
                'message' => 'Upload finalized successfully'
            ]);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'error' => 'Finalization failed',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function saveMetadata(string $mediaId, array $metadata): void
    {
        $allMetadata = $this->loadAllMetadata();
        $allMetadata[$mediaId] = $metadata;
        file_put_contents($this->metadataFile, json_encode($allMetadata, JSON_PRETTY_PRINT));
    }

    private function loadMetadata(string $mediaId): ?array
    {
        $allMetadata = $this->loadAllMetadata();
        return $allMetadata[$mediaId] ?? null;
    }

    private function loadAllMetadata(): array
    {
        if (!file_exists($this->metadataFile)) {
            return [];
        }

        $content = file_get_contents($this->metadataFile);
        return json_decode($content, true) ?? [];
    }

    private function cleanupChunks(string $chunkDir): void
    {
        if (!is_dir($chunkDir)) {
            return;
        }

        $files = glob($chunkDir . '/*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }

        rmdir($chunkDir);
    }
}
```

---

## 📊 Available Events

The library emits 15+ events for complete control:

| Event | Description |
|-------|-------------|
| `INITIALIZE_UPLOAD_STARTED` | Initialization started |
| `INITIALIZE_UPLOAD_SUCCESS` | Initialization successful |
| `INITIALIZE_UPLOAD_FAILURE` | Initialization failed |
| `MEDIA_CHUNK_UPLOAD_STARTED` | Chunk upload started |
| `MEDIA_CHUNK_UPLOAD_SUCCESS` | Chunk upload successful |
| `MEDIA_CHUNK_UPLOAD_FAILED` | Chunk upload failed |
| `MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE` | HTTP error response |
| `MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE` | Max retries reached |
| `DOWNLOAD_MEDIA_COMPLETE` | Upload completed |
| `DOWNLOAD_MEDIA_FAILURE` | Upload failed |
| `UPLOAD_CANCELLED` | Upload cancelled |
| `UPLOAD_PAUSED` | Upload paused |
| `UPLOAD_RESUMED` | Upload resumed |
| `UPLOAD_STATE_CHANGED` | Upload state changed |
| `MEDIA_CHUNK_UPLOAD_RESUME` | Resume detected |

---

## 🎯 Upload States (UploadState)

```typescript
enum UploadState {
  IDLE = 'idle',                  // Ready
  INITIALIZING = 'initializing',  // Initializing
  UPLOADING = 'uploading',        // Uploading in progress
  PAUSED = 'paused',              // Paused
  CANCELLED = 'cancelled',        // Cancelled
  FINALIZING = 'finalizing',      // Finalizing
  COMPLETED = 'completed',        // Completed
  FAILED = 'failed'               // Failed
}
```

---

## 🔄 Pause and Resume

### Pause Upload

```typescript
uploader.pause();  // Pause the upload
```

### Resume Upload

```typescript
const resumeData = await cache.getItem(`upload_${fileName}`);
await uploader.resumeUpload(resumeData);
```

### Cancel Upload

```typescript
uploader.cancel();  // Cancel completely
```

---

## 🛡️ Error Handling

### Custom Exceptions

```typescript
import {
  FileUploadChunkError,
  ChunkUploadHttpErrorException,
  InitializeUploadFailureException,
  UploadCancelledException
} from '@wlindabla/form_validator';

try {
  await uploader.upload();
} catch (error) {
  if (error instanceof FileUploadChunkError) {
    console.log(`Chunk ${error.chunkIndex} failed`);
    console.log(`Attempted ${error.attemptNumber} times`);
  } else if (error instanceof InitializeUploadFailureException) {
    console.error('Initialization failed:', error.message);
  } else if (error instanceof UploadCancelledException) {
    console.log('Upload was cancelled');
  }
}
```

---

## 📈 UploadProgress Interface

Received in `onProgress` callback:

```typescript
interface UploadProgress {
  uploadedChunks: number;          // Chunks uploaded
  totalChunks: number;             // Total chunks
  uploadedBytes: number;           // Bytes uploaded
  totalBytes: number;              // Total bytes
  percentage: number;              // 0-100
  currentChunk: number;            // Current chunk
  speed?: number;                  // Bytes per second
  estimatedTimeRemaining?: number | null;  // Seconds
  elapsed: number;                 // Elapsed seconds
}
```

### Usage Example

```typescript
onProgress: (progress) => {
  console.log(`Upload: ${progress.percentage}%`);
  console.log(`Speed: ${progress.speed / 1000000} MB/s`);
  console.log(`ETA: ${progress.estimatedTimeRemaining} seconds`);
  console.log(`Elapsed: ${progress.elapsed} seconds`);
}
```

---

## 🔐 Security Best Practices

### 1. Authentication

```typescript
const uploader = new ChunkedFileUploader({
  file,
  endpoint: 'https://api.example.com/upload',
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'X-Custom-Header': 'value'
  }
}, cache, eventEmitter);
```

### 2. File Validation

```typescript
const validateFile = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
  const ALLOWED_TYPES = ['video/mp4', 'image/jpeg', 'application/pdf'];

  if (file.size > MAX_SIZE) {
    throw new Error('File too large');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('File type not allowed');
  }
};

validateFile(selectedFile);
await uploader.upload();
```

### 3. Timeout and Retry Configuration

```typescript
const uploader = new ChunkedFileUploader({
  file,
  timeout: 30000,        // 30 seconds per chunk
  maxRetries: 5,         // Maximum 5 retry attempts
  initTimeout: 45000     // 45 seconds for initialization
}, cache, eventEmitter);
```

---

## 💡 Real-World Examples

### Video Streaming Platform

```typescript
const videoUploader = new ChunkedFileUploader({
  file: videoFile,
  endpoint: 'https://api.streaming.com/upload',
  endpointInit: 'https://api.streaming.com/init',
  endpointFinalize: 'https://api.streaming.com/finalize',
  chunkSize: 10 * 1024 * 1024,  // 10MB chunks
  maxRetries: 5,
  autoSave: true,
  metadata: {
    userId: currentUser.id,
    projectId: projectId,
    quality: 'HD'
  }
}, cache, eventEmitter);
```

### Medical Application

```typescript
const medicalUploader = new ChunkedFileUploader({
  file: scanFile,
  endpoint: 'https://api.medical.com/upload',
  headers: {
    'Authorization': `Bearer ${medicalToken}`,
    'X-HIPAA-Compliant': 'true'
  },
  metadata: {
    patientId: securePatientId,
    scanType: 'MRI',
    encrypted: true
  }
}, cache, eventEmitter);
```

### SaaS - File Backup

```typescript
const backupUploader = new ChunkedFileUploader({
  file: backupFile,
  endpoint: 'https://api.backup.com/upload',
  maxRetries: 10,
  autoSave: true,
  onProgress: (progress) => {
    analytics.track('backup_progress', {
      percentage: progress.percentage,
      speed: progress.speed
    });
  },
  onComplete: (result) => {
    database.updateBackupRecord({
      fileId: result.fileId,
      duration: result.duration,
      status: 'completed'
    });
  }
}, cache, eventEmitter);
```

---

## 📞 Support & Contributing

**Author:** AGBOKOUDJO Franck  
**Email:** internationaleswebservices@gmail.com  
**Phone:** +229 0167 25 18 86  
**LinkedIn:** https://www.linkedin.com/in/internationales-web-apps-services-120520193/  
**Company:** INTERNATIONALES WEB APPS & SERVICES

### Bug Reports

Create an issue with:
- Problem description
- Steps to reproduce
- Your environment (browser, OS, version)
- Console logs

### Contributing

We welcome contributions!
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

## ⭐ Show Your Support

If you find this library useful:
- ⭐ Star the repository
- 🐛 Report bugs
- 💡 Suggest improvements
- 🎉 Share feedback

Thank you! 🙏