import { ChunkedFileUploader } from '../FileUploader';

/*const uploader = new ChunkedFileUploader(
    {
        file: new File('../../home.png','home.png'),
        endpoint: 'http://localhost:8000/api/upload/chunk',
        endpointInit: 'http://localhost:8000/api/upload/init',
        endpointFinalize: 'http://localhost:8000/api/upload/finalize',
        chunkSize: 1024 * 1024, // 1 MB
        maxRetries: 3,
        autoSave: true,
        onProgress: (progress) => {
            console.log(`${progress.percentage}% - ${progress.uploadedChunks}/${progress.totalChunks}`);
        },
        onComplete: (result) => {
            console.log('Upload terminé !', result);
        },
        onError: (error) => {
            console.error('Erreur :', error);
        }
    },
    cache,
    eventEmitter
);
*/