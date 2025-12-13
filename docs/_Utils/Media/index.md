# 🚀 Chunked File Uploader

<div align="center">

![Version](https://img.shields.io/badge/version-2.4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Bundle Size](https://img.shields.io/badge/gzip-8.2kb-brightgreen.svg)

**The most powerful, flexible, and developer-friendly chunked upload library for modern web applications.**

[Quick Start](#quick-start) • [API Reference](#api-reference) • [Examples](#examples) • [Backend Integration](#backend-integration)

</div>

---

## ✨ Why Choose This Library?

### 🎯 **Zero Dependencies**
Pure TypeScript. No bloat. No external dependencies.

### 🔥 **Framework Agnostic**
Works seamlessly with React, Angular, Vue, Svelte, or Vanilla JS.

### 📦 **Tiny Bundle**
Less than 10KB gzipped. Won't slow down your app.

### 🔄 **Smart Resume**
Continue uploads exactly where they stopped. Perfect for unreliable connections.

### 🚀 **Intelligent Retry**
Exponential backoff with configurable strategies. Handles network failures gracefully.

### 📊 **Real-time Progress**
Detailed upload statistics: speed, ETA, percentage, and more.

### 🎨 **Event-Driven Architecture**
Full control with a rich event system. Listen to every stage of the upload.

### 💾 **Flexible Storage**
Built-in support for localStorage, or bring your own cache implementation.

### 🔐 **Type-Safe**
Full TypeScript support with comprehensive type definitions.

### 🌐 **Production-Ready Backends**
Complete examples for Symfony, Node.js, Laravel, and custom solutions.

---

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
  - [ChunkedFileUploader](#chunkedfileuploader)
  - [Interfaces](#interfaces)
  - [Events](#events)
  - [Exceptions](#exceptions)
- [Framework Integration](#framework-integration)
  - [React](#react-integration)
  - [Angular](#angular-integration)
  - [Vue 3](#vue-3-integration)
  - [Vanilla JavaScript](#vanilla-javascript)
- [Backend Integration](#backend-integration)
  - [Symfony](#symfony-backend)
  - [Node.js (Express)](#nodejs-express-backend)
  - [Laravel](#laravel-backend)
- [Advanced Usage](#advanced-usage)
  - [Resume Upload](#resume-upload)
  - [Custom Cache](#custom-cache-implementation)
  - [Custom Event Emitter](#custom-event-emitter)
  - [Retry Strategies](#retry-strategies)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Installation

```bash
# npm
npm install @wlindabla/chunked-uploader

# yarn
yarn add @wlindabla/chunked-uploader

# pnpm
pnpm add @wlindabla/chunked-uploader
```

---

## Quick Start

### Basic Upload (5 minutes)

```typescript
import { 
  ChunkedFileUploader,
  DefaultUploadResumeCacheAdapter,
  UniversalEventEmitter
} from '@wlindabla/chunked-uploader';

// 1. Setup cache and event emitter
const cache = new DefaultUploadResumeCacheAdapter();
const eventEmitter = new UniversalEventEmitter();

// 2. Get your file
const fileInput = document.querySelector<HTMLInputElement>('#file-input');
const file = fileInput.files[0];

// 3. Create uploader
const uploader = new ChunkedFileUploader(
  {
    file: file,
    endpoint: 'https://api.example.com/upload/chunk',
    endpointInit: 'https://api.example.com/upload/init',
    endpointFinalize: 'https://api.example.com/upload/finalize',
    chunkSize: 1024 * 1024, // 1MB chunks
    maxRetries: 3,
    onProgress: (progress) => {
      console.log(`${progress.percentage}% complete`);
    },
    onComplete: (result) => {
      console.log('Upload successful!', result);
    },
    onError: (error) => {
      console.error('Upload failed:', error);
    }
  },
  cache,
  eventEmitter
);

// 4. Start upload
await uploader.upload();
```

---

## Core Concepts

### 🎯 **Three-Endpoint Architecture**

The library uses a standardized 3-endpoint pattern:

1. **`endpointInit`** - Initialize upload session, get mediaId
2. **`endpoint`** - Upload individual chunks
3. **`endpointFinalize`** - Finalize upload, assemble chunks

### 🔄 **Upload Flow**

```
┌─────────────────────────────────────────────────────┐
│ 1. INITIALIZE                                       │
│    POST /api/upload/init                           │
│    → Returns: { mediaId: "abc123" }               │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 2. UPLOAD CHUNKS (Parallel/Sequential)             │
│    POST /api/upload/chunk                          │
│    FormData: { chunk, chunkIndex, mediaId, ... }  │
│    → Repeat for each chunk                         │
└─────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────┐
│ 3. FINALIZE                                        │
│    POST /api/upload/finalize                       │
│    → Assembles chunks, returns final file URL     │
└─────────────────────────────────────────────────────┘
```

### 📦 **Chunk Size Strategy**

The library automatically calculates optimal chunk sizes based on:
- File size
- Network speed (if provided)
- Custom configuration

**Default Strategy:**

| File Size | Chunk Size |
|-----------|-----------|
| < 200 MB  | 50 MB     |
| 200-400 MB | 100 MB   |
| 400-800 MB | 300 MB   |
| 800-1000 MB | 500 MB  |
| > 1000 MB | 700 MB    |

**For slow connections (< 5 Mbps):**
Automatically reduces to 2 MB chunks.

---

## API Reference

### ChunkedFileUploader

#### Constructor

```typescript
new ChunkedFileUploader(
  options: UploadOptions,
  cache: UploadResumeCacheInterface,
  eventEmitter: EventEmitterInterface
)
```

#### Methods

##### `upload(): Promise<UploadResult>`

Starts the upload process.

```typescript
const result = await uploader.upload();
console.log(result.fileId); // Server-provided file ID
```

**Returns:**
```typescript
interface UploadResult {
  success: boolean;
  fileId: string;
  totalChunks: number;
  totalBytes: number;
  duration: number; // seconds
  averageSpeed: number; // bytes/second
  finalizeUploadResponse: any;
}
```

##### `pause(): void`

Pauses the upload.

```typescript
uploader.pause();
```

##### `resume(): void`

Resumes a paused upload.

```typescript
uploader.resume();
```

##### `cancel(): void`

Cancels the upload permanently.

```typescript
uploader.cancel();
```

##### `resumeUpload(resumeData: ResumeData): Promise<UploadResult>`

Resumes an upload from saved state.

```typescript
const resumeData = await cache.getItem('upload_video.mp4');
if (resumeData) {
  await uploader.resumeUpload(resumeData);
}
```

##### `getState(): UploadState`

Gets current upload state.

```typescript
const state = uploader.getState();
// Returns: 'IDLE' | 'INITIALIZING' | 'UPLOADING' | 'PAUSED' | 
//          'CANCELLED' | 'FINALIZING' | 'COMPLETED' | 'FAILED'
```

---

### Interfaces

#### UploadOptions

```typescript
interface UploadOptions {
  // Required
  file: File;
  endpoint: string; // Chunk upload endpoint
  endpointInit: string; // Initialize endpoint
  endpointFinalize: string; // Finalize endpoint
  
  // Optional
  chunkSize?: number; // Auto-calculated if not provided
  maxRetries?: number; // Default: 3
  timeout?: number; // Per-chunk timeout (ms), default: 60000
  initTimeout?: number; // Init timeout (ms), default: 45000
  speedMbps?: number; // Network speed for chunk size calculation
  headers?: Record<string, string>; // Custom headers
  metadata?: Record<string, any>; // Custom metadata
  autoSave?: boolean; // Auto-save progress, default: false
  
  // Configuration
  config?: ChunkSizeConfig;
  
  // Callbacks
  onProgress?: (progress: UploadProgress) => void;
  onChunkSuccess?: (chunkInfo: ChunkInfo) => void;
  onChunkError?: (error: ChunkError) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}
```

#### UploadProgress

```typescript
interface UploadProgress {
  uploadedChunks: number;
  totalChunks: number;
  uploadedBytes: number;
  totalBytes: number;
  percentage: number; // 0-100
  currentChunk: number;
  speed?: number; // bytes/second
  estimatedTimeRemaining?: number | null; // seconds
  elapsed: number; // seconds elapsed
}
```

#### ChunkInfo

```typescript
interface ChunkInfo {
  index: number; // 0-based
  start: number; // byte position
  end: number;
  size: number; // chunk size in bytes
  attempt: number; // current retry attempt
  status: 'pending' | 'uploading' | 'success' | 'error';
}
```

#### ResumeData

```typescript
interface ResumeData {
  fileId: string;
  fileName: string;
  fileSize: number;
  uploadedChunks: number;
  lastChunkIndex: number;
  lastBytePosition: number;
  chunkSize: number;
}
```

---

### Events

The library emits rich events throughout the upload lifecycle.

#### Event List

| Event | When Fired | Event Data |
|-------|-----------|------------|
| `initializeUploadStarted` | Upload initialization begins | `InitializeUploadStartedEvent` |
| `initializeUploadSuccess` | Initialization successful | `InitializeUploadSuccessEvent` |
| `initializeUploadFailure` | Initialization failed | `InitializeUploadFailureEvent` |
| `mediaChunkUploadStarted` | Chunk upload begins | `UploadChunkStartedEvent` |
| `mediaChunkUploadSuccess` | Chunk uploaded successfully | `UploadProgressEvent` |
| `mediaChunkUploadFailed` | Chunk upload failed | `ChunkError` |
| `mediaChunkUploadMaxRetryExpire` | All retries exhausted | `FileUploadChunkError` |
| `uploadStateChanged` | Upload state changes | `UploadStateChangedEvent` |
| `uploadPaused` | Upload paused | `UploadPausedEvent` |
| `uploadResumed` | Upload resumed | `UploadResumedEvent` |
| `uploadCancelled` | Upload cancelled | `UploadCancelledEvent` |
| `downloadMediaComplete` | Upload completed | `UploadMediaCompleteEvent` |
| `downloadMediaFailure` | Upload failed | `Error` |

#### Listening to Events

```typescript
import { 
  MEDIA_CHUNK_UPLOAD_SUCCESS,
  UPLOAD_STATE_CHANGED,
  DOWNLOAD_MEDIA_COMPLETE
} from '@wlindabla/chunked-uploader';

// Listen to progress
eventEmitter.on(MEDIA_CHUNK_UPLOAD_SUCCESS, (event) => {
  console.log(`${event.percentage}%`);
  console.log(`Speed: ${event.speed} bytes/s`);
  console.log(`ETA: ${event.estimatedTimeRemaining}s`);
});

// Listen to state changes
eventEmitter.on(UPLOAD_STATE_CHANGED, (event) => {
  console.log(`State: ${event.oldState} → ${event.newState}`);
});

// Listen to completion
eventEmitter.on(DOWNLOAD_MEDIA_COMPLETE, (event) => {
  console.log(`File ID: ${event.mediaId}`);
  console.log(`Duration: ${event.operationDuration}s`);
  console.log(`Speed: ${event.averageSpeed} bytes/s`);
});
```

---

### Exceptions

#### Custom Exceptions

The library throws specific exceptions for different error scenarios:

##### `InitializeUploadFailureException`

Thrown when upload initialization fails.

```typescript
try {
  await uploader.upload();
} catch (error) {
  if (error instanceof InitializeUploadFailureException) {
    console.error('Init failed:', error.message);
    console.error('Response:', error.errorPayload);
  }
}
```

##### `FileUploadChunkError`

Thrown when a chunk fails after all retries.

```typescript
catch (error) {
  if (error instanceof FileUploadChunkError) {
    console.error(`Chunk ${error.chunkError.chunk.index} failed`);
    console.error(`Attempts: ${error.chunkError.attempt}`);
  }
}
```

##### `ChunkUploadHttpErrorException`

Thrown when server returns HTTP error (4xx/5xx).

```typescript
catch (error) {
  if (error instanceof ChunkUploadHttpErrorException) {
    console.error(`HTTP ${error.statusResponse}`);
    console.error('Error:', error.errorPayload);
  }
}
```

##### `UploadCancelledException`

Thrown when upload is cancelled.

```typescript
catch (error) {
  if (error instanceof UploadCancelledException) {
    console.log('Upload was cancelled by user');
  }
}
```

---

## Framework Integration

### React Integration

#### Basic Example

```tsx
import React, { useState } from 'react';
import { 
  ChunkedFileUploader,
  DefaultUploadResumeCacheAdapter,
  UniversalEventEmitter,
  UploadProgress
} from '@wlindabla/chunked-uploader';

export function FileUploadComponent() {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [status, setStatus] = useState<string>('idle');
  const [uploader, setUploader] = useState<ChunkedFileUploader | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cache = new DefaultUploadResumeCacheAdapter();
    const eventEmitter = new UniversalEventEmitter();

    const newUploader = new ChunkedFileUploader(
      {
        file,
        endpoint: '/api/upload/chunk',
        endpointInit: '/api/upload/init',
        endpointFinalize: '/api/upload/finalize',
        chunkSize: 1024 * 1024,
        onProgress: (prog) => setProgress(prog),
        onComplete: (result) => {
          setStatus('completed');
          console.log('Upload complete:', result);
        },
        onError: (error) => {
          setStatus('failed');
          console.error('Upload error:', error);
        }
      },
      cache,
      eventEmitter
    );

    setUploader(newUploader);
    setStatus('uploading');

    try {
      await newUploader.upload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileSelect} />
      
      {progress && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress.percentage}%` }}
          />
          <span>{progress.percentage}%</span>
        </div>
      )}

      {progress && (
        <div className="stats">
          <p>Speed: {(progress.speed! / 1024 / 1024).toFixed(2)} MB/s</p>
          <p>ETA: {progress.estimatedTimeRemaining}s</p>
          <p>Uploaded: {progress.uploadedChunks}/{progress.totalChunks} chunks</p>
        </div>
      )}

      {uploader && status === 'uploading' && (
        <div className="controls">
          <button onClick={() => uploader.pause()}>Pause</button>
          <button onClick={() => uploader.resume()}>Resume</button>
          <button onClick={() => uploader.cancel()}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

#### Custom Hook

```tsx
import { useState, useCallback } from 'react';
import { 
  ChunkedFileUploader,
  UploadOptions,
  UploadProgress,
  UploadResult
} from '@wlindabla/chunked-uploader';

export function useChunkedUpload(baseOptions: Partial<UploadOptions>) {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [uploader, setUploader] = useState<ChunkedFileUploader | null>(null);

  const upload = useCallback(async (file: File) => {
    const cache = new DefaultUploadResumeCacheAdapter();
    const eventEmitter = new UniversalEventEmitter();

    const newUploader = new ChunkedFileUploader(
      {
        ...baseOptions,
        file,
        onProgress: setProgress,
        onError: setError,
        onComplete: setResult
      } as UploadOptions,
      cache,
      eventEmitter
    );

    setUploader(newUploader);
    
    try {
      await newUploader.upload();
    } catch (err) {
      setError(err as Error);
    }
  }, [baseOptions]);

  return {
    upload,
    progress,
    error,
    result,
    uploader,
    pause: () => uploader?.pause(),
    resume: () => uploader?.resume(),
    cancel: () => uploader?.cancel()
  };
}

// Usage
function App() {
  const { upload, progress, pause, resume } = useChunkedUpload({
    endpoint: '/api/upload/chunk',
    endpointInit: '/api/upload/init',
    endpointFinalize: '/api/upload/finalize'
  });

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {progress && <p>{progress.percentage}%</p>}
    </div>
  );
}
```

---

### Angular Integration

#### Service

```typescript
// upload.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ChunkedFileUploader,
  DefaultUploadResumeCacheAdapter,
  UniversalEventEmitter,
  UploadProgress,
  UploadOptions
} from '@wlindabla/chunked-uploader';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private progressSubject = new BehaviorSubject<UploadProgress | null>(null);
  private statusSubject = new BehaviorSubject<string>('idle');
  
  public progress$: Observable<UploadProgress | null> = this.progressSubject.asObservable();
  public status$: Observable<string> = this.statusSubject.asObservable();

  private uploader: ChunkedFileUploader | null = null;

  async uploadFile(file: File, options: Partial<UploadOptions> = {}): Promise<void> {
    const cache = new DefaultUploadResumeCacheAdapter();
    const eventEmitter = new UniversalEventEmitter();

    this.uploader = new ChunkedFileUploader(
      {
        file,
        endpoint: options.endpoint || '/api/upload/chunk',
        endpointInit: options.endpointInit || '/api/upload/init',
        endpointFinalize: options.endpointFinalize || '/api/upload/finalize',
        chunkSize: options.chunkSize || 1024 * 1024,
        onProgress: (progress) => {
          this.progressSubject.next(progress);
        },
        onComplete: (result) => {
          this.statusSubject.next('completed');
          console.log('Upload complete:', result);
        },
        onError: (error) => {
          this.statusSubject.next('failed');
          console.error('Upload error:', error);
        },
        ...options
      } as UploadOptions,
      cache,
      eventEmitter
    );

    this.statusSubject.next('uploading');

    try {
      await this.uploader.upload();
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }

  pause(): void {
    this.uploader?.pause();
    this.statusSubject.next('paused');
  }

  resume(): void {
    this.uploader?.resume();
    this.statusSubject.next('uploading');
  }

  cancel(): void {
    this.uploader?.cancel();
    this.statusSubject.next('cancelled');
  }
}
```

#### Component

```typescript
// upload.component.ts
import { Component } from '@angular/core';
import { UploadService } from './upload.service';
import { UploadProgress } from '@wlindabla/chunked-uploader';

@Component({
  selector: 'app-upload',
  template: `
    <div class="upload-container">
      <input type="file" (change)="onFileSelected($event)" />
      
      <div *ngIf="progress" class="progress-bar">
        <div 
          class="progress-fill" 
          [style.width.%]="progress.percentage"
        ></div>
        <span>{{ progress.percentage }}%</span>
      </div>

      <div *ngIf="progress" class="stats">
        <p>Speed: {{ getSpeedMBps() }} MB/s</p>
        <p>ETA: {{ progress.estimatedTimeRemaining }}s</p>
        <p>Chunks: {{ progress.uploadedChunks }}/{{ progress.totalChunks }}</p>
      </div>

      <div *ngIf="status === 'uploading'" class="controls">
        <button (click)="pause()">Pause</button>
        <button (click)="resume()">Resume</button>
        <button (click)="cancel()">Cancel</button>
      </div>
    </div>
  `
})
export class UploadComponent {
  progress: UploadProgress | null = null;
  status: string = 'idle';

  constructor(private uploadService: UploadService) {
    this.uploadService.progress$.subscribe(p => this.progress = p);
    this.uploadService.status$.subscribe(s => this.status = s);
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      await this.uploadService.uploadFile(file);
    }
  }

  getSpeedMBps(): string {
    if (!this.progress?.speed) return '0.00';
    return (this.progress.speed / 1024 / 1024).toFixed(2);
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

---

### Vue 3 Integration

#### Composition API

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ChunkedFileUploader,
  DefaultUploadResumeCacheAdapter,
  UniversalEventEmitter,
  UploadProgress
} from '@wlindabla/chunked-uploader';

const progress = ref<UploadProgress | null>(null);
const status = ref('idle');
const uploader = ref<ChunkedFileUploader | null>(null);

const speedMBps = computed(() => {
  if (!progress.value?.speed) return '0.00';
  return (progress.value.speed / 1024 / 1024).toFixed(2);
});

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const cache = new DefaultUploadResumeCacheAdapter();
  const eventEmitter = new UniversalEventEmitter();

  const newUploader = new ChunkedFileUploader(
    {
      file,
      endpoint: '/api/upload/chunk',
      endpointInit: '/api/upload/init',
      endpointFinalize: '/api/upload/finalize',
      onProgress: (prog) => progress.value = prog,
      onComplete: (result) => {
        status.value = 'completed';
        console.log('Upload complete:', result);
      },
      onError: (error) => {
        status.value = 'failed';
        console.error('Upload error:', error);
      }
    },
    cache,
    eventEmitter
  );

  uploader.value = newUploader;
  status.value = 'uploading';

  try {
    await newUploader.upload();
  } catch (error) {
    console.error(error);
  }
}

function pause() {
  uploader.value?.pause();
}

function resume() {
  uploader.value?.resume();
}

function cancel() {
  uploader.value?.cancel();
}
</script>

<template>
  <div class="upload-container">
    <input type="file" @change="handleFileSelect" />
    
    <div v-if="progress" class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${progress.percentage}%` }"
      />
      <span>{{ progress.percentage }}%</span>
    </div>

    <div v-if="progress" class="stats">
      <p>Speed: {{ speedMBps }} MB/s</p>
      <p>ETA: {{ progress.estimatedTimeRemaining }}s</p>
      <p>Chunks: {{ progress.uploadedChunks }}/{{ progress.totalChunks }}</p>
    </div>

    <div v-if="uploader && status === 'uploading'" class="controls">
      <button @click="pause">Pause</button>
      <button @click="resume">Resume</button>
      <button @click="cancel">Cancel</button>
    </div>
  </div>
</template>
```

---

### Vanilla JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>Chunked Upload</title>
  <style>
    .progress-bar {
      width: 100%;
      height: 30px;
      background: #f0f0f0;
      border-radius: 15px;
      overflow: hidden;
      position: relative;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4CAF50, #45a049);
      transition: width 0.3s ease;
    }
    .progress-text {
      position: absolute;
      width: 100%;
      text-align: center;
      line-height: 30px;
      color: #333;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <input type="file" id="fileInput" />
  <div id="progress-container" style="display: none;">
    <div class="progress-bar">
      <div class="progress-fill" id="progressFill"></div>
      <div class="progress-text" id="progressText">0%</div>
    </div>
    <div id="stats"></div>
    <div id="controls">
      <button id="pauseBtn">Pause</button>
      <button id="resumeBtn">Resume</button>
      <button id="cancelBtn">Cancel</button>
    </div>
  </div>

  <script type="module">
    import {
      ChunkedFileUploader,
      DefaultUploadResumeCacheAdapter,
      UniversalEventEmitter
    } from '@wlindabla/chunked-uploader';

    let uploader = null;
    const cache = new DefaultUploadResumeCacheAdapter();
    const eventEmitter = new UniversalEventEmitter();

    document.getElementById('fileInput').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      document.getElementById('progress-container').style.display = 'block';

      uploader = new ChunkedFileUploader(
        {
          file,
          endpoint: '/api/upload/chunk',
          endpointInit: '/api/upload/init',
          endpointFinalize: '/api/upload/finalize',
          onProgress: (progress) => {
            const fill = document.getElementById('progressFill');
            const text = document.getElementById('progressText');
            const stats = document.getElementById('stats');

            fill.style.width = `${progress.percentage}%`;
            text.textContent = `${progress.percentage}%`;

            const speedMBps = (progress.speed / 1024 / 1024).toFixed(2);
            stats.innerHTML = `
              <p>Speed: ${speedMBps} MB/s</p>
              <p>ETA: ${progress.estimatedTimeRemaining || 'Calculating...'}s</p>
              <p>Chunks: ${progress.uploadedChunks}/${progress.totalChunks}</p>
            `;
          },
          onComplete: (result) => {
            alert('Upload complete!');
            console.log(result);
          },
          onError: (error) => {
            alert('Upload failed: ' + error.message);
          }
        },
        cache,
        eventEmitter
      );

      try {
        await uploader.upload();
      } catch (error) {
        console.error(error);
      }
    });

    document.getElementById('pauseBtn').addEventListener('click', () => {
      uploader?.pause();
    });

    document.getElementById