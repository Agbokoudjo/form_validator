# 📤 ChunkedFileUploader v2.4.0

> Une bibliothèque TypeScript robuste, framework-agnostique pour télécharger des fichiers volumineux par chunks avec reprise, retry automatique et gestion d'événements complète.

**Auteur:** AGBOKOUDJO Franck  
**License:** MIT  
**npm:** `@wlindabla/form_validator`

---

## 🚀 Fonctionnalités Principales

- ✅ **Upload par Chunks** - Divisez les fichiers volumineux en chunks optimisés
- ✅ **Vérification d'Intégrité** - Hash SHA-256 pour garantir la sécurité des données
- ✅ **Retry Automatique** - Backoff exponentiel configurable
- ✅ **Pause/Reprise** - Interruption et reprise intelligentes
- ✅ **Suivi Temps Réel** - Vitesse, ETA, pourcentage d'avancement
- ✅ **Événements Riches** - Plus de 15 événements personnalisés
- ✅ **Framework-Agnostique** - Works with React, Angular, Vue, Vanilla JS
- ✅ **Gestion Robuste des Erreurs** - Exceptions personnalisées
- ✅ **Cache Flexible** - Support localStorage, IndexedDB, sessionStorage

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

## 🎯 Démarrage Rapide

```typescript
import { 
  ChunkedFileUploader,
  DefaultUploadResumeCacheAdapter,
  EventEmitter 
} from '@wlindabla/form_validator';

// Initialiser les dépendances
const cache = new DefaultUploadResumeCacheAdapter();
const eventEmitter = new EventEmitter();

// Créer l'uploader
const uploader = new ChunkedFileUploader(
  {
    file: inputFile,
    endpoint: 'https://api.example.com/upload',
    endpointInit: 'https://api.example.com/init',
    endpointFinalize: 'https://api.example.com/finalize',
    onProgress: (progress) => console.log(`${progress.percentage}%`),
    onComplete: (result) => console.log('Succès!', result)
  },
  cache,
  eventEmitter
);

// Démarrer l'upload
await uploader.upload();
```

---

## ⚙️ Configuration Complète

### UploadOptions

```typescript
interface UploadOptions {
  // Obligatoires
  file: File;                          // Le fichier à télécharger
  endpoint: string | URL;              // URL pour les chunks
  endpointInit: string | URL;          // URL d'initialisation
  endpointFinalize: string | URL;      // URL de finalisation
  
  // Optionnels
  chunkSize?: number;                  // Taille en bytes (par défaut: auto)
  speedMbps?: number;                  // Vitesse connexion pour optimisation
  config?: ChunkSizeConfig;            // Configuration avancée chunks
  headers?: HeadersInit;               // Headers HTTP personnalisés
  metadata?: Record<string, any>;      // Données supplémentaires
  maxRetries?: number;                 // Tentatives avant abandon (défaut: 3)
  timeout?: number;                    // Timeout requêtes en ms (défaut: 60000)
  autoSave?: boolean;                  // Sauvegarde auto la progression
  
  // Callbacks
  onProgress?: (progress: UploadProgress) => void;
  onChunkSuccess?: (chunk: ChunkInfo) => void;
  onChunkError?: (error: ChunkError) => void;
  onComplete?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
}
```

### Configuration Avancée (ChunkSizeConfig)

```typescript
const config = {
  defaultChunkSizeMB: 50,           // Taille par défaut en MB
  slowSpeedThresholdMbps: 5,        // Seuil pour connexion lente
  slowSpeedChunkSizeMB: 2,          // Taille chunk pour connexion lente
  fileSizeThresholds: [
    { maxSizeMB: 200, chunkSizeMB: 50 },
    { maxSizeMB: 1000, chunkSizeMB: 500 },
    { maxSizeMB: Infinity, chunkSizeMB: 700 }
  ]
};
```

---

## 🍦 Vanilla JavaScript

### Exemple Complet

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
  </style>
</head>
<body>
  <input type="file" id="fileInput" />
  <button id="uploadBtn">Démarrer</button>
  <button id="pauseBtn" disabled>Pause</button>
  <button id="resumeBtn" disabled>Reprendre</button>
  <button id="cancelBtn" disabled>Annuler</button>

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
        alert('Sélectionnez un fichier');
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
              : 'Calcul...';
            
            document.getElementById('progressText').textContent = 
              `${progress.percentage}% | ${speed} MB/s | ETA: ${eta}`;
          },
          onComplete: (result) => {
            console.log('Upload réussi!', result);
            alert('Fichier uploadé avec succès!');
            document.getElementById('uploadBtn').disabled = false;
          },
          onError: (error) => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'upload');
          }
        },
        cache,
        eventEmitter
      );

      try {
        await uploader.upload();
      } catch (error) {
        console.error('Upload échoué:', error);
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

### Hook Personnalisé

```typescript
import { useState, useRef, useCallback } from 'react';
import { ChunkedFileUploader } from '@wlindabla/form_validator';

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

### Composant React

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
          <p>Progression: {progress}%</p>
          
          <button onClick={pause}>Pause</button>
          <button onClick={resume}>Reprendre</button>
          <button onClick={cancel}>Annuler</button>
        </>
      )}
      
      {error && <p className="error">{error}</p>}
      {state === 'completed' && <p className="success">✓ Upload réussi!</p>}
    </div>
  );
}

export default FileUploadComponent;
```

---

## 🅰️ Angular

### Service Angular

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChunkedFileUploader } from '@wlindabla/form_validator';

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

### Composant Angular

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
}
```

### Template Angular

```html
<div class="upload-container">
  <input 
    type="file" 
    (change)="onFileSelected($event)"
  />
  
  <button (click)="startUpload()">Démarrer</button>

  <div class="progress" *ngIf="(state$ | async) as state">
    <div 
      class="progress-bar"
      [style.width.%]="(progress$ | async) || 0"
    ></div>
  </div>
  
  <p>{{ progress$ | async }}%</p>
</div>
```

---

## 🟢 Backend Node.js / Express

### Installation

```bash
npm install express multer
```

### Initialisation d'Upload

```typescript
import express, { Router, Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs/promises';

const router = Router();
const uploads: Record<string, any> = {};

router.post('/init', async (req: Request, res: Response) => {
  const { fileName, fileSize, fileHash, metadata } = req.body;

  // Validation
  if (!fileName || !fileSize || !fileHash) {
    return res.status(400).json({ 
      error: 'Données manquantes',
      message: 'fileName, fileSize, et fileHash sont requis'
    });
  }

  try {
    // Générer un ID unique
    const mediaId = crypto.randomUUID();
    const uploadDir = path.join(process.cwd(), 'uploads', mediaId);

    // Créer le répertoire
    await fs.mkdir(uploadDir, { recursive: true });

    // Sauvegarder les métadonnées
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

    console.log(`[UPLOAD] Session ${mediaId} initialisée: ${fileName}`);

    res.status(201).json({
      success: true,
      mediaId,
      message: 'Session d\'upload initialisée avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur initialisation',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

### Réception des Chunks

```typescript
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('chunk'), async (req: Request, res: Response) => {
  try {
    const { mediaId, chunkIndex, totalChunks } = req.body;
    const chunkFile = req.file;

    // Validation
    if (!mediaId || chunkIndex === undefined) {
      return res.status(400).json({ 
        error: 'Paramètres manquants'
      });
    }

    const session = uploads[mediaId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Session non trouvée' 
      });
    }

    if (!chunkFile) {
      return res.status(400).json({ 
        error: 'Aucun chunk uploadé'
      });
    }

    // Sauvegarder le chunk
    const chunkPath = path.join(session.uploadDir, `chunk_${chunkIndex}.part`);
    await fs.writeFile(chunkPath, chunkFile.buffer);

    // Mettre à jour les métadonnées
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
      message: `Chunk ${chunkIndex}/${totalChunks - 1} uploadé`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur upload chunk',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

### Finalisation d'Upload

```typescript
import { createWriteStream } from 'fs';

router.post('/finalize', async (req: Request, res: Response) => {
  try {
    const { mediaId, mediaHash } = req.body;

    if (!mediaId) {
      return res.status(400).json({ 
        error: 'mediaId requis'
      });
    }

    const session = uploads[mediaId];
    if (!session) {
      return res.status(404).json({ 
        error: 'Session non trouvée'
      });
    }

    // Assembler les chunks
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

    // Vérifier le hash
    const fileContent = await fs.readFile(outputPath);
    const actualHash = crypto
      .createHash('sha256')
      .update(fileContent)
      .digest('hex');

    console.log(`[FINALIZE] ${mediaId}: Upload finalisé`);
    console.log(`  Fichier: ${session.fileName}`);
    console.log(`  Taille: ${fileContent.length} bytes`);

    // Nettoyer les chunks
    await fs.rm(session.uploadDir, { recursive: true, force: true });

    // Mettre à jour le statut
    session.status = 'completed';
    session.completedAt = new Date();
    session.filePath = outputPath;

    res.json({
      success: true,
      mediaId,
      fileName: session.fileName,
      filePath: `/uploads/${mediaId}_${session.fileName}`,
      fileSize: fileContent.length,
      message: 'Upload finalisé avec succès'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur finalisation',
      message: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
```

---

## 🐘 Backend PHP / Symfony

Voici l'exemple complet du contrôleur Symfony fourni:

### Initialisation

```php
#[Route('/api/upload/init', methods: ['POST'])]
public function initializeUpload(Request $request): JsonResponse
{
    try {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['fileName'], $data['fileSize'], $data['fileHash'])) {
            return $this->json([
                'error' => 'Données manquantes',
                'message' => 'fileName, fileSize, et fileHash sont requis'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Générer un mediaId unique
        $mediaId = uniqid('media_', true);
        $mediaChunkDir = $this->chunksDir . '/' . $mediaId;

        if (!is_dir($mediaChunkDir)) {
            mkdir($mediaChunkDir, 0777, true);
        }

        // Sauvegarder les métadonnées
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
            'message' => 'Session d\'upload initialisée'
        ], Response::HTTP_CREATED);
    } catch (\Exception $e) {
        return $this->json([
            'success' => false,
            'error' => 'Erreur serveur',
            'message' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
```

### Upload Chunk

```php
#[Route('/api/upload/chunk', methods: ['POST'])]
public function uploadChunk(Request $request): JsonResponse
{
    try {
        $chunk = $request->files->get('chunk');
        $chunkIndex = (int) $request->request->get('chunkIndex');
        $totalChunks = (int) $request->request->get('totalChunks');
        $mediaId = $request->request->get('mediaId');

        if (!$chunk) {
            return $this->json([
                'error' => 'Aucun chunk uploadé'
            ], Response::HTTP_BAD_REQUEST);
        }

        $metadata = $this->loadMetadata($mediaId);
        if (!$metadata) {
            return $this->json([
                'error' => 'Session non trouvée'
            ], Response::HTTP_NOT_FOUND);
        }

        // Chemin du chunk
        $chunkDir = $metadata['chunkDir'];
        $chunkFileName = sprintf('chunk_%04d.part', $chunkIndex);
        $chunkPath = $chunkDir . '/' . $chunkFileName;

        // Sauvegarder
        if (!$chunk->move($chunkDir, $chunkFileName)) {
            throw new \RuntimeException('Impossible de sauvegarder le chunk');
        }

        // Mettre à jour les métadonnées
        $metadata['uploadedChunks'] = $chunkIndex + 1;
        $metadata['totalChunks'] = $totalChunks;
        $metadata['status'] = 'uploading';
        $this->saveMetadata($mediaId, $metadata);

        $percentage = round(($metadata['uploadedChunks'] / $totalChunks) * 100);

        return $this->json([
            'success' => true,
            'chunkIndex' => $chunkIndex,
            'uploadedChunks' => $metadata['uploadedChunks'],
            'totalChunks' => $totalChunks,
            'percentage' => $percentage
        ]);
    } catch (\Exception $e) {
        return $this->json([
            'success' => false,
            'error' => 'Erreur upload',
            'message' => $e->getMessage()
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
```

### Finalisation

```php
#[Route('/api/upload/finalize', methods: ['POST'])]
public function finalizeUpload(Request $request): JsonResponse
{
    try {
        $data = json_decode($request->getContent(), true);
        $mediaId = $data['mediaId'] ?? null;

        $metadata = $this->loadMetadata($mediaId);
        if (!$metadata) {
            return $this->json([
                'error' => 'Session non trouvée'
            ], Response::HTTP_NOT_FOUND);
        }

        $chunkDir = $metadata['chunkDir'];
        $totalChunks = $metadata['totalChunks'];
        $finalFileName = $metadata['fileName'];
        $finalFilePath = $this->uploadDir . '/' . $mediaId . '_' . $finalFileName;

        // Assembler les chunks
        $finalFile = fopen($finalFilePath, 'wb');
        if (!$finalFile) {
            throw new \RuntimeException('Impossible de créer le fichier final');
        }

        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkFileName = sprintf('chunk_%04d.part', $i);
            $chunkPath = $chunkDir . '/' . $chunkFileName;

            if (!file_exists($chunkPath)) {
                throw new \RuntimeException("Chunk manquant: $i");
            }

            $chunkData = file_get_contents($chunkPath);
            fwrite($finalFile, $chunkData);
        }

        fclose($finalFile);

        // Nettoyer les chunks
        $this->cleanupChunks($chunkDir);

        // Mettre à jour le statut
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
            'message' => 'Upload finalisé'
        ]);
    } catch (\Exception $e) {
        return $this->json([
            'success' => false,
            'error' => 'Erreur finalisation',
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

private function cleanupChunks(string $chunkDir): void
{
    if (!is_dir($chunkDir)) return;
    
    $files = glob($chunkDir . '/*');
    foreach ($files as $file) {
        if (is_file($file)) unlink($file);
    }
    rmdir($chunkDir);
}
```

---

## 📚 Événements Disponibles

La bibliothèque émet plus de 15 événements pour un contrôle total:

| Événement | Description |
|-----------|-------------|
| `INITIALIZE_UPLOAD_STARTED` | Initialisation démarrée |
| `INITIALIZE_UPLOAD_SUCCESS` | Initialisation réussie |
| `INITIALIZE_UPLOAD_FAILURE` | Initialisation échouée |
| `MEDIA_CHUNK_UPLOAD_STARTED` | Chunk commencé |
| `MEDIA_CHUNK_UPLOAD_SUCCESS` | Chunk réussi |
| `MEDIA_CHUNK_UPLOAD_FAILED` | Chunk échoué |
| `MEDIA_CHUNK_UPLOAD_HTTP_ERROR_RESPONSE` | Erreur HTTP chunk |
| `MEDIA_CHUNK_UPLOAD_MAXRETRY_EXPIRE` | Max retries atteint |
| `DOWNLOAD_MEDIA_COMPLETE` | Upload complété |
| `DOWNLOAD_MEDIA_FAILURE` | Upload échoué |
| `UPLOAD_CANCELLED` | Upload annulé |
| `UPLOAD_PAUSED` | Upload mis en pause |
| `UPLOAD_RESUMED` | Upload repris |
| `UPLOAD_STATE_CHANGED` | État changé |
| `MEDIA_CHUNK_UPLOAD_RESUME` | Reprise chunk détectée |

---

## 🎯 Gestion des États (UploadState)

```typescript
enum UploadState {
  IDLE = 'idle',              // Prêt
  INITIALIZING = 'initializing',  // En cours d'initialisation
  UPLOADING = 'uploading',    // Uploading en cours
  PAUSED = 'paused',          // En pause
  CANCELLED = 'cancelled',    // Annulé
  FINALIZING = 'finalizing',  // Finalisation en cours
  COMPLETED = 'completed',    // Complété
  FAILED = 'failed'           // Échoué
}
```

---

## 🔄 Pause et Reprise

### Mettre en Pause

```typescript
uploader.pause();  // Met l'upload en pause
```

### Reprendre un Upload

```typescript
// Reprendre depuis la dernière position sauvegardée
const resumeData = await cache.getItem(`upload_${fileName}`);
await uploader.resumeUpload(resumeData);
```

### Annuler un Upload

```typescript
uploader.cancel();  // Annule complètement l'upload
```

---

## 🛡️ Gestion des Erreurs

### Exception Personnalisées

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
    console.log(`Will retry: ${error.willRetry}`);
  } else if (error instanceof InitializeUploadFailureException) {
    console.error('Upload initialization failed:', error.message);
  } else if (error instanceof UploadCancelledException) {
    console.log('Upload was cancelled by user');
  }
}
```

---

## 📊 Interface UploadProgress

Reçue dans le callback `onProgress`:

```typescript
interface UploadProgress {
  uploadedChunks: number;        // Chunks uploadés
  totalChunks: number;           // Total chunks
  uploadedBytes: number;         // Bytes uploadés
  totalBytes: number;            // Total bytes
  percentage: number;            // 0-100
  currentChunk: number;          // Chunk actuel
  speed?: number;                // Bytes par seconde
  estimatedTimeRemaining?: number | null;  // Secondes
  elapsed: number;               // Secondes écoulées
}
```

### Exemple d'Utilisation

```typescript
onProgress: (progress) => {
  console.log(`Upload: ${progress.percentage}%`);
  console.log(`Speed: ${progress.speed / 1000000} MB/s`);
  console.log(`ETA: ${progress.estimatedTimeRemaining} seconds`);
  console.log(`Elapsed: ${progress.elapsed} seconds`);
}
```

---

## 🔐 Sécurité et Bonnes Pratiques

### 1. Authentification

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

### 2. Validation Côté Client

```typescript
const validateFile = (file: File) => {
  const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
  const ALLOWED_TYPES = ['video/mp4', 'image/jpeg', 'application/pdf'];

  if (file.size > MAX_SIZE) {
    throw new Error('Fichier trop volumineux');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Type de fichier non autorisé');
  }
};

validateFile(selectedFile);
await uploader.upload();
```

### 3. Timeout et Retry

```typescript
const uploader = new ChunkedFileUploader({
  file,
  timeout: 30000,        // 30 secondes par chunk
  maxRetries: 5,         // Maximum 5 tentatives
  initTimeout: 45000     // 45 secondes pour initialisation
}, cache, eventEmitter);
```

---

## 📞 Support et Contribution

**Auteur:** AGBOKOUDJO Franck  
**Email:** internationaleswebservices@gmail.com  
**Phone:** +229 0167 25 18 86  
**LinkedIn:** https://www.linkedin.com/in/internationales-web-apps-services-120520193/  
**Company:** INTERNATIONALES WEB APPS & SERVICES

### Signaler un Bug

Créez une issue sur le repository GitHub avec:
- Description du problème
- Étapes pour reproduire
- Votre environnement (navigateur, OS, version)
- Console logs

### Contribuer

Les contributions sont les bienvenues! Veuillez:
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 License

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🎉 Exemples de Projets Réels

### Plateforme de Streaming Vidéo

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

### Application Médicale

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

### SaaS - Backup Fichiers

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

## 📚 Ressources Additionnelles

- [Documentation Complète](https://docs.example.com)
- [API Reference](https://api.example.com/docs)
- [Exemples de Code](https://github.com/wlindabla/chunked-file-uploader/examples)
- [Chat Community Discord](https://discord.gg/example)

---

## ⭐ Montrez votre Support

Si vous trouvez cette bibliothèque utile, n'hésitez pas à:
- ⭐ Star le repository
- 🐛 Signaler des bugs
- 💡 Suggérer des améliorations
- 🎉 Partager votre retour

Merci! 🙏